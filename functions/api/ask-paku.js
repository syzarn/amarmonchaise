/**
 * Cloudflare Pages Function: /api/ask-paku
 * Handles questions and recommendations submitted to Saru and dispatches to Telegram.
 */

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function convertBengaliDigits(str) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[০-৯]/g, (d) => bnDigits.indexOf(d));
}

function sanitizeContact(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let str = convertBengaliDigits(raw.trim());
  // Strip control characters & newlines
  str = str.replace(/[\u0000-\u001F\u007F]/g, '');

  // 1. Email format check
  if (str.includes('@')) {
    const cleanedEmail = str.toLowerCase().replace(/[\s\r\n\t]/g, '');
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (emailRegex.test(cleanedEmail) && cleanedEmail.length <= 100) {
      return { type: 'email', value: cleanedEmail, label: 'ই-মেইল (Email)' };
    }
    return null;
  }

  // 2. Phone number format check (normalize spaces, dashes, parentheses, dots)
  let cleanedPhone = str.replace(/[\s\-\(\)\.]/g, '');
  if (cleanedPhone.startsWith('+88')) {
    cleanedPhone = cleanedPhone.slice(3);
  } else if (cleanedPhone.startsWith('88')) {
    cleanedPhone = cleanedPhone.slice(2);
  }

  // BD phone: 11 digits starting with 01[3-9]
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  if (bdPhoneRegex.test(cleanedPhone)) {
    return { type: 'phone', value: cleanedPhone, label: 'মোবাইল (Phone)' };
  }

  // General / international phone: 7-15 digits
  const intlCleaned = str.replace(/[\s\-\(\)\.]/g, '');
  const intlPhoneRegex = /^\+?[0-9]{7,15}$/;
  if (intlPhoneRegex.test(intlCleaned)) {
    return { type: 'phone', value: intlCleaned, label: 'ফোন (Phone)' };
  }

  return null;
}

function safeTgMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/([*_`\[])/g, '\\$1');
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'অবৈধ অনুরোধ। সঠিক JSON প্রদান করুন।' }, 400);
  }

  const { name, contact, type, message } = body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return jsonResponse({ error: 'অনুগ্রহ করে আপনার নাম লিখুন।' }, 400);
  }

  if (!contact || typeof contact !== 'string' || !contact.trim()) {
    return jsonResponse({ error: 'অনুগ্রহ করে আপনার ই-মেইল বা মোবাইল নম্বর লিখুন।' }, 400);
  }

  const sanitizedContact = sanitizeContact(contact);
  if (!sanitizedContact) {
    return jsonResponse({ error: 'অনুগ্রহ করে একটি সঠিক ই-মেইল ঠিকানা অথবা ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।' }, 400);
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return jsonResponse({ error: 'অনুগ্রহ করে আপনার জিজ্ঞাসা বা পরামর্শ লিখুন।' }, 400);
  }

  const sanitizedName = name.trim().slice(0, 100);
  const sanitizedType = type === 'recommendation' ? 'recommendation' : 'question';
  const sanitizedMessage = message.trim().slice(0, 2000);

  const typeLabel = sanitizedType === 'recommendation' ? 'পরামর্শ (Recommendation)' : 'জিজ্ঞাসা (Question)';
  const nowDhaka = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });

  // Optional Telegram Alert Notification (Identical credentials as checkout)
  if (env && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const safeContactValue = sanitizedContact.value.replace(/`/g, '');
    const tgMsg = [
      `*নতুন বার্তা: সারুর সাথে কথোপকথন*`,
      ``,
      `*প্রেরক:* ${safeTgMarkdown(sanitizedName)}`,
      `*যোগাযোগ (${sanitizedContact.label}):* \`${safeContactValue}\``,
      `*ধরণ:* ${typeLabel}`,
      `*সময়:* ${nowDhaka} (Dhaka Time)`,
      ``,
      `*বার্তা:*`,
      `${safeTgMarkdown(sanitizedMessage)}`
    ].join('\n');

    try {
      const sendPromise = fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: tgMsg,
          parse_mode: 'Markdown'
        })
      }).catch(tgErr => console.error('Telegram dispatch error:', tgErr));

      if (context.waitUntil) {
        context.waitUntil(sendPromise);
      } else {
        await sendPromise;
      }
    } catch (err) {
      console.error('Telegram notification error:', err);
    }
  } else {
    console.info('Telegram credentials not configured. Simulated dispatch for message:', {
      name: sanitizedName,
      contact: sanitizedContact,
      type: sanitizedType,
      message: sanitizedMessage
    });
  }

  return jsonResponse({
    success: true,
    message: 'বার্তা সফলভাবে পাঠানো হয়েছে!'
  }, 200);
}
