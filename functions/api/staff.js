/**
 * Cloudflare Pages Function: /api/staff
 * Protected Mobile Operations & Dispatch Backend for Mon Chaise (মঞ্চাইছে)
 * 
 * Capabilities:
 *  - Named Staff Authentication with personal credentials (Name + PIN)
 *  - IP-based brute-force throttling (5 failed attempts within 10 minutes -> HTTP 429)
 *  - Cryptographic HMAC session tokens (mc-staff.<payload>.<sig>)
 *  - Audit logging of all fulfillment actions (public.order_audit_logs)
 *  - Order state transitions (verify_payment, mark_dispatched, cancel_order, override_status, update_courier)
 *  - Seamless local development & static preview simulation with pre-seeded staff
 */

const DEFAULT_LOCAL_PASSKEY = 'amc-staff-2026';
const TOKEN_SECRET_SALT = 'amc-staff-secret-salt-2026';

// Pre-seeded credentials for local fallback & offline demonstration
const PRESEEDED_STAFF = [
  { name: 'Sara', pin: '23111997', role: 'manager' },
  { name: 'Antar', pin: '30062002', role: 'dispatcher' },
  { name: 'Operations 1', pin: '1234', role: 'operator' }
];

// In-memory IP rate limiter for brute-force protection
// Map<ip, { count: number, firstFailedAt: number, lockedUntil: number }>
const failedLoginTracker = new Map();

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'local-client'
  );
}

function checkRateLimit(ip) {
  const record = failedLoginTracker.get(ip);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      message: `অতিরিক্ত ভুল চেষ্টার কারণে সাময়িকভাবে প্রবেশাধিকার বন্ধ রয়েছে। ${Math.ceil(retryAfter / 60)} মিনিট পর আবার চেষ্টা করুন।`
    };
  }

  // If lockout or window has expired (10 minutes), reset
  if (now - record.firstFailedAt > 10 * 60 * 1000) {
    failedLoginTracker.delete(ip);
    return { allowed: true };
  }

  return { allowed: true, attempts: record.count };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = failedLoginTracker.get(ip) || { count: 0, firstFailedAt: now, lockedUntil: 0 };
  
  if (now - record.firstFailedAt > 10 * 60 * 1000) {
    record.count = 1;
    record.firstFailedAt = now;
    record.lockedUntil = 0;
  } else {
    record.count += 1;
  }

  if (record.count >= 5) {
    record.lockedUntil = now + 10 * 60 * 1000; // Lock for 10 minutes
  }

  failedLoginTracker.set(ip, record);
  return record;
}

function clearRateLimit(ip) {
  failedLoginTracker.delete(ip);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-staff-token, x-staff-passkey, x-staff-name, apikey, Prefer',
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

// ==========================================
// CRYPTOGRAPHIC TOKEN HELPERS (Web Crypto)
// ==========================================

async function getHmacKey(secretStr) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secretStr),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signString(str, secretStr) {
  const enc = new TextEncoder();
  const key = await getHmacKey(secretStr);
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(str));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateSessionToken(staff, env) {
  const secret = String(env.STAFF_SESSION_SECRET || env.STAFF_ACCESS_KEY || TOKEN_SECRET_SALT);
  const payload = {
    name: staff.name,
    role: staff.role || 'operator',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = btoa(unescape(encodeURIComponent(payloadStr)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const sig = await signString(payloadB64, secret);
  return `mc-staff.${payloadB64}.${sig}`;
}

async function verifySessionToken(tokenStr, env) {
  if (!tokenStr || typeof tokenStr !== 'string' || !tokenStr.startsWith('mc-staff.')) {
    return null;
  }
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return null;

  const [prefix, payloadB64, sig] = parts;
  const secret = String(env.STAFF_SESSION_SECRET || env.STAFF_ACCESS_KEY || TOKEN_SECRET_SALT);
  const expectedSig = await signString(payloadB64, secret);

  if (sig !== expectedSig) {
    return null;
  }

  try {
    const jsonStr = decodeURIComponent(escape(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))));
    const payload = JSON.parse(jsonStr);
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return {
      name: payload.name,
      role: payload.role || 'operator'
    };
  } catch (_) {
    return null;
  }
}

// Authenticate caller via Session Token or legacy Passkey
async function authenticateRequest(request, env = {}) {
  // 1. Check Bearer or x-staff-token
  const authHeader = request.headers.get('Authorization') || '';
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    token = request.headers.get('x-staff-token') || request.headers.get('x-staff-passkey');
  }

  if (token) {
    const verifiedStaff = await verifySessionToken(token, env);
    if (verifiedStaff) {
      return { authenticated: true, staff: verifiedStaff };
    }
  }

  // 2. Check legacy / dev passkey fallback
  const configuredPasskey = String(env.STAFF_ACCESS_KEY || DEFAULT_LOCAL_PASSKEY).trim();
  const staffNameHeader = request.headers.get('x-staff-name') || 'Staff';

  if (token && (token === configuredPasskey || token === DEFAULT_LOCAL_PASSKEY)) {
    return {
      authenticated: true,
      staff: { name: staffNameHeader, role: 'admin' }
    };
  }

  // 3. Query string fallback (?token=... or ?passkey=...)
  try {
    const url = new URL(request.url);
    const qToken = url.searchParams.get('token');
    if (qToken) {
      const verifiedStaff = await verifySessionToken(qToken, env);
      if (verifiedStaff) return { authenticated: true, staff: verifiedStaff };
    }
    const qPasskey = url.searchParams.get('passkey') || url.searchParams.get('key');
    if (qPasskey && (qPasskey.trim() === configuredPasskey || qPasskey.trim() === DEFAULT_LOCAL_PASSKEY)) {
      return {
        authenticated: true,
        staff: { name: url.searchParams.get('staff_name') || 'Staff', role: 'admin' }
      };
    }
  } catch (_) {}

  return { authenticated: false };
}

