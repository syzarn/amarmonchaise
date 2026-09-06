/**
 * ============================================================================
 * MON CHAISE (মঞ্চাইছে) — DUAL RECEIPT ENGINE
 * Dedicated Separate Receipt Rendering for English (POS Thermal) & Bengali (Lined Khata)
 * ============================================================================
 */

(function () {
  'use strict';

  // --- BENGALI NUMBER & DATE HELPERS ---
  const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const BN_MONTHS = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const EN_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  function toBengaliDigits(input) {
    if (input === null || input === undefined) return '';
    return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
  }

  function formatBengaliMoney(amount) {
    const num = Math.round(Number(amount) || 0);
    return '৳ ' + toBengaliDigits(num.toLocaleString('en-US'));
  }

  function formatEnglishMoney(amount) {
    const num = Math.round(Number(amount) || 0);
    return 'BDT ' + num.toLocaleString('en-US');
  }

  function formatBengaliDate(isoDateStr) {
    const date = isoDateStr ? new Date(isoDateStr) : new Date();
    const day = date.getDate();
    const month = BN_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
    hours = hours % 12 || 12;
    return `${toBengaliDigits(day)} ${month} ${toBengaliDigits(year)}, ${toBengaliDigits(hours)}:${toBengaliDigits(minutes)} ${ampm}`;
  }

  function formatEnglishDate(isoDateStr) {
    const date = isoDateStr ? new Date(isoDateStr) : new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = EN_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  function numberToBengaliWords(num) {
    num = Math.floor(Number(num) || 0);
    if (num === 0) return 'শূন্য';

    const units = [
      '', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
      'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ',
      'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ',
      'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ',
      'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ',
      'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়াল্লিশ', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট',
      'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর',
      'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি',
      'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'অষ্টআশি', 'ঊননব্বই', 'নব্বই',
      'একানব্বই', 'বানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
    ];

    let words = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = Math.floor(num / 100);
    num %= 100;

    if (crore > 0) words += (units[crore] || crore) + ' কোটি ';
    if (lakh > 0) words += (units[lakh] || lakh) + ' লাখ ';
    if (thousand > 0) words += (units[thousand] || thousand) + ' হাজার ';
    if (hundred > 0) words += (units[hundred] || hundred) + ' শত ';
    if (num > 0) words += units[num] + ' ';

    return words.trim();
  }

  // --- WIKTIONARY BENGALI ROMANIZATION ALGORITHM (ADAPTED FOR ASCII & CP437) ---
  // Ported from Wiktionary Module:bn-translit with modifications for plain ASCII / CP437
  const CHAR_MAP = {
    // Consonants
    '\u0995': 'k', '\u0996': 'kh', '\u0997': 'g', '\u0998': 'gh', '\u0999': 'ng',
    '\u099A': 'ch', '\u099B': 'chh', '\u099C': 'j', '\u099D': 'jh', '\u099E': 'n',
    '\u099F': 't', '\u09A0': 'th', '\u09A1': 'd', '\u09A2': 'dh', '\u09A3': 'n',
    '\u09A4': 't', '\u09A5': 'th', '\u09A6': 'd', '\u09A7': 'dh', '\u09A8': 'n',
    '\u09AA': 'p', '\u09AB': 'f', '\u09AC': 'b', '\u09AD': 'bh', '\u09AE': 'm',
    '\u09AF': 'j', '\u09B0': 'r', '\u09B2': 'l',
    '\u09B6': 'sh', '\u09B7': 'sh', '\u09B8': 's', '\u09B9': 'h',
    '\u09DC': 'r', '\u09DD': 'rh', '\u09DF': 'y', '\u09CE': 't', '\u0982': 'ng', '\u0983': 'h',
    '\u0981': '', // chandrabindu

    // Vowel Diacritics
    '\u09BE': 'a', '\u09BF': 'i', '\u09C0': 'i', '\u09C1': 'u', '\u09C2': 'u',
    '\u09C3': 'ri', '\u09C7': 'e', '\u09C8': 'oi', '\u09CB': 'o', '\u09CC': 'ou',

    // Independent Vowels
    '\u0985': 'o', '\u0986': 'a', '\u0987': 'i', '\u0988': 'i', '\u0989': 'u',
    '\u098A': 'u', '\u098B': 'ri', '\u098F': 'e', '\u0990': 'oi', '\u0993': 'o',
    '\u0994': 'ou',

    // Virama
    '\u09CD': '',

    // Digits
    '\u09E6': '0', '\u09E7': '1', '\u09E8': '2', '\u09E9': '3', '\u09EA': '4',
    '\u09EB': '5', '\u09EC': '6', '\u09ED': '7', '\u09EE': '8', '\u09EF': '9',

    // Punctuation
    '\u0964': '.', '\u0965': '.'
  };

  function romanizeBengali(input) {
    if (!input) return '';
    let str = String(input).trim();
    if (!/[\u0980-\u09FF]/.test(str)) return str;

    // Common abbreviations and terms
    str = str.replace(/নং/g, 'No.');
    str = str.replace(/রোড/g, 'Road');
    str = str.replace(/বাড়ি|বাড়ি/g, 'House');

    // Insert inherent vowel 'o' after consonants not followed by vowel sign or virama
    str = str.replace(/([\u0995-\u09B9\u09DC-\u09DF]়?)([\u09BE-\u09CC\u0985-\u0994\u09CD]?)/g, (m, c, v) => {
      return c + (v === '' ? 'o' : v);
    });

    // Phonetic cluster smoothing
    str = str.replace(/হo([\u0995-\u09B9\u09DC-\u09DF])/g, 'হ$1');
    str = str.replace(/নo([\u09AD\u09AC\u09A1\u09A4\u09A6\u09A7])/g, 'ন$1');

    // Terminal 'o' deletion (Wiktionary reverse technique)
    str = str.replace(/([\u09BE-\u09CC\u0985-\u0994a-z])([\u0995-\u09B9\u09DC-\u09DF])o(?=[\s,\.\/\(\)\-]|$)/g, '$1$2');
    str = str.replace(/([\u0995-\u09B9\u09DC-\u09DF]o[\u0995-\u09B9\u09DC-\u09DF])o(?=[\s,\.\/\(\)\-]|$)/g, '$1');

    // Translate mapped characters
    let out = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      out += CHAR_MAP[ch] !== undefined ? CHAR_MAP[ch] : ch;
    }

    // Common English romanization smoothing
    out = out.replace(/sh([lr])/gi, 's$1');
    out = out.replace(/bho\b/gi, 'bh');
    out = out.replace(/dho\b/gi, 'dh');
    out = out.replace(/sho\b/gi, 'sh');
    out = out.replace(/to\b/gi, 't');
    out = out.replace(/ro\b/gi, 'r');
    out = out.replace(/mo\b/gi, 'm');
    out = out.replace(/no\b/gi, 'n');
    out = out.replace(/oo+/gi, 'o');
    out = out.replace(/ii+/gi, 'i');
    out = out.replace(/uu+/gi, 'u');
    out = out.replace(/aa+/gi, 'a');

    // Well-known name adjustments
    out = out.replace(/Tanbhir/gi, 'Tanvir');
    out = out.replace(/Ahomed/gi, 'Ahmed');

    return out.replace(/\b[a-z]/g, c => c.toUpperCase()).trim();
  }

  // Resolves customer name for Bengali receipt:
  // - If customer provided Bengali name -> return { name: bnName, isBengali: true } (rendered in Kobiguru)
  // - If customer provided English name only -> return { name: enName, isBengali: false } (rendered in Biro Script)
  function resolveCustomerNameBn(rawName) {
    if (!rawName) return { name: 'সম্মানিত ক্রেতা', isBengali: true };
    const str = String(rawName).trim();

    if (/[\u0980-\u09FF]/.test(str)) {
      // If bilingual format with Bengali in parentheses: "Fahmida Moon (ফাহমিদা মুন)"
      const parenMatch = str.match(/\(([\u0980-\u09FF\s]+)\)/);
      if (parenMatch && parenMatch[1].trim()) {
        return { name: parenMatch[1].trim(), isBengali: true };
      }
      // If Bengali first followed by English in parentheses: "ফাহমিদা মুন (Fahmida Moon)"
      const preParenMatch = str.match(/^([\u0980-\u09FF\s]+)\s*\(/);
      if (preParenMatch && preParenMatch[1].trim()) {
        return { name: preParenMatch[1].trim(), isBengali: true };
      }
      // Strip any English characters in parentheses or slashes
      const cleaned = str.replace(/\([A-Za-z\s\.\-']+\)/g, '').replace(/\/[A-Za-z\s\.\-']+/g, '').trim();
      return { name: cleaned || str, isBengali: true };
    }

    return { name: str, isBengali: false };
  }

  // Resolves customer name for English receipt:
  // - Always strictly in English (Latin ASCII)
  // - If English was provided, extracts it
  // - If ONLY Bengali was provided, romanizes via Wiktionary algorithm
  function resolveCustomerNameEn(rawName) {
    if (!rawName) return 'VALUED CUSTOMER';
    const str = String(rawName).trim();

    const enMatch = str.match(/[A-Za-z][A-Za-z\s\.\-']*/);
    if (enMatch && enMatch[0].trim().length >= 2) {
      return enMatch[0].trim().toUpperCase();
    }

    const romanized = romanizeBengali(str);
    return (romanized || 'VALUED CUSTOMER').toUpperCase();
  }

  // --- BENGALI RECEIPT GENERATOR (হাতে লেখা দাগ টানা খাতার মেমো) ---
  function generateBengaliReceiptHtml(order) {
    const items = order.items || order.cart || [];
    const subtotal = order.pricing?.subtotal || 0;
    const delivery = order.pricing?.deliveryCharge ?? order.pricing?.deliveryFee ?? 0;
    const total = order.pricing?.grandTotal || (subtotal + delivery);
    const dateFormatted = formatBengaliDate(order.createdAt);
    const totalWords = numberToBengaliWords(total);

    const paymentMethodLabel = order.payment?.method === 'cod'
      ? 'ক্যাশ অন ডেলিভারি'
      : 'অগ্রিম এমএফএস সেন্ড মানি';

    const districtLabel = order.customer?.district === 'dhaka'
      ? 'ঢাকা মহানগর'
      : 'ঢাকার বাইরে (সারাদেশ)';

    // Name resolution: Bengali name in Kobiguru; if only English was given, render in Biro Script!
    const customerBn = resolveCustomerNameBn(order.customer?.name);
    const customerNameHtml = customerBn.isBengali
      ? `<span class="receipt-customer-bn">${customerBn.name}</span>`
      : `<span class="receipt-customer-latin font-biro">${customerBn.name}</span>`;

    return `
      <div id="receipt-bn-content" class="receipt-paper-bn select-none">
        <!-- Top Traditional Invocation Banner -->
        <div style="text-align: center; margin-bottom: 6px; font-size: 18px; letter-spacing: 0.08em;">
          <span>॥ ৭ ॥</span>
        </div>

        <!-- Store Masthead (হাতে লেখা খাতা মেমো) -->
        <div style="text-align: center; border-bottom: 2px solid rgba(189,58,84,0.4); padding-bottom: 8px; margin-bottom: 12px;">
          <h1 style="font-size: 42px; font-weight: bold; margin: 0; line-height: 1.1; color: #a71a1aff;">মঞ্চাইছে</h1>
          <p style="font-size: 18px; margin: 2px 0 0; color: #4a3b32;">হস্তশিল্প, শৌখিন কারুশিল্প ও তাঁতবস্ত্রের মেমো</p>
          <p style="font-size: 15px; margin: 2px 0 0; opacity: 0.85;">ঢাকা, বাংলাদেশ — জরুরি যোগাযোগ: ০১৪১০-০০২৭১১</p>
        </div>

        <!-- Customer & Order Meta Information -->
        <div style="margin-bottom: 12px; font-size: 17px; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; border-bottom: 1px dashed rgba(123,156,179,0.45); padding-bottom: 4px; margin-bottom: 6px;">
            <span><strong>মেমো নং:</strong> <span class="receipt-order-code-stamp">${order.orderId}</span></span>
            <span><strong>তারিখ:</strong> ${dateFormatted}</span>
          </div>
          <div>
            <strong>খরিদ্দারের নাম:</strong> ${customerNameHtml}
          </div>
          <div>
            <strong>মোবাইল নম্বর:</strong> ${toBengaliDigits(order.customer?.phone || '')}
          </div>
          <div>
            <strong>ঠিকানা:</strong> <span>${order.customer?.address || ''} (${districtLabel})</span>
          </div>
          <div>
            <strong>মূল্য পরিশোধ:</strong> ${paymentMethodLabel}
            ${order.payment?.trxId ? ` — <strong>TrxID:</strong> ${order.payment.trxId} (প্রেরক: ${toBengaliDigits(order.payment.senderPhone || '')})` : ''}
          </div>
        </div>

        <!-- Items Table (হাতের টানে দাগ কাটা ছক) -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 16.5px;">
          <thead>
            <tr style="border-top: 1.5px solid #2b1d14; border-bottom: 1.5px solid #2b1d14;">
              <th style="padding: 6px 4px; text-align: center; width: 34px;">ক্র.</th>
              <th style="padding: 6px 6px; text-align: left;">পণ্যের বিবরণ</th>
              <th style="padding: 6px 4px; text-align: center; width: 44px;">পরিমাণ</th>
              <th style="padding: 6px 6px; text-align: right; width: 75px;">দর</th>
              <th style="padding: 6px 6px; text-align: right; width: 85px;">মোট টাকা</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => `
              <tr style="border-bottom: 1px dashed rgba(123,156,179,0.35);">
                <td style="padding: 6px 4px; text-align: center; vertical-align: top;">${toBengaliDigits(idx + 1)}।</td>
                <td style="padding: 6px 6px; text-align: left; vertical-align: top; font-weight: 500;">
                  ${item.name_bn || item.name}
                </td>
                <td style="padding: 6px 4px; text-align: center; vertical-align: top;">${toBengaliDigits(item.qty)}</td>
                <td style="padding: 6px 6px; text-align: right; vertical-align: top;">${toBengaliDigits(item.price)}</td>
                <td style="padding: 6px 6px; text-align: right; vertical-align: top;">${toBengaliDigits(item.total || (item.price * item.qty))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals & In-Words Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px; border-top: 1.5px solid #2b1d14; padding-top: 6px;">
          <div style="flex: 1; padding-right: 14px; font-size: 15.5px; line-height: 1.45;">
            <div><strong>কথায়:</strong> ${totalWords} টাকা মাত্র।</div>
            <div style="font-size: 13.5px; opacity: 0.85; margin-top: 3px;">
              * পণ্য ডেলিভারি ম্যানের সামনে দেখে বুঝে নিন।<br>“যার যা, যেমনে মন চায়!”
            </div>
          </div>
          <div style="width: 180px; text-align: right; font-size: 16px; line-height: 1.5;">
            <div>মোট মূল্য: <strong>${formatBengaliMoney(subtotal)}</strong></div>
            <div>ডেলিভারি খরচ: <strong>${formatBengaliMoney(delivery)}</strong></div>
            <div style="border-top: 1.5px double #2b1d14; margin-top: 3px; padding-top: 2px; font-size: 18.5px; color: #a71a1aff;">
              সর্বমোট: <strong>${formatBengaliMoney(total)}</strong>
            </div>
          </div>
        </div>

        <!-- Authentic Postage Stamp & Red-Inked Saru Seal Stamp -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 16px; padding-top: 4px;">
          <div style="position: relative; width: 145px; height: 95px; display: flex; align-items: center;">
            <img src="./files/monchaise_stamp.png" class="receipt-seal-stamp" style="width: 110px; height: auto; border-radius: 2px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transform: rotate(-2deg);" alt="মঞ্চাইছে ডাকটিকিট" />
            <img src="./files/saru_seal_stamp.svg" class="receipt-red-seal" style="position: absolute; left: 16px; top: -10px; width: 125px; height: auto; transform: rotate(-10deg); pointer-events: none; mix-blend-mode: multiply; opacity: 0.94; filter: drop-shadow(0 0.5px 1px rgba(184,36,56,0.25));" alt="সিলমোহর" />
          </div>
          <div style="text-align: center; border-top: 1px solid #333333; width: 150px; padding-top: 4px; font-size: 16px;">
            <span>মঞ্চাইছে</span><br>
            <span style="font-size: 12.5px; opacity: 0.8;">(অনুমোদিত হস্তলিপি)</span>
          </div>
        </div>
      </div>
    `;
  }

  // --- CODE 128 (SET B) BARCODE SVG GENERATOR ---
  const CODE128_PATTERNS = [
    '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
    '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
    '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
    '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
    '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
    '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
    '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
    '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
    '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
    '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
    '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
  ];

  function generateCode128Svg(text, options = {}) {
    const raw = String(text || '').trim();
    if (!raw) return '';
    const height = options.height || 42;
    const barWidth = options.barWidth || 1.6;
    const quietZone = options.quietZone || 10;

    // Code Set B (standard for ASCII alphanumeric)
    const startVal = 104;
    const values = [startVal];
    let checksum = startVal;

    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i) - 32;
      const validCode = (code >= 0 && code <= 95) ? code : 0;
      values.push(validCode);
      checksum += (i + 1) * validCode;
    }
    checksum %= 103;
    values.push(checksum);
    values.push(106); // Stop code

    let totalModules = 0;
    const allPatterns = [];
    for (let j = 0; j < values.length; j++) {
      const p = CODE128_PATTERNS[values[j]];
      allPatterns.push(p);
      for (let k = 0; k < p.length; k++) {
        totalModules += parseInt(p[k], 10);
      }
    }

    const svgWidth = (totalModules * barWidth) + (2 * quietZone);
    const rects = [];
    let x = quietZone;

    for (let pIdx = 0; pIdx < allPatterns.length; pIdx++) {
      const pattern = allPatterns[pIdx];
      for (let wIdx = 0; wIdx < pattern.length; wIdx++) {
        const w = parseInt(pattern[wIdx], 10) * barWidth;
        if (wIdx % 2 === 0) { // Black bar
          rects.push(`<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${height}" fill="#000000" />`);
        }
        x += w;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth.toFixed(2)} ${height}" width="${svgWidth.toFixed(2)}" height="${height}" class="receipt-barcode-svg" style="display: block; margin: 0 auto; max-width: 100%; height: ${height}px;" aria-label="Code 128 Barcode: ${raw}">${rects.join('')}</svg>`;
  }

  // --- ENGLISH RECEIPT GENERATOR (THERMAL POS 80MM SLIP) ---
  function generateEnglishReceiptHtml(order) {
    const items = order.items || order.cart || [];
    const subtotal = order.pricing?.subtotal || 0;
    const delivery = order.pricing?.deliveryCharge ?? order.pricing?.deliveryFee ?? 0;
    const total = order.pricing?.grandTotal || (subtotal + delivery);
    const dateFormatted = formatEnglishDate(order.createdAt);

    const paymentMethodLabel = order.payment?.method === 'cod'
      ? 'CASH ON DELIVERY'
      : 'MFS ADVANCE SEND MONEY';

    const districtLabel = order.customer?.district === 'dhaka'
      ? 'INSIDE DHAKA'
      : 'OUTSIDE DHAKA';

    // Customer name strictly in English (romanized via Wiktionary if in Bengali)
    const customerEnName = resolveCustomerNameEn(order.customer?.name);

    // Customer address romanized to plain ASCII if written in Bengali
    const customerAddressEn = order.customer?.address
      ? romanizeBengali(order.customer.address).toUpperCase()
      : '';

    return `
      <div id="receipt-en-content" class="receipt-paper-en select-none">
        <!-- Thermal Receipt Header -->
        <div style="text-align: center; margin-bottom: 12px;">
          <div style="font-size: 11px; letter-spacing: 2px;">*** SALES RECEIPT ***</div>
          <h2 style="font-size: 22px; font-weight: bold; margin: 4px 0 2px; letter-spacing: 1px;">MON CHAISE</h2>
          <div style="font-size: 11px;">WE CRAFT WHATEVER THE HEART DESIRES</div>
          <div style="font-size: 11px;">MON CHAISE - DHAKA, BD</div>
          <div style="font-size: 11px;">HELPLINE: +880 1410-002711</div>
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>

        <!-- Meta Section -->
        <div style="font-size: 12px; line-height: 1.45;">
          <div style="display: flex; justify-content: space-between;">
            <span>ORDER NO:</span>
            <strong>${order.orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>DATE:</span>
            <span>${dateFormatted}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>CUSTOMER:</span>
            <strong>${customerEnName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>PHONE:</span>
            <span>${order.customer?.phone || ''}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>DELIVERY:</span>
            <span>${districtLabel}</span>
          </div>
          <div>
            <span>ADDRESS: ${customerAddressEn}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>PAYMENT:</span>
            <span>${paymentMethodLabel}</span>
          </div>
          ${order.payment?.trxId ? `
            <div style="display: flex; justify-content: space-between;">
              <span>TRX ID:</span>
              <span>${order.payment.trxId}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>SENDER:</span>
              <span>${order.payment.senderPhone || ''}</span>
            </div>
          ` : ''}
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>

        <!-- Column Headers -->
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 6px;">
          <span style="flex: 2;">ITEM</span>
          <span style="width: 32px; text-align: center;">QTY</span>
          <span style="width: 58px; text-align: right;">PRICE</span>
          <span style="width: 68px; text-align: right;">TOTAL</span>
        </div>

        <div style="border-top: 1px dashed #444; margin-bottom: 6px;"></div>

        <!-- Line Items -->
        <div style="font-size: 12px; line-height: 1.35;">
          ${items.map(item => {
      const rawEnName = item.name_en || romanizeBengali(item.name || item.name_bn || '');
      const enName = (rawEnName || 'HANDLOOM ITEM').toUpperCase();
      return `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="flex: 2; padding-right: 6px;">${enName}</span>
                <span style="width: 32px; text-align: center;">${item.qty}</span>
                <span style="width: 58px; text-align: right;">${item.price}</span>
                <span style="width: 68px; text-align: right; font-weight: bold;">${item.total || (item.price * item.qty)}</span>
              </div>
            `;
    }).join('')}
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>

        <!-- Calculations -->
        <div style="font-size: 12px; line-height: 1.5;">
          <div style="display: flex; justify-content: space-between;">
            <span>SUBTOTAL:</span>
            <span>${formatEnglishMoney(subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>DELIVERY FEE:</span>
            <span>${formatEnglishMoney(delivery)}</span>
          </div>
          <div style="border-top: 1px solid #000; margin-top: 4px; padding-top: 4px; display: flex; justify-content: space-between; font-size: 13.5px; font-weight: bold;">
            <span>TOTAL AMOUNT:</span>
            <span>${formatEnglishMoney(total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 2px; font-size: 11px;">
            <span>STATUS:</span>
            <span>${order.payment?.method === 'cod' ? 'PAYMENT DUE ON ARRIVAL' : 'PAID (ADVANCE MFS)'}</span>
          </div>
        </div>

        <div style="border-top: 1px dashed #000; margin: 10px 0 8px;"></div>

        <!-- Footer / Code 128 Barcode (Vector SVG) -->
        <div style="text-align: center; font-size: 10.5px;">
          <div>* THANK YOU FOR PATRONIZING ARTISANS *</div>
          <div style="margin: 8px auto 4px; display: flex; justify-content: center; align-items: center;">
            ${generateCode128Svg(order.orderId, { height: 42, barWidth: 1.6, quietZone: 8 })}
          </div>
          <div style="letter-spacing: 2.5px; font-size: 11px; font-weight: bold; margin-top: 3px;">${order.orderId}</div>
          <div style="margin-top: 6px; font-size: 10px; letter-spacing: 1px;">HTTPS://AMARMONCHAISE.PAGES.DEV</div>
        </div>
      </div>
    `;
  }

  // --- HTML2PDF DYNAMIC INJECTOR ---
  let html2pdfLoadingPromise = null;
  function ensureHtml2PdfLoaded() {
    if (window.html2pdf) return Promise.resolve(window.html2pdf);
    if (html2pdfLoadingPromise) return html2pdfLoadingPromise;

    html2pdfLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './files/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = () => {
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        cdnScript.onload = () => resolve(window.html2pdf);
        cdnScript.onerror = () => reject(new Error('Failed to load html2pdf library.'));
        document.head.appendChild(cdnScript);
      };
      document.head.appendChild(script);
    });
    return html2pdfLoadingPromise;
  }

  // --- PDF EXPORT FUNCTION ---
  async function downloadReceiptPdf(order, lang = 'bn') {
    await ensureHtml2PdfLoaded();
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const targetId = lang === 'bn' ? 'receipt-bn-content' : 'receipt-en-content';
    let element = document.getElementById(targetId);

    // If modal is not rendering it currently, construct a detached container
    let detached = false;
    if (!element) {
      element = document.createElement('div');
      element.innerHTML = lang === 'bn'
        ? generateBengaliReceiptHtml(order)
        : generateEnglishReceiptHtml(order);
      element = element.firstElementChild;
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.top = '0';
      document.body.appendChild(element);
      detached = true;
    }

    const filename = `MonChaise_Receipt_${order.orderId}_${lang.toUpperCase()}.pdf`;

    // Configure PDF options specifically calibrated for each receipt style
    const opt = {
      margin: lang === 'en' ? [4, 4, 4, 4] : [6, 6, 6, 6],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: lang === 'en' ? [90, 240] : 'a5',
        orientation: 'portrait'
      }
    };

    try {
      await window.html2pdf().set(opt).from(element).save();
    } finally {
      if (detached && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }

  // --- PRINT FUNCTION ---
  function printReceipt(order, lang = 'bn') {
    let printContainer = document.getElementById('printable-receipt-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'printable-receipt-container';
      document.body.appendChild(printContainer);
    }

    printContainer.innerHTML = lang === 'bn'
      ? generateBengaliReceiptHtml(order)
      : generateEnglishReceiptHtml(order);

    window.print();
  }

  // --- INTERACTIVE RECEIPT MODAL CONTROLLER ---
  function openReceiptModal(order, defaultLang = 'bn') {
    // Preload custom fonts
    if (document.fonts && document.fonts.load) {
      document.fonts.load('14px "VKP80II-CP437"');
      document.fonts.load('bold 14px "VKP80II-CP437"');
      document.fonts.load('16px "Kobiguru"');
      document.fonts.load('18px "BiroScript"');
      document.fonts.load('24px "Confidential"');
    }

    let modalEl = document.getElementById('order-receipt-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'order-receipt-modal';
      document.body.appendChild(modalEl);
    }

    let currentLang = defaultLang === 'en' ? 'en' : 'bn';

    function renderModalContent() {
      modalEl.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div class="modal-animate-in relative w-full max-w-2xl bg-[#fafafa] dark:bg-[#0f0f14] border border-slate-300 dark:border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            
            <!-- Modal Header with Language Tabs -->
            <div class="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#14141d]">
              <div class="flex items-center gap-2">
                <img src="./files/monchaise_logo_green.svg" alt="Mon Chaise" class="h-8 w-auto dark:hidden" />
                <img src="./files/monchaise_logo.svg" alt="Mon Chaise" class="h-8 w-auto hidden dark:block" />
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    অর্ডার রসিদ / Order Receipt
                  </h3>
                  <span class="text-[11px] text-slate-500 dark:text-zinc-400">ID: ${order.orderId}</span>
                </div>
              </div>

              <!-- Dual Receipt Selector Tabs -->
              <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <button type="button" id="tab-receipt-bn" class="receipt-tab-btn ${currentLang === 'bn' ? 'active' : ''}">
                  <span>বাংলা রসিদ</span>
                </button>
                <button type="button" id="tab-receipt-en" class="receipt-tab-btn ${currentLang === 'en' ? 'active' : ''}">
                  <span>English Slip</span>
                </button>
              </div>
            </div>

            <!-- Receipt Display Scrollable Area -->
            <div class="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center items-start bg-slate-100/70 dark:bg-zinc-950/80">
              <div id="receipt-dynamic-view" class="w-full flex justify-center">
                ${currentLang === 'bn' ? generateBengaliReceiptHtml(order) : generateEnglishReceiptHtml(order)}
              </div>
            </div>

            <!-- Modal Action Footer -->
            <div class="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#14141d]">
              <div class="flex items-center gap-2.5 w-full sm:w-auto">
                <!-- Download PDF Button -->
                <button type="button" id="download-pdf-btn" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#166b58] hover:bg-[#125446] text-white dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-black font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span>PDF ডাউনলোড</span>
                </button>

                <!-- Print Button -->
                <button type="button" id="print-active-btn" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  <span>প্রিন্ট করুন</span>
                </button>

                <!-- Close Button -->
                <button type="button" id="close-receipt-modal-btn" class="px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold text-xs sm:text-sm transition-all">
                  ✕ বন্ধ করুন
                </button>
              </div>
            </div>

          </div>
        </div>
      `;

      modalEl.classList.remove('hidden');

      // Bind Tab Switchers
      document.getElementById('tab-receipt-bn')?.addEventListener('click', () => {
        currentLang = 'bn';
        renderModalContent();
      });

      document.getElementById('tab-receipt-en')?.addEventListener('click', () => {
        currentLang = 'en';
        renderModalContent();
      });

      // Bind PDF Download
      document.getElementById('download-pdf-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('download-pdf-btn');
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="animate-spin h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>রেন্ডার হচ্ছে...</span>
        `;
        try {
          await downloadReceiptPdf(order, currentLang);
        } catch (err) {
          console.error('PDF export failed:', err);
          alert('PDF রেন্ডারিংয়ে সমস্যা হয়েছে। অনুগ্রহ করে "প্রিন্ট করুন" অপশনটি ব্যবহার করে Save as PDF নির্বাচন করুন।');
        } finally {
          btn.disabled = false;
          btn.innerHTML = origText;
        }
      });

      // Bind Print
      document.getElementById('print-active-btn')?.addEventListener('click', () => {
        printReceipt(order, currentLang);
      });

      // Bind Close
      document.getElementById('close-receipt-modal-btn')?.addEventListener('click', () => {
        modalEl.classList.add('hidden');
      });
    }

    renderModalContent();
  }

  // Export public API to window
  window.ReceiptEngine = {
    generateBengaliReceiptHtml,
    generateEnglishReceiptHtml,
    downloadReceiptPdf,
    printReceipt,
    openReceiptModal,
    numberToBengaliWords,
    toBengaliDigits,
    romanizeBengali,
    resolveCustomerNameBn,
    resolveCustomerNameEn,
    generateCode128Svg
  };

})();
