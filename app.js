/**
 * MON CHAISE (মঞ্চাইছে)
 * Bilingual E-commerce Storefront Pure JavaScript Engine
 * Brand: Mon Chaise (মঞ্চাইছে)
 * Primary Slogan: "যা মন চায় বেচি"
 * Secondary Slogan: "যার যা, যেমনে মন চায়"
 * Themes: Light Mode (DEFAULT) with Calibrated Handloom Green & Dark Mode (AMOLED + Gold)
 */

(function () {
  'use strict';

  // --- BILINGUAL DICTIONARY ---
  const i18n = {
    bn: {
      siteTitle: 'মঞ্চাইছে | Mon Chaise',
      brandName: 'মঞ্চাইছে',
      englishBrand: 'Mon Chaise',
      tagline: 'যা মন চায় বেচি',
      secondaryTagline: 'যার যা, যেমনে মন চায়',
      heroSub: 'আমাদের খেয়ালে যা আসে, আমরা সেটাই সযত্নে বানিয়ে আপনার জন্য সাজিয়ে রাখি। যার যা, যেমনে মন চায়—অদ্ভুত, সুন্দর আর নস্টালজিক সব জিনিসপত্রের স্বাধীন পসরা।',
      shopNow: 'পসরা দেখুন',
      ourPhilosophy: 'আমাদের খেয়াল',
      searchPlaceholder: 'পণ্য খুঁজুন (যেমন: থামি, গামছা, ক্যাসেট, চা পাতা...)',
      allCategories: 'সব পণ্য',
      catWeaves: 'হস্তশিল্প ও বুনন',
      catQuirks: 'খেয়ালী ও আজব',
      catFood: 'চা ও ঘ্রাণ',
      catTech: 'টেক ও ডেস্ক',
      cartTitle: 'আপনার থলে',
      cartEmpty: 'আপনার থলে এখনো খালি!',
      cartEmptySub: 'পছন্দের যেকোনো অদ্ভুত জিনিস বেছে নিয়ে থলেতে ভরুন।',
      startShopping: 'কেনাকাটা শুরু করুন',
      subtotal: 'মোট মূল্য',
      deliveryNote: 'ডেলিভারি চার্জ চেকআউটে যুক্ত হবে',
      checkoutBtn: 'অর্ডার করতে এগিয়ে যান',
      itemAdded: 'পণ্যটি থলেতে ভরা হয়েছে!',
      itemRemoved: 'পণ্যটি সরানো হয়েছে',
      qtyUpdated: 'পরিমাণ পরিবর্তিত হয়েছে',
      orderSummary: 'অর্ডারের বিবরণী',
      deliveryCharge: 'ডেলিভারি চার্জ',
      grandTotal: 'সর্বমোট প্রদেয়',
      checkoutHeading: 'অর্ডার কনফার্ম করুন',
      checkoutSub: 'আপনার তথ্য দিয়ে সহজ দুই মিনিটে অর্ডার সম্পন্ন করুন।',
      customerInfo: '১. আপনার তথ্য',
      fullName: 'পুরো নাম',
      fullNamePlaceholder: 'যেমন: ফারহান আহমেদ',
      phone: 'মোবাইল নম্বর',
      phonePlaceholder: '017XXXXXXXX',
      phoneHelp: '১১ ডিজিটের বাংলাদেশি নম্বর (013 - 019)',
      address: 'সম্পূর্ণ ডেলিভারি ঠিকানা',
      addressPlaceholder: 'বাসা/রোড নম্বর, এলাকা, থানা/উপজেলা...',
      district: 'ডেলিভারি এলাকা',
      selectDistrict: 'ডেলিভারি এরিয়া নির্বাচন করুন',
      dhakaCity: 'ঢাকার ভেতরে (৳৬০ ডেলিভারি চার্জ)',
      outsideDhaka: 'ঢাকার বাইরে (৳১২০ ডেলিভারি চার্জ)',
      paymentHeading: '২. পেমেন্ট পদ্ধতি',
      codOption: 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)',
      codDesc: 'পণ্য হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করুন।',
      mfsOption: 'বিকাশ / নগদ / রকেট / উপায় (Send Money)',
      mfsDesc: 'আমাদের পার্সোনাল নাম্বারে সেন্ড মানি করে TrxID প্রদান করুন।',
      mfsInstructions: 'পেমেন্ট নির্দেশিকা:',
      mfsStep1: 'যেকোনো একটি পার্সোনাল নম্বরে মোট টাকা <b>Send Money</b> করুন।',
      mfsStep2: 'রেফারেন্সে আপনার নাম বা ফোন নাম্বার দিন।',
      mfsStep3: 'নিচের ঘরে প্রেরক নম্বর ও TrxID লিখে অর্ডার সম্পন্ন করুন।',
      copied: 'কপি হয়েছে!',
      copyNumber: 'কপি',
      senderPhone: 'যে নম্বর থেকে টাকা পাঠিয়েছেন',
      senderPhonePlaceholder: '01XXXXXXXXX',
      trxId: 'ট্রানজেকশন আইডি (TrxID)',
      trxIdPlaceholder: 'যেমন: BKA48X9PQZ',
      placeOrder: 'অর্ডার নিশ্চিত করুন',
      processing: 'অর্ডার প্রসেস হচ্ছে...',
      itemsCount: 'আইটেম',
      quickView: 'দ্রুত দেখুন',
      viewDetails: 'বিস্তারিত',
      addToCart: 'থলেতে ভরুন',
      inStock: 'স্টকে আছে',
      badgeHot: 'হট',
      badgeLimited: 'সীমিত সংস্করণ',
      badgeStaff: 'পছন্দের',
      badgeNew: 'নতুন খেয়াল',
      aboutThisItem: 'পণ্যের সম্পর্কে',
      facebookLabel: 'ফেসবুক',
      instagramLabel: 'ইনস্টাগ্রাম',
      footerAboutTitle: 'মঞ্চাইছে সম্পর্কে',
      footerAbout: 'আমরা কোনো ধরাবাঁধা দোকান নই। যখন যা মন চায়, সেটাই তৈরি করে আপনাদের সামনে নিয়ে আসি। যার যা, যেমনে মন চায়—সেই স্বাধীনতায় আমাদের বিশ্বাস।',
      footerQuickLinks: 'প্রয়োজনীয় লিংক',
      footerTerms: 'শর্তাবলী ও নিয়ম',
      footerPrivacy: 'গোপনীয়তা নীতি',
      footerContact: 'যোগাযোগ',
      footerHelpline: 'হেল্পলাইন: +880 1410-002711 (সকাল ১০টা - রাত ১০টা)',
      footerLocation: 'ঢাকা, বাংলাদেশ',
      footerPayments: 'গ্রহণযোগ্য পেমেন্ট মাধ্যম',
      footerCopyright: '© ২০২৬ মঞ্চাইছে (Mon Chaise)। সর্বস্বত্ব সংরক্ষিত।',
      successModalTitle: 'অর্ডার সফল হয়েছে! 🎉',
      successModalSub: 'আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই কনফার্মেশন কল করা হবে।',
      orderIdLabel: 'অর্ডার আইডি',
      orderTotalLabel: 'মোট প্রদেয়',
      paymentMethodLabel: 'পেমেন্ট মাধ্যম',
      deliveryAddressLabel: 'ডেলিভারি ঠিকানা',
      closeBtn: 'ঠিক আছে',
      printReceipt: 'রসিদ প্রিন্ট করুন',
      valNameRequired: 'দয়া করে আপনার পুরো নাম লিখুন।',
      valPhoneInvalid: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।',
      valAddressRequired: 'সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।',
      valDistrictRequired: 'ডেলিভারি এলাকা (ঢাকা / ঢাকার বাইরে) বেছে নিন।',
      valMfsSenderInvalid: 'সঠিক প্রেরক মোবাইল নম্বর দিন।',
      valTrxIdRequired: 'MFS পেমেন্টের TrxID প্রদান করা বাধ্যতামূলক।',
      valTrxIdInvalid: 'সঠিক TrxID প্রদান করুন (সর্বনিম্ন ৪ অক্ষর)।',
      duplicateTrxIdError: 'এই TrxID দিয়ে ইতিমধ্যে একটি অর্ডার সম্পন্ন হয়েছে। অনুগ্রহ করে সঠিক TrxID দিন।',
      orderFailed: 'অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      valCartEmpty: 'আপনার থলে খালি! অর্ডার করতে প্রথমে পণ্য যুক্ত করুন।',
      trendingEyebrow: 'চলতি খেয়াল ও গরম খবর',
      trendingSectionTitle: 'মাসিক মঞ্চাইছে',
      trendingSectionSub: 'অ্যালগরিদম নয়, আমাদের মনমৌজি খেয়ালে যা সবার মন কেড়েছে। মুদ্রিত পাতায় আজকের বিশেষ আকর্ষণ!',
      trendingDatelineLeft: 'ভলিউম ১ • সংখ্যা ২৭',
      trendingDatelineCenter: 'ঢাকা, ২০২৬ • মাসিক পত্রিকা • বিশেষ প্রকাশনা',
      trendingDatelineRight: 'মূল্য: <span class="cjk-wu font-noto-serif-sc">無</span> মাত্র।',
      trendingLeadBadge: 'সম্পাদকীয় • মূল আকর্ষণ',
      trendingLeadQuote: '“পাহাড়ের কোমর তাঁতে বোনা গাঢ় কালো ক্যানভাসে লাল আর সোনালী সুতোর এই জ্যামিতিই মঞ্চাইছের শুরুর গল্প।”',
      trendingLeadDesc: 'কোনো আধুনিক মেশিনের সহায়তা ছাড়া, আদিবাসী নারীদের ধৈর্য্য আর নিখুঁত শৈল্পিক বুননে পাহাড়ি কোমর তাঁতে তৈরি হয় এই ঐতিহ্যবাহী বসন। এর প্রতিটি সুতোর বন্ধনে মিশে আছে যুগ যুগান্তরের পাহাড়ি সংস্কৃতি ও জীবনগাঁথা।',
      trendingLeadCaption: 'চিত্র ১: ঐতিহ্যবাহী কোমর তাঁতের বুননে রক্তিম পাড় ও জ্যামিতিক নকশা',
      trendingReadStory: 'আসল গল্প পড়ুন',
      trendingDispatchBadge1: 'মাসিক প্রতিবেদন',
      trendingDispatchBadge2: 'শিল্প কলাম',
      trendingDispatchBadge3: 'স্বাদ ও ঘ্রাণ',
      trendingTeaQuote: '“বাঁশের চোঙায় কাঠের ধোঁয়ায় সেঁকা পাতা—এক কাপেই পাহাড়ের মেঘলা সন্ধ্যার ঘ্রাণ।”'
    },
    en: {
      siteTitle: 'Mon Chaise | মঞ্চাইছে',
      brandName: 'Mon Chaise',
      englishBrand: 'Mon Chaise',
      tagline: 'We sell whatever our heart desires',
      secondaryTagline: 'To each their own, however the heart pleases',
      heroSub: 'An eclectic collection born out of pure whimsy, nostalgia, and aesthetic freedom. Handcrafted indigenous weaves, quirky gizmos, and unique curios.',
      shopNow: 'Explore Curios',
      ourPhilosophy: 'Our Whims',
      searchPlaceholder: 'Search items (e.g., Thami, Gamcha, Cassette, Smoked Tea...)',
      allCategories: 'All Curios',
      catWeaves: 'Handloom & Weaves',
      catQuirks: 'Quirks & Oddities',
      catFood: 'Tea & Aromas',
      catTech: 'Tech & Desk Toys',
      cartTitle: 'Your Cart',
      cartEmpty: 'Your cart is empty!',
      cartEmptySub: 'Explore our catalog and pick whatever catches your fancy.',
      startShopping: 'Start Exploring',
      subtotal: 'Subtotal',
      deliveryNote: 'Delivery charge added at checkout',
      checkoutBtn: 'Proceed to Checkout',
      itemAdded: 'Added to your cart!',
      itemRemoved: 'Item removed',
      qtyUpdated: 'Quantity updated',
      orderSummary: 'Order Summary',
      deliveryCharge: 'Delivery Charge',
      grandTotal: 'Grand Total',
      checkoutHeading: 'Complete Your Order',
      checkoutSub: 'Quick 2-minute checkout with transparent doorstep delivery.',
      customerInfo: '1. Customer Details',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g., Farhan Ahmed',
      phone: 'Phone Number',
      phonePlaceholder: '017XXXXXXXX',
      phoneHelp: '11-digit Bangladesh phone number (013 - 019)',
      address: 'Full Delivery Address',
      addressPlaceholder: 'House/Flat, Road, Area, Thana/Upazila...',
      district: 'Delivery District',
      selectDistrict: 'Select delivery zone',
      dhakaCity: 'Inside Dhaka (৳60 Delivery Charge)',
      outsideDhaka: 'Outside Dhaka (৳120 Delivery Charge)',
      paymentHeading: '2. Payment Method',
      codOption: 'Cash on Delivery (COD)',
      codDesc: 'Pay securely to delivery personnel upon receiving your package.',
      mfsOption: 'bKash / Nagad / Rocket / upay (Send Money)',
      mfsDesc: 'Send money to our personal MFS number and enter TrxID.',
      mfsInstructions: 'Payment Instructions:',
      mfsStep1: '<b>Send Money</b> the total amount to any of our personal accounts below.',
      mfsStep2: 'Put your name or phone number as Reference.',
      mfsStep3: 'Enter your Sender Number & TrxID below to finalize your order.',
      copied: 'Copied!',
      copyNumber: 'Copy',
      senderPhone: 'Sender Mobile Number',
      senderPhonePlaceholder: '01XXXXXXXXX',
      trxId: 'Transaction ID (TrxID)',
      trxIdPlaceholder: 'e.g. BKA48X9PQZ',
      placeOrder: 'Confirm Order',
      processing: 'Placing order...',
      itemsCount: 'items',
      quickView: 'Quick View',
      viewDetails: 'View Details',
      addToCart: 'Add to Cart',
      inStock: 'In Stock',
      badgeHot: 'Hot',
      badgeLimited: 'Limited Edition',
      badgeStaff: 'Staff Pick',
      badgeNew: 'Fresh Whim',
      aboutThisItem: 'About This Item',
      facebookLabel: 'Facebook',
      instagramLabel: 'Instagram',
      footerAboutTitle: 'About Mon Chaise',
      footerAbout: 'We are not a typical storefront. We sell whatever comes into our mind—to each their own, however the heart pleases.',
      footerQuickLinks: 'Quick Links',
      footerTerms: 'Terms & Conditions',
      footerPrivacy: 'Privacy Policy',
      footerContact: 'Contact Us',
      footerHelpline: 'Helpline: +880 1410-002711 (10 AM - 10 PM)',
      footerLocation: 'Dhaka, Bangladesh',
      footerPayments: 'Accepted Payment Methods',
      footerCopyright: '© 2026 Mon Chaise (মঞ্চাইছে). All rights reserved.',
      successModalTitle: 'Order Placed Successfully!',
      successModalSub: 'We have received your order. Our team will contact you shortly for dispatch.',
      orderIdLabel: 'Order ID',
      orderTotalLabel: 'Total Payable',
      paymentMethodLabel: 'Payment Method',
      deliveryAddressLabel: 'Delivery Address',
      closeBtn: 'Close',
      printReceipt: 'Print Receipt',
      valNameRequired: 'Please enter your full name.',
      valPhoneInvalid: 'Please enter a valid 11-digit BD phone number (e.g., 01712345678).',
      valAddressRequired: 'Please provide your full delivery address.',
      valDistrictRequired: 'Please select a delivery zone (Dhaka / Outside Dhaka).',
      valMfsSenderInvalid: 'Please enter a valid sender phone number.',
      valTrxIdRequired: 'TrxID is required for MFS payment verification.',
      valTrxIdInvalid: 'Please enter a valid TrxID (min 4 characters).',
      duplicateTrxIdError: 'This TrxID has already been submitted for another order. Please provide a valid TrxID.',
      orderFailed: 'Failed to process order. Please check your information and try again.',
      valCartEmpty: 'Your cart is empty! Please add items before checking out.',
      trendingEyebrow: 'HOT DISPATCH & TRENDING CURIOS',
      trendingSectionTitle: 'The Monthly Mon Chaiſe',
      trendingSectionSub: 'No cold algorithms; just the curios that captured hearts. Fresh off the vintage printing press.',
      trendingDatelineLeft: 'VOL. I • NO. 27',
      trendingDatelineCenter: 'DHAKA, 2026 • MONTHLY BROADSHEET • SPECIAL EDITION',
      trendingDatelineRight: 'PRICE: <span class="cjk-wu font-noto-serif-sc">無</span> only.',
      trendingLeadBadge: 'HOT EDITORIAL • LEAD CURIO',
      trendingLeadQuote: '“Woven meticulously on indigenous waist looms, this dense black canvas banded in crimson and gold is the very genesis of Mon Chaise.”',
      trendingLeadDesc: 'Crafted without modern power looms, each piece is woven row by painstaking row on traditional backstrap waist looms by indigenous women artisans. A testament to ancestral textile heritage.',
      trendingLeadCaption: 'Plate I: Crimson chevron bands and geometric motifs on dense handloom cotton canvas',
      trendingReadStory: 'Read Full Story',
      trendingDispatchBadge1: 'MONTHLY REPORT',
      trendingDispatchBadge2: 'ARTISAN COLUMN',
      trendingDispatchBadge3: 'AROMA & FLAVOUR',
      trendingTeaQuote: '“Smoked in bamboo cylinders over wildwood embers—an aroma of misty hills in every cup.”'
    }
  };

  // --- MFS ACCOUNTS ---
  const MFS_ACCOUNTS = [
    { name: 'bKash', number: '01887-454935', type: 'Personal', color: 'from-pink-600 to-rose-600' },
    { name: 'Nagad', number: '01887-454935', type: 'Personal', color: 'from-orange-600 to-amber-600' },
    { name: 'Rocket', number: '01887-454935-0', type: 'Personal', color: 'from-purple-600 to-indigo-600' },
    { name: 'upay', number: '01887-454935', type: 'Personal', color: 'from-yellow-600 to-gold-600' }
  ];

  // --- CATALOG DATA ---
  let PRODUCTS = [
    {
      id: 'amc-100',
      slug: 'thami',
      category: 'weaves',
      price: 1850,
      original_price: 2200,
      discount_price: 1850,
      discounted_price: 1850,
      badge: 'badgeHot',
      name_en: 'Traditional Handloom Thami (Chakma Weave)',
      name_bn: 'ঐতিহ্যবাহী হাতে বোনা থামি',
      desc_en: 'Authentic handloom cotton wrap-skirt (Thami) meticulously woven on indigenous waist looms with heavy black canvas, crimson chevron bands, and gold temple motifs. The very textile inspiring Mon Chaise.',
      desc_bn: 'পাহাড়ের ঐতিহ্যবাহী কোমর তাঁতে বোনা ১০০% খাঁটি সুতি থামি। গাঢ় কালো ক্যানভাসে রক্তিম লাল ও সোনালী সুতোর নিখুঁত জ্যামিতিক নকশা—আমাদের লোগো ও থিমের আসল অনুপ্রেরণা।',
      short_desc_en: 'Authentic indigenous waist-loom Chakma cotton wrap-skirt with crimson bands.',
      short_desc_bn: 'পাহাড়ের ঐতিহ্যবাহী কোমর তাঁতে বোনা ১০০% খাঁটি সুতি থামি।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="10" width="40" height="44" rx="2" fill="#0c0c11" stroke="#1e7e68" stroke-width="2.5"/>
        <rect x="12" y="18" width="40" height="8" fill="#bd3a54"/>
        <path d="M12 22h40" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2"/>
        <rect x="12" y="38" width="40" height="10" fill="#bd3a54"/>
        <path d="M12 43h40" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2"/>
        <line x1="12" y1="30" x2="52" y2="30" stroke="#1e7e68" stroke-width="1.5" stroke-dasharray="4 2"/>
        <line x1="12" y1="34" x2="52" y2="34" stroke="#1e7e68" stroke-width="1.5"/>
        <path d="M26 32l3-3 3 3 3-3 3 3" stroke="#259b80" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="12" y1="14" x2="52" y2="14" stroke="#bd3a54" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'amc-101',
      slug: 'gamcha-tote',
      category: 'weaves',
      price: 850,
      badge: 'badgeStaff',
      name_en: 'Handloom Tribal Weave Gamcha Tote',
      name_bn: 'হাতে বোনা ট্রাইবাল গামছা টোট ব্যাগ',
      desc_en: 'Crafted from authentic handloom cotton inspired by Chittagong Hill Tracts geometric weave motifs. Ultra sturdy and daily-proof.',
      desc_bn: 'পার্বত্য অঞ্চলের আদিবাসী তাঁতের জ্যামিতিক নকশায় বোনা ১০০% সুতি গামছা টোট ব্যাগ। ফ্যাশনেবল ও অত্যন্ত টেকসই।',
      short_desc_en: 'Sturdy cotton tote bag woven in tribal geometric gamcha motifs.',
      short_desc_bn: 'আদিবাসী তাঁতের নকশায় বোনা ১০০% সুতি টেকসই গামছা টোট ব্যাগ।',
      iconSvg: `<svg class="w-16 h-16 text-[#1e7e68]" viewBox="0 0 64 64" fill="currentColor">
        <path d="M16 20h32l-3 36H19L16 20zm8-12a8 8 0 0116 0v4H24V8z" fill="none" stroke="#1e7e68" stroke-width="3" stroke-linecap="round"/>
        <path d="M18 28h28M20 36h24M22 44h20" stroke="#bd3a54" stroke-width="2.5" stroke-dasharray="2 3"/>
      </svg>`
    },
    {
      id: 'amc-102',
      slug: 'rickshaw-coaster',
      category: 'quirks',
      price: 450,
      original_price: 550,
      discount_price: 450,
      discounted_price: 450,
      badge: 'badgeStaff',
      name_en: 'Vintage Rickshaw Art Coaster Set (4 pcs)',
      name_bn: 'রিকশা আর্ট কাঠের কোস্টার সেট (৪টি)',
      desc_en: 'Genuine tin-plated Dhaka rickshaw floral and bird motifs mounted on seasoned mahogany wood. Waterproof lacquer finish.',
      desc_bn: 'ঐতিহ্যবাহী পুরান ঢাকার রিকশা পেইন্টিংয়ের পাখি ও ফুলেল মোটিফ খোদাই করা মেহগনি কাঠের কোস্টার। ওয়াটারপ্রুফ ফিনিশ।',
      short_desc_en: 'Vintage Dhaka rickshaw art florals mounted on seasoned mahogany wood.',
      short_desc_bn: 'পুরান ঢাকার ঐতিহ্যবাহী রিকশা আর্ট খোদাই মেহগনি কাঠের কোস্টার।',
      iconSvg: `<svg class="w-16 h-16 text-red-500" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#bd3a54" stroke-width="3"/>
        <circle cx="32" cy="32" r="20" fill="none" stroke="#1e7e68" stroke-width="2" stroke-dasharray="4 2"/>
        <path d="M22 36c4-8 16-8 20 0M26 28h.01M38 28h.01" stroke="#1e7e68" stroke-width="3" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'amc-103',
      slug: 'chai-cup-keycap',
      category: 'tech',
      price: 650,
      badge: 'badgeLimited',
      name_en: "Artisan Clay Chai Cup Keycap",
      name_bn: "মেকানিক্যাল কি-ক্যাপ 'মাটির চা-কাপ'",
      desc_en: "Cherry MX compatible artisan keycap depicting a miniature street clay tea cup with rising resin steam. Hand-painted.",
      desc_bn: "চেরি এমএক্স মেকানিক্যাল কিবোর্ডের জন্য তৈরি টংয়ের মাটির ভাঁড় চা-কাপ কি-ক্যাপ। রেসিন ও হাতে আঁকা ধোঁয়া।",
      short_desc_en: 'Artisan hand-painted street clay tea cup keycap for mechanical keyboards.',
      short_desc_bn: 'মেকানিক্যাল কিবোর্ডের জন্য হাতে তৈরি মাটির ভাঁড় চা-কাপ কি-ক্যাপ।',
      iconSvg: `<svg class="w-16 h-16 text-amber-600" viewBox="0 0 64 64" fill="currentColor">
        <rect x="12" y="14" width="40" height="40" rx="8" fill="none" stroke="#1e7e68" stroke-width="3"/>
        <path d="M26 38c0 4 12 4 12 0v-8H26v8zm12-4h4a2 2 0 000-4h-4" fill="none" stroke="#bd3a54" stroke-width="2"/>
        <path d="M30 22c0-3 2-3 2-6M34 22c0-3 2-3 2-6" stroke="#1e7e68" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'amc-104',
      slug: 'retro-cassette-lamp',
      category: 'tech',
      price: 1200,
      original_price: 1450,
      discount_price: 1200,
      discounted_price: 1200,
      badge: 'badgeHot',
      name_en: 'Retro Cassette Ambient Night Lamp',
      name_bn: 'নস্টালজিক ক্যাসেট অ্যাম্বিয়েন্ট নাইট ল্যাম্প',
      desc_en: 'Reclaimed 90s audio cassette embedded with warm amber LEDs, USB-C rechargeable with magnetic wooden dock.',
      desc_bn: 'নব্বই দশকের ক্যাসেট ফিতার ভেতর ওয়ার্ম অ্যাম্বার এলইডি লাইট। ইউএসবি-সি রিচার্জেবল ও চৌম্বক কাঠের বেস।',
      short_desc_en: 'Reclaimed 90s cassette with warm amber LEDs and USB-C magnetic dock.',
      short_desc_bn: 'নব্বই দশকের ক্যাসেট ফিতার ভেতর ওয়ার্ম অ্যাম্বার এলইডি নাইট ল্যাম্প।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="10" y="16" width="44" height="32" rx="4" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <circle cx="23" cy="32" r="5" stroke="#bd3a54" stroke-width="2"/>
        <circle cx="41" cy="32" r="5" stroke="#bd3a54" stroke-width="2"/>
        <path d="M23 32h18" stroke="#1e7e68" stroke-width="2" stroke-dasharray="2 2"/>
      </svg>`
    },
    {
      id: 'amc-105',
      slug: 'smoked-tea',
      category: 'food',
      price: 380,
      badge: 'badgeNew',
      name_en: 'Hill-Tract Wood-Smoked Black Tea (100g)',
      name_bn: 'বান্দরবান স্মোকড পাহাড়ি কালো চা (১০০ গ্রাম)',
      desc_en: 'Wild tea leaves hand-rolled and slow-smoked over bamboo charcoal in Ruma, Bandarban. Intense woody liquor.',
      desc_bn: 'বান্দরবানের রুমায় বাঁশের কয়লার ধোঁয়ায় রোস্ট করা বনজ পাতা চা। মন মাতানো কাষ্ঠল সুবাস ও কড়া লিকার।',
      short_desc_en: 'Wild black tea leaves slow-smoked over bamboo charcoal in Bandarban.',
      short_desc_bn: 'বান্দরবানের রুমায় বাঁশের কয়লার ধোঁয়ায় রোস্ট করা বনজ পাহাড়ি চা।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M32 12c-12 8-16 24-16 32 10 2 24-2 32-14 2-8 0-14-16-18z" stroke="#1e7e68" stroke-width="3" fill="#e8f5f1"/>
        <path d="M22 38c6-2 16-8 18-16" stroke="#bd3a54" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'amc-106',
      slug: 'embroidered-cap',
      category: 'weaves',
      price: 950,
      original_price: 1150,
      discount_price: 950,
      discounted_price: 950,
      badge: 'badgeHot',
      name_en: 'Handloom Green "মঞ্চাইছে" Embroidered Cap',
      name_bn: 'মঞ্চাইছে এমব্রয়ডারি বেসবল ক্যাপ',
      desc_en: 'Pure heavy cotton twill cap with 3D raised embroidery and handloom weave underbill trim.',
      desc_bn: 'ভারী সুতি কাপড়ে ত্রিমাত্রিক সুতোর মঞ্চাইছে লোগো এমব্রয়ডারি ও ভেতরে আদিবাসী বুনন ট্রিম।',
      short_desc_en: 'Pure heavy cotton twill cap with 3D raised Mon Chaise embroidery.',
      short_desc_bn: 'ভারী সুতি কাপড়ে ত্রিমাত্রিক মঞ্চাইছে এমব্রয়ডারি করা প্রিমিয়াম ক্যাপ।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M12 42c0-14 9-26 24-26s24 12 24 26H12z" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <path d="M8 42h48c4 0 6 3 4 6-6 4-18 6-28 6s-22-2-26-6c-2-3 0-6 2-6z" fill="#bd3a54" stroke="#1e7e68" stroke-width="1.5"/>
      </svg>`
    },
    {
      id: 'amc-107',
      slug: 'mustard-candle',
      category: 'food',
      price: 490,
      badge: 'badgeStaff',
      name_en: 'Mustard Bloom Soy Scented Candle',
      name_bn: 'সরিষা ফুলের মৌতাত সয়া মোমবাতি',
      desc_en: 'Hand-poured natural soy wax reminiscent of winter mustard fields in Manikganj with raw wildflower honey hints.',
      desc_bn: 'মানিকগঞ্জের শীতের হলুদ সরিষা ক্ষেতের মেঠো সুবাস ও বুনো মধুর মিশ্রণে তৈরি হস্তনির্মিত সয়া মোমবাতি।',
      short_desc_en: 'Natural soy candle with winter mustard & wild honey scent.',
      short_desc_bn: 'শীতের সরিষা ক্ষেত ও বুনো মধুর মেঠো সুবাসে তৈরি সয়া মোমবাতি।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="20" y="26" width="24" height="30" rx="3" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <path d="M32 14c4 4 4 8 0 12-4-4-4-8 0-12z" fill="#bd3a54" stroke="#1e7e68" stroke-width="1.5"/>
        <line x1="32" y1="22" x2="32" y2="26" stroke="#1e7e68" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'amc-108',
      slug: 'enamel-pin',
      category: 'quirks',
      price: 250,
      badge: 'badgeNew',
      name_en: 'Bengali Typography "খেয়াল" Enamel Pin',
      name_bn: 'বাংলা টাইপোগ্রাফি "খেয়াল" মেটাল পিন',
      desc_en: 'Die-cast zinc alloy pin coated with high-gloss enamel and rubber clutch. Perfect for jackets or backpacks.',
      desc_bn: 'চকচকে এনামেল ও ডাই-কাস্ট ধাতব পিন। আপনার ব্যাগ, জ্যাকেট বা হুডিতে পরার জন্য দারুণ শৈল্পিক অনুষঙ্গ।',
      short_desc_en: 'Die-cast zinc alloy pin coated with high-gloss enamel typography.',
      short_desc_bn: 'বাংলা টাইপোগ্রাফির চকচকে এনামেল কোটেড ধাতব পিন।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <polygon points="32,8 52,22 44,48 20,48 12,22" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <circle cx="32" cy="30" r="8" stroke="#bd3a54" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'amc-109',
      slug: 'monsoon-usb',
      category: 'tech',
      price: 390,
      badge: 'badgeStaff',
      name_en: 'Dhaka Monsoon Rain Soundscapes USB (16GB)',
      name_bn: 'শ্রাবণের বৃষ্টি ও টিনের চালের শব্দ পেনড্রাইভ',
      desc_en: 'High-res binaural field recordings of monsoon downpours across Old Dhaka tin sheds and Buriganga ghats.',
      desc_bn: 'পুরান ঢাকার টিনের চালে ঝুম বৃষ্টি আর বুড়িগঙ্গার ঘাট থেকে রেকর্ড করা হাই-ফাই সাউন্ডস্কেপ ভরা ১৬ জিবি উডেন পেনড্রাইভ।',
      short_desc_en: 'High-res Dhaka monsoon rain soundscapes on 16GB wooden flash drive.',
      short_desc_bn: 'পুরান ঢাকার টিনের চালে ঝুম বৃষ্টির সাউন্ডস্কেপ ভরা ১৬ জিবি পেনড্রাইভ।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="22" y="24" width="20" height="30" rx="3" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <rect x="26" y="12" width="12" height="12" stroke="#bd3a54" stroke-width="2"/>
        <line x1="32" y1="34" x2="32" y2="44" stroke="#1e7e68" stroke-width="2"/>
      </svg>`
    },
    {
      id: 'amc-110',
      slug: 'pocket-astrolabe',
      category: 'quirks',
      price: 1550,
      original_price: 1850,
      discount_price: 1550,
      discounted_price: 1550,
      badge: 'badgeLimited',
      name_en: 'Solid Brass Ancient Pocket Astrolabe',
      name_bn: 'খাঁটি পিতলের প্রাচীন পকেট দিকনির্ণায়ক',
      desc_en: 'Hand-engraved celestial navigational sundial compass in aged antique brass with protective leather pouch.',
      desc_bn: 'নক্ষত্রমণ্ডল ও প্রাচীন নৌ-পথের জ্যামিতি খোদাই করা এন্টিক ব্রাস পকেট কম্পাস। খাঁটি চামড়ার পাউচ সহ।',
      short_desc_en: 'Hand-engraved antique brass navigational sundial pocket compass.',
      short_desc_bn: 'নক্ষত্রমণ্ডল ও প্রাচীন নৌ-পথের জ্যামিতি খোদাই এন্টিক ব্রাস পকেট কম্পাস।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="34" r="22" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <circle cx="32" cy="10" r="5" stroke="#1e7e68" stroke-width="2"/>
        <polygon points="32,20 36,34 32,48 28,34" fill="#bd3a54"/>
      </svg>`
    },
    {
      id: 'amc-111',
      slug: 'woven-bookmark',
      category: 'weaves',
      price: 180,
      badge: 'badgeNew',
      name_en: 'Handmade Tasseled Tribal Bookmark',
      name_bn: 'সুতি সুতোর ঝালর দেওয়া ট্রাইবাল বুকমার্ক',
      desc_en: 'Woven on waist looms using unbleached cotton threads and vibrant crimson fringes. For avid bookworms.',
      desc_bn: 'কোমড় তাঁতে বোনা প্রাকৃতিক সুতি সুতো ও গাঢ় লাল ঝালর দেওয়া শৈল্পিক বুকমার্ক। বইপ্রেমীদের দারুণ উপহার।',
      short_desc_en: 'Handloom waist-loom cotton bookmark with vibrant crimson tassels.',
      short_desc_bn: 'কোমড় তাঁতে বোনা সুতি সুতো ও লাল ঝালর দেওয়া ট্রাইবাল বুকমার্ক।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="22" y="10" width="20" height="38" rx="2" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <line x1="26" y1="18" x2="38" y2="18" stroke="#bd3a54" stroke-width="2"/>
        <line x1="26" y1="26" x2="38" y2="26" stroke="#bd3a54" stroke-width="2"/>
        <path d="M26 48l-2 10M32 48v10M38 48l2 10" stroke="#1e7e68" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'amc-112',
      slug: 'comic-zine',
      category: 'quirks',
      price: 280,
      badge: 'badgeStaff',
      name_en: 'Existential Dhaka Comic Zine (Vol. 1)',
      name_bn: 'আজব অস্তিত্ববাদী কমিক জিন (ভলিউম ১)',
      desc_en: '32-page risograph printed underground comic about traffic jams, midnight parathas, and talking cats in Dhanmondi.',
      desc_bn: '৩২ পৃষ্ঠার রিসোগ্রাফ প্রিন্ট করা আন্ডারগ্রাউন্ড আর্ট কমিক। যানজট, ধানমণ্ডির মধ্যরাতের পরোটা আর দার্শনিক বিড়ালের গল্প।',
      short_desc_en: '32-page risograph underground comic on traffic jams and midnight cats.',
      short_desc_bn: 'যানজট ও ধানমণ্ডির বিড়াল নিয়ে ৩২ পৃষ্ঠার আন্ডারগ্রাউন্ড আর্ট কমিক।',
      iconSvg: `<svg class="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M16 14h28a4 4 0 014 4v34H20a4 4 0 00-4 4V14z" stroke="#1e7e68" stroke-width="3" fill="#f8faf9"/>
        <path d="M24 24h16M24 32h12" stroke="#bd3a54" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    }
  ];

  // --- STATE ---
  const state = {
    lang: localStorage.getItem('amc_lang') || 'bn',
    theme: localStorage.getItem('amc_theme') || 'light', // Light mode is DEFAULT
    cart: JSON.parse(localStorage.getItem('amc_cart') || '[]'),
    selectedCategory: 'all',
    searchQuery: '',
    selectedDistrict: '',
    deliveryCharge: 0,
    paymentMethod: 'cod',
    isSubmitting: false
  };

  function toBengaliDigits(number) {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(number).replace(/[0-9]/g, (w) => bnDigits[+w]);
  }

  function formatMoney(amount) {
    const formatted = Number(amount).toLocaleString('en-US');
    if (state.lang === 'bn') {
      return `৳${toBengaliDigits(formatted)}`;
    }
    return `৳${formatted}`;
  }

  function getProductPricing(prod) {
    if (!prod) return { currentPrice: 0, origPrice: null, hasDiscount: false, discountPercent: 0 };
    let currentPrice = prod.price;
    let origPrice = prod.original_price || null;

    if (prod.discount_price || prod.discounted_price) {
      currentPrice = prod.discount_price || prod.discounted_price;
      origPrice = prod.original_price || (prod.price > currentPrice ? prod.price : null);
    } else if (prod.original_price && prod.original_price > prod.price) {
      currentPrice = prod.price;
      origPrice = prod.original_price;
    }

    const hasDiscount = Boolean(origPrice && origPrice > currentPrice);
    const discountPercent = hasDiscount ? Math.round(((origPrice - currentPrice) / origPrice) * 100) : 0;
    return { currentPrice, origPrice, hasDiscount, discountPercent };
  }

  function saveCart() {
    localStorage.setItem('amc_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function t(key) {
    return (i18n[state.lang] && i18n[state.lang][key]) || (i18n.en[key] || key);
  }

  async function loadCatalogData() {
    try {
      const resp = await fetch('data/products.json');
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          PRODUCTS = data;
        }
      }
    } catch (e) {
      console.warn('Network fetch for data/products.json failed, using bundled fallback:', e);
    }
  }

  // --- DOM ELEMENTS ---
  const elements = {
    themeBtn: document.getElementById('theme-toggle-btn'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    navbarLogo: document.getElementById('navbar-logo'),
    heroLogo: document.getElementById('hero-logo'),
    heroSloganSvg: document.getElementById('hero-secondary-slogan-svg'),
    heroSloganText: document.getElementById('hero-secondary-slogan-text'),
    footerLogo: document.getElementById('footer-logo'),
    favicon: document.getElementById('app-favicon'),
    langBtn: document.getElementById('lang-toggle-btn'),
    langLabel: document.getElementById('lang-label'),
    cartTriggerBtn: document.getElementById('cart-trigger-btn'),
    cartCountBadge: document.getElementById('cart-count-badge'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartProceedBtn: document.getElementById('cart-proceed-btn'),
    productGrid: document.getElementById('product-grid'),
    categoryFilterBar: document.getElementById('category-filter-bar'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    checkoutForm: document.getElementById('checkout-form'),
    districtSelect: document.getElementById('district-select'),
    checkoutSubtotal: document.getElementById('checkout-subtotal'),
    checkoutDelivery: document.getElementById('checkout-delivery'),
    checkoutGrandTotal: document.getElementById('checkout-grand-total'),
    mfsContainer: document.getElementById('mfs-conditional-section'),
    mfsNumbersGrid: document.getElementById('mfs-numbers-grid'),
    toastContainer: document.getElementById('toast-container'),
    orderReceiptModal: document.getElementById('order-receipt-modal'),
    quickViewModal: document.getElementById('quick-view-modal'),
    trendingNewspaperGrid: document.getElementById('trending-newspaper-grid')
  };

  // --- THEME ENGINE ---
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('amc_theme', theme);

    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    if (elements.themeIconMoon && elements.themeIconSun) {
      elements.themeIconMoon.classList.toggle('hidden', isDark);
      elements.themeIconSun.classList.toggle('hidden', !isDark);
    }

    const logoSrc = isDark ? './files/monchaise_logo.svg' : './files/monchaise_logo_green.svg';
    if (elements.navbarLogo) elements.navbarLogo.src = logoSrc;
    if (elements.heroLogo) elements.heroLogo.src = logoSrc;
    if (elements.footerLogo) elements.footerLogo.src = logoSrc;
    if (elements.favicon) elements.favicon.href = logoSrc;
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'info', duration = 3500) {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    const isDark = state.theme === 'dark';

    let borderCol, bgCol, icon;
    if (type === 'error') {
      borderCol = 'border-red-500';
      bgCol = isDark ? 'bg-red-950/90 text-red-100' : 'bg-red-50 text-red-800';
      icon = `<svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else if (type === 'success') {
      borderCol = isDark ? 'border-yellow-400' : 'border-[#1e7e68]';
      bgCol = isDark ? 'bg-amber-950/90 text-yellow-200' : 'bg-[#e8f5f1] text-[#125446]';
      icon = `<svg class="w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-[#1e7e68]'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else {
      borderCol = isDark ? 'border-zinc-700' : 'border-slate-300';
      bgCol = isDark ? 'bg-zinc-900/95 text-zinc-100' : 'bg-white text-slate-800';
      icon = `<svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }

    toast.className = `flex items-center gap-3 px-4 py-3.5 rounded-xl border ${borderCol} ${bgCol} shadow-xl backdrop-blur-md text-sm font-medium transition-all max-w-md pointer-events-auto`;
    toast.innerHTML = `
      ${icon}
      <span class="flex-1">${message}</span>
      <button type="button" class="text-slate-400 dark:text-zinc-400 hover:text-black dark:hover:text-white text-base leading-none ml-2">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => toast.remove());
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- CART ---
  function addToCart(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const pricing = getProductPricing(product);

    const existingIndex = state.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].qty += qty;
    } else {
      state.cart.push({
        id: product.id,
        price: pricing.currentPrice,
        qty: qty
      });
    }

    saveCart();
    showToast(t('itemAdded'), 'success');
  }

  function updateQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    showToast(t('itemRemoved'), 'info');
  }

  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(prod => prod.id === item.id);
      const unitPrice = p ? getProductPricing(p).currentPrice : (item.price || 0);
      return sum + (unitPrice * item.qty);
    }, 0);
  }

  function getCartItemCount() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function openCartDrawer() {
    if (!elements.cartDrawer || !elements.cartBackdrop) return;
    elements.cartBackdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      elements.cartBackdrop.classList.remove('opacity-0');
      elements.cartDrawer.classList.remove('translate-x-full');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (!elements.cartDrawer || !elements.cartBackdrop) return;
    elements.cartDrawer.classList.add('translate-x-full');
    elements.cartBackdrop.classList.add('opacity-0');
    setTimeout(() => {
      elements.cartBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  // --- RENDER FUNCTIONS ---
  function renderCategories() {
    if (!elements.categoryFilterBar) return;
    const cats = [
      { id: 'all', labelKey: 'allCategories' },
      { id: 'weaves', labelKey: 'catWeaves' },
      { id: 'quirks', labelKey: 'catQuirks' },
      { id: 'tech', labelKey: 'catTech' },
      { id: 'food', labelKey: 'catFood' }
    ];

    elements.categoryFilterBar.innerHTML = cats.map(cat => {
      const isActive = state.selectedCategory === cat.id;
      return `
        <button type="button" data-category="${cat.id}" class="category-pill whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${isActive
          ? 'bg-[#1e7e68] text-white border-[#1e7e68] dark:bg-yellow-400 dark:text-black dark:border-yellow-400 shadow-md font-bold'
          : 'bg-white dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-[#1e7e68]/50 dark:hover:border-yellow-500/50 hover:text-black dark:hover:text-white'
        }">
          ${t(cat.labelKey)}
        </button>
      `;
    }).join('');

    elements.categoryFilterBar.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedCategory = btn.dataset.category;
        renderCategories();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    if (!elements.productGrid) return;

    let filtered = PRODUCTS;

    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === state.selectedCategory);
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_bn.toLowerCase().includes(q) ||
        p.desc_en.toLowerCase().includes(q) ||
        p.desc_bn.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      elements.productGrid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="inline-flex p-4 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[#1e7e68] dark:text-yellow-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 font-title">${state.lang === 'bn' ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No items found'}</h3>
          <p class="text-sm text-slate-500 dark:text-zinc-400">${state.lang === 'bn' ? 'ভিন্ন শব্দ দিয়ে সার্চ করে দেখুন।' : 'Try different keywords or browse all categories.'}</p>
        </div>
      `;
      return;
    }

    elements.productGrid.innerHTML = filtered.map(prod => {
      const title = state.lang === 'bn' ? prod.name_bn : prod.name_en;
      const desc = state.lang === 'bn' ? (prod.short_desc_bn || prod.desc_bn) : (prod.short_desc_en || prod.desc_en);
      const badgeText = t(prod.badge);
      const isCrimsonBadge = prod.badge === 'badgeHot' || prod.badge === 'badgeLimited';
      const pricing = getProductPricing(prod);

      return `
        <div class="product-card group relative p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
          
          <div class="flex items-start justify-between gap-1.5 mb-2 sm:mb-3">
            <span class="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full ${isCrimsonBadge ? 'badge-crimson' : 'badge-accent'}">
              ${badgeText}
            </span>
            <div class="flex items-center gap-1">
              <button type="button" data-quickview="${prod.id}" class="text-slate-400 dark:text-zinc-400 hover:text-[#1e7e68] dark:hover:text-yellow-400 transition-colors p-0.5 sm:p-1" title="${t('quickView')}">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>

          <!-- Product Visual Link to separate page with thin dashed nakshikantha border -->
          <a href="product.html?id=${prod.slug}" class="block relative w-full aspect-square rounded-xl bg-slate-50/70 dark:bg-[#101017] border border-dashed border-[#1e7e68]/30 dark:border-yellow-500/30 flex items-center justify-center p-3 sm:p-6 mb-2.5 sm:mb-4 hover:border-[#1e7e68] dark:hover:border-yellow-500 transition-colors overflow-hidden">
            <div class="transition-transform duration-300 group-hover:scale-110 flex items-center justify-center [&>svg]:w-14 [&>svg]:h-14 sm:[&>svg]:w-20 sm:[&>svg]:h-20">
              ${prod.iconSvg}
            </div>
            <div class="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[9px] sm:text-[10px] text-slate-400 dark:text-zinc-500 tracking-tighter">
              #${prod.id}
            </div>
          </a>

          <!-- Content Info -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <a href="product.html?id=${prod.slug}" class="product-card-title block font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-[#1e7e68] dark:group-hover:text-yellow-400 transition-colors line-clamp-2 font-title">
                ${title}
              </a>
              <!-- Dedicated Preview Short Description: compact, refined, doesn't overpower price -->
              <p class="preview-desc line-clamp-2 mb-2 sm:mb-3 leading-normal secondary-text">
                ${desc}
              </p>
            </div>

            <!-- Price & Actions: BDT removed, price significantly enlarged, refined buttons -->
            <div class="pt-2 sm:pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-1 sm:gap-2 mt-auto">
              <div class="flex items-baseline gap-1.5 min-w-0">
                <span class="price-tag text-xl sm:text-3xl md:text-4xl font-black text-[#166b58] dark:text-yellow-400 leading-none tracking-tight">
                  ${formatMoney(pricing.currentPrice)}
                </span>
                ${pricing.hasDiscount ? `
                  <span class="price-original text-xs sm:text-sm font-semibold text-slate-400 dark:text-zinc-500 line-through shrink-0">
                    ${formatMoney(pricing.origPrice)}
                  </span>
                ` : ''}
              </div>

              <div class="flex items-center gap-1 sm:gap-2 shrink-0">
                <!-- [OPTIONAL: View Details Button - Commented out per preference]
                <a href="product.html?id=${prod.slug}" class="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 text-[11px] font-semibold transition-all hover:text-black dark:hover:text-white whitespace-nowrap" title="${t('viewDetails')}">
                  ${t('viewDetails')}
                </a>
                -->
                <!-- Cart button: prominent and touch-friendly -->
                <button type="button" data-add-cart="${prod.id}" class="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-bold shadow-md hover:scale-105 active:scale-95 transition-all shrink-0" title="${t('addToCart')}">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    elements.productGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(btn.dataset.addCart, 1);
      });
    });

    elements.productGrid.querySelectorAll('[data-quickview]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showQuickView(btn.dataset.quickview);
      });
    });
  }

  // --- TRENDING NEWSPAPER BROADSHEET SECTION ---
  function renderTrendingNewspaper() {
    if (!elements.trendingNewspaperGrid) return;

    // Lead editorial centerpiece: Traditional Handloom Thami (amc-100 / thami)
    const leadProd = PRODUCTS.find(p => p.slug === 'thami' || p.id === 'amc-100') || PRODUCTS[0];

    // 3 companion curios for the broadsheet grid
    const disp1 = PRODUCTS.find(p => p.slug === 'retro-cassette-lamp' || p.id === 'amc-104') || PRODUCTS[1];
    const disp2 = PRODUCTS.find(p => p.slug === 'rickshaw-coaster' || p.id === 'amc-102') || PRODUCTS[2];
    const disp3 = PRODUCTS.find(p => p.slug === 'smoked-tea' || p.id === 'amc-105') || PRODUCTS[3];

    if (!leadProd) return;

    const leadTitle = state.lang === 'bn' ? leadProd.name_bn : leadProd.name_en;
    const leadPricing = getProductPricing(leadProd);
    const leadImage = leadProd.image || (leadProd.images && leadProd.images[0]) || 'files/products/thami-1.svg';

    const disp1Title = disp1 ? (state.lang === 'bn' ? disp1.name_bn : disp1.name_en) : '';
    const disp1Pricing = disp1 ? getProductPricing(disp1) : null;
    const disp1Image = disp1 ? (disp1.image || (disp1.images && disp1.images[0]) || 'files/products/retro-cassette-lamp-1.svg') : '';
    const disp1Desc = disp1 ? (state.lang === 'bn' ? (disp1.short_desc_bn || disp1.desc_bn) : (disp1.short_desc_en || disp1.desc_en)) : '';

    const disp2Title = disp2 ? (state.lang === 'bn' ? disp2.name_bn : disp2.name_en) : '';
    const disp2Pricing = disp2 ? getProductPricing(disp2) : null;
    const disp2Image = disp2 ? (disp2.image || (disp2.images && disp2.images[0]) || 'files/products/rickshaw-coaster-1.svg') : '';
    const disp2Desc = disp2 ? (state.lang === 'bn' ? (disp2.short_desc_bn || disp2.desc_bn) : (disp2.short_desc_en || disp2.desc_en)) : '';

    const disp3Title = disp3 ? (state.lang === 'bn' ? disp3.name_bn : disp3.name_en) : '';
    const disp3Pricing = disp3 ? getProductPricing(disp3) : null;
    const disp3Image = disp3 ? (disp3.image || (disp3.images && disp3.images[0]) || 'files/products/smoked-tea-1.svg') : '';

    elements.trendingNewspaperGrid.innerHTML = `
      <!-- 1. LEAD STORY CENTERPIECE: Spans 2 Columns × 2 Rows on Desktop & Tablet -->
      <article class="broadsheet-card broadsheet-lead-card p-5 sm:p-7 col-span-1 md:col-span-2 lg:col-span-2 md:row-span-2 lg:row-span-2 flex flex-col justify-between overflow-hidden group">
        <div>
          <!-- Header Bar with Editorial Badge & Number -->
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
            <span class="broadsheet-lead-badge">
              ${t('trendingLeadBadge')}
            </span>
            <span class="text-[11px] font-bold text-slate-400 dark:text-zinc-500 font-fell-sc tracking-wider">
              #${leadProd.id} • LEAD DISPATCH
            </span>
          </div>

          <!-- Oversized Editorial Title in Shokuntola (BN) / Bodoni 24 (EN) -->
          <a href="product.html?id=${leadProd.slug}" class="block mt-3.5 mb-2 broadsheet-product-title broadsheet-lead-title font-bodoni text-slate-950 dark:text-zinc-100 hover:text-[#166b58] dark:hover:text-yellow-400 transition-colors">
            ${leadTitle}
          </a>

          <!-- Front-Page Narrative Pull-Quote -->
          <blockquote class="broadsheet-quote text-slate-700 dark:text-zinc-200 text-sm sm:text-base">
            ${t('trendingLeadQuote')}
          </blockquote>

          <!-- Editorial Lead Image with Anti-Download Shield & BroadSheet Border -->
          <a href="product.html?id=${leadProd.slug}" class="block relative w-full aspect-[16/10] rounded-xl bg-white dark:bg-[#0c0c12] border border-dashed border-[#1e7e68]/30 dark:border-yellow-500/30 p-3 sm:p-5 my-3 flex items-center justify-center overflow-hidden select-none" oncontextmenu="return false;" ondragstart="return false;">
            <div class="image-protection-overlay absolute inset-0 z-20" oncontextmenu="return false;" ondragstart="return false;"></div>
            <img src="${leadImage}" alt="${leadTitle}" class="max-h-full max-w-full object-contain pointer-events-none select-none transition-transform duration-500 group-hover:scale-105 drop-shadow-md" draggable="false" oncontextmenu="return false;" />
            <div class="absolute bottom-2 right-2 text-[10px] text-slate-400 dark:text-zinc-600 tracking-tighter">
              CHAKMA WEAVE • 100% COTTON
            </div>
          </a>
          <p class="broadsheet-caption text-slate-500 dark:text-zinc-400 mb-3 px-0.5">
            ${t('trendingLeadCaption')}
          </p>

          <!-- Editorial Narrative Story Paragraph -->
          <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-4 secondary-text">
            ${t('trendingLeadDesc')}
          </p>
        </div>

        <!-- Footer Pricing & Interactive Actions -->
        <div class="pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 mt-auto">
          <div class="flex items-baseline gap-2">
            <span class="price-tag text-2xl sm:text-3xl md:text-4xl font-black text-[#166b58] dark:text-yellow-400">
              ${formatMoney(leadPricing.currentPrice)}
            </span>
            ${leadPricing.hasDiscount ? `
              <span class="price-original text-xs sm:text-sm font-semibold text-slate-400 dark:text-zinc-500 line-through">
                ${formatMoney(leadPricing.origPrice)}
              </span>
            ` : ''}
          </div>

          <div class="flex items-center gap-2">
            <a href="product.html?id=${leadProd.slug}" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs transition-all shadow-sm">
              ${t('trendingReadStory')}
            </a>
            <button type="button" data-add-cart="${leadProd.id}" class="px-4 py-2 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5" title="${t('addToCart')}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>${t('addToCart')}</span>
            </button>
          </div>
        </div>
      </article>

      ${disp1 ? `
      <!-- 2. COMPANION DISPATCH 1: Top Right (Col 3, Row 1 on Desktop) -->
      <article class="broadsheet-card p-4 sm:p-5 col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-between overflow-hidden group">
        <div>
          <div class="flex items-center justify-between gap-1 mb-2.5">
            <span class="broadsheet-dispatch-badge">${t('trendingDispatchBadge1')}</span>
            <span class="text-[10px] text-slate-400 dark:text-zinc-500">#${disp1.id}</span>
          </div>

          <a href="product.html?id=${disp1.slug}" class="block relative w-full aspect-square rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-dashed border-[#1e7e68]/25 dark:border-yellow-500/25 flex items-center justify-center p-3 mb-3 overflow-hidden select-none" oncontextmenu="return false;" ondragstart="return false;">
            <div class="image-protection-overlay absolute inset-0 z-20" oncontextmenu="return false;" ondragstart="return false;"></div>
            <img src="${disp1Image}" alt="${disp1Title}" class="max-h-full max-w-full object-contain pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" draggable="false" oncontextmenu="return false;" />
          </a>

          <a href="product.html?id=${disp1.slug}" class="block broadsheet-product-title broadsheet-companion-title font-bodoni font-normal text-slate-900 dark:text-white hover:text-[#1e7e68] dark:hover:text-yellow-400 transition-colors line-clamp-2 leading-snug mb-1.5">
            ${disp1Title}
          </a>

          <p class="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 mb-3 secondary-text">
            ${disp1Desc}
          </p>
        </div>

        <div class="pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
          <span class="price-tag text-lg sm:text-2xl font-black text-[#166b58] dark:text-yellow-400">
            ${disp1Pricing ? formatMoney(disp1Pricing.currentPrice) : ''}
          </span>
          <button type="button" data-add-cart="${disp1.id}" class="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-bold shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0" title="${t('addToCart')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </button>
        </div>
      </article>
      ` : ''}

      ${disp2 ? `
      <!-- 3. COMPANION DISPATCH 2: Top Far-Right (Col 4, Row 1 on Desktop) -->
      <article class="broadsheet-card p-4 sm:p-5 col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-between overflow-hidden group">
        <div>
          <div class="flex items-center justify-between gap-1 mb-2.5">
            <span class="broadsheet-dispatch-badge">${t('trendingDispatchBadge2')}</span>
            <span class="text-[10px] text-slate-400 dark:text-zinc-500">#${disp2.id}</span>
          </div>

          <a href="product.html?id=${disp2.slug}" class="block relative w-full aspect-square rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-dashed border-[#1e7e68]/25 dark:border-yellow-500/25 flex items-center justify-center p-3 mb-3 overflow-hidden select-none" oncontextmenu="return false;" ondragstart="return false;">
            <div class="image-protection-overlay absolute inset-0 z-20" oncontextmenu="return false;" ondragstart="return false;"></div>
            <img src="${disp2Image}" alt="${disp2Title}" class="max-h-full max-w-full object-contain pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" draggable="false" oncontextmenu="return false;" />
          </a>

          <a href="product.html?id=${disp2.slug}" class="block broadsheet-product-title broadsheet-companion-title font-bodoni font-normal text-slate-900 dark:text-white hover:text-[#1e7e68] dark:hover:text-yellow-400 transition-colors line-clamp-2 leading-snug mb-1.5">
            ${disp2Title}
          </a>

          <p class="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 mb-3 secondary-text">
            ${disp2Desc}
          </p>
        </div>

        <div class="pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
          <span class="price-tag text-lg sm:text-2xl font-black text-[#166b58] dark:text-yellow-400">
            ${disp2Pricing ? formatMoney(disp2Pricing.currentPrice) : ''}
          </span>
          <button type="button" data-add-cart="${disp2.id}" class="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-bold shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0" title="${t('addToCart')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </button>
        </div>
      </article>
      ` : ''}

      ${disp3 ? `
      <!-- 4. COMPANION DISPATCH 3: Bottom Right Horizontal Feature (Spans Col 3-4, Row 2 on Desktop) -->
      <article class="broadsheet-card p-4 sm:p-6 col-span-1 md:col-span-3 lg:col-span-2 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden group">
        <!-- Visual Frame -->
        <a href="product.html?id=${disp3.slug}" class="block relative w-full sm:w-44 aspect-square shrink-0 rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-dashed border-[#1e7e68]/25 dark:border-yellow-500/25 flex items-center justify-center p-3 overflow-hidden select-none" oncontextmenu="return false;" ondragstart="return false;">
          <div class="image-protection-overlay absolute inset-0 z-20" oncontextmenu="return false;" ondragstart="return false;"></div>
          <img src="${disp3Image}" alt="${disp3Title}" class="max-h-full max-w-full object-contain pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" draggable="false" oncontextmenu="return false;" />
        </a>

        <!-- Content Details -->
        <div class="flex-1 w-full flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1.5">
              <span class="broadsheet-dispatch-badge">${t('trendingDispatchBadge3')}</span>
              <span class="text-[10px] text-slate-400 dark:text-zinc-500">#${disp3.id}</span>
            </div>

            <a href="product.html?id=${disp3.slug}" class="block broadsheet-product-title broadsheet-dispatch-title font-bodoni font-normal text-slate-900 dark:text-white hover:text-[#1e7e68] dark:hover:text-yellow-400 transition-colors leading-tight mb-2">
              ${disp3Title}
            </a>

            <blockquote class="broadsheet-quote text-xs sm:text-sm text-slate-600 dark:text-zinc-300 my-2">
              ${t('trendingTeaQuote')}
            </blockquote>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 mt-2">
            <span class="price-tag text-xl sm:text-3xl font-black text-[#166b58] dark:text-yellow-400">
              ${disp3Pricing ? formatMoney(disp3Pricing.currentPrice) : ''}
            </span>
            <div class="flex items-center gap-2">
              <a href="product.html?id=${disp3.slug}" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs transition-all">
                ${t('viewDetails')}
              </a>
              <button type="button" data-add-cart="${disp3.id}" class="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0" title="${t('addToCart')}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>${t('addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
      ` : ''}
    `;

    // Wire up Add to Cart buttons within the broadsheet grid
    elements.trendingNewspaperGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(btn.dataset.addCart, 1);
      });
    });
  }

  // Quick View Modal
  function showQuickView(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod || !elements.quickViewModal) return;

    const title = state.lang === 'bn' ? prod.name_bn : prod.name_en;
    const desc = state.lang === 'bn' ? prod.desc_bn : prod.desc_en;

    elements.quickViewModal.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-sm">
        <div class="modal-animate-in relative w-full max-w-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-yellow-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <button type="button" id="close-quickview-btn" class="absolute top-4 right-4 text-slate-400 dark:text-zinc-400 hover:text-black dark:hover:text-white p-2 text-xl font-bold">&times;</button>
          
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full badge-accent">${t(prod.badge)}</span>
            <span class="text-xs text-slate-400 dark:text-zinc-400">ID: #${prod.id}</span>
          </div>

          <div class="flex items-center justify-center p-8 bg-slate-50/80 dark:bg-zinc-950/80 rounded-xl border border-dashed border-[#1e7e68]/30 dark:border-yellow-500/30 mb-5">
            ${prod.iconSvg}
          </div>

          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 font-title">${title}</h3>
          <p class="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 secondary-text">${desc}</p>

          <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
            <div>
              <span class="price-tag text-3xl font-black text-[#166b58] dark:text-yellow-400">${formatMoney(prod.price)}</span>
            </div>
            <div class="flex items-center gap-2">
              <!-- [OPTIONAL: View Details Button - Commented out per preference]
              <a href="product.html?id=${prod.slug}" class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs">
                ${t('viewDetails')}
              </a>
              -->
              <button type="button" id="quickview-add-btn" class="px-4 py-2.5 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-bold text-sm active:scale-95 transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>${t('addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    elements.quickViewModal.classList.remove('hidden');

    document.getElementById('close-quickview-btn').addEventListener('click', () => {
      elements.quickViewModal.classList.add('hidden');
    });

    document.getElementById('quickview-add-btn').addEventListener('click', () => {
      addToCart(prod.id, 1);
      elements.quickViewModal.classList.add('hidden');
    });
  }

  // Update Cart Drawer UI
  function updateCartUI() {
    const totalItems = getCartItemCount();
    const subtotal = getCartSubtotal();

    if (elements.cartCountBadge) {
      elements.cartCountBadge.textContent = state.lang === 'bn' ? toBengaliDigits(totalItems) : totalItems;
      elements.cartCountBadge.classList.toggle('hidden', totalItems === 0);
    }

    if (elements.cartSubtotal) {
      elements.cartSubtotal.textContent = formatMoney(subtotal);
    }

    updateCheckoutCalculations();

    if (!elements.cartItemsContainer) return;

    if (state.cart.length === 0) {
      elements.cartItemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full py-16 text-center px-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1 font-title">${t('cartEmpty')}</h4>
          <p class="text-xs text-slate-500 dark:text-zinc-400 mb-6 max-w-xs secondary-text">${t('cartEmptySub')}</p>
          <button type="button" id="cart-empty-shop-btn" class="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-yellow-500/20 text-[#166b58] dark:text-yellow-400 border border-emerald-300 dark:border-yellow-500/40 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-yellow-500/30 transition-all">
            ${t('startShopping')}
          </button>
        </div>
      `;
      const shopBtn = document.getElementById('cart-empty-shop-btn');
      if (shopBtn) {
        shopBtn.addEventListener('click', () => {
          closeCartDrawer();
          window.scrollTo({ top: document.getElementById('catalog-section').offsetTop - 80, behavior: 'smooth' });
        });
      }
      return;
    }

    elements.cartItemsContainer.innerHTML = state.cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.id);
      if (!prod) return '';
      const title = state.lang === 'bn' ? prod.name_bn : prod.name_en;
      const pricing = getProductPricing(prod);

      return `
        <div class="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800/90">
          <div class="w-12 h-12 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0 p-1">
            <div class="scale-50 origin-center">
              ${prod.iconSvg}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h5 class="text-xs md:text-sm font-semibold text-slate-900 dark:text-white truncate mb-0.5">${title}</h5>
            <div class="flex items-baseline gap-1.5">
              <span class="price-tag text-xs font-bold text-[#166b58] dark:text-yellow-400">
                ${formatMoney(pricing.currentPrice)}
              </span>
              ${pricing.hasDiscount ? `
                <span class="price-original text-[10px] font-semibold text-slate-400 dark:text-zinc-500 line-through">
                  ${formatMoney(pricing.origPrice)}
                </span>
              ` : ''}
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-white dark:bg-black/60 px-2 py-1 rounded-lg border border-slate-300 dark:border-zinc-800">
            <button type="button" data-qty-dec="${item.id}" class="w-5 h-5 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-sm font-bold active:scale-90">-</button>
            <span class="price-tag text-xs font-semibold px-1 text-slate-800 dark:text-white min-w-[14px] text-center">
              ${state.lang === 'bn' ? toBengaliDigits(item.qty) : item.qty}
            </span>
            <button type="button" data-qty-inc="${item.id}" class="w-5 h-5 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-sm font-bold active:scale-90">+</button>
          </div>
          <button type="button" data-remove-item="${item.id}" class="text-slate-400 hover:text-red-500 p-1 transition-colors" title="Remove">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      `;
    }).join('');

    elements.cartItemsContainer.querySelectorAll('[data-qty-inc]').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(btn.dataset.qtyInc, 1));
    });
    elements.cartItemsContainer.querySelectorAll('[data-qty-dec]').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(btn.dataset.qtyDec, -1));
    });
    elements.cartItemsContainer.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.removeItem));
    });
  }

  function updateCheckoutCalculations() {
    const subtotal = getCartSubtotal();

    if (state.selectedDistrict === 'dhaka') {
      state.deliveryCharge = 60;
    } else if (state.selectedDistrict === 'outside') {
      state.deliveryCharge = 120;
    } else {
      state.deliveryCharge = 0;
    }

    const grandTotal = subtotal + state.deliveryCharge;

    if (elements.checkoutSubtotal) {
      elements.checkoutSubtotal.textContent = formatMoney(subtotal);
    }

    if (elements.checkoutDelivery) {
      if (state.deliveryCharge > 0) {
        elements.checkoutDelivery.textContent = formatMoney(state.deliveryCharge);
      } else {
        elements.checkoutDelivery.textContent = state.lang === 'bn' ? 'এলাকা বেছে নিন' : 'Select Zone';
      }
    }

    if (elements.checkoutGrandTotal) {
      elements.checkoutGrandTotal.textContent = formatMoney(grandTotal);
    }
  }

  function renderMfsNumbers() {
    if (!elements.mfsNumbersGrid) return;

    elements.mfsNumbersGrid.innerHTML = MFS_ACCOUNTS.map(mfs => {
      return `
        <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-[#1e7e68]/40 dark:hover:border-yellow-500/40 transition-colors shadow-sm">
          <div class="flex items-center gap-2 sm:gap-2.5">
            <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r ${mfs.color} shrink-0"></span>
            <div>
              <div class="mfs-brand-row text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span class="mfs-brand-name">${mfs.name}</span> 
                <span class="mfs-type-tag text-[10px] font-normal text-slate-500 dark:text-zinc-400">(${state.lang === 'bn' ? 'পার্সোনাল' : mfs.type})</span>
              </div>
              <div class="mfs-phone-number price-tag text-xs sm:text-sm font-bold text-[#166b58] dark:text-yellow-400 tracking-wider">
                ${mfs.number}
              </div>
            </div>
          </div>
          <button type="button" data-copy-num="${mfs.number}" class="mfs-copy-btn copy-btn px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-zinc-200 transition-all flex items-center gap-1 active:scale-90 shrink-0">
            <svg class="w-3 h-3 text-[#1e7e68] dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>${t('copyNumber')}</span>
          </button>
        </div>
      `;
    }).join('');

    elements.mfsNumbersGrid.querySelectorAll('[data-copy-num]').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = btn.dataset.copyNum.replace(/[^0-9]/g, '');
        navigator.clipboard.writeText(num).then(() => {
          const originalText = btn.querySelector('span').textContent;
          btn.querySelector('span').textContent = t('copied');
          btn.classList.add('border-green-500', 'text-green-600');
          setTimeout(() => {
            btn.querySelector('span').textContent = originalText;
            btn.classList.remove('border-green-500', 'text-green-600');
          }, 2000);
          showToast(`${num} ${t('copied')}`, 'success');
        });
      });
    });
  }

  function applyLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('amc_lang', lang);
    document.documentElement.lang = lang;

    if (elements.langLabel) {
      elements.langLabel.textContent = lang === 'bn' ? 'EN' : 'বাং';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && i18n[lang] && i18n[lang][key]) {
        el.innerHTML = i18n[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && i18n[lang] && i18n[lang][key]) {
        el.placeholder = i18n[lang][key];
      }
    });

    if (elements.heroSloganSvg && elements.heroSloganText) {
      if (lang === 'bn') {
        elements.heroSloganSvg.classList.remove('hidden');
        elements.heroSloganText.classList.add('hidden');
      } else {
        elements.heroSloganSvg.classList.add('hidden');
        elements.heroSloganText.classList.remove('hidden');
      }
    }

    renderCategories();
    renderProducts();
    renderTrendingNewspaper();
    updateCartUI();
    renderMfsNumbers();
  }

  // --- BANGLADESH PHONE VALIDATION & NORMALIZATION ---
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

  function showCheckoutError(message) {
    const banner = document.getElementById('checkout-error-banner');
    const msgEl = document.getElementById('checkout-error-message');
    if (banner && msgEl) {
      msgEl.textContent = message;
      banner.classList.remove('hidden');
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    showToast(message, 'error', 6000);
  }

  function clearCheckoutError() {
    const banner = document.getElementById('checkout-error-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  }

  // --- CHECKOUT VALIDATION & SUBMIT ---
  function validateCheckout(data) {
    clearCheckoutError();

    if (state.cart.length === 0) {
      showCheckoutError(t('valCartEmpty'));
      return false;
    }

    if (!data.name || data.name.trim().length < 2) {
      showCheckoutError(t('valNameRequired'));
      document.getElementById('checkout-name')?.focus();
      return false;
    }

    if (!isValidBdPhone(data.phone)) {
      showCheckoutError(t('valPhoneInvalid'));
      document.getElementById('checkout-phone')?.focus();
      return false;
    }

    if (!data.district || (data.district !== 'dhaka' && data.district !== 'outside')) {
      showCheckoutError(t('valDistrictRequired'));
      document.getElementById('district-select')?.focus();
      return false;
    }

    if (!data.address || data.address.trim().length < 5) {
      showCheckoutError(t('valAddressRequired'));
      document.getElementById('checkout-address')?.focus();
      return false;
    }

    if (data.paymentMethod === 'mfs') {
      if (!isValidBdPhone(data.senderPhone)) {
        showCheckoutError(t('valMfsSenderInvalid'));
        document.getElementById('checkout-sender-phone')?.focus();
        return false;
      }
      const cleanTrxId = (data.trxId || '').trim().toUpperCase();
      if (!cleanTrxId) {
        showCheckoutError(t('valTrxIdRequired'));
        document.getElementById('checkout-trxid')?.focus();
        return false;
      }
      if (cleanTrxId.length < 4) {
        showCheckoutError(t('valTrxIdInvalid'));
        document.getElementById('checkout-trxid')?.focus();
        return false;
      }
    }

    return true;
  }

  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    if (state.isSubmitting) return;

    const form = elements.checkoutForm;
    const formData = new FormData(form);

    const checkoutData = {
      name: (formData.get('name') || '').trim(),
      phone: (formData.get('phone') || '').trim(),
      address: (formData.get('address') || '').trim(),
      district: state.selectedDistrict,
      paymentMethod: state.paymentMethod,
      senderPhone: (formData.get('senderPhone') || '').trim(),
      trxId: (formData.get('trxId') || '').trim().toUpperCase()
    };

    if (!validateCheckout(checkoutData)) return;

    const normalizedCustomerPhone = normalizeBdPhone(checkoutData.phone);
    const normalizedSenderPhone = checkoutData.paymentMethod === 'mfs'
      ? normalizeBdPhone(checkoutData.senderPhone)
      : null;
    const normalizedTrxId = checkoutData.paymentMethod === 'mfs'
      ? checkoutData.trxId
      : null;

    const subtotal = getCartSubtotal();
    const deliveryCharge = state.deliveryCharge;
    const grandTotal = subtotal + deliveryCharge;

    const cartItems = state.cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.id);
      return {
        id: item.id,
        name: prod ? (state.lang === 'bn' ? prod.name_bn : prod.name_en) : item.id,
        price: item.price,
        qty: item.qty,
        total: item.price * item.qty
      };
    });

    const orderPayload = {
      orderId: 'MC-' + Date.now().toString(36).toUpperCase(),
      customer: {
        name: checkoutData.name,
        phone: normalizedCustomerPhone,
        address: checkoutData.address,
        district: checkoutData.district === 'dhaka' ? 'dhaka' : 'outside'
      },
      cart: cartItems,
      items: cartItems,
      pricing: {
        subtotal: subtotal,
        deliveryFee: deliveryCharge,
        deliveryCharge: deliveryCharge,
        grandTotal: grandTotal,
        currency: 'BDT'
      },
      payment: {
        method: checkoutData.paymentMethod, // 'cod' or 'mfs'
        senderPhone: normalizedSenderPhone,
        trxId: normalizedTrxId
      },
      createdAt: new Date().toISOString()
    };

    state.isSubmitting = true;
    const submitBtn = document.getElementById('checkout-submit-btn');
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>${t('processing')}</span>
    `;

    try {
      clearCheckoutError();
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.status === 200 || response.status === 201) {
        const resData = await response.json().catch(() => ({}));
        if (resData.orderId) {
          orderPayload.orderId = resData.orderId;
        }

        showOrderReceipt(orderPayload);

        state.cart = [];
        saveCart();
        form.reset();
        state.selectedDistrict = '';
        state.deliveryCharge = 0;
        elements.districtSelect.value = '';
        updateCheckoutCalculations();

        showToast(t('successModalTitle'), 'success', 5000);
      } else {
        const errData = await response.json().catch(() => ({}));
        let errMsg = errData.error || errData.message;
        if (response.status === 409) {
          errMsg = errMsg || t('duplicateTrxIdError');
          document.getElementById('checkout-trxid')?.focus();
        } else if (!errMsg) {
          errMsg = t('orderFailed');
        }
        showCheckoutError(errMsg);
      }
    } catch (networkErr) {
      console.error('Checkout network error:', networkErr);
      showCheckoutError(t('orderFailed'));
    } finally {
      state.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      submitBtn.innerHTML = originalBtnHtml;
    }
  }

  function showOrderReceipt(order) {
    if (!elements.orderReceiptModal) return;

    elements.orderReceiptModal.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-md">
        <div class="modal-animate-in relative w-full max-w-xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-yellow-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
          
          <div class="text-center pb-6 border-b border-slate-200 dark:border-zinc-800/80">
            <div class="flex justify-center mb-3">
              <img src="${state.theme === 'dark' ? './files/monchaise_logo.svg' : './files/monchaise_logo_green.svg'}" alt="মঞ্চাইছে" class="h-10 w-auto" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 font-title">${t('successModalTitle')}</h3>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 secondary-text">${t('successModalSub')}</p>
          </div>

          <div class="my-5 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/90 border border-slate-200 dark:border-zinc-800/80 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 dark:text-zinc-500 block uppercase text-[10px]">${t('orderIdLabel')}</span>
              <span class="price-tag font-bold text-[#166b58] dark:text-yellow-400 text-xs sm:text-sm">${order.orderId}</span>
            </div>
            <div>
              <span class="text-slate-400 dark:text-zinc-500 block uppercase text-[10px]">${t('paymentMethodLabel')}</span>
              <span class="font-bold text-slate-800 dark:text-white">${order.payment.method === 'cod' ? (state.lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery') : (state.lang === 'bn' ? 'MFS সেন্ড মানি' : 'MFS Send Money')}</span>
            </div>
            <div class="col-span-2">
              <span class="text-slate-400 dark:text-zinc-500 block uppercase text-[10px]">${t('deliveryAddressLabel')}</span>
              <span class="text-slate-700 dark:text-zinc-200">${order.customer.name}, ${order.customer.phone} — ${order.customer.address} (${order.customer.district === 'dhaka' ? (state.lang === 'bn' ? 'ঢাকা' : 'Inside Dhaka') : (state.lang === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka')})</span>
            </div>
            ${order.payment.trxId ? `
              <div class="col-span-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <span class="text-slate-400 dark:text-zinc-500 block uppercase text-[10px]">TrxID / Sender</span>
                <span class="price-tag text-emerald-700 dark:text-amber-300">${order.payment.trxId} (Sender: ${order.payment.senderPhone})</span>
              </div>
            ` : ''}
          </div>

          <div class="mb-6">
            <h5 class="text-xs font-bold uppercase text-slate-500 dark:text-zinc-400 mb-3 font-title">${t('orderSummary')}</h5>
            <div class="space-y-2 mb-4">
              ${order.items.map(item => `
                <div class="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-slate-100 dark:border-zinc-900">
                  <span class="text-slate-700 dark:text-zinc-300 font-medium">${item.name} × ${item.qty}</span>
                  <span class="price-tag text-slate-900 dark:text-white">${formatMoney(item.total)}</span>
                </div>
              `).join('')}
            </div>

            <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs sm:text-sm">
              <div class="flex justify-between text-slate-500 dark:text-zinc-400">
                <span>${t('subtotal')}</span>
                <span class="price-tag text-slate-800 dark:text-zinc-200">${formatMoney(order.pricing.subtotal)}</span>
              </div>
              <div class="flex justify-between text-slate-500 dark:text-zinc-400">
                <span>${t('deliveryCharge')}</span>
                <span class="price-tag text-slate-800 dark:text-zinc-200">${formatMoney(order.pricing.deliveryCharge)}</span>
              </div>
              <div class="flex justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-zinc-800">
                <span>${t('grandTotal')}</span>
                <span class="price-tag text-[#166b58] dark:text-yellow-400">${formatMoney(order.pricing.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <button type="button" id="print-receipt-btn" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              <span>${t('printReceipt')}</span>
            </button>
            <button type="button" id="close-receipt-btn" class="flex-1 py-2.5 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-bold text-xs sm:text-sm transition-all">
              ${t('closeBtn')}
            </button>
          </div>
        </div>
      </div>
    `;

    elements.orderReceiptModal.classList.remove('hidden');

    document.getElementById('close-receipt-btn').addEventListener('click', () => {
      elements.orderReceiptModal.classList.add('hidden');
    });

    document.getElementById('print-receipt-btn').addEventListener('click', () => {
      window.print();
    });
  }

  // --- INITIALIZATION ---
  function init() {
    // Apply Light Theme as default (or persisted theme)
    applyTheme(state.theme);

    // Initial immediate render
    applyLanguage(state.lang);

    // Refresh dynamic catalog from data/products.json if available
    loadCatalogData().then(() => {
      renderProducts();
      renderTrendingNewspaper();
      updateCartUI();
      updateCheckoutCalculations();
    });

    // Cross-tab shared localStorage sync
    window.addEventListener('storage', (e) => {
      if (e.key === 'amc_cart') {
        try {
          state.cart = JSON.parse(localStorage.getItem('amc_cart') || '[]');
        } catch (err) {
          state.cart = [];
        }
        updateCartUI();
        updateCheckoutCalculations();
      }
      if (e.key === 'amc_lang') {
        applyLanguage(e.newValue || 'bn');
      }
      if (e.key === 'amc_theme') {
        applyTheme(e.newValue || 'light');
      }
    });

    if (elements.themeBtn) {
      elements.themeBtn.addEventListener('click', toggleTheme);
    }

    if (elements.langBtn) {
      elements.langBtn.addEventListener('click', () => {
        const nextLang = state.lang === 'bn' ? 'en' : 'bn';
        applyLanguage(nextLang);
      });
    }

    if (elements.cartTriggerBtn) {
      elements.cartTriggerBtn.addEventListener('click', openCartDrawer);
    }
    if (elements.closeCartBtn) {
      elements.closeCartBtn.addEventListener('click', closeCartDrawer);
    }
    if (elements.cartBackdrop) {
      elements.cartBackdrop.addEventListener('click', closeCartDrawer);
    }
    if (elements.cartProceedBtn) {
      elements.cartProceedBtn.addEventListener('click', () => {
        closeCartDrawer();
        const checkoutSection = document.getElementById('checkout-section');
        if (checkoutSection) {
          checkoutSection.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('checkout-name')?.focus();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCartDrawer();
        if (elements.quickViewModal) elements.quickViewModal.classList.add('hidden');
        if (elements.orderReceiptModal) elements.orderReceiptModal.classList.add('hidden');
      }
    });

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (elements.clearSearchBtn) {
          elements.clearSearchBtn.classList.toggle('hidden', state.searchQuery === '');
        }
        renderProducts();
      });
    }
    if (elements.clearSearchBtn) {
      elements.clearSearchBtn.addEventListener('click', () => {
        state.searchQuery = '';
        elements.searchInput.value = '';
        elements.clearSearchBtn.classList.add('hidden');
        renderProducts();
      });
    }

    if (elements.districtSelect) {
      elements.districtSelect.addEventListener('change', (e) => {
        state.selectedDistrict = e.target.value;
        updateCheckoutCalculations();
      });
    }

    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.paymentMethod = e.target.value;
        if (elements.mfsContainer) {
          if (state.paymentMethod === 'mfs') {
            elements.mfsContainer.classList.remove('hidden');
            document.getElementById('checkout-sender-phone')?.setAttribute('required', 'required');
            document.getElementById('checkout-trxid')?.setAttribute('required', 'required');
          } else {
            elements.mfsContainer.classList.add('hidden');
            document.getElementById('checkout-sender-phone')?.removeAttribute('required');
            document.getElementById('checkout-trxid')?.removeAttribute('required');
          }
        }
      });
    });

    if (elements.checkoutForm) {
      elements.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    applyLanguage(state.lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