// ==========================================
// CATALOG & ORDER NORMALIZATION HELPERS
// ==========================================

const PRODUCT_CATALOG = {
  'amc-100': { sku: 'AMC-WEV-THM-01', name_bn: 'ঐতিহ্যবাহী হাতে বোনা থামি', name_en: 'Traditional Handloom Thami (Chakma Weave)', price: 1850 },
  'amc-101': { sku: 'AMC-WEV-GMC-01', name_bn: 'হাতে বোনা ট্রাইবাল গামছা টোট ব্যাগ', name_en: 'Handloom Tribal Weave Gamcha Tote', price: 850 },
  'amc-102': { sku: 'AMC-ART-RCK-01', name_bn: 'রিকশা আর্ট কাঠের কোস্টার সেট (৪টি)', name_en: 'Vintage Rickshaw Art Coaster Set (4 pcs)', price: 450 },
  'amc-103': { sku: 'AMC-KCP-CHM-01', name_bn: 'মেকানিক্যাল কি-ক্যাপ "মাটির চা-কাপ"', name_en: 'Artisan Clay Chai Cup Keycap', price: 650 },
  'amc-104': { sku: 'AMC-LMP-CAS-01', name_bn: 'নস্টালজিক ক্যাসেট অ্যাম্বিয়েন্ট নাইট ল্যাম্প', name_en: 'Retro Cassette Ambient Night Lamp', price: 1200 },
  'amc-105': { sku: 'AMC-TEA-CHM-01', name_bn: 'বান্দরবান স্মোকড পাহাড়ি কালো চা (১০০ গ্রাম)', name_en: 'Hill-Tract Wood-Smoked Black Tea (100g)', price: 380 },
  'amc-106': { sku: 'AMC-CAP-EMB-01', name_bn: 'মঞ্চাইছে এমব্রয়ডারি বেসবল ক্যাপ', name_en: 'Handloom Green "মঞ্চাইছে" Embroidered Cap', price: 950 },
  'amc-107': { sku: 'AMC-CDL-MST-01', name_bn: 'সরিষা ফুলের মৌতাত সয়া মোমবাতি', name_en: 'Mustard Bloom Soy Scented Candle', price: 490 },
  'amc-108': { sku: 'AMC-PIN-ENM-01', name_bn: 'বাংলা টাইপোগ্রাফি "খেয়াল" মেটাল পিন', name_en: 'Bengali Typography "খেয়াল" Enamel Pin', price: 250 },
  'amc-109': { sku: 'AMC-USB-MNS-01', name_bn: 'শ্রাবণের বৃষ্টি ও টিনের চালের শব্দ পেনড্রাইভ', name_en: 'Dhaka Monsoon Rain Soundscapes USB (16GB)', price: 390 },
  'amc-110': { sku: 'AMC-AST-BRS-01', name_bn: 'খাঁটি পিতলের প্রাচীন পকেট দিকনির্ণায়ক', name_en: 'Solid Brass Ancient Pocket Astrolabe', price: 1550 },
  'amc-111': { sku: 'AMC-BMK-TRB-01', name_bn: 'সুতি সুতোর ঝালর দেওয়া ট্রাইবাল বুকমার্ক', name_en: 'Handmade Tasseled Tribal Bookmark', price: 180 },
  'amc-112': { sku: 'AMC-ZIN-CMK-01', name_bn: 'আজব অস্তিত্ববাদী কমিক জিন (ভলিউম ১)', name_en: 'Existential Dhaka Comic Zine (Vol. 1)', price: 280 }
};

