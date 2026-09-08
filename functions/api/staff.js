/**
 * Cloudflare Pages Function: /api/staff
 * Protected Mobile Operations & Dispatch Backend for Mon Chaise (মঞ্চাইছে)
 * 
 * Capabilities:
 *  - Administrative Passkey authentication (x-staff-passkey / Bearer token)
 *  - Query fulfillment orders with customer names, delivery addresses, and MFS TrxIDs
 *  - Perform order state transitions:
 *      * 'verify_payment'  -> orders.status = 'verified'
 *      * 'mark_dispatched' -> orders.status = 'dispatched' + courier_name + tracking_code
 *      * 'cancel_order'    -> orders.status = 'cancelled'
 *  - Aggregated order status metrics (pending, verified, dispatched counts)
 *  - Seamless local development & static preview simulation when Supabase credentials are unset
 */

const DEFAULT_LOCAL_PASSKEY = 'amc-staff-2026';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-staff-passkey, apikey, Prefer',
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

function verifyPasskey(request, env = {}) {
  const configuredPasskey = String(env.STAFF_ACCESS_KEY || DEFAULT_LOCAL_PASSKEY).trim();

  // Check 1: Custom header
  const headerKey = request.headers.get('x-staff-passkey');
  if (headerKey && headerKey.trim() === configuredPasskey) {
    return true;
  }

  // Check 2: Bearer authorization
  const authHeader = request.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token === configuredPasskey) {
      return true;
    }
  }

  // Check 3: Query parameter fallback (?passkey=...)
  try {
    const url = new URL(request.url);
    const queryKey = url.searchParams.get('passkey') || url.searchParams.get('key');
    if (queryKey && queryKey.trim() === configuredPasskey) {
      return true;
    }
  } catch (_) {}

  return false;
}

