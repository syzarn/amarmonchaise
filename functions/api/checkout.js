/**
 * Cloudflare Pages Function: /api/checkout
 * Production serverless endpoint for Mon Chaise (মঞ্চাইছে)
 * Features:
 *  - Strict Bangladesh mobile operator validation & sanitization
 *  - Supabase REST API customer upsert (matching phone)
 *  - Supabase REST API order insertion with duplicate TrxID conflict handling (HTTP 409)
 *  - Optional Telegram channel / group order alert notification
 *  - Resilient error handling & CORS preflight support
 */

const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

function normalizeBdPhone(input) {
  if (!input) return '';
  let cleaned = String(input).replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+88')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('88')) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
}

function isValidBdPhone(input) {
  if (!input) return false;
  const cleaned = String(input).replace(/[\s\-\(\)\.]/g, '');
  return BD_PHONE_REGEX.test(cleaned);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, Prefer',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  // 1. Parse JSON Payload
  let data;
  try {
    data = await request.json();
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON request body.' }, 400);
  }

  // 2. Validate Required Fields
  const customer = data.customer || {};
  const pricing = data.pricing || {};
  const payment = data.payment || {};
  const cart = data.cart || data.items || [];

  if (!customer.name || typeof customer.name !== 'string' || customer.name.trim().length < 2) {
    return jsonResponse({ error: 'Customer full name is required (min 2 characters).' }, 400);
  }

  if (!isValidBdPhone(customer.phone)) {
    return jsonResponse({ error: 'Valid 11-digit Bangladeshi mobile number is required (013 - 019).' }, 400);
  }

  if (!customer.address || typeof customer.address !== 'string' || customer.address.trim().length < 5) {
    return jsonResponse({ error: 'Full delivery address is required (min 5 characters).' }, 400);
  }

  if (!customer.district || (customer.district !== 'dhaka' && customer.district !== 'outside' && customer.district !== 'Inside Dhaka' && customer.district !== 'Outside Dhaka')) {
    return jsonResponse({ error: 'Delivery district (Dhaka / Outside Dhaka) is required.' }, 400);
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return jsonResponse({ error: 'Cart must contain at least one item.' }, 400);
  }

  if (typeof pricing.grandTotal !== 'number' || pricing.grandTotal <= 0) {
    return jsonResponse({ error: 'Valid total pricing is required.' }, 400);
  }

  const paymentMethod = payment.method === 'mfs' || payment.method === 'MFS Send Money' ? 'mfs' : 'cod';

  // Normalize Inputs
  const normalizedCustomerPhone = normalizeBdPhone(customer.phone);
  let normalizedSenderPhone = null;
  let normalizedTrxId = null;

  if (paymentMethod === 'mfs') {
    if (!isValidBdPhone(payment.senderPhone)) {
      return jsonResponse({ error: 'Valid sender mobile number is required for MFS Send Money.' }, 400);
    }
    normalizedSenderPhone = normalizeBdPhone(payment.senderPhone);

    const rawTrx = (payment.trxId || '').trim().toUpperCase();
    if (!rawTrx || rawTrx.length < 4) {
      return jsonResponse({ error: 'Valid TrxID is required for MFS payment (min 4 characters).' }, 400);
    }
    normalizedTrxId = rawTrx;
  }

  const clientOrderId = data.orderId || ('MC-' + Date.now().toString(36).toUpperCase());
  const deliveryCharge = pricing.deliveryFee !== undefined ? pricing.deliveryFee : (pricing.deliveryCharge !== undefined ? pricing.deliveryCharge : (customer.district === 'dhaka' || customer.district === 'Inside Dhaka' ? 60 : 120));
  const subtotal = pricing.subtotal !== undefined ? pricing.subtotal : (pricing.grandTotal - deliveryCharge);

  let dbOrderId = null;

  // 3. Supabase Integration
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabaseUrl = env.SUPABASE_URL.replace(/\/$/, '');
    const headers = {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    };

    try {
      // Step 3.1: Upsert Customer (Keyed on unique phone)
      let customerId = null;
      let customerErrText = null;
      const customerUpsertPayload = {
        phone: normalizedCustomerPhone,
        name: customer.name.trim(),
        address: customer.address.trim(),
        district: customer.district === 'dhaka' || customer.district === 'Inside Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'
      };

      const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?on_conflict=phone`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(customerUpsertPayload)
      });

      if (custRes.ok) {
        const custRecord = await custRes.json();
        if (Array.isArray(custRecord) && custRecord.length > 0) {
          customerId = custRecord[0].id || custRecord[0].customer_id;
        } else if (custRecord && custRecord.id) {
          customerId = custRecord.id;
        }
      } else {
        customerErrText = await custRes.text();
        console.warn('Customer upsert non-200 response:', custRes.status, customerErrText);
      }

      // Step 3.2: Insert Order
      const orderInsertPayload = {
        customer_id: customerId,
        client_order_id: clientOrderId,
        items: Array.isArray(cart) ? cart : (typeof cart === 'string' ? JSON.parse(cart) : [cart]),
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        total_amount: pricing.grandTotal,
        payment_method: paymentMethod,
        sender_number: normalizedSenderPhone,
        trx_id: normalizedTrxId,
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending_verification'
      };

      const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(orderInsertPayload)
      });

      if (orderRes.status === 409) {
        return jsonResponse({ error: 'This TrxID has already been submitted for another order.' }, 409);
      }

      if (!orderRes.ok) {
        const orderErrText = await orderRes.text();
        console.error('Supabase order insert failed:', orderRes.status, orderErrText);

        // Check for unique conflict on trx_id in PostgreSQL error body
        if (orderErrText.includes('trx_id') || orderErrText.includes('duplicate key') || orderErrText.includes('23505')) {
          return jsonResponse({ error: 'This TrxID has already been submitted for another order.' }, 409);
        }

        let parsedErr = {};
        try {
          parsedErr = JSON.parse(orderErrText);
        } catch (_) {}

        const detailedMsg = parsedErr.message || parsedErr.hint || parsedErr.details || orderErrText;
        return jsonResponse({ 
          error: `Failed to record order in database: ${detailedMsg}`,
          details: detailedMsg,
          customerError: customerErrText,
          supabaseStatus: orderRes.status
        }, 500);
      }

      const orderRecord = await orderRes.json();
      if (Array.isArray(orderRecord) && orderRecord.length > 0) {
        dbOrderId = orderRecord[0].id || orderRecord[0].order_id;
      } else if (orderRecord && orderRecord.id) {
        dbOrderId = orderRecord.id;
      }

    } catch (supabaseError) {
      console.error('Supabase connection exception:', supabaseError);
      return jsonResponse({ error: 'Database connection failed. Please try again.' }, 502);
    }
  } else {
    console.info('Supabase credentials not set. Simulated order confirmation.');
    dbOrderId = 'local-' + clientOrderId;
  }

  // 4. Optional Telegram Alert Notification
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const tgMsg = [
      `🎉 *New Order: ${clientOrderId}*`,
      ``,
      `👤 *Customer:* ${customer.name.trim()} (\`${normalizedCustomerPhone}\`)`,
      `📍 *Address:* ${customer.address.trim()} (${customer.district})`,
      `💳 *Payment:* ${paymentMethod.toUpperCase()}`,
      normalizedTrxId ? `🔑 *TrxID:* \`${normalizedTrxId}\` (Sender: \`${normalizedSenderPhone}\`)` : null,
      `💰 *Total:* ৳${pricing.grandTotal} (Delivery: ৳${deliveryCharge})`,
      `📦 *Items:*`,
      ...cart.map(i => `  • ${i.name || i.id} × ${i.qty} (৳${i.price * i.qty})`)
    ].filter(Boolean).join('\n');

    try {
      if (context.waitUntil) {
        context.waitUntil(
          fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: env.TELEGRAM_CHAT_ID,
              text: tgMsg,
              parse_mode: 'Markdown'
            })
          }).catch(tgErr => console.error('Telegram dispatch error:', tgErr))
        );
      } else {
        fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: tgMsg,
            parse_mode: 'Markdown'
          })
        }).catch(() => {});
      }
    } catch (e) {
      // Non-fatal
    }
  }

  // 5. Successful Response
  return jsonResponse({
    success: true,
    orderId: clientOrderId,
    dbOrderId: dbOrderId || clientOrderId
  }, 201);
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return onRequestOptions(context);
  }
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  return jsonResponse({ error: 'Method Not Allowed' }, 405);
}