function normalizeOrderItems(rawItems) {
  let list = rawItems;
  if (typeof list === 'string') {
    try { list = JSON.parse(list); } catch (_) { list = []; }
  }
  if (!Array.isArray(list)) list = [];

  return list.map(item => {
    if (!item) return null;
    const pid = String(item.product_id || item.id || item.item_id || '').trim();
    const cat = PRODUCT_CATALOG[pid] || {};

    const nameBn = item.title_bn || item.name_bn || (item.title && /[\u0980-\u09FF]/.test(item.title) ? item.title : null) || cat.name_bn || item.title || item.name_en || item.name || (pid ? `পণ্য #${pid}` : 'পণ্য');
    const nameEn = item.title_en || item.name_en || cat.name_en || item.title || item.name || (pid ? `Product #${pid}` : 'Order Item');
    const displayTitle = item.title || nameBn || nameEn;

    const qty = parseInt(item.quantity !== undefined ? item.quantity : (item.qty !== undefined ? item.qty : (item.count !== undefined ? item.count : 1)), 10) || 1;
    const unitPrice = parseInt(item.unit_price_bdt !== undefined ? item.unit_price_bdt : (item.price_bdt !== undefined ? item.price_bdt : (item.price !== undefined ? item.price : (cat.price || 0))), 10) || 0;
    const totalPrice = parseInt(item.total_price_bdt !== undefined ? item.total_price_bdt : (qty * unitPrice), 10) || (qty * unitPrice);

    return {
      product_id: pid,
      sku: item.sku || cat.sku || pid,
      title: displayTitle,
      title_bn: nameBn,
      title_en: nameEn,
      quantity: qty,
      unit_price_bdt: unitPrice,
      total_price_bdt: totalPrice
    };
  }).filter(Boolean);
}