// In-memory mock database for local development and demonstration
let memoryMockOrders = [
  {
    id: 'MC-260908-A4F1',
    customer_id: 'cust-101',
    customer_name: 'ফারহানা চৌধুরী',
    customer_phone: '01712-344935',
    shipping_address: 'বাড়ি ১২, রোড ৪, ব্লক সি, বনানী, ঢাকা - ১২১৩',
    district: 'Inside Dhaka',
    payment_method: 'cod',
    sender_number: null,
    trx_id: null,
    status: 'dispatched',
    subtotal_bdt: 2450,
    delivery_charge_bdt: 60,
    total_amount_bdt: 2510,
    courier_name: 'Steadfast Courier',
    tracking_code: 'SF-108294',
    items: [
      { product_id: 'amc-100', sku: 'AMC-WEV-THM-01', title: 'নীলাম্বরী খাঁটি কোমর তাঁতের থামি (Chakma Thami)', quantity: 1, unit_price_bdt: 2450, total_price_bdt: 2450 }
    ],
    customer_notes: 'বিকেলের পর ডেলিভারি দিলে সুবিধা হয়।',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'MC-260908-B7D2',
    customer_id: 'cust-102',
    customer_name: 'মাহমুদুল হক সাজিদ',
    customer_phone: '01887-454935',
    shipping_address: 'ফ্ল্যাট ৪এ, ধানমন্ডি লেকভিউ অ্যাপার্টমেন্ট, রোড ৮/এ, ধানমন্ডি',
    district: 'Inside Dhaka',
    payment_method: 'mfs',
    sender_number: '01887-454935',
    trx_id: 'BKA98X7Z21',
    status: 'pending_verification',
    subtotal_bdt: 1850,
    delivery_charge_bdt: 60,
    total_amount_bdt: 1910,
    courier_name: null,
    tracking_code: null,
    items: [
      { product_id: 'amc-101', sku: 'AMC-WEV-GMC-01', title: 'হাতে বোনা ট্রাইবাল গামছা টোট ব্যাগ', quantity: 1, unit_price_bdt: 1850, total_price_bdt: 1850 }
    ],
    customer_notes: 'বিকাশ সেন্ড মানি করা হয়েছে। TrxID মেলান।',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'MC-260908-C9K4',
    customer_id: 'cust-103',
    customer_name: 'তানজিলা তাসনিম',
    customer_phone: '01923-887711',
    shipping_address: 'হোল্ডিং ৪৫, জিলা স্কুল মোড়, কোতোয়ালি, ময়মনসিংহ',
    district: 'Outside Dhaka',
    payment_method: 'mfs',
    sender_number: '01923-887711',
    trx_id: 'NGD43K8L99',
    status: 'verified',
    subtotal_bdt: 3200,
    delivery_charge_bdt: 120,
    total_amount_bdt: 3320,
    courier_name: null,
    tracking_code: null,
    items: [
      { product_id: 'amc-100', sku: 'AMC-WEV-THM-01', title: 'ঐতিহ্যবাহী হাতে বোনা থামি', quantity: 1, unit_price_bdt: 2450, total_price_bdt: 2450 },
      { product_id: 'amc-103', sku: 'AMC-TEA-CHM-01', title: 'জুম পাহাড়ি কাঠের ধোঁয়ায় সেঁকা ব্ল্যাক টি (১০০ গ্রাম)', quantity: 1, unit_price_bdt: 750, total_price_bdt: 750 }
    ],
    customer_notes: 'প্যাকিং যেন মজবুত হয়। উপহারের পার্সেল।',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'MC-260907-E2M1',
    customer_id: 'cust-104',
    customer_name: 'রুবাইয়া আক্তার',
    customer_phone: '01611-223344',
    shipping_address: 'বাড়ি ৭, আগ্রাবাদ আবাসিক এলাকা, চট্টগ্রাম',
    district: 'Outside Dhaka',
    payment_method: 'cod',
    sender_number: null,
    trx_id: null,
    status: 'delivered',
    subtotal_bdt: 1200,
    delivery_charge_bdt: 120,
    total_amount_bdt: 1320,
    courier_name: 'Pathao Courier',
    tracking_code: 'PTH-882190',
    items: [
      { product_id: 'amc-102', sku: 'AMC-ART-RCK-01', title: 'রিকশা আর্ট কাঠের কোস্টার সেট (৪টি)', quantity: 2, unit_price_bdt: 600, total_price_bdt: 1200 }
    ],
    customer_notes: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export async function onRequestGet(context) {
  const { request, env = {} } = context;

  // 1. Security Gate
  if (!verifyPasskey(request, env)) {
    return jsonResponse({
      success: false,
      error: 'অননুমোদিত প্রবেশাধিকার (Invalid or Missing Passkey)। অনুগ্রহ করে সঠিক পাসকি প্রদান করুন।'
    }, 401);
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'orders';

  // Quick verification ping
  if (action === 'verify_passkey') {
    return jsonResponse({
      success: true,
      message: 'প্রবেশাধিকার সফলভাবে অনুমোদিত হয়েছে।'
    }, 200);
  }

  const statusFilter = url.searchParams.get('status') || 'all';

  // 2. Fetch from Supabase if configured
  if (env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) {
    const supabaseUrl = String(env.SUPABASE_URL).trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
    const supabaseKey = String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY).trim();
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    };

    try {
      let ordersQueryUrl = `${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc&limit=50`;
      if (statusFilter && statusFilter !== 'all') {
        ordersQueryUrl += `&status=eq.${encodeURIComponent(statusFilter)}`;
      }

      const [ordersResp, customersResp] = await Promise.all([
        fetch(ordersQueryUrl, { headers }),
        fetch(`${supabaseUrl}/rest/v1/customers?select=*&limit=100`, { headers })
      ]);

      if (ordersResp.ok) {
        const rawOrders = await ordersResp.json();
        const customers = customersResp.ok ? await customersResp.json() : [];
        const customerMap = new Map((Array.isArray(customers) ? customers : []).map(c => [c.id, c]));

        const enrichedOrders = rawOrders.map(order => {
          const cust = order.customer_id ? customerMap.get(order.customer_id) : null;
          return {
            id: order.id,
            customer_id: order.customer_id,
            customer_name: cust?.name || 'গ্রাহক',
            customer_phone: cust?.phone || order.sender_number || '',
            shipping_address: order.shipping_address || cust?.address || '',
            district: cust?.district || (String(order.shipping_address || '').includes('ঢাকা') ? 'Inside Dhaka' : 'Outside Dhaka'),
            payment_method: order.payment_method || 'cod',
            sender_number: order.sender_number || null,
            trx_id: order.trx_id || null,
            status: order.status || 'pending_verification',
            subtotal_bdt: order.subtotal_bdt || 0,
            delivery_charge_bdt: order.delivery_charge_bdt || 0,
            total_amount_bdt: order.total_amount_bdt || 0,
            courier_name: order.courier_name || null,
            tracking_code: order.tracking_code || null,
            items: order.items || [],
            customer_notes: order.customer_notes || null,
            created_at: order.created_at,
            updated_at: order.updated_at
          };
        });

        // Compute metrics
        const pendingCount = enrichedOrders.filter(o => o.status === 'pending_verification').length;
        const verifiedCount = enrichedOrders.filter(o => o.status === 'verified').length;
        const dispatchedCount = enrichedOrders.filter(o => o.status === 'dispatched').length;

        return jsonResponse({
          success: true,
          orders: enrichedOrders,
          metrics: {
            total_count: enrichedOrders.length,
            pending_count: pendingCount,
            verified_count: verifiedCount,
            dispatched_count: dispatchedCount
          }
        }, 200);
      }
    } catch (err) {
      console.error('Supabase fetch error in /api/staff:', err);
      // Fallback to memory store if query failed
    }
  }

  // 3. Fallback: Local memory mock store
  let filtered = [...memoryMockOrders];
  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter(o => o.status === statusFilter);
  }

  const pendingCount = memoryMockOrders.filter(o => o.status === 'pending_verification').length;
  const verifiedCount = memoryMockOrders.filter(o => o.status === 'verified').length;
  const dispatchedCount = memoryMockOrders.filter(o => o.status === 'dispatched').length;

  return jsonResponse({
    success: true,
    orders: filtered,
    metrics: {
      total_count: memoryMockOrders.length,
      pending_count: pendingCount,
      verified_count: verifiedCount,
      dispatched_count: dispatchedCount
    }
  }, 200);
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  // 1. Security Gate
  if (!verifyPasskey(request, env)) {
    return jsonResponse({
      success: false,
      error: 'অননুমোদিত প্রবেশাধিকার (Invalid or Missing Passkey)।'
    }, 401);
  }

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ success: false, error: 'অনুরোধের তথ্য সঠিক নয় (Invalid JSON)।' }, 400);
  }

  const orderId = String(body.order_id || body.orderId || '').trim().toUpperCase();
  const action = String(body.action || '').trim().toLowerCase();
  const courierName = String(body.courier_name || body.courierName || '').trim();
  const trackingCode = String(body.tracking_code || body.trackingCode || '').trim().toUpperCase();

  if (!orderId) {
    return jsonResponse({ success: false, error: 'অর্ডার নম্বর প্রদান করা বাধ্যতামূলক।' }, 400);
  }

  const validActions = ['verify_payment', 'mark_dispatched', 'cancel_order', 'update_courier'];
  if (!validActions.includes(action)) {
    return jsonResponse({
      success: false,
      error: `অকার্যকর অ্যাকশন (${action})। প্রযোজ্য অ্যাকশন: verify_payment, mark_dispatched, cancel_order`
    }, 400);
  }

  let newStatus = null;
  const updates = {
    updated_at: new Date().toISOString()
  };

  if (action === 'verify_payment') {
    newStatus = 'verified';
    updates.status = newStatus;
  } else if (action === 'mark_dispatched') {
    newStatus = 'dispatched';
    updates.status = newStatus;
    if (courierName) updates.courier_name = courierName;
    if (trackingCode) updates.tracking_code = trackingCode;
  } else if (action === 'cancel_order') {
    newStatus = 'cancelled';
    updates.status = newStatus;
  } else if (action === 'update_courier') {
    if (courierName) updates.courier_name = courierName;
    if (trackingCode) updates.tracking_code = trackingCode;
  }

  // A. Execute Supabase update if configured
  if (env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) {
    const supabaseUrl = String(env.SUPABASE_URL).trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
    const supabaseKey = String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY).trim();
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    try {
      const updateResp = await fetch(
        `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updates)
        }
      );

      if (updateResp.ok) {
        const updatedRows = await updateResp.json();
        return jsonResponse({
          success: true,
          message: 'অর্ডার সফলভাবে হালনাগাদ করা হয়েছে।',
          order: Array.isArray(updatedRows) && updatedRows.length > 0 ? updatedRows[0] : updates
        }, 200);
      }
    } catch (err) {
      console.error('Supabase update error in /api/staff:', err);
    }
  }

  // B. Fallback: Update in-memory mock store
  const targetIndex = memoryMockOrders.findIndex(o => o.id.toUpperCase() === orderId);
  if (targetIndex !== -1) {
    memoryMockOrders[targetIndex] = {
      ...memoryMockOrders[targetIndex],
      ...updates
    };
    return jsonResponse({
      success: true,
      message: 'অর্ডার সফলভাবে হালনাগাদ করা হয়েছে (Local Store)।',
      order: memoryMockOrders[targetIndex]
    }, 200);
  }

  return jsonResponse({
    success: false,
    error: `অর্ডার ${orderId} খুঁজে পাওয়া যায়নি।`
  }, 404);
}
