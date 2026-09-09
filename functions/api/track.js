/**
 * Cloudflare Pages Function: /api/track
 * Secure, read-only order tracking endpoint for Mon Chaise (মঞ্চাইছে)
 * 
 * Features:
 *  - Supports GET (?orderId=...&phone4=...) and POST ({ orderId, phone4 })
 *  - Strict privacy gate: Order ID + last 4 digits of customer phone number
 *  - Prevents enumeration: Returns uniform 404 for missing order or phone suffix mismatch
 *  - Zero data leakage: Never exposes customer address, full phone number, or internal UUIDs
 *  - Returns safe order status, milestones, itemized summary, and courier consignment codes
 */

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, Prefer',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
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

async function handleTrackRequest(orderIdInput, phone4Input, env = {}) {
  const orderId = String(orderIdInput || '').trim().toUpperCase();
  const phone4 = String(phone4Input || '').trim();

  // 1. Input Sanitization & Validation
  if (!orderId || orderId.length < 5) {
    return jsonResponse({
      success: false,
      error: 'সঠিক অর্ডার নম্বর প্রদান করুন (যেমন: MC-260908-A4F1)।'
    }, 400);
  }

  if (!/^\d{4}$/.test(phone4)) {
    return jsonResponse({
      success: false,
      error: 'মোবাইল নম্বরের শেষ ৪ ডিজিট সঠিক নয় (৪টি সংখ্যা আবশ্যক)।'
    }, 400);
  }

  // 2. Check Supabase Configuration
  if (!env.SUPABASE_URL || (!env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_KEY && !env.SUPABASE_ANON_KEY)) {
    return jsonResponse({
      success: false,
      error: 'ট্র্যাকিং সার্ভিস সাময়িকভাবে অনুপলব্ধ। অনুগ্রহ করে কিছু পর আবার চেষ্টা করুন।'
    }, 503);
  }

  const supabaseUrl = String(env.SUPABASE_URL).trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
  const supabaseKey = String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY || env.SUPABASE_ANON_KEY).trim();

  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };

  try {
    // Step A: Fetch order record (supports querying by bigint id or alphanumeric order_no)
    const matchFilter = /^\d+$/.test(orderId)
      ? `or=(id.eq.${orderId},order_no.eq.${encodeURIComponent(orderId)})`
      : `order_no=eq.${encodeURIComponent(orderId)}`;
    const orderResp = await fetch(
      `${supabaseUrl}/rest/v1/orders?${matchFilter}&select=*`,
      { headers }
    );

    if (!orderResp.ok) {
      console.error('Supabase query error for order:', orderResp.status, await orderResp.text());
      return jsonResponse({
        success: false,
        error: 'এই অর্ডার নম্বর বা ফোন নম্বরের কোনো তথ্য পাওয়া যায়নি।'
      }, 404);
    }

    const orders = await orderResp.json();
    if (!Array.isArray(orders) || orders.length === 0) {
      return jsonResponse({
        success: false,
        error: 'এই অর্ডার নম্বর বা ফোন নম্বরের কোনো তথ্য পাওয়া যায়নি।'
      }, 404);
    }

    const order = orders[0];

    // Step B: Fetch customer record to verify phone suffix
    let phoneMatches = false;

    if (order.customer_id) {
      const custResp = await fetch(
        `${supabaseUrl}/rest/v1/customers?id=eq.${encodeURIComponent(order.customer_id)}&select=phone`,
        { headers }
      );

      if (custResp.ok) {
        const customers = await custResp.json();
        if (Array.isArray(customers) && customers.length > 0) {
          const rawPhone = String(customers[0].phone || '').replace(/[\s\-\(\)\.]/g, '');
          if (rawPhone.endsWith(phone4)) {
            phoneMatches = true;
          }
        }
      }
    }

    // Fallback: If customer_id was null or not matched, also check sender_number on order
    if (!phoneMatches && order.sender_number) {
      const rawSender = String(order.sender_number).replace(/[\s\-\(\)\.]/g, '');
      if (rawSender.endsWith(phone4)) {
        phoneMatches = true;
      }
    }

    // Privacy Gate Check
    if (!phoneMatches) {
      return jsonResponse({
        success: false,
        error: 'এই অর্ডার নম্বর বা ফোন নম্বরের কোনো তথ্য পাওয়া যায়নি।'
      }, 404);
    }

    // 3. Data Sanitization (Privacy Filter)
    // Strictly omit customer name, full delivery address, and full phone number
    const safeItems = Array.isArray(order.items) ? order.items.map(item => ({
      product_id: item.product_id || item.id || '',
      sku: item.sku || '',
      title: item.title || item.name_bn || item.name_en || 'পণ্য',
      quantity: Math.max(1, parseInt(item.quantity || item.qty || 1, 10)),
      unit_price_bdt: parseInt(item.unit_price_bdt || item.price || 0, 10),
      total_price_bdt: parseInt(
        item.total_price_bdt || 
        ((item.unit_price_bdt || item.price || 0) * (item.quantity || item.qty || 1)), 
        10
      )
    })) : [];

    const trackingPayload = {
      success: true,
      order_id: order.id,
      status: order.status || 'pending_verification',
      payment_method: order.payment_method || 'cod',
      subtotal_bdt: parseInt(order.subtotal_bdt || 0, 10),
      delivery_charge_bdt: parseInt(order.delivery_charge_bdt || 0, 10),
      total_amount_bdt: parseInt(order.total_amount_bdt || 0, 10),
      items: safeItems,
      courier_name: order.courier_name || null,
      tracking_code: order.tracking_code || null,
      created_at: order.created_at,
      status_updated_at: order.updated_at || order.created_at
    };

    return jsonResponse(trackingPayload, 200);

  } catch (err) {
    console.error('Unexpected error in /api/track:', err);
    return jsonResponse({
      success: false,
      error: 'সার্ভার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে কিছু পর আবার চেষ্টা করুন।'
    }, 500);
  }
}

export async function onRequestGet(context) {
  const { request, env = {} } = context;
  const url = new URL(request.url);
  const orderId = url.searchParams.get('orderId') || url.searchParams.get('id');
  const phone4 = url.searchParams.get('phone4') || url.searchParams.get('p') || url.searchParams.get('phone');

  return handleTrackRequest(orderId, phone4, env);
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;
  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ success: false, error: 'অনুরোধের তথ্য সঠিক নয় (Invalid JSON)।' }, 400);
  }

  const orderId = body.orderId || body.order_id || body.id;
  const phone4 = body.phone4 || body.phone_4 || body.phone || body.p;

  return handleTrackRequest(orderId, phone4, env);
}