// In-memory mock database for local development and demonstration
let memoryMockOrders = [
  {
    id: 101,
    order_no: 'MC-MTR643A1',
    chronological_no: '#101',
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
    last_modified_by: 'Antar',
    items: [
      { product_id: 'amc-100', sku: 'AMC-WEV-THM-01', title: 'নীলাম্বরী খাঁটি কোমর তাঁতের থামি (Chakma Thami)', quantity: 1, unit_price_bdt: 2450, total_price_bdt: 2450 }
    ],
    customer_notes: 'বিকেলের পর ডেলিভারি দিলে সুবিধা হয়।',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    audit_trail: [
      { id: 'aud-1', staff_name: 'Sara', action: 'status_override', details: { note: 'অর্ডার প্রস্তুত করা হয়েছে' }, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
      { id: 'aud-2', staff_name: 'Antar', action: 'dispatched', details: { courier_name: 'Steadfast Courier', tracking_code: 'SF-108294' }, created_at: new Date(Date.now() - 3600000 * 2).toISOString() }
    ]
  },
  {
    id: 102,
    order_no: 'MC-MTR682B2',
    chronological_no: '#102',
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
    last_modified_by: null,
    items: [
      { product_id: 'amc-101', sku: 'AMC-WEV-GMC-01', title: 'হাতে বোনা ট্রাইবাল গামছা টোট ব্যাগ', quantity: 1, unit_price_bdt: 1850, total_price_bdt: 1850 }
    ],
    customer_notes: 'বিকাশ সেন্ড মানি করা হয়েছে। TrxID মেলান।',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    audit_trail: []
  },
  {
    id: 103,
    order_no: 'MC-MTR719C4',
    chronological_no: '#103',
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
    last_modified_by: 'Sara',
    items: [
      { product_id: 'amc-100', sku: 'AMC-WEV-THM-01', title: 'ঐতিহ্যবাহী হাতে বোনা থামি', quantity: 1, unit_price_bdt: 2450, total_price_bdt: 2450 },
      { product_id: 'amc-103', sku: 'AMC-TEA-CHM-01', title: 'জুম পাহাড়ি কাঠের ধোঁয়ায় সেঁকা ব্ল্যাক টি (১০০ গ্রাম)', quantity: 1, unit_price_bdt: 750, total_price_bdt: 750 }
    ],
    customer_notes: 'প্যাকিং যেন মজবুত হয়। উপহারের পার্সেল।',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    audit_trail: [
      { id: 'aud-3', staff_name: 'Sara', action: 'payment_verified', details: { trx_id: 'NGD43K8L99' }, created_at: new Date(Date.now() - 3600000 * 1).toISOString() }
    ]
  },
  {
    id: 104,
    order_no: 'MC-MTR755D5',
    chronological_no: '#104',
    customer_id: 'cust-105',
    customer_name: 'আহমেদ জুবায়ের',
    customer_phone: '01715-998877',
    shipping_address: 'বাড়ি ১৪, সেক্টর ৭, উত্তরা, ঢাকা',
    district: 'Inside Dhaka',
    payment_method: 'cod',
    sender_number: null,
    trx_id: null,
    status: 'confirmed',
    subtotal_bdt: 1400,
    delivery_charge_bdt: 60,
    total_amount_bdt: 1460,
    courier_name: null,
    tracking_code: null,
    last_modified_by: null,
    items: [
      { product_id: 'amc-104', sku: 'AMC-LMP-CAS-01', title: 'নস্টালজিক ক্যাসেট অ্যাম্বিয়েন্ট নাইট ল্যাম্প', quantity: 1, unit_price_bdt: 1200, total_price_bdt: 1200 },
      { product_id: 'amc-111', sku: 'AMC-BMK-TRB-01', title: 'সুতি সুতোর ঝালর দেওয়া ট্রাইবাল বুকমার্ক', quantity: 1, unit_price_bdt: 200, total_price_bdt: 200 }
    ],
    customer_notes: 'ক্যাশ অন ডেলিভারি নিশ্চিত করা হয়েছে।',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    audit_trail: []
  },
  {
    id: 105,
    order_no: 'MC-MTR801E6',
    chronological_no: '#105',
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
    last_modified_by: 'Antar',
    items: [
      { product_id: 'amc-102', sku: 'AMC-ART-RCK-01', title: 'রিকশা আর্ট কাঠের কোস্টার সেট (৪টি)', quantity: 2, unit_price_bdt: 600, total_price_bdt: 1200 }
    ],
    customer_notes: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    audit_trail: [
      { id: 'aud-4', staff_name: 'Antar', action: 'dispatched', details: { courier_name: 'Pathao Courier', tracking_code: 'PTH-882190' }, created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
    ]
  }
];

// ==========================================
// GET HANDLER: Query Orders & Audit Logs
// ==========================================

export async function onRequestGet(context) {
  const { request, env = {} } = context;

  // 1. Security Gate
  const auth = await authenticateRequest(request, env);
  if (!auth.authenticated) {
    return jsonResponse({
      success: false,
      error: 'অননুমোদিত প্রবেশাধিকার (Invalid or Missing Passkey/Token)। অনুগ্রহ করে সাইন ইন করুন।'
    }, 401);
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'orders';

  // Quick verification ping
  if (action === 'verify_passkey' || action === 'check_session') {
    return jsonResponse({
      success: true,
      message: 'প্রবেশাধিকার সফলভাবে অনুমোদিত হয়েছে।',
      staff: auth.staff
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
        if (statusFilter === 'confirmed_or_verified' || statusFilter === 'ready_for_dispatch') {
          ordersQueryUrl += `&status=in.(confirmed,verified)`;
        } else {
          ordersQueryUrl += `&status=eq.${encodeURIComponent(statusFilter)}`;
        }
      }

      const [ordersResp, customersResp, auditResp] = await Promise.all([
        fetch(ordersQueryUrl, { headers }),
        fetch(`${supabaseUrl}/rest/v1/customers?select=*&limit=100`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/order_audit_logs?select=*&order=created_at.desc&limit=100`, { headers }).catch(() => ({ ok: false }))
      ]);

      if (ordersResp.ok) {
        const rawOrders = await ordersResp.json();
        const customers = customersResp.ok ? await customersResp.json() : [];
        const auditLogs = auditResp.ok ? await auditResp.json() : [];

        const customerMap = new Map((Array.isArray(customers) ? customers : []).map(c => [c.id, c]));
        const auditMap = new Map();
        if (Array.isArray(auditLogs)) {
          auditLogs.forEach(log => {
            if (!auditMap.has(log.order_id)) auditMap.set(log.order_id, []);
            auditMap.get(log.order_id).push(log);
          });
        }

        const enrichedOrders = rawOrders.map(order => {
          const cust = order.customer_id ? customerMap.get(order.customer_id) : null;
          const normalizedItems = normalizeOrderItems(order.items);

          // Support both new (*_bdt) and legacy (without _bdt) column names
          const subtotal = Number(order.subtotal_bdt ?? order.subtotal ?? 0);
          const deliveryCharge = Number(order.delivery_charge_bdt ?? order.delivery_charge ?? order.delivery_fee ?? 0);
          let totalAmount = Number(order.total_amount_bdt ?? order.total_amount ?? order.total ?? order.grand_total ?? 0);

          // If totalAmount is 0 but we have items, compute from items
          if ((!totalAmount || totalAmount === 0) && normalizedItems.length > 0) {
            const itemsSum = normalizedItems.reduce((acc, it) => acc + (Number(it.total_price_bdt || it.price_bdt || 0)), 0);
            totalAmount = itemsSum + (deliveryCharge || (String(order.shipping_address || '').includes('ঢাকা') ? 60 : 120));
          }

          // Support order_no, client_order_id (legacy), order_code, or derived
          const orderNo = order.order_no || order.client_order_id || order.order_code || (order.id ? ('MC-MTR' + (typeof order.id === 'number' ? order.id.toString(36).toUpperCase() : order.id)) : 'MC-ORDER');
          const chronoNo = '#' + order.id;

          return {
            id: order.id,
            order_no: orderNo,
            client_order_id: order.client_order_id || orderNo,
            chronological_no: chronoNo,
            customer_id: order.customer_id,
            customer_name: cust?.name || 'গ্রাহক',
            customer_phone: cust?.phone || order.sender_number || '',
            shipping_address: order.shipping_address || cust?.address || '',
            district: cust?.district || (String(order.shipping_address || '').includes('ঢাকা') ? 'Inside Dhaka' : 'Outside Dhaka'),
            payment_method: order.payment_method || 'cod',
            sender_number: order.sender_number || null,
            trx_id: order.trx_id || null,
            status: order.status || 'pending_verification',
            subtotal_bdt: subtotal,
            delivery_charge_bdt: deliveryCharge,
            total_amount_bdt: totalAmount,
            courier_name: order.courier_name || null,
            tracking_code: order.tracking_code || null,
            last_modified_by: order.last_modified_by || null,
            items: normalizedItems,
            customer_notes: order.customer_notes || null,
            created_at: order.created_at,
            updated_at: order.updated_at,
            audit_trail: auditMap.get(String(order.id)) || auditMap.get(String(orderNo)) || []
          };
        });

        // Compute metrics (unifying confirmed and verified into ready-for-dispatch)
        const pendingCount = enrichedOrders.filter(o => o.status === 'pending_verification').length;
        const confirmedCount = enrichedOrders.filter(o => o.status === 'confirmed' || o.status === 'verified').length;
        const dispatchedCount = enrichedOrders.filter(o => o.status === 'dispatched').length;
        const deliveredCount = enrichedOrders.filter(o => o.status === 'delivered').length;

        return jsonResponse({
          success: true,
          current_staff: auth.staff,
          orders: enrichedOrders,
          metrics: {
            total_count: enrichedOrders.length,
            pending_count: pendingCount,
            verified_count: confirmedCount, // backward compatibility
            confirmed_count: confirmedCount,
            dispatched_count: dispatchedCount,
            delivered_count: deliveredCount
          }
        }, 200);
      }
    } catch (err) {
      console.error('Supabase fetch error in /api/staff:', err);
      // Fallback to memory store if query failed
    }
  }

  // 3. Fallback: Local memory mock store
  let filtered = memoryMockOrders.map(o => ({ ...o, items: normalizeOrderItems(o.items) }));
  if (statusFilter && statusFilter !== 'all') {
    if (statusFilter === 'confirmed_or_verified' || statusFilter === 'ready_for_dispatch') {
      filtered = filtered.filter(o => o.status === 'confirmed' || o.status === 'verified');
    } else {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
  }

  const pendingCount = memoryMockOrders.filter(o => o.status === 'pending_verification').length;
  const confirmedCount = memoryMockOrders.filter(o => o.status === 'confirmed' || o.status === 'verified').length;
  const dispatchedCount = memoryMockOrders.filter(o => o.status === 'dispatched').length;
  const deliveredCount = memoryMockOrders.filter(o => o.status === 'delivered').length;

  return jsonResponse({
    success: true,
    current_staff: auth.staff,
    orders: filtered,
    metrics: {
      total_count: memoryMockOrders.length,
      pending_count: pendingCount,
      verified_count: confirmedCount,
      confirmed_count: confirmedCount,
      dispatched_count: dispatchedCount,
      delivered_count: deliveredCount
    }
  }, 200);
}

// ==========================================
// POST HANDLER: Authentication & Mutations
// ==========================================

export async function onRequestPost(context) {
  const { request, env = {} } = context;
  const ip = getClientIp(request);

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ success: false, error: 'অনুরোধের তথ্য সঠিক নয় (Invalid JSON)।' }, 400);
  }

  const url = new URL(request.url);
  const actionParam = url.searchParams.get('action');
  const action = String(body.action || actionParam || '').trim().toLowerCase();

  // ----------------------------------------------------
  // ACTION 1: Named Staff Login (with Brute-Force Rate Limiting)
  // ----------------------------------------------------
  if (action === 'login') {
    // 1. Check Rate Limit
    const rateStatus = checkRateLimit(ip);
    if (!rateStatus.allowed) {
      return jsonResponse({
        success: false,
        error: rateStatus.message,
        retry_after_seconds: rateStatus.retryAfter
      }, 429);
    }

    const name = String(body.name || body.staff_name || body.username || '').trim();
    const pin = String(body.pin || body.passkey || '').trim();

    if (!name || !pin) {
      recordFailedAttempt(ip);
      return jsonResponse({
        success: false,
        error: 'নাম এবং পিন উভয়ই প্রদান করা আবশ্যক।'
      }, 400);
    }

    let authenticatedStaff = null;

    // A. Check Supabase staff_members table if configured
    if (env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) {
      const supabaseUrl = String(env.SUPABASE_URL).trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
      const supabaseKey = String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY).trim();
      const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      };

      try {
        const staffQueryUrl = `${supabaseUrl}/rest/v1/staff_members?name=ilike.${encodeURIComponent(name)}&pin=eq.${encodeURIComponent(pin)}&is_active=eq.true&select=id,name,role,phone`;
        const staffResp = await fetch(staffQueryUrl, { headers });
        if (staffResp.ok) {
          const matched = await staffResp.json();
          if (Array.isArray(matched) && matched.length > 0) {
            authenticatedStaff = matched[0];
          }
        }
      } catch (err) {
        console.error('Staff auth check error:', err);
      }
    }

    // B. Check Pre-seeded staff list (for local dev or fallback)
    if (!authenticatedStaff) {
      const preMatch = PRESEEDED_STAFF.find(
        s => s.name.toLowerCase() === name.toLowerCase() && s.pin === pin
      );
      if (preMatch) {
        authenticatedStaff = { name: preMatch.name, role: preMatch.role };
      }
    }

    // C. Admin master passkey fallback
    if (!authenticatedStaff) {
      const masterKey = String(env.STAFF_ACCESS_KEY || DEFAULT_LOCAL_PASSKEY).trim();
      if (pin === masterKey && name.toLowerCase() === 'admin') {
        authenticatedStaff = { name: 'Admin', role: 'admin' };
      }
    }

    // Handle authentication result
    if (!authenticatedStaff) {
      const record = recordFailedAttempt(ip);
      const remainingAttempts = Math.max(0, 5 - record.count);
      if (record.count >= 5) {
        const retryAfter = Math.ceil((record.lockedUntil - Date.now()) / 1000);
        return jsonResponse({
          success: false,
          error: 'ভুল নাম অথবা পিন। অতিরিক্ত ভুল চেষ্টার কারণে একাউন্ট সাময়িকভাবে ১০ মিনিটের জন্য লক করা হয়েছে।',
          retry_after_seconds: retryAfter
        }, 429);
      }
      return jsonResponse({
        success: false,
        error: `ভুল নাম অথবা পিন। (অবশিষ্ট চেষ্টা: ${remainingAttempts} বার)`
      }, 401);
    }

    // Authentication succeeded: clear rate limiter
    clearRateLimit(ip);

    // Generate signed token
    const token = await generateSessionToken(authenticatedStaff, env);

    return jsonResponse({
      success: true,
      message: `স্বাগতম, ${authenticatedStaff.name}!`,
      token,
      staff: {
        name: authenticatedStaff.name,
        role: authenticatedStaff.role
      }
    }, 200);
  }

  // ----------------------------------------------------
  // ORDER MUTATIONS: Requires Valid Authentication
  // ----------------------------------------------------
  const auth = await authenticateRequest(request, env);
  if (!auth.authenticated) {
    return jsonResponse({
      success: false,
      error: 'অননুমোদিত প্রবেশাধিকার। অনুগ্রহ করে পুনরায় লগইন করুন।'
    }, 401);
  }

  const staffName = auth.staff.name || 'Staff';
  const orderId = String(body.order_id || body.orderId || '').trim().toUpperCase();
  const courierName = String(body.courier_name || body.courierName || '').trim();
  const trackingCode = String(body.tracking_code || body.trackingCode || '').trim().toUpperCase();
  const note = String(body.note || body.reason || '').trim();

  if (!orderId) {
    return jsonResponse({ success: false, error: 'অর্ডার নম্বর প্রদান করা বাধ্যতামূলক।' }, 400);
  }

  const validActions = ['verify_payment', 'mark_dispatched', 'cancel_order', 'update_courier', 'override_status'];
  if (!validActions.includes(action)) {
    return jsonResponse({
      success: false,
      error: `অকার্যকর অ্যাকশন (${action})। প্রযোজ্য অ্যাকশন: verify_payment, mark_dispatched, cancel_order, update_courier, override_status`
    }, 400);
  }

  let newStatus = null;
  let auditActionType = 'note_added';
  const auditDetails = { staff_name: staffName };
  const updates = {
    last_modified_by: staffName,
    updated_at: new Date().toISOString()
  };

  if (action === 'verify_payment') {
    newStatus = 'verified';
    updates.status = newStatus;
    auditActionType = 'payment_verified';
    if (body.trx_id) auditDetails.trx_id = body.trx_id;
  } else if (action === 'mark_dispatched') {
    newStatus = 'dispatched';
    updates.status = newStatus;
    auditActionType = 'dispatched';
    if (courierName) updates.courier_name = courierName;
    if (trackingCode) updates.tracking_code = trackingCode;
    auditDetails.courier_name = courierName;
    auditDetails.tracking_code = trackingCode;
  } else if (action === 'cancel_order') {
    newStatus = 'cancelled';
    updates.status = newStatus;
    auditActionType = 'cancelled';
    if (note) auditDetails.reason = note;
  } else if (action === 'update_courier') {
    auditActionType = 'courier_updated';
    if (courierName) updates.courier_name = courierName;
    if (trackingCode) updates.tracking_code = trackingCode;
    auditDetails.courier_name = courierName;
    auditDetails.tracking_code = trackingCode;
  } else if (action === 'override_status') {
    const targetStatus = String(body.status || '').trim().toLowerCase();
    const allowedStatuses = ['pending_verification', 'confirmed', 'verified', 'dispatched', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(targetStatus)) {
      return jsonResponse({ success: false, error: `অকার্যকর স্ট্যাটাস (${targetStatus})` }, 400);
    }
    newStatus = targetStatus;
    updates.status = newStatus;
    auditActionType = 'status_override';
    auditDetails.target_status = newStatus;
    if (note) auditDetails.reason = note;
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
      // 1. Update orders table (supports querying by bigint id, client_order_id, or order_no)
      let matchFilter;
      if (/^\d+$/.test(orderId)) {
        matchFilter = `or=(id.eq.${orderId},client_order_id.eq.${encodeURIComponent(orderId)},order_no.eq.${encodeURIComponent(orderId)})`;
      } else {
        matchFilter = `or=(client_order_id.eq.${encodeURIComponent(orderId)},order_no.eq.${encodeURIComponent(orderId)})`;
      }

      // Try updating with last_modified_by first
      let patchBody = { ...updates };
      let updateResp = await fetch(
        `${supabaseUrl}/rest/v1/orders?${matchFilter}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify(patchBody)
        }
      );

      // If failed because last_modified_by column does not exist yet in Supabase, retry without it
      if (!updateResp.ok) {
        const errTxt = await updateResp.text();
        console.warn('First PATCH attempt failed, retrying without last_modified_by:', updateResp.status, errTxt);
        if (errTxt.includes('last_modified_by') || errTxt.includes('does not exist')) {
          delete patchBody.last_modified_by;
          updateResp = await fetch(
            `${supabaseUrl}/rest/v1/orders?${matchFilter}`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify(patchBody)
            }
          );
        }
      }

      // 2. Insert audit log record (fire and record)
      fetch(`${supabaseUrl}/rest/v1/order_audit_logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          order_id: orderId,
          staff_name: staffName,
          action: auditActionType,
          details: auditDetails,
          created_at: new Date().toISOString()
        })
      }).catch(e => console.error('Failed to write audit log to Supabase:', e));

      if (updateResp.ok) {
        const updatedRows = await updateResp.json().catch(() => []);
        const savedOrder = Array.isArray(updatedRows) && updatedRows.length > 0 ? updatedRows[0] : null;

        return jsonResponse({
          success: true,
          message: `অর্ডার #${orderId} সফলভাবে হালনাগাদ করা হয়েছে (${staffName} কর্তৃক)।`,
          order: savedOrder ? {
            ...savedOrder,
            subtotal_bdt: Number(savedOrder.subtotal_bdt ?? savedOrder.subtotal ?? 0),
            delivery_charge_bdt: Number(savedOrder.delivery_charge_bdt ?? savedOrder.delivery_charge ?? 0),
            total_amount_bdt: Number(savedOrder.total_amount_bdt ?? savedOrder.total_amount ?? 0)
          } : updates
        }, 200);
      } else {
        const errTxt = await updateResp.text().catch(() => '');
        console.error('Supabase update failed:', updateResp.status, errTxt);
        return jsonResponse({
          success: false,
          error: `ডাটাবেজ আপডেট ব্যর্থ হয়েছে: ${errTxt}`
        }, 500);
      }
    } catch (err) {
      console.error('Supabase update error in /api/staff:', err);
    }
  }

  // B. Fallback: Update in-memory mock store
  const targetIndex = memoryMockOrders.findIndex(o => 
    String(o.id).toUpperCase() === orderId || 
    String(o.order_no || '').toUpperCase() === orderId
  );
  if (targetIndex !== -1) {
    const targetOrder = memoryMockOrders[targetIndex];
    if (!targetOrder.audit_trail) targetOrder.audit_trail = [];
    
    targetOrder.audit_trail.unshift({
      id: `aud-${Date.now()}`,
      order_id: orderId,
      staff_name: staffName,
      action: auditActionType,
      details: auditDetails,
      created_at: new Date().toISOString()
    });

    memoryMockOrders[targetIndex] = {
      ...targetOrder,
      ...updates
    };

    return jsonResponse({
      success: true,
      message: `অর্ডার #${orderId} সফলভাবে হালনাগাদ করা হয়েছে (${staffName} কর্তৃক)।`,
      order: memoryMockOrders[targetIndex]
    }, 200);
  }

  return jsonResponse({
    success: false,
    error: `অর্ডার ${orderId} খুঁজে পাওয়া যায়নি।`
  }, 404);
}
