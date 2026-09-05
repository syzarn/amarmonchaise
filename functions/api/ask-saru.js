/**
 * Cloudflare Pages Function: /api/ask-saru
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

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'অবৈধ অনুরোধ। সঠিক JSON প্রদান করুন।' }, 400);
  }

  const { name, type, message } = body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return jsonResponse({ error: 'অনুগ্রহ করে আপনার নাম লিখুন।' }, 400);
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
    const tgMsg = [
      `*নতুন বার্তা: সারুর সাথে কথোপকথন*`,
      ``,
      `*প্রেরক:* ${sanitizedName}`,
      `*ধরণ:* ${typeLabel}`,
      `*সময়:* ${nowDhaka} (Dhaka Time)`,
      ``,
      `*বার্তা:*`,
      `${sanitizedMessage}`
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
      type: sanitizedType,
      message: sanitizedMessage
    });
  }

  return jsonResponse({
    success: true,
    message: 'বার্তা সফলভাবে পাঠানো হয়েছে!'
  }, 200);
}
