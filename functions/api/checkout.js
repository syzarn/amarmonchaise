/**
 * Cloudflare Pages Function: /api/checkout
 * Production transactional serverless endpoint for Mon Chaise (মঞ্চাইছে)
 * 
 * Upgraded from multi-step glue code to ACID-compliant PostgreSQL transaction:
 *  - Calls Supabase atomic RPC: place_order()
 *  - Row-level lock on products (ORDER BY id ASC FOR UPDATE) preventing deadlocks & race conditions
 *  - Automatic inventory deduction & 1-of-1 handloom piece sold-out protection
 *  - Authoritative server-side pricing from products table (anti-tampering)
 *  - Partial unique index enforcement on MFS TrxID (allowing unlimited COD nulls)
 *  - Strict service_role execution privileges
 *  - Asynchronous non-blocking Telegram order notifications
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

  // 2. Validate Client Payload Inputs
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

  const paymentMethod = payment.method === 'mfs' || payment.method === 'MFS Send Money' ? 'mfs' : 'cod';
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

  const deliveryCharge = pricing.deliveryFee !== undefined 
    ? pricing.deliveryFee 
    : (pricing.deliveryCharge !== undefined 
      ? pricing.deliveryCharge 
      : (customer.district === 'dhaka' || customer.district === 'Inside Dhaka' ? 60 : 120));

  const clientOrderId = data.orderId || ('MC-' + Date.now().toString(36).toUpperCase());
  let orderResult = null;

  // 3. Transactional Execution via Supabase Stored Procedure
  if (env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY || env.SUPABASE_ANON_KEY)) {
    const supabaseUrl = String(env.SUPABASE_URL).trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
    // SAFEGUARD 3: Prioritize SUPABASE_SERVICE_ROLE_KEY for the SECURITY DEFINER RPC
    const supabaseKey = String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY || env.SUPABASE_ANON_KEY).trim();

    if (!env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_ANON_KEY) {
      console.warn('Warning: Using anon key for place_order RPC. Stored procedure requires service_role privileges.');
    }

    // Format items for the stored procedure (authoritative pricing is derived in database)
    const rpcItems = cart.map(item => ({
      product_id: String(item.product_id || item.id || '').trim(),
      quantity: Math.max(1, parseInt(item.quantity || item.qty || 1, 10))
    }));

    const rpcPayload = {
      p_customer_name: customer.name.trim(),
      p_customer_phone: normalizedCustomerPhone,
      p_shipping_address: customer.address.trim(),
      p_district: customer.district === 'dhaka' || customer.district === 'Inside Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
      p_payment_method: paymentMethod,
      p_sender_number: normalizedSenderPhone,
      p_trx_id: normalizedTrxId,
      p_items: rpcItems,
      p_delivery_charge: parseInt(deliveryCharge, 10),
      p_customer_notes: (data.customerNotes || data.notes || '').trim() || null
    };

    try {
      const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/place_order`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(rpcPayload)
      });

      if (!rpcResponse.ok) {
        const errText = await rpcResponse.text();
        let parsedErr = {};
        try {
          parsedErr = JSON.parse(errText);
        } catch (_) {}

        const rawMsg = parsedErr.message || parsedErr.details || parsedErr.hint || errText;
        const errCode = parsedErr.code || '';

        console.error('Supabase place_order RPC failed:', rpcResponse.status, rawMsg);

        // SAFEGUARD 1: Duplicate TrxID Conflict Handling
        if (rawMsg.includes('DUPLICATE_TRX_ID') || rawMsg.includes('idx_orders_unique_trx_id') || errCode === '23505') {
          return jsonResponse({ 
            error: 'This TrxID has already been submitted for another order.',
            code: 'DUPLICATE_TRX_ID'
          }, 409);
        }

        // SAFEGUARD 5: 1-of-1 Piece Sold Out / Insufficient Stock
        if (rawMsg.includes('ONE_OF_A_KIND_SOLD_OUT')) {
          const cleanMsg = rawMsg.replace(/^[^:]+:\s*/, '');
          return jsonResponse({ 
            error: cleanMsg,
            code: 'ONE_OF_A_KIND_SOLD_OUT'
          }, 409);
        }

        if (rawMsg.includes('INSUFFICIENT_STOCK')) {
          const cleanMsg = rawMsg.replace(/^[^:]+:\s*/, '');
          return jsonResponse({ 
            error: cleanMsg,
            code: 'INSUFFICIENT_STOCK'
          }, 409);
        }

        if (rawMsg.includes('PRODUCT_NOT_FOUND')) {
          const cleanMsg = rawMsg.replace(/^[^:]+:\s*/, '');
          return jsonResponse({ error: cleanMsg, code: 'PRODUCT_NOT_FOUND' }, 400);
        }

        if (rawMsg.includes('INVALID_') || rawMsg.includes('EMPTY_CART') || rawMsg.includes('MFS_REQUIRES_')) {
          const cleanMsg = rawMsg.replace(/^[^:]+:\s*/, '');
          return jsonResponse({ error: cleanMsg, code: 'VALIDATION_ERROR' }, 400);
        }

        // Permission denied (anon key attempted on service_role RPC)
        if (rpcResponse.status === 401 || rpcResponse.status === 403 || errCode === '42501') {
          return jsonResponse({
            error: 'Database permission denied. Stored procedure requires SUPABASE_SERVICE_ROLE_KEY.',
            code: 'FORBIDDEN'
          }, 403);
        }

        return jsonResponse({
          error: `Checkout transaction failed: ${rawMsg}`,
          details: rawMsg,
          supabaseStatus: rpcResponse.status
        }, 500);
      }

      orderResult = await rpcResponse.json();

    } catch (dbEx) {
      console.error('Database connection exception during place_order RPC:', dbEx);
      return jsonResponse({ error: 'Database connection failed. Please try again.' }, 502);
    }
  } else {
    // Local development fallback simulation (when SUPABASE_URL is not set)
    console.info('Supabase credentials not configured in environment. Using simulated checkout response.');
    orderResult = {
      success: true,
      order_id: clientOrderId,
      customer_id: 'local-dev-cust',
      total_amount_bdt: pricing.grandTotal || (pricing.subtotal + deliveryCharge),
      subtotal_bdt: pricing.subtotal || 0,
      delivery_charge_bdt: deliveryCharge,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending_verification',
      created_at: new Date().toISOString()
    };
  }

  const finalOrderId = orderResult.order_id || clientOrderId;

  // 4. Optional Asynchronous Telegram Notification (Non-blocking via context.waitUntil)
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const verifiedTotal = orderResult.total_amount_bdt || pricing.grandTotal;
    const verifiedDelivery = orderResult.delivery_charge_bdt !== undefined ? orderResult.delivery_charge_bdt : deliveryCharge;

    const tgMsg = [
      `*New Order: ${finalOrderId}*`,
      ``,
      `*Customer:* ${customer.name.trim()} (\`${normalizedCustomerPhone}\`)`,
      `*Address:* ${customer.address.trim()} (${customer.district})`,
      `*Payment:* ${paymentMethod.toUpperCase()}`,
      normalizedTrxId ? `*TrxID:* \`${normalizedTrxId}\` (Sender: \`${normalizedSenderPhone}\`)` : null,
      `*Status:* ${orderResult.status}`,
      `*Total:* ৳${verifiedTotal} (Delivery: ৳${verifiedDelivery})`,
      `*Items:*`,
      ...(orderResult.items || cart).map(i => {
        const title = i.title || i.name_bn || i.name || i.product_id || i.id;
        const qty = i.quantity || i.qty || 1;
        const total = i.total_price_bdt || (i.price ? i.price * qty : '');
        return `  • ${title} × ${qty} ${total ? `(৳${total})` : ''}`;
      })
    ].filter(Boolean).join('\n');

    try {
      const sendTg = fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: tgMsg,
          parse_mode: 'Markdown'
        })
      }).catch(err => console.error('Telegram notification error:', err));

      if (context.waitUntil) {
        context.waitUntil(sendTg);
      }
    } catch (_) {
      // Non-fatal for checkout success
    }
  }

  // 5. Successful Transactional Response (Compatible with frontend app.js & ReceiptEngine)
  return jsonResponse({
    success: true,
    orderId: finalOrderId,
    dbOrderId: finalOrderId,
    customerId: orderResult.customer_id,
    totalAmount: orderResult.total_amount_bdt,
    subtotal: orderResult.subtotal_bdt,
    deliveryCharge: orderResult.delivery_charge_bdt,
    status: orderResult.status,
    createdAt: orderResult.created_at || new Date().toISOString()
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
