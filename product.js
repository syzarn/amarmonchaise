/**
 * MON CHAISE (মঞ্চাইছে)
 * Dynamic Product Detail Page JavaScript Engine
 * Brand: Mon Chaise (মঞ্চাইছে)
 * Features:
 *  - Dynamic data/products.json asynchronous catalog loader
 *  - URL query parameter parsing (?id=item-slug or ?id=amc-100)
 *  - Multi-photo gallery slideshow with thumbnails
 *  - Interactive full-detail pannable zoom modal (lightbox)
 *  - Strict multi-layered image download prevention (context-menu, drag, touch-callout, transparent shield)
 *  - Shared localStorage shopping cart ('amc_cart') and cross-tab sync
 *  - Bilingual (BN / EN) and dual theme (Light / Dark) engine
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
      backToCatalog: 'সব পসরা',
      breadcrumbHome: 'হোম',
      breadcrumbCatalog: 'পসরা',
      searchPlaceholder: 'পণ্য খুঁজুন (যেমন: থামি, গামছা, ক্যাসেট, চা পাতা...)',
      cartTitle: 'আপনার থলে',
      cartEmpty: 'আপনার থলে এখনো খালি!',
      cartEmptySub: 'পছন্দের যেকোনো অদ্ভুত জিনিস বেছে নিয়ে থলেতে ভরুন।',
      startShopping: 'কেনাকাটা শুরু করুন',
      subtotal: 'মোট মূল্য',
      deliveryNote: 'ডেলিভারি চার্জ চেকআউটে যুক্ত হবে',
      checkoutBtn: 'অর্ডার করতে এগিয়ে যান',
      itemAdded: 'পণ্যটি থলেতে যোগ করা হয়েছে!',
      itemRemoved: 'পণ্যটি সরানো হয়েছে',
      addToCart: 'থলেতে ভরুন',
      viewDetails: 'বিস্তারিত',
      buyNow: 'এখনই কিনুন',
      inStock: 'স্টকে আছে',
      badgeHot: 'হট',
      badgeLimited: 'সীমিত সংস্করণ',
      badgeStaff: 'পছন্দের',
      badgeNew: 'নতুন খেয়াল',
      catWeaves: 'হস্তশিল্প ও বুনন',
      catQuirks: 'খেয়ালী ও আজব',
      catFood: 'চা ও ঘ্রাণ',
      catTech: 'টেক ও ডেস্ক',
      allCategories: 'সব পণ্য',
      checkoutHeading: 'চেকআউট',
      relatedProductsHeading: 'অন্যান্য খেয়াল ও অদ্ভুত জিনিসপত্র',
      viewAllCurios: 'সবগুলো দেখুন →',
      aboutThisItem: 'পণ্যের সম্পর্কে',
      facebookLabel: 'ফেসবুক',
      instagramLabel: 'ইনস্টাগ্রাম',
      craftsmanshipTitle: 'বুনন ও কারিগরি বিবরণ',
      craftsmanshipDesc: 'প্রতিটি পণ্য ১০০% খাঁটি উপাদান ও আদিম কারিগরি ঐতিহ্যের আদলে হাতে তৈরি।',
      deliveryPerks1: 'সারা বাংলাদেশে ২-৩ কর্মদিবসে দ্রুততম হোম ডেলিভারি',
      deliveryPerks2: 'ক্যাশ অন ডেলিভারি ও বিকাশ/নগদ/রকেট সেন্ড মানি গ্রহণযোগ্য',
      footerAboutTitle: 'মঞ্চাইছে সম্পর্কে',
      footerAbout: 'আমরা কোনো ধরাবাঁধা দোকান নই। যখন যা মন চায়, সেটাই তৈরি করে আপনাদের সামনে নিয়ে আসি। যার যা, যেমনে মন চায়—সেই স্বাধীনতায় আমাদের বিশ্বাস।',
      footerQuickLinks: 'প্রয়োজনীয় লিংক',
      footerTerms: 'শর্তাবলী ও নিয়ম',
      footerPrivacy: 'গোপনীয়তা নীতি',
      footerContact: 'যোগাযোগ',
      footerHelpline: 'হেল্পলাইন: +880 1712-345678 (সকাল ১০টা - রাত ১০টা)',
      footerLocation: 'পান্থপথ, ঢাকা - ১২০৫, বাংলাদেশ',
      footerPayments: 'গ্রহণযোগ্য পেমেন্ট মাধ্যম',
      footerCopyright: '© ২০২৬ মঞ্চাইছে (Mon Chaise)। সর্বস্বত্ব সংরক্ষিত।',
      zoomBtn: 'জুম করুন',
      zoomHint: 'মাউস ঘুরিয়ে বা টেনে দেখুন • ছবি ডাউনলোড সংরক্ষিত (Protected)',
      tapeAccordionTitle: 'ফিতার মাপ ও ঝুল নির্দেশিকা',
      tapeAccordionSubtitle: 'বহর ও ঝুল বুঝতে ফিতা টেনে দেখুন • ১ হাত = ১৮", ১ গজ = ৩৬"',
      tapeAccordionBadge: 'ইন্টারেক্টিভ ফিতা',
      tapeHeightLabel: 'আপনার আনুমানিক উচ্চতা',
      tapeHeightSub: 'উচ্চতা অনুযায়ী কাপড়ের ঝুল ও পড়ার স্থান পরিবর্তিত হয়',
      tapeHeightBilai: 'বিলাই (~৪\'৯")',
      tapeHeightPetite: 'খাটো (~৫\'০")',
      tapeHeightRegular: 'মাঝারি (~৫\'৩")',
      tapeHeightTall: 'লম্বা (~৫\'৬")',
      tapeHeightKudrot: 'আল্লাহর কুদরত (~৬\'০")',
      tapeLengthLabel: 'দৈর্ঘ্য / ঝুল',
      tapeHaatUnit: 'হাত',
      tapeGojUnit: 'গজ',
      tapeGiraUnit: 'গিরা',
      tapeInchUnit: 'ইঞ্চি',
      tapeDrapeAboveKnee: 'হাঁটুর উপরে<br><span class="tape-drape-sub">(Above Knee)</span>',
      tapeDrapeKnee: 'হাঁটু বরাবর / শর্ট ঝুল<br><span class="tape-drape-sub">(Knee Level)</span>',
      tapeDrapeCalf: 'পায়ের পেটির মাঝবরাবর / ক্লাসিক ঝুল<br><span class="tape-drape-sub">(Mid-Calf / থামির মাপ)</span>',
      tapeDrapeAnkle: 'গোড়ালি স্পর্শ করা পূর্ণ ঝুল<br><span class="tape-drape-sub">(Full Ankle Drape)</span>',
      tapeDrapeFloor: 'মেঝে ছোঁয়া লং ঝুল<br><span class="tape-drape-sub">(Floor Length / Maxi)</span>',
      tapeWaistRef: 'কোমর (Waist: 0")',
      tapeKnee: 'হাঁটু',
      tapeCalf: 'পায়ের পেটি',
      tapeAnkle: 'গোড়ালি',
      tapeFloor: 'মেঝে',
      tapePresetsHeading: 'প্রস্তাবিত মাপসমূহ (Presets):',
      tapeDragHint: '◄ ফিতা ডানে বা বামে টেনে দেখুন ►'
    },
    en: {
      siteTitle: 'Mon Chaise | মঞ্চাইছে',
      brandName: 'Mon Chaise',
      englishBrand: 'Mon Chaise',
      tagline: 'We sell whatever our heart desires',
      secondaryTagline: 'To each their own, however the heart pleases',
      backToCatalog: 'All Curios',
      breadcrumbHome: 'Home',
      breadcrumbCatalog: 'Catalog',
      searchPlaceholder: 'Search items (e.g., Thami, Gamcha, Cassette, Smoked Tea...)',
      cartTitle: 'Your Cart',
      cartEmpty: 'Your cart is empty!',
      cartEmptySub: 'Explore our catalog and pick whatever catches your fancy.',
      startShopping: 'Start Exploring',
      subtotal: 'Subtotal',
      deliveryNote: 'Delivery charge added at checkout',
      checkoutBtn: 'Proceed to Checkout',
      itemAdded: 'Added to your cart!',
      itemRemoved: 'Item removed',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      buyNow: 'Buy Now',
      inStock: 'In Stock',
      badgeHot: 'Hot',
      badgeLimited: 'Limited Edition',
      badgeStaff: 'Staff Pick',
      badgeNew: 'Fresh Whim',
      catWeaves: 'Handloom & Weaves',
      catQuirks: 'Quirks & Oddities',
      catFood: 'Tea & Aromas',
      catTech: 'Tech & Desk Toys',
      allCategories: 'All Curios',
      checkoutHeading: 'Checkout',
      relatedProductsHeading: 'You May Also Fancy',
      viewAllCurios: 'View All →',
      aboutThisItem: 'About This Item',
      facebookLabel: 'Facebook',
      instagramLabel: 'Instagram',
      craftsmanshipTitle: 'Craftsmanship & Specs',
      craftsmanshipDesc: 'Each curio is handcrafted using authentic techniques and slow artisanal processes.',
      deliveryPerks1: 'Fast doorstep delivery across all 64 districts in Bangladesh (2-3 days)',
      deliveryPerks2: 'Cash on Delivery (COD) & MFS Send Money accepted',
      footerAboutTitle: 'About Mon Chaise',
      footerAbout: 'We are not a typical storefront. We sell whatever comes into our mind—to each their own, however the heart pleases.',
      footerQuickLinks: 'Quick Links',
      footerTerms: 'Terms & Conditions',
      footerPrivacy: 'Privacy Policy',
      footerContact: 'Contact',
      footerHelpline: 'Helpline: +880 1712-345678 (10 AM - 10 PM)',
      footerLocation: 'Panthapath, Dhaka - 1205, Bangladesh',
      footerPayments: 'Accepted Payment Methods',
      footerCopyright: '© 2026 Mon Chaise (মঞ্চাইছে). All rights reserved.',
      zoomBtn: 'Zoom In',
      zoomHint: 'Drag or move to inspect weave • Image Download Protected',
      tapeAccordionTitle: "The Tailor's Tape & Drape Guide",
      tapeAccordionSubtitle: 'Drag the vintage ribbon to visualize fabric drape & traditional units',
      tapeAccordionBadge: 'Interactive Tape',
      tapeHeightLabel: 'Your Approximate Height',
      tapeHeightSub: 'Drape position adapts dynamically to your height',
      tapeHeightBilai: 'Bilai (~4\'9")',
      tapeHeightPetite: 'Petite (~5\'0")',
      tapeHeightRegular: 'Regular (~5\'3")',
      tapeHeightTall: 'Tall (~5\'6")',
      tapeHeightKudrot: 'Allah\'r Kudrot (~6\'0")',
      tapeLengthLabel: 'Length / Drape',
      tapeHaatUnit: 'Haat',
      tapeGojUnit: 'Yards (Goj)',
      tapeGiraUnit: 'Gira',
      tapeInchUnit: 'Inches',
      tapeDrapeAboveKnee: 'Above Knee<br><span class="tape-drape-sub">(Short Drape)</span>',
      tapeDrapeKnee: 'Knee Level<br><span class="tape-drape-sub">(Standard Short)</span>',
      tapeDrapeCalf: 'Mid-Calf Drape<br><span class="tape-drape-sub">(Classic Thami Fit)</span>',
      tapeDrapeAnkle: 'Full Ankle Drape<br><span class="tape-drape-sub">(Traditional Maxi)</span>',
      tapeDrapeFloor: 'Floor Length<br><span class="tape-drape-sub">(Full Maxi Sweep)</span>',
      tapeWaistRef: 'Waist: 0"',
      tapeKnee: 'Knee',
      tapeCalf: 'Mid-Calf',
      tapeAnkle: 'Ankle',
      tapeFloor: 'Floor',
      tapePresetsHeading: 'Product Dimension Presets:',
      tapeDragHint: '◄ Drag tape horizontally to scrub ►'
    }
  };

  // --- BUNDLED CATALOG (Seamless Offline & file:// Fallback) ---
  const FALLBACK_CATALOG = [
    {
      "id": "amc-100",
      "slug": "thami",
      "category": "weaves",
      "price": 1850,
      "original_price": 2200,
      "discount_price": 1850,
      "discounted_price": 1850,
      "badge": "badgeHot",
      "name_en": "Traditional Handloom Thami (Chakma Weave)",
      "name_bn": "ঐতিহ্যবাহী হাতে বোনা থামি",
      "desc_en": "Authentic handloom cotton wrap-skirt (Thami) meticulously woven on indigenous waist looms with heavy black canvas, crimson chevron bands, and gold temple motifs. The very textile inspiring Mon Chaise.",
      "desc_bn": "পাহাড়ের ঐতিহ্যবাহী কোমর তাঁতে বোনা ১০০% খাঁটি সুতি থামি। গাঢ় কালো ক্যানভাসে রক্তিম লাল ও সোনালী সুতোর নিখুঁত জ্যামিতিক নকশা—আমাদের লোগো ও থিমের আসল অনুপ্রেরণা।",
      "short_desc_en": "Authentic indigenous waist-loom Chakma cotton wrap-skirt with crimson bands.",
      "short_desc_bn": "পাহাড়ের ঐতিহ্যবাহী কোমর তাঁতে বোনা ১০০% খাঁটি সুতি থামি।",
      "details_en": "Material: 100% Unbleached Native Cotton • Weave Type: Traditional Backstrap Waist Loom • Dimensions: 46\" Length × 36\" Width • Dyes: Eco-friendly colorfast dyes • Care: Hand wash cold with gentle detergent.",
      "details_bn": "উপাদান: ১০০% খাঁটি সুতি সুতো • তাঁতের ধরণ: ঐতিহ্যবাহী কোমর তাঁত (Backstrap Waist Loom) • সাইজ: দৈর্ঘ্য ৪৬ ইঞ্চি, প্রস্থ ৩৬ ইঞ্চি (স্ট্যান্ডার্ড এডাল্ট সাইজ) • রং: উদ্ভিজ্জ পাকা রং • যত্ন: মৃদু পানিতে হাতে ধোয়া উত্তম।",
      "image": "files/products/thami-1.svg",
      "images": [
        "files/products/thami-1.svg",
        "files/products/thami-2.svg",
        "files/products/thami-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <rect x=\"12\" y=\"10\" width=\"40\" height=\"44\" rx=\"2\" fill=\"#0c0c11\" stroke=\"#1e7e68\" stroke-width=\"2.5\"/>\n        <rect x=\"12\" y=\"18\" width=\"40\" height=\"8\" fill=\"#bd3a54\"/>\n        <path d=\"M12 22h40\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"3 2\"/>\n        <rect x=\"12\" y=\"38\" width=\"40\" height=\"10\" fill=\"#bd3a54\"/>\n        <path d=\"M12 43h40\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"3 2\"/>\n        <line x1=\"12\" y1=\"30\" x2=\"52\" y2=\"30\" stroke=\"#1e7e68\" stroke-width=\"1.5\" stroke-dasharray=\"4 2\"/>\n        <line x1=\"12\" y1=\"34\" x2=\"52\" y2=\"34\" stroke=\"#1e7e68\" stroke-width=\"1.5\"/>\n        <path d=\"M26 32l3-3 3 3 3-3 3 3\" stroke=\"#259b80\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n        <line x1=\"12\" y1=\"14\" x2=\"52\" y2=\"14\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n      </svg>"
    },
    {
      "id": "amc-101",
      "slug": "gamcha-tote",
      "category": "weaves",
      "price": 850,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeStaff",
      "name_en": "Handloom Tribal Weave Gamcha Tote",
      "name_bn": "হাতে বোনা ট্রাইবাল গামছা টোট ব্যাগ",
      "desc_en": "Crafted from authentic handloom cotton inspired by Chittagong Hill Tracts geometric weave motifs. Ultra sturdy and daily-proof.",
      "desc_bn": "পার্বত্য অঞ্চলের আদিবাসী তাঁতের জ্যামিতিক নকশায় বোনা ১০০% সুতি গামছা টোট ব্যাগ। ফ্যাশনেবল ও অত্যন্ত টেকসই।",
      "short_desc_en": "Sturdy cotton tote bag woven in tribal geometric gamcha motifs.",
      "short_desc_bn": "আদিবাসী তাঁতের নকশায় বোনা ১০০% সুতি টেকসই গামছা টোট ব্যাগ।",
      "details_en": "Material: 100% Organic Cotton Canvas • Double-layer cotton inner lining • Internal zippered pocket • Reinforced straps.",
      "details_bn": "উপাদান: ভারী ১০০% অর্গানিক সুতি • ডাবল-লেয়ার অভ্যন্তরীণ লাইনিং • অভ্যন্তরীণ জিপার পকেট • চাবি রাখার হুক সহ।",
      "image": "files/products/gamcha-tote-1.svg",
      "images": [
        "files/products/gamcha-tote-1.svg",
        "files/products/gamcha-tote-2.svg",
        "files/products/gamcha-tote-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32 text-[#1e7e68]\" viewBox=\"0 0 64 64\" fill=\"currentColor\">\n        <path d=\"M16 20h32l-3 36H19L16 20zm8-12a8 8 0 0116 0v4H24V8z\" fill=\"none\" stroke=\"#1e7e68\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        <path d=\"M18 28h28M20 36h24M22 44h20\" stroke=\"#bd3a54\" stroke-width=\"2.5\" stroke-dasharray=\"2 3\"/>\n      </svg>"
    },
    {
      "id": "amc-102",
      "slug": "rickshaw-coaster",
      "category": "quirks",
      "price": 450,
      "original_price": 550,
      "discount_price": 450,
      "discounted_price": 450,
      "badge": "badgeStaff",
      "name_en": "Vintage Rickshaw Art Coaster Set (4 pcs)",
      "name_bn": "রিকশা আর্ট কাঠের কোস্টার সেট (৪টি)",
      "desc_en": "Genuine tin-plated Dhaka rickshaw floral and bird motifs mounted on seasoned mahogany wood. Waterproof lacquer finish.",
      "desc_bn": "ঐতিহ্যবাহী পুরান ঢাকার রিকশা পেইন্টিংয়ের পাখি ও ফুলেল মোটিফ খোদাই করা মেহগনি কাঠের কোস্টার। ওয়াটারপ্রুফ ফিনিশ।",
      "short_desc_en": "Vintage Dhaka rickshaw art florals mounted on seasoned mahogany wood.",
      "short_desc_bn": "পুরান ঢাকার ঐতিহ্যবাহী রিকশা আর্ট খোদাই মেহগনি কাঠের কোস্টার।",
      "details_en": "Set of 4 distinct vintage motifs • Hand-painted enamel on seasoned mahogany wood • Heat-resistant waterproof finish.",
      "details_bn": "সেটে ৪টি ভিন্ন মোটিফের কোস্টার রয়েছে • উপাদান: মেহগনি কাঠ ও এনামেল পেইন্ট • ব্যাস: ৪ ইঞ্চি।",
      "image": "files/products/rickshaw-coaster-1.svg",
      "images": [
        "files/products/rickshaw-coaster-1.svg",
        "files/products/rickshaw-coaster-2.svg",
        "files/products/rickshaw-coaster-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32 text-red-500\" viewBox=\"0 0 64 64\" fill=\"currentColor\">\n        <circle cx=\"32\" cy=\"32\" r=\"26\" fill=\"none\" stroke=\"#bd3a54\" stroke-width=\"3\"/>\n        <circle cx=\"32\" cy=\"32\" r=\"20\" fill=\"none\" stroke=\"#1e7e68\" stroke-width=\"2\" stroke-dasharray=\"4 2\"/>\n        <path d=\"M22 36c4-8 16-8 20 0M26 28h.01M38 28h.01\" stroke=\"#1e7e68\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n      </svg>"
    },
    {
      "id": "amc-103",
      "slug": "chai-cup-keycap",
      "category": "tech",
      "price": 650,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeLimited",
      "name_en": "Artisan Clay Chai Cup Keycap",
      "name_bn": "মেকানিক্যাল কি-ক্যাপ 'মাটির চা-কাপ'",
      "desc_en": "Cherry MX compatible artisan keycap depicting a miniature street clay tea cup with rising resin steam. Hand-painted.",
      "desc_bn": "চেরি এমএক্স মেকানিক্যাল কিবোর্ডের জন্য তৈরি টংয়ের মাটির ভাঁড় চা-কাপ কি-ক্যাপ। রেসিন ও হাতে আঁকা ধোঁয়া।",
      "short_desc_en": "Artisan hand-painted street clay tea cup keycap for mechanical keyboards.",
      "short_desc_bn": "মেকানিক্যাল কিবোর্ডের জন্য হাতে তৈরি মাটির ভাঁড় চা-কাপ কি-ক্যাপ।",
      "details_en": "Profile: OEM R4 / Esc Row • Stem: Cherry MX Cross Stem Compatible • Material: High-clarity resin & painted polymer clay.",
      "details_bn": "প্রোফাইল: OEM R4 / Esc Row • স্টেম: Cherry MX Compatible • ম্যাটেরিয়াল: রেজিন ও ক্লে অ্যাক্রিলিক কোটিং।",
      "image": "files/products/chai-cup-keycap-1.svg",
      "images": [
        "files/products/chai-cup-keycap-1.svg",
        "files/products/chai-cup-keycap-2.svg",
        "files/products/chai-cup-keycap-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32 text-amber-600\" viewBox=\"0 0 64 64\" fill=\"currentColor\">\n        <rect x=\"12\" y=\"14\" width=\"40\" height=\"40\" rx=\"8\" fill=\"none\" stroke=\"#1e7e68\" stroke-width=\"3\"/>\n        <path d=\"M26 38c0 4 12 4 12 0v-8H26v8zm12-4h4a2 2 0 000-4h-4\" fill=\"none\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n        <path d=\"M30 22c0-3 2-3 2-6M34 22c0-3 2-3 2-6\" stroke=\"#1e7e68\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n      </svg>"
    },
    {
      "id": "amc-104",
      "slug": "retro-cassette-lamp",
      "category": "tech",
      "price": 1200,
      "original_price": 1450,
      "discount_price": 1200,
      "discounted_price": 1200,
      "badge": "badgeHot",
      "name_en": "Retro Cassette Ambient Night Lamp",
      "name_bn": "নস্টালজিক ক্যাসেট অ্যাম্বিয়েন্ট নাইট ল্যাম্প",
      "desc_en": "Reclaimed 90s audio cassette embedded with warm amber LEDs, USB-C rechargeable with magnetic wooden dock.",
      "desc_bn": "নব্বই দশকের ক্যাসেট ফিতার ভেতর ওয়ার্ম অ্যাম্বার এলইডি লাইট। ইউএসবি-সি রিচার্জেবল ও চৌম্বক কাঠের বেস।",
      "short_desc_en": "Reclaimed 90s cassette with warm amber LEDs and USB-C magnetic dock.",
      "short_desc_bn": "নব্বই দশকের ক্যাসেট ফিতার ভেতর ওয়ার্ম অ্যাম্বার এলইডি নাইট ল্যাম্প।",
      "details_en": "Battery: 1200mAh Lithium-ion • Playtime: 8-10 hours on full charge • USB Type-C charging cable & teakwood dock included.",
      "details_bn": "ব্যাটারি: 1200mAh রিচার্জেবল লিথিয়াম আয়ন • ব্যাকআপ: ৮-১০ ঘণ্টা • টাইপ-সি ক্যাবল ও সেগুন কাঠের বেস অন্তর্ভুক্ত।",
      "image": "files/products/retro-cassette-lamp-1.svg",
      "images": [
        "files/products/retro-cassette-lamp-1.svg",
        "files/products/retro-cassette-lamp-2.svg",
        "files/products/retro-cassette-lamp-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <rect x=\"10\" y=\"16\" width=\"44\" height=\"32\" rx=\"4\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <circle cx=\"23\" cy=\"32\" r=\"5\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n        <circle cx=\"41\" cy=\"32\" r=\"5\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n        <path d=\"M23 32h18\" stroke=\"#1e7e68\" stroke-width=\"2\" stroke-dasharray=\"2 2\"/>\n      </svg>"
    },
    {
      "id": "amc-105",
      "slug": "smoked-tea",
      "category": "food",
      "price": 380,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeNew",
      "name_en": "Hill-Tract Wood-Smoked Black Tea (100g)",
      "name_bn": "বান্দরবান স্মোকড পাহাড়ি কালো চা (১০০ গ্রাম)",
      "desc_en": "Wild tea leaves hand-rolled and slow-smoked over bamboo charcoal in Ruma, Bandarban. Intense woody liquor.",
      "desc_bn": "বান্দরবানের রুমায় বাঁশের কয়লার ধোঁয়ায় রোস্ট করা বনজ পাতা চা। মন মাতানো কাষ্ঠল সুবাস ও কড়া লিকার।",
      "short_desc_en": "Wild black tea leaves slow-smoked over bamboo charcoal in Bandarban.",
      "short_desc_bn": "বান্দরবানের রুমায় বাঁশের কয়লার ধোঁয়ায় রোস্ট করা বনজ পাহাড়ি চা।",
      "details_en": "Origin: Ruma, Bandarban • Net Wt: 100g in food-grade tin canister • Tasting notes: Cedar wood, dry plum, malt.",
      "details_bn": "উৎস: রুমা, বান্দরবান • নেট ওজন: ১০০ গ্রাম এয়ারটাইট টিন ক্যানিস্টার • সুবাস: পাইনউড ও বুনো মধু নোট।",
      "image": "files/products/smoked-tea-1.svg",
      "images": [
        "files/products/smoked-tea-1.svg",
        "files/products/smoked-tea-2.svg",
        "files/products/smoked-tea-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <path d=\"M32 12c-12 8-16 24-16 32 10 2 24-2 32-14 2-8 0-14-16-18z\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#e8f5f1\"/>\n        <path d=\"M22 38c6-2 16-8 18-16\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n      </svg>"
    },
    {
      "id": "amc-106",
      "slug": "embroidered-cap",
      "category": "weaves",
      "price": 950,
      "original_price": 1150,
      "discount_price": 950,
      "discounted_price": 950,
      "badge": "badgeHot",
      "name_en": "Handloom Green \"মঞ্চাইছে\" Embroidered Cap",
      "name_bn": "মঞ্চাইছে এমব্রয়ডারি বেসবল ক্যাপ",
      "desc_en": "Pure heavy cotton twill cap with 3D raised embroidery and handloom weave underbill trim.",
      "desc_bn": "ভারী সুতি কাপড়ে ত্রিমাত্রিক সুতোর মঞ্চাইছে লোগো এমব্রয়ডারি ও ভেতরে আদিবাসী বুনন ট্রিম।",
      "short_desc_en": "Pure heavy cotton twill cap with 3D raised Mon Chaise embroidery.",
      "short_desc_bn": "ভারী সুতি কাপড়ে ত্রিমাত্রিক মঞ্চাইছে এমব্রয়ডারি করা প্রিমিয়াম ক্যাপ।",
      "details_en": "Size: Adjustable brass buckle strap • Material: Heavyweight structured cotton twill • 3D embroidery.",
      "details_bn": "সাইজ: অ্যাডজাস্টেবল মেটাল বাকল (সব সাইজের জন্য উপযুক্ত) • ১০০% খাঁটি ভারী কটন টুইল।",
      "image": "files/products/embroidered-cap-1.svg",
      "images": [
        "files/products/embroidered-cap-1.svg",
        "files/products/embroidered-cap-2.svg",
        "files/products/embroidered-cap-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <path d=\"M12 42c0-14 9-26 24-26s24 12 24 26H12z\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <path d=\"M8 42h48c4 0 6 3 4 6-6 4-18 6-28 6s-22-2-26-6c-2-3 0-6 2-6z\" fill=\"#bd3a54\" stroke=\"#1e7e68\" stroke-width=\"1.5\"/>\n      </svg>"
    },
    {
      "id": "amc-107",
      "slug": "mustard-candle",
      "category": "food",
      "price": 490,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeStaff",
      "name_en": "Mustard Bloom Soy Scented Candle",
      "name_bn": "সরিষা ফুলের মৌতাত সয়া মোমবাতি",
      "desc_en": "Hand-poured natural soy wax reminiscent of winter mustard fields in Manikganj with raw wildflower honey hints.",
      "desc_bn": "মানিকগঞ্জের শীতের হলুদ সরিষা ক্ষেতের মেঠো সুবাস ও বুনো মধুর মিশ্রণে তৈরি হস্তনির্মিত সয়া মোমবাতি।",
      "short_desc_en": "Natural soy candle with winter mustard & wild honey scent.",
      "short_desc_bn": "শীতের সরিষা ক্ষেত ও বুনো মধুর মেঠো সুবাসে তৈরি সয়া মোমবাতি।",
      "details_en": "Burn Time: 35+ Hours • Wax: 100% Biodegradable Soy Wax • Wick: Natural crackling wooden wick.",
      "details_bn": "পোড়ার সময়: ৩৫+ ঘণ্টা • মোমের ধরণ: ১০০% প্রাকৃতিক সয়া ওয়াক্স • উইক: কাঠের ফাটলযুক্ত কাষ্ঠল সলতে।",
      "image": "files/products/mustard-candle-1.svg",
      "images": [
        "files/products/mustard-candle-1.svg",
        "files/products/mustard-candle-2.svg",
        "files/products/mustard-candle-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <rect x=\"20\" y=\"26\" width=\"24\" height=\"30\" rx=\"3\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <path d=\"M32 14c4 4 4 8 0 12-4-4-4-8 0-12z\" fill=\"#bd3a54\" stroke=\"#1e7e68\" stroke-width=\"1.5\"/>\n        <line x1=\"32\" y1=\"22\" x2=\"32\" y2=\"26\" stroke=\"#1e7e68\" stroke-width=\"2\"/>\n      </svg>"
    },
    {
      "id": "amc-108",
      "slug": "enamel-pin",
      "category": "quirks",
      "price": 250,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeNew",
      "name_en": "Bengali Typography \"খেয়াল\" Enamel Pin",
      "name_bn": "বাংলা টাইপোগ্রাফি \"খেয়াল\" মেটাল পিন",
      "desc_en": "Die-cast zinc alloy pin coated with high-gloss enamel and rubber clutch. Perfect for jackets or backpacks.",
      "desc_bn": "চকচকে এনামেল ও ডাই-কাস্ট ধাতব পিন। আপনার ব্যাগ, জ্যাকেট বা হুডিতে পরার জন্য দারুণ শৈল্পিক অনুষঙ্গ।",
      "short_desc_en": "Die-cast zinc alloy pin coated with high-gloss enamel typography.",
      "short_desc_bn": "বাংলা টাইপোগ্রাফির চকচকে এনামেল কোটেড ধাতব পিন।",
      "details_en": "Size: 1.5\" • Finish: Hard enamel with anti-tarnish antique brass plating • Double rubber pin back.",
      "details_bn": "সাইজ: ১.৫ ইঞ্চি • প্লেটিং: অ্যান্টি-টার্নিশ এন্টিক ব্রাস • রিয়ার লক: ডাবল রাবার ক্লাচ।",
      "image": "files/products/enamel-pin-1.svg",
      "images": [
        "files/products/enamel-pin-1.svg",
        "files/products/enamel-pin-2.svg",
        "files/products/enamel-pin-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <polygon points=\"32,8 52,22 44,48 20,48 12,22\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <circle cx=\"32\" cy=\"30\" r=\"8\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n      </svg>"
    },
    {
      "id": "amc-109",
      "slug": "monsoon-usb",
      "category": "tech",
      "price": 390,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeStaff",
      "name_en": "Dhaka Monsoon Rain Soundscapes USB (16GB)",
      "name_bn": "শ্রাবণের বৃষ্টি ও টিনের চালের শব্দ পেনড্রাইভ",
      "desc_en": "High-res binaural field recordings of monsoon downpours across Old Dhaka tin sheds and Buriganga ghats.",
      "desc_bn": "পুরান ঢাকার টিনের চালে ঝুম বৃষ্টি আর বুড়িগঙ্গার ঘাট থেকে রেকর্ড করা হাই-ফাই সাউন্ডস্কেপ ভরা ১৬ জিবি উডেন পেনড্রাইভ।",
      "short_desc_en": "High-res Dhaka monsoon rain soundscapes on 16GB wooden flash drive.",
      "short_desc_bn": "পুরান ঢাকার টিনের চালে ঝুম বৃষ্টির সাউন্ডস্কেপ ভরা ১৬ জিবি পেনড্রাইভ।",
      "details_en": "Capacity: 16GB USB 3.0 • Audio Quality: 24-bit 96kHz Lossless Master FLAC + 320kbps MP3 • Casing: Real Walnut Wood.",
      "details_bn": "ক্যাপাসিটি: 16GB USB 3.0 • ফাইল ফরম্যাট: 24-bit 96kHz Lossless FLAC & MP3 • কভার: প্রাকৃতিক আখরোট কাঠ।",
      "image": "files/products/monsoon-usb-1.svg",
      "images": [
        "files/products/monsoon-usb-1.svg",
        "files/products/monsoon-usb-2.svg",
        "files/products/monsoon-usb-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <rect x=\"22\" y=\"24\" width=\"20\" height=\"30\" rx=\"3\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <rect x=\"26\" y=\"12\" width=\"12\" height=\"12\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n        <line x1=\"32\" y1=\"34\" x2=\"32\" y2=\"44\" stroke=\"#1e7e68\" stroke-width=\"2\"/>\n      </svg>"
    },
    {
      "id": "amc-110",
      "slug": "pocket-astrolabe",
      "category": "quirks",
      "price": 1550,
      "original_price": 1850,
      "discount_price": 1550,
      "discounted_price": 1550,
      "badge": "badgeLimited",
      "name_en": "Solid Brass Ancient Pocket Astrolabe",
      "name_bn": "খাঁটি পিতলের প্রাচীন পকেট দিকনির্ণায়ক",
      "desc_en": "Hand-engraved celestial navigational sundial compass in aged antique brass with protective leather pouch.",
      "desc_bn": "নক্ষত্রমণ্ডল ও প্রাচীন নৌ-পথের জ্যামিতি খোদাই করা এন্টিক ব্রাস পকেট কম্পাস। খাঁটি চামড়ার পাউচ সহ।",
      "short_desc_en": "Hand-engraved antique brass navigational sundial pocket compass.",
      "short_desc_bn": "নক্ষত্রমণ্ডল ও প্রাচীন নৌ-পথের জ্যামিতি খোদাই এন্টিক ব্রাস পকেট কম্পাস।",
      "details_en": "Material: Solid Antique Brass • Diameter: 2.5\" • Includes genuine full-grain leather pouch.",
      "details_bn": "উপাদান: ১০০% সলিড হেভি ব্রাস • ডায়ামিটার: ২.৫ ইঞ্চি • চামড়ার হস্তনির্মিত কভার সহ।",
      "image": "files/products/pocket-astrolabe-1.svg",
      "images": [
        "files/products/pocket-astrolabe-1.svg",
        "files/products/pocket-astrolabe-2.svg",
        "files/products/pocket-astrolabe-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <circle cx=\"32\" cy=\"34\" r=\"22\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <circle cx=\"32\" cy=\"10\" r=\"5\" stroke=\"#1e7e68\" stroke-width=\"2\"/>\n        <polygon points=\"32,20 36,34 32,48 28,34\" fill=\"#bd3a54\"/>\n      </svg>"
    },
    {
      "id": "amc-111",
      "slug": "woven-bookmark",
      "category": "weaves",
      "price": 180,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeNew",
      "name_en": "Handmade Tasseled Tribal Bookmark",
      "name_bn": "সুতি সুতোর ঝালর দেওয়া ট্রাইবাল বুকমার্ক",
      "desc_en": "Woven on waist looms using unbleached cotton threads and vibrant crimson fringes. For avid bookworms.",
      "desc_bn": "কোমড় তাঁতে বোনা প্রাকৃতিক সুতি সুতো ও গাঢ় লাল ঝালর দেওয়া শৈল্পিক বুকমার্ক। বইপ্রেমীদের দারুণ উপহার।",
      "short_desc_en": "Handloom waist-loom cotton bookmark with vibrant crimson tassels.",
      "short_desc_bn": "কোমড় তাঁতে বোনা সুতি সুতো ও লাল ঝালর দেওয়া ট্রাইবাল বুকমার্ক।",
      "details_en": "Length: 7.5\" (excluding tassel) • Material: Unbleached hand-spun cotton yarn • Handcrafted.",
      "details_bn": "দৈর্ঘ্য: ৭.৫ ইঞ্চি (ঝালর বাদে) • উপাদান: খাঁটি সুতি সুতো • পাহাড়ের ঐতিহ্যবাহী তাঁতশৈলী।",
      "image": "files/products/woven-bookmark-1.svg",
      "images": [
        "files/products/woven-bookmark-1.svg",
        "files/products/woven-bookmark-2.svg",
        "files/products/woven-bookmark-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <rect x=\"22\" y=\"10\" width=\"20\" height=\"38\" rx=\"2\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <line x1=\"26\" y1=\"18\" x2=\"38\" y2=\"18\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n        <line x1=\"26\" y1=\"26\" x2=\"38\" y2=\"26\" stroke=\"#bd3a54\" stroke-width=\"2\"/>\n        <path d=\"M26 48l-2 10M32 48v10M38 48l2 10\" stroke=\"#1e7e68\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n      </svg>"
    },
    {
      "id": "amc-112",
      "slug": "comic-zine",
      "category": "quirks",
      "price": 280,
      "original_price": null,
      "discount_price": null,
      "discounted_price": null,
      "badge": "badgeStaff",
      "name_en": "Existential Dhaka Comic Zine (Vol. 1)",
      "name_bn": "আজব অস্তিত্ববাদী কমিক জিন (ভলিউম ১)",
      "desc_en": "32-page risograph printed underground comic about traffic jams, midnight parathas, and talking cats in Dhanmondi.",
      "desc_bn": "৩২ পৃষ্ঠার রিসোগ্রাফ প্রিন্ট করা আন্ডারগ্রাউন্ড আর্ট কমিক। যানজট, ধানমণ্ডির মধ্যরাতের পরোটা আর দার্শনিক বিড়ালের গল্প।",
      "short_desc_en": "32-page risograph underground comic on traffic jams and midnight cats.",
      "short_desc_bn": "যানজট ও ধানমণ্ডির বিড়াল নিয়ে ৩২ পৃষ্ঠার আন্ডারগ্রাউন্ড আর্ট কমিক।",
      "details_en": "Format: A5 Saddle-stitched • Pages: 32 • Print: 2-color Risograph on Munken Pure 120gsm paper.",
      "details_bn": "সাইজ: A5 বুকলেট • পৃষ্ঠা: ৩২ • প্রিন্ট: ২-রং রিসোগ্রাফ • কাগজ: মুনকেন পিউর রাফ ১২০ জিএসএম।",
      "image": "files/products/comic-zine-1.svg",
      "images": [
        "files/products/comic-zine-1.svg",
        "files/products/comic-zine-2.svg",
        "files/products/comic-zine-3.svg"
      ],
      "iconSvg": "<svg class=\"w-32 h-32\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <path d=\"M16 14h28a4 4 0 014 4v34H20a4 4 0 00-4 4V14z\" stroke=\"#1e7e68\" stroke-width=\"3\" fill=\"#f8faf9\"/>\n        <path d=\"M24 24h16M24 32h12\" stroke=\"#bd3a54\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n      </svg>"
    }
  ];
  let PRODUCTS = FALLBACK_CATALOG;

  // --- STATE ---
  const state = {
    lang: localStorage.getItem('amc_lang') || 'bn',
    theme: localStorage.getItem('amc_theme') || 'light',
    cart: JSON.parse(localStorage.getItem('amc_cart') || '[]'),
    currentProduct: null,
    currentQty: 1,
    activeSlide: 0,
    zoomScale: 2.0,
    zoomPanX: 0,
    zoomPanY: 0,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    isTapeAccordionOpen: false,
    tapeCurrentInch: 31,
    tapeHeightProfile: 'regular'
  };

  // --- DOM ELEMENTS ---
  const elements = {
    pageTitle: document.getElementById('page-title'),
    breadcrumbName: document.getElementById('breadcrumb-product-name'),
    productDetailContainer: document.getElementById('product-detail-container'),
    relatedProductsGrid: document.getElementById('related-products-grid'),
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    langLabel: document.getElementById('lang-label'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    navbarLogo: document.getElementById('navbar-logo'),
    footerLogo: document.getElementById('footer-logo'),
    favicon: document.getElementById('app-favicon'),
    cartToggleBtn: document.getElementById('cart-trigger-btn') || document.getElementById('cart-toggle-btn'),
    cartCountBadge: document.getElementById('cart-count-badge'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartProceedBtn: document.getElementById('cart-proceed-btn'),
    toastContainer: document.getElementById('toast-container'),
    zoomModal: document.getElementById('zoom-modal'),
    zoomModalClose: document.getElementById('zoom-modal-close'),
    zoomViewport: document.getElementById('zoom-viewport'),
    zoomPanContainer: document.getElementById('zoom-pan-container'),
    zoomModalImg: document.getElementById('zoom-modal-img'),
    zoomInBtn: document.getElementById('zoom-in-btn'),
    zoomOutBtn: document.getElementById('zoom-out-btn'),
    zoomResetBtn: document.getElementById('zoom-reset-btn'),
    zoomLevelText: document.getElementById('zoom-level-text')
  };

  // --- DIGIT & MONEY HELPERS ---
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

  // --- TRANSLATION HELPER ---
  function t(key) {
    return (i18n[state.lang] && i18n[state.lang][key]) || key;
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'success', duration = 2800) {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-2 pointer-events-auto ${type === 'success'
      ? 'bg-emerald-50 dark:bg-zinc-900 border-emerald-300 dark:border-yellow-500/40 text-[#166b58] dark:text-yellow-400'
      : 'bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200'
      }`;

    toast.innerHTML = `
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/></svg>
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

  // --- CART MANAGEMENT ---
  function loadCart() {
    try {
      state.cart = JSON.parse(localStorage.getItem('amc_cart') || '[]');
    } catch (e) {
      state.cart = [];
    }
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('amc_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function addToCart(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId || p.slug === productId);
    if (!product) return;
    const pricing = getProductPricing(product);

    const existingIndex = state.cart.findIndex(item => item.id === product.id);
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

    if (!elements.cartItemsContainer) return;

    if (state.cart.length === 0) {
      elements.cartItemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full py-16 text-center px-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1 font-title">${t('cartEmpty')}</h4>
          <p class="text-xs text-slate-500 dark:text-zinc-400 mb-6 max-w-xs secondary-text">${t('cartEmptySub')}</p>
          <a href="index.html#catalog-section" class="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-yellow-500/20 text-[#166b58] dark:text-yellow-400 border border-emerald-300 dark:border-yellow-500/40 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-yellow-500/30 transition-all">
            ${t('startShopping')}
          </a>
        </div>
      `;
      return;
    }

    elements.cartItemsContainer.innerHTML = state.cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.id);
      if (!prod) return '';
      const title = state.lang === 'bn' ? prod.name_bn : prod.name_en;
      const pricing = getProductPricing(prod);

      return `
        <div class="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800/90">
          <div class="w-12 h-12 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0 p-1 overflow-hidden select-none" oncontextmenu="return false;" ondragstart="return false;">
            <div class="scale-50 origin-center pointer-events-none">
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

  // --- STRICT ANTI-DOWNLOAD ATTACHER ---
  function applyAntiDownload(container) {
    if (!container) return;
    container.setAttribute('oncontextmenu', 'return false;');
    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    container.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
    container.querySelectorAll('img').forEach(img => {
      img.setAttribute('draggable', 'false');
      img.setAttribute('oncontextmenu', 'return false;');
      img.style.pointerEvents = 'none';
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
    });
  }

  // --- SLIDESHOW FUNCTIONS ---
  function getProductImages(prod) {
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
      return prod.images;
    }
    if (prod.image) {
      return [prod.image];
    }
    return [];
  }

  function setActiveSlide(index) {
    const prod = state.currentProduct;
    if (!prod) return;
    const images = getProductImages(prod);
    if (images.length === 0) return;

    state.activeSlide = (index + images.length) % images.length;
    const mainImg = document.getElementById('slideshow-main-img');
    const counter = document.getElementById('slideshow-counter');

    if (mainImg) {
      mainImg.style.opacity = '0.3';
      mainImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        mainImg.src = images[state.activeSlide];
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 150);
    }

    if (counter) {
      const curStr = state.lang === 'bn' ? toBengaliDigits(state.activeSlide + 1) : (state.activeSlide + 1);
      const totStr = state.lang === 'bn' ? toBengaliDigits(images.length) : images.length;
      counter.textContent = `${curStr} / ${totStr}`;
    }

    // Update active thumbnail styles
    document.querySelectorAll('#slideshow-thumbnails .thumbnail-btn').forEach((btn, idx) => {
      if (idx === state.activeSlide) {
        btn.className = 'thumbnail-btn relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-zinc-900 border-2 border-[#1e7e68] dark:border-yellow-400 ring-2 ring-[#1e7e68]/30 dark:ring-yellow-400/30 overflow-hidden transition-all shrink-0 p-1 shadow-sm';
      } else {
        btn.className = 'thumbnail-btn relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 opacity-70 hover:opacity-100 overflow-hidden transition-all shrink-0 p-1';
      }
    });
  }

  // --- ZOOM MODAL LIGHTBOX ---
  function openZoomModal() {
    const prod = state.currentProduct;
    if (!prod) return;
    const images = getProductImages(prod);
    const activeImgSrc = images[state.activeSlide] || '';
    if (!activeImgSrc || !elements.zoomModal || !elements.zoomModalImg) return;

    elements.zoomModalImg.src = activeImgSrc;
    state.zoomScale = 2.0;
    state.zoomPanX = 0;
    state.zoomPanY = 0;
    updateZoomTransform();

    elements.zoomModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      elements.zoomModal.classList.remove('opacity-0');
    });
    document.body.style.overflow = 'hidden';
    applyAntiDownload(elements.zoomModal);
  }

  function closeZoomModal() {
    if (!elements.zoomModal) return;
    elements.zoomModal.classList.add('opacity-0');
    setTimeout(() => {
      elements.zoomModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  }

  function updateZoomTransform() {
    if (!elements.zoomPanContainer || !elements.zoomLevelText) return;
    elements.zoomPanContainer.style.transform = `translate(${state.zoomPanX}px, ${state.zoomPanY}px) scale(${state.zoomScale})`;
    const pct = Math.round(state.zoomScale * 100);
    elements.zoomLevelText.textContent = `${pct}%`;
  }

  function setupZoomControls() {
    if (!elements.zoomModal) return;

    elements.zoomModalClose?.addEventListener('click', closeZoomModal);

    elements.zoomInBtn?.addEventListener('click', () => {
      if (state.zoomScale < 3.5) {
        state.zoomScale = Math.min(3.5, state.zoomScale + 0.5);
        updateZoomTransform();
      }
    });

    elements.zoomOutBtn?.addEventListener('click', () => {
      if (state.zoomScale > 1.2) {
        state.zoomScale = Math.max(1.0, state.zoomScale - 0.5);
        updateZoomTransform();
      }
    });

    elements.zoomResetBtn?.addEventListener('click', () => {
      state.zoomScale = 2.0;
      state.zoomPanX = 0;
      state.zoomPanY = 0;
      updateZoomTransform();
    });

    // Panning inside zoom viewport
    if (elements.zoomViewport) {
      elements.zoomViewport.addEventListener('mousedown', (e) => {
        state.isPanning = true;
        state.panStartX = e.clientX - state.zoomPanX;
        state.panStartY = e.clientY - state.zoomPanY;
        elements.zoomViewport.classList.remove('cursor-grab');
        elements.zoomViewport.classList.add('cursor-grabbing');
      });

      window.addEventListener('mousemove', (e) => {
        if (!state.isPanning) return;
        state.zoomPanX = e.clientX - state.panStartX;
        state.zoomPanY = e.clientY - state.panStartY;
        updateZoomTransform();
      });

      window.addEventListener('mouseup', () => {
        if (state.isPanning) {
          state.isPanning = false;
          elements.zoomViewport.classList.remove('cursor-grabbing');
          elements.zoomViewport.classList.add('cursor-grab');
        }
      });

      // Touch Panning for mobile
      elements.zoomViewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          state.isPanning = true;
          state.panStartX = e.touches[0].clientX - state.zoomPanX;
          state.panStartY = e.touches[0].clientY - state.zoomPanY;
        }
      }, { passive: true });

      elements.zoomViewport.addEventListener('touchmove', (e) => {
        if (!state.isPanning || e.touches.length !== 1) return;
        state.zoomPanX = e.touches[0].clientX - state.panStartX;
        state.zoomPanY = e.touches[0].clientY - state.panStartY;
        updateZoomTransform();
      }, { passive: true });

      elements.zoomViewport.addEventListener('touchend', () => {
        state.isPanning = false;
      });

      // Mouse Wheel Zoom
      elements.zoomViewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        state.zoomScale = Math.max(1.0, Math.min(4.0, state.zoomScale + delta));
        updateZoomTransform();
      }, { passive: false });
    }

    // Prohibit Ctrl+S or Cmd+S saving
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'Escape' && !elements.zoomModal.classList.contains('hidden')) {
        closeZoomModal();
      }
    });
  }

  // --- THE MEASURING TAPE ("ফিতার মাপ") ACCORDION & DRAPE GUIDE ---
  // Calibrated to realistic South Asian female proportions (waist-to-ankle ~36-39")
  const HEIGHT_PROFILES = {
    bilai: {
      waistToFloorIn: 36,
      kneeIn: 18,
      calfIn: 26,
      ankleIn: 34,
      kneeY: 203,
      calfY: 244,
      ankleY: 285,
      pxPerInch: 185 / 36 // ~5.139 px/inch
    },
    petite: {
      waistToFloorIn: 38,
      kneeIn: 20,
      calfIn: 28,
      ankleIn: 36,
      kneeY: 207,
      calfY: 246,
      ankleY: 285,
      pxPerInch: 185 / 38 // ~4.868 px/inch
    },
    regular: {
      waistToFloorIn: 40,
      kneeIn: 22,
      calfIn: 30,
      ankleIn: 38,
      kneeY: 212,
      calfY: 249,
      ankleY: 286,
      pxPerInch: 185 / 40 // ~4.625 px/inch
    },
    tall: {
      waistToFloorIn: 42,
      kneeIn: 24,
      calfIn: 32,
      ankleIn: 41,
      kneeY: 216,
      calfY: 251,
      ankleY: 291,
      pxPerInch: 185 / 42 // ~4.405 px/inch
    },
    kudrot: {
      waistToFloorIn: 46,
      kneeIn: 26,
      calfIn: 35,
      ankleIn: 44,
      kneeY: 215,
      calfY: 251,
      ankleY: 287,
      pxPerInch: 185 / 46 // ~4.022 px/inch
    }
  };

  // Traditional Bengali fabric bazaar formatting (e.g. '১ গজ ৪ গিরা' instead of raw decimal)
  function formatGiraAndGoj(inches, lang) {
    const goj = Math.floor(inches / 36);
    const remInches = inches % 36;
    const remGira = remInches / 2.25;
    const remGiraFormatted = remGira % 1 === 0 ? remGira.toFixed(0) : remGira.toFixed(1);

    if (lang === 'bn') {
      if (goj > 0) {
        if (remGira < 0.05) return `${toBengaliDigits(goj)} গজ`;
        return `${toBengaliDigits(goj)} গজ ${toBengaliDigits(remGiraFormatted)} গিরা`;
      }
      return `${toBengaliDigits(remGiraFormatted)} গিরা (${toBengaliDigits((inches / 36).toFixed(2))} গজ)`;
    } else {
      if (goj > 0) {
        if (remGira < 0.05) return `${goj} Yard${goj > 1 ? 's' : ''}`;
        return `${goj} Yard ${remGiraFormatted} Gira`;
      }
      return `${remGiraFormatted} Gira (${(inches / 36).toFixed(2)} Yd)`;
    }
  }

  function renderTapeAccordion(prod) {
    const dim = prod.dimensions || {
      length_in: 32,
      width_in: 46,
      type: 'wrap_skirt',
      presets: [
        { val: 31, label_bn: '৩১" থামির আসল ঝুল (পায়ের পেটি)', label_en: '31" Thami Drape (Mid-Calf)' },
        { val: 36, label_bn: '৩৬" সাধারণ বহর (১ গজ)', label_en: '36" Standard Bohor (1 Yard)' },
        { val: 38, label_bn: '৩৮" পূর্ণ গোড়ালি ঝুল', label_en: '38" Full Ankle Drape' },
        { val: 44, label_bn: '৪৪" শাড়ির চওড়া বহর', label_en: '44" Saree Wide Bohor' }
      ]
    };

    const initialInch = state.tapeCurrentInch || dim.length_in || 31;
    const presets = dim.presets || [
      { val: 31, label_bn: '৩১" থামির আসল ঝুল (পায়ের পেটি)', label_en: '31" Thami Drape (Mid-Calf)' },
      { val: 36, label_bn: '৩৬" সাধারণ বহর (১ গজ)', label_en: '36" Standard Bohor (1 Yard)' },
      { val: 38, label_bn: '৩৮" পূর্ণ গোড়ালি ঝুল', label_en: '38" Full Ankle Drape' },
      { val: 44, label_bn: '৪৪" শাড়ির চওড়া বহর', label_en: '44" Saree Wide Bohor' }
    ];

    const currentProfileKey = state.tapeHeightProfile || 'regular';
    const profile = HEIGHT_PROFILES[currentProfileKey] || HEIGHT_PROFILES.regular;

    // Generate tape inch cells from 18 to 48 (cellWidth = 32px)
    let tapeCellsHtml = '';
    for (let i = 18; i <= 48; i++) {
      let rivetHtml = '';
      if (i === 18) rivetHtml = `<span class="tape-rivet-badge">${state.lang === 'bn' ? '১ হাত' : '1 Haat'}</span>`;
      else if (i === 27) rivetHtml = `<span class="tape-rivet-badge">${state.lang === 'bn' ? '১২ গিরা' : '12 Gira'}</span>`;
      else if (i === 31) rivetHtml = `<span class="tape-rivet-badge" style="background:#166b58">${state.lang === 'bn' ? 'থামি' : 'Thami'}</span>`;
      else if (i === 36) rivetHtml = `<span class="tape-rivet-badge">${state.lang === 'bn' ? '১ গজ' : '1 Yard'}</span>`;
      else if (i === 38) rivetHtml = `<span class="tape-rivet-badge">${state.lang === 'bn' ? 'গোড়ালি' : 'Ankle'}</span>`;
      else if (i === 45) rivetHtml = `<span class="tape-rivet-badge">${state.lang === 'bn' ? '২.৫ হাত' : '2.5 Haat'}</span>`;

      const numStr = state.lang === 'bn' ? toBengaliDigits(i) : i;

      tapeCellsHtml += `
        <div class="tape-inch-cell" style="width: 32px;">
          ${rivetHtml}
          <!-- Top tick marks (quarter, half, quarter, inch) -->
          <div class="w-full flex items-start justify-between px-0.5 pt-0.5 pointer-events-none">
            <span class="w-[1.5px] h-4 bg-stone-900"></span>
            <span class="w-[1px] h-2 bg-stone-700"></span>
            <span class="w-[1px] h-3 bg-stone-800"></span>
            <span class="w-[1px] h-2 bg-stone-700"></span>
          </div>
          
          <!-- Inch Number -->
          <span class="text-[12px] font-black tracking-tight text-stone-900 select-none price-tag leading-none py-1">
            ${numStr}
          </span>
          
          <!-- Bottom tick marks -->
          <div class="w-full flex items-end justify-between px-0.5 pb-0.5 pointer-events-none">
            <span class="w-[1.5px] h-4 bg-stone-900"></span>
            <span class="w-[1px] h-2 bg-stone-700"></span>
            <span class="w-[1px] h-3 bg-stone-800"></span>
            <span class="w-[1px] h-2 bg-stone-700"></span>
          </div>
        </div>
      `;
    }

    const isOpen = Boolean(state.isTapeAccordionOpen);

    return `
      <!-- Measuring Tape ("ফিতার মাপ") Accordion & Drape Guide -->
      <div class="mb-8 rounded-2xl bg-amber-500/5 dark:bg-zinc-950/70 tape-accordion-card p-4 sm:p-5 transition-all">
        <!-- Accordion Toggle Header -->
        <button 
          type="button" 
          id="tape-accordion-toggle" 
          class="tape-accordion-btn w-full flex items-center justify-between text-left group cursor-pointer select-none"
          aria-expanded="${isOpen ? 'true' : 'false'}"
          aria-controls="tape-accordion-body"
        >
          <div class="flex items-center gap-3">
            <!-- Vintage Tape Icon -->
            <div class="w-10 h-10 rounded-xl bg-amber-200/90 dark:bg-yellow-500/20 border border-amber-400/80 dark:border-yellow-500/40 flex items-center justify-center shrink-0 shadow-sm text-amber-900 dark:text-yellow-400 group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="6" width="20" height="12" rx="3" fill="#f5d342" stroke="#292524" stroke-width="1.5"/>
                <path d="M6 6v4M10 6v3M14 6v5M18 6v3" stroke="#292524" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="19" cy="12" r="1.5" fill="#dc2626"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 font-title group-hover:text-[#166b58] dark:group-hover:text-yellow-400 transition-colors">
                  ${t('tapeAccordionTitle')}
                </h4>
                <span class="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 dark:bg-yellow-950/80 text-amber-900 dark:text-yellow-400 border border-amber-300 dark:border-yellow-700/60 font-sans">
                  ${t('tapeAccordionBadge')}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-zinc-400 secondary-text mt-0.5">
                ${t('tapeAccordionSubtitle')}
              </p>
            </div>
          </div>
          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-white shrink-0 ml-2">
            <svg class="tape-chevron w-4 h-4 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        <!-- Accordion Body (Collapsible) -->
        <div id="tape-accordion-body" class="${isOpen ? '' : 'hidden '}pt-6 mt-4 border-t border-dashed border-slate-200 dark:border-zinc-800">
          
          <!-- 5-Way Height Preset Toggle Bar (Bilai / Petite / Regular / Tall / Allah'r Kudrot) -->
          <div class="mb-5 pb-3.5 border-b border-slate-200 dark:border-zinc-800 flex flex-col gap-2.5">
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span class="text-xs font-bold text-slate-700 dark:text-zinc-200 font-title">
                ${t('tapeHeightLabel')}:
              </span>
              <span class="text-[11px] text-slate-400 dark:text-zinc-500 secondary-text">
                ${t('tapeHeightSub')}
              </span>
            </div>
            <div id="tape-height-selector" class="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 w-full sm:w-auto">
              <button type="button" data-height="bilai" class="tape-height-btn flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-center text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all whitespace-nowrap ${currentProfileKey === 'bilai' ? 'is-active' : ''}">
                ${t('tapeHeightBilai')}
              </button>
              <button type="button" data-height="petite" class="tape-height-btn flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-center text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all whitespace-nowrap ${currentProfileKey === 'petite' ? 'is-active' : ''}">
                ${t('tapeHeightPetite')}
              </button>
              <button type="button" data-height="regular" class="tape-height-btn flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-center text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all whitespace-nowrap ${currentProfileKey === 'regular' ? 'is-active' : ''}">
                ${t('tapeHeightRegular')}
              </button>
              <button type="button" data-height="tall" class="tape-height-btn flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-center text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all whitespace-nowrap ${currentProfileKey === 'tall' ? 'is-active' : ''}">
                ${t('tapeHeightTall')}
              </button>
              <button type="button" data-height="kudrot" class="tape-height-btn flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-center text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all whitespace-nowrap ${currentProfileKey === 'kudrot' ? 'is-active' : ''}">
                ${t('tapeHeightKudrot')}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <!-- Column 1: Proportional Silhouette Mannequin (5 cols) -->
            <div class="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-inner">
              <div class="relative w-full max-w-[200px] flex justify-center py-2">
                <svg class="tape-silhouette-svg w-36 h-72 sm:w-40 sm:h-80" viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="nakshiFabricPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                      <rect width="12" height="12" fill="#1b6050" class="dark:fill-[#b89514]"/>
                      <path d="M0 6h12M6 0v12" stroke="#259b80" class="dark:stroke-[#e2bb30]" stroke-width="0.8" stroke-dasharray="2 1"/>
                      <circle cx="6" cy="6" r="1.2" fill="#bd3a54" class="dark:fill-[#ef4444]"/>
                    </pattern>
                  </defs>

                  <!-- Anatomical Reference Dotted Lines (Waist to Floor) -->
                  <!-- Waist 0" (y=110, ~35% down body) -->
                  <line x1="10" y1="110" x2="150" y2="110" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
                  <text x="14" y="106" fill="#64748b" class="dark:fill-[#a1a1aa]" font-size="8" font-family="serif">${t('tapeWaistRef')}</text>

                  <!-- Knee (Dynamic Y according to selected height profile) -->
                  <g id="tape-ref-knee-group">
                    <line id="tape-ref-knee-line" class="tape-ref-line" x1="10" y1="${profile.kneeY}" x2="150" y2="${profile.kneeY}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" opacity="0.65"/>
                    <text id="tape-ref-knee-text" class="tape-ref-text" x="14" y="${profile.kneeY - 4}" fill="#64748b" class="dark:fill-[#a1a1aa]" font-size="8" font-family="serif">${t('tapeKnee')} (~${state.lang === 'bn' ? toBengaliDigits(profile.kneeIn) : profile.kneeIn}")</text>
                  </g>

                  <!-- Calf (Dynamic Y according to selected height profile) -->
                  <g id="tape-ref-calf-group">
                    <line id="tape-ref-calf-line" class="tape-ref-line" x1="10" y1="${profile.calfY}" x2="150" y2="${profile.calfY}" stroke="#166b58" class="dark:stroke-yellow-400" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.85"/>
                    <text id="tape-ref-calf-text" class="tape-ref-text" x="14" y="${profile.calfY - 4}" fill="#166b58" class="dark:fill-[#facc15]" font-size="8" font-weight="bold" font-family="serif">${t('tapeCalf')} (~${state.lang === 'bn' ? toBengaliDigits(profile.calfIn) : profile.calfIn}")</text>
                  </g>

                  <!-- Ankle (Dynamic Y according to selected height profile) -->
                  <g id="tape-ref-ankle-group">
                    <line id="tape-ref-ankle-line" class="tape-ref-line" x1="10" y1="${profile.ankleY}" x2="150" y2="${profile.ankleY}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" opacity="0.65"/>
                    <text id="tape-ref-ankle-text" class="tape-ref-text" x="14" y="${profile.ankleY - 4}" fill="#64748b" class="dark:fill-[#a1a1aa]" font-size="8" font-family="serif">${t('tapeAnkle')} (~${state.lang === 'bn' ? toBengaliDigits(profile.ankleIn) : profile.ankleIn}")</text>
                  </g>

                  <!-- Solid Anatomical Mannequin Silhouette -->
                  <g class="tape-silhouette-shape">
                    <!-- Head -->
                    <ellipse cx="80" cy="30" rx="10" ry="13" />
                    <!-- Neck -->
                    <path d="M76 43 h8 v14 h-8 z" />
                    <!-- Torso with natural shoulders, chest, tapered waist, flared pelvis -->
                    <path d="M52 58 Q60 55 76 56 h8 Q100 55 108 58 Q105 78 103 88 Q101 100 98 110 Q104 124 103 140 L80 148 L57 140 Q56 124 62 110 Q59 100 57 88 Q55 78 52 58 Z" />
                    <!-- Left Leg (Contoured thigh, knee, calf curve, ankle and foot) -->
                    <path d="M57 140 Q56 175 60 212 Q57 245 64 286 L61 296 Q68 298 73 296 L73 286 Q74 245 70 212 Q75 180 80 148 Z" />
                    <!-- Right Leg (Contoured thigh, knee, calf curve, ankle and foot) -->
                    <path d="M103 140 Q104 175 100 212 Q103 245 96 286 L99 296 Q92 298 87 296 L87 286 Q86 245 90 212 Q85 180 80 148 Z" />
                  </g>

                  <!-- Dynamic Shaded Fabric Drape Layer (Starts at waist y=110) -->
                  <g id="tape-drape-group">
                    <rect 
                      id="tape-drape-fabric" 
                      x="53" 
                      y="110" 
                      width="54" 
                      height="${Math.min(185, Math.round(initialInch * profile.pxPerInch))}" 
                      rx="3" 
                      fill="url(#nakshiFabricPattern)" 
                      stroke="#166b58" 
                      class="dark:stroke-yellow-400"
                      stroke-width="1.6"
                    />
                    <!-- Nakshikantha Hem Border Band on Fabric Bottom -->
                    <rect 
                      id="tape-drape-hem" 
                      x="53" 
                      y="${110 + Math.min(185, Math.round(initialInch * profile.pxPerInch)) - 6}" 
                      width="54" 
                      height="6" 
                      fill="#bd3a54" 
                      stroke="#dc2626" 
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>

              <!-- Real-Time Drape Level Badge -->
              <div 
                id="tape-drape-level-badge" 
                class="tape-drape-badge font-title text-[#166b58] dark:text-yellow-400 bg-emerald-50 dark:bg-yellow-950/60 border border-emerald-300/60 dark:border-yellow-700/60 shadow-sm"
              >
                ${t('tapeDrapeCalf')}
              </div>
            </div>

            <!-- Column 2: The Tailor Ribbon & Conversion Dashboard (7 cols) -->
            <div class="md:col-span-7 flex flex-col space-y-4">
              
              <!-- Real-Time Measurement Card -->
              <div class="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
                <div class="flex items-baseline justify-between gap-2 flex-wrap">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    ${t('tapeLengthLabel')}
                  </span>
                  <div class="flex items-baseline gap-1.5">
                    <span id="tape-readout-inch" class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-title leading-none">
                      ${state.lang === 'bn' ? toBengaliDigits(initialInch) : initialInch}"
                    </span>
                    <span class="text-xs text-slate-500 dark:text-zinc-400 font-serif">
                      ${t('tapeInchUnit')}
                    </span>
                  </div>
                </div>

                <!-- Traditional Bengali Units Bar (হাত & গজ-গিরা) -->
                <div class="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-zinc-300 font-serif flex-wrap gap-2">
                  <div class="flex items-center gap-1">
                    <span class="text-slate-400 dark:text-zinc-500">হাত:</span>
                    <strong id="tape-readout-haat" class="font-bold text-[#166b58] dark:text-yellow-400">
                      ${state.lang === 'bn' ? toBengaliDigits((initialInch / 18).toFixed(2)) : (initialInch / 18).toFixed(2)} ${t('tapeHaatUnit')}
                    </strong>
                  </div>
                  <span class="text-slate-300 dark:text-zinc-700">•</span>
                  <div class="flex items-center gap-1">
                    <span class="text-slate-400 dark:text-zinc-500">গজ ও গিরা:</span>
                    <strong id="tape-readout-goj-gira" class="font-bold text-[#166b58] dark:text-yellow-400">
                      ${formatGiraAndGoj(initialInch, state.lang)}
                    </strong>
                  </div>
                </div>
              </div>

              <!-- Vintage Tailor Yellow Ribbon Track (18" to 48") -->
              <div>
                <div class="tape-track-outer">
                  <div id="tape-viewport" class="tape-viewport" role="slider" aria-valuemin="18" aria-valuemax="48" aria-valuenow="${initialInch}" tabindex="0">
                    <!-- Crimson Center Fixed Needle -->
                    <div id="tape-needle" class="tape-needle"></div>
                    
                    <!-- Draggable Ribbon Strip (18" to 48") -->
                    <div id="tape-strip" class="tape-strip">
                      ${tapeCellsHtml}
                    </div>
                  </div>
                </div>
                <!-- Drag Hint -->
                <p class="text-[11px] text-center text-slate-400 dark:text-zinc-500 mt-1 select-none font-serif">
                  ${t('tapeDragHint')}
                </p>
              </div>

              <!-- Quick Presets -->
              <div class="pt-2">
                <p class="text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 font-serif">
                  ${t('tapePresetsHeading')}
                </p>
                <div id="tape-preset-chips" class="flex flex-wrap gap-2">
                  ${presets.map(p => `
                    <button 
                      type="button" 
                      data-inch="${p.val}"
                      class="tape-preset-chip px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-300 shadow-sm ${p.val === initialInch ? 'is-active' : ''}"
                    >
                      ${state.lang === 'bn' ? p.label_bn : p.label_en}
                    </button>
                  `).join('')}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    `;
  }

  function initTapeScrubber(prod) {
    const toggleBtn = document.getElementById('tape-accordion-toggle');
    const accordionBody = document.getElementById('tape-accordion-body');
    const chevron = toggleBtn?.querySelector('.tape-chevron');
    const viewport = document.getElementById('tape-viewport');
    const strip = document.getElementById('tape-strip');
    const drapeFabric = document.getElementById('tape-drape-fabric');
    const drapeHem = document.getElementById('tape-drape-hem');
    const badge = document.getElementById('tape-drape-level-badge');
    const readoutInch = document.getElementById('tape-readout-inch');
    const readoutHaat = document.getElementById('tape-readout-haat');
    const readoutGojGira = document.getElementById('tape-readout-goj-gira');
    const presetChips = document.querySelectorAll('#tape-preset-chips button');
    const heightBtns = document.querySelectorAll('#tape-height-selector button');

    if (!toggleBtn || !accordionBody || !viewport || !strip) return;

    const cellWidth = 32; // 32px per inch
    const minInch = 18;
    const maxInch = 48;
    let currentInch = state.tapeCurrentInch || prod.dimensions?.length_in || 31;
    let currentProfile = state.tapeHeightProfile || 'regular';

    // Toggle Accordion open/close
    toggleBtn.addEventListener('click', () => {
      const isClosed = accordionBody.classList.contains('hidden');
      if (isClosed) {
        accordionBody.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
        state.isTapeAccordionOpen = true;
        chevron?.classList.add('rotate-180');
        setTimeout(() => updateTapePosition(currentInch, false), 50);
      } else {
        accordionBody.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        state.isTapeAccordionOpen = false;
        chevron?.classList.remove('rotate-180');
      }
    });

    function getDrapeDescription(inch, profileKey) {
      const cfg = HEIGHT_PROFILES[profileKey] || HEIGHT_PROFILES.regular;
      if (inch < cfg.kneeIn - 1.5) return t('tapeDrapeAboveKnee');
      if (inch <= cfg.kneeIn + 2) return t('tapeDrapeKnee');
      if (inch <= cfg.calfIn + 2) return t('tapeDrapeCalf');
      if (inch <= cfg.ankleIn + 1.5) return t('tapeDrapeAnkle');
      return t('tapeDrapeFloor');
    }

    function updateHeightLines(profileKey) {
      const cfg = HEIGHT_PROFILES[profileKey] || HEIGHT_PROFILES.regular;

      const kneeLine = document.getElementById('tape-ref-knee-line');
      const kneeText = document.getElementById('tape-ref-knee-text');
      if (kneeLine && kneeText) {
        kneeLine.setAttribute('y1', cfg.kneeY);
        kneeLine.setAttribute('y2', cfg.kneeY);
        kneeText.setAttribute('y', cfg.kneeY - 4);
        kneeText.textContent = `${t('tapeKnee')} (~${state.lang === 'bn' ? toBengaliDigits(cfg.kneeIn) : cfg.kneeIn}")`;
      }

      const calfLine = document.getElementById('tape-ref-calf-line');
      const calfText = document.getElementById('tape-ref-calf-text');
      if (calfLine && calfText) {
        calfLine.setAttribute('y1', cfg.calfY);
        calfLine.setAttribute('y2', cfg.calfY);
        calfText.setAttribute('y', cfg.calfY - 4);
        calfText.textContent = `${t('tapeCalf')} (~${state.lang === 'bn' ? toBengaliDigits(cfg.calfIn) : cfg.calfIn}")`;
      }

      const ankleLine = document.getElementById('tape-ref-ankle-line');
      const ankleText = document.getElementById('tape-ref-ankle-text');
      if (ankleLine && ankleText) {
        ankleLine.setAttribute('y1', cfg.ankleY);
        ankleLine.setAttribute('y2', cfg.ankleY);
        ankleText.setAttribute('y', cfg.ankleY - 4);
        ankleText.textContent = `${t('tapeAnkle')} (~${state.lang === 'bn' ? toBengaliDigits(cfg.ankleIn) : cfg.ankleIn}")`;
      }
    }

    function updateDrapeSilhouette(inch) {
      if (!drapeFabric || !drapeHem) return;
      const clamped = Math.max(minInch, Math.min(maxInch, inch));
      const cfg = HEIGHT_PROFILES[currentProfile] || HEIGHT_PROFILES.regular;

      // Dynamic height mapping scaled to human proportion (starting at waist y=110)
      const fabricHeight = Math.min(185, Math.round(clamped * cfg.pxPerInch));
      drapeFabric.setAttribute('y', 110);
      drapeFabric.setAttribute('height', fabricHeight);
      drapeHem.setAttribute('y', 110 + fabricHeight - 6);

      if (badge) {
        badge.innerHTML = getDrapeDescription(clamped, currentProfile);
      }
    }

    function updateReadouts(inch) {
      const clamped = Math.max(minInch, Math.min(maxInch, inch));
      if (readoutInch) {
        readoutInch.textContent = `${state.lang === 'bn' ? toBengaliDigits(clamped) : clamped}"`;
      }
      if (readoutHaat) {
        const h = (clamped / 18).toFixed(2);
        readoutHaat.textContent = `${state.lang === 'bn' ? toBengaliDigits(h) : h} ${t('tapeHaatUnit')}`;
      }
      if (readoutGojGira) {
        readoutGojGira.textContent = formatGiraAndGoj(clamped, state.lang);
      }
      viewport.setAttribute('aria-valuenow', clamped);

      // Update preset chips active state
      presetChips.forEach(chip => {
        const chipInch = parseFloat(chip.dataset.inch);
        if (Math.abs(chipInch - clamped) < 0.5) {
          chip.classList.add('is-active');
        } else {
          chip.classList.remove('is-active');
        }
      });
    }

    function updateTapePosition(inch, animate = true) {
      const vWidth = viewport.clientWidth || 360;
      const targetX = (inch - minInch) * cellWidth + (cellWidth / 2);
      const tx = (vWidth / 2) - targetX;

      if (animate) {
        strip.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)';
      } else {
        strip.style.transition = 'none';
      }

      strip.style.transform = `translateX(${tx}px)`;
      updateDrapeSilhouette(inch);
      updateReadouts(inch);
    }

    function getInchFromTranslate(tx) {
      const vWidth = viewport.clientWidth || 360;
      const targetX = (vWidth / 2) - tx;
      const rawInch = (targetX - (cellWidth / 2)) / cellWidth + minInch;
      return Math.max(minInch, Math.min(maxInch, Math.round(rawInch * 2) / 2));
    }

    // Height Selector Listeners
    heightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentProfile = btn.dataset.height;
        state.tapeHeightProfile = currentProfile;
        heightBtns.forEach(b => b.classList.toggle('is-active', b === btn));
        updateHeightLines(currentProfile);
        updateDrapeSilhouette(currentInch);
      });
    });

    // Drag Interaction (Mouse & Touch)
    let isDragging = false;
    let startX = 0;
    let currentTx = 0;

    function getCurrentTranslateX() {
      const style = window.getComputedStyle(strip);
      const transform = style.transform || style.webkitTransform;
      if (transform && transform !== 'none') {
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
          const values = matrix[1].split(', ');
          return parseFloat(values[4]);
        }
      }
      return 0;
    }

    function onDragStart(clientX) {
      isDragging = true;
      startX = clientX;
      currentTx = getCurrentTranslateX();
      strip.style.transition = 'none';
      viewport.classList.add('is-dragging');
    }

    function onDragMove(clientX) {
      if (!isDragging) return;
      const dx = clientX - startX;
      let newTx = currentTx + dx;

      // Bound checking
      const vWidth = viewport.clientWidth || 360;
      const maxTx = (vWidth / 2) - (cellWidth / 2);
      const minTx = (vWidth / 2) - ((maxInch - minInch) * cellWidth + (cellWidth / 2));

      // Elastic resistance past bounds
      if (newTx > maxTx) newTx = maxTx + (newTx - maxTx) * 0.2;
      if (newTx < minTx) newTx = minTx + (newTx - minTx) * 0.2;

      strip.style.transform = `translateX(${newTx}px)`;
      const inch = getInchFromTranslate(newTx);
      currentInch = inch;
      state.tapeCurrentInch = inch;
      updateDrapeSilhouette(inch);
      updateReadouts(inch);
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('is-dragging');
      updateTapePosition(currentInch, true);
    }

    // Mouse events
    viewport.addEventListener('mousedown', (e) => {
      onDragStart(e.clientX);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        onDragMove(e.clientX);
      }
    });
    window.addEventListener('mouseup', () => {
      if (isDragging) onDragEnd();
    });

    // Touch events for mobile
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onDragStart(e.touches[0].clientX);
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        onDragMove(e.touches[0].clientX);
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (isDragging) onDragEnd();
    });

    // Mouse Wheel support
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY || e.deltaX);
      currentInch = Math.max(minInch, Math.min(maxInch, currentInch + delta * 0.5));
      state.tapeCurrentInch = currentInch;
      updateTapePosition(currentInch, true);
    }, { passive: false });

    // Preset chip clicks
    presetChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetInch = parseFloat(chip.dataset.inch);
        if (!isNaN(targetInch)) {
          currentInch = targetInch;
          state.tapeCurrentInch = currentInch;
          updateTapePosition(currentInch, true);
        }
      });
    });

    // Keyboard accessibility
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        currentInch = Math.min(maxInch, currentInch + 0.5);
        state.tapeCurrentInch = currentInch;
        updateTapePosition(currentInch, true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        currentInch = Math.max(minInch, currentInch - 0.5);
        state.tapeCurrentInch = currentInch;
        updateTapePosition(currentInch, true);
      }
    });

    // Window resize observer
    window.addEventListener('resize', () => {
      if (!accordionBody.classList.contains('hidden')) {
        updateTapePosition(currentInch, false);
      }
    });

    // Initial setup
    updateHeightLines(currentProfile);
    if (!accordionBody.classList.contains('hidden')) {
      setTimeout(() => updateTapePosition(currentInch, false), 50);
    }
  }

  // --- RENDER DYNAMIC PRODUCT PAGE ---
  function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id') || urlParams.get('slug') || 'thami';

    // Match by slug first, then ID
    const prod = PRODUCTS.find(p => p.slug === targetId || p.id === targetId) || PRODUCTS[0];
    if (!prod) return;

    state.currentProduct = prod;
    state.activeSlide = 0;

    const title = state.lang === 'bn' ? prod.name_bn : prod.name_en;
    const desc = state.lang === 'bn' ? prod.desc_bn : prod.desc_en;
    const details = state.lang === 'bn' ? prod.details_bn : prod.details_en;
    const badgeText = t(prod.badge);
    const isCrimsonBadge = prod.badge === 'badgeHot' || prod.badge === 'badgeLimited';
    const pricing = getProductPricing(prod);
    const images = getProductImages(prod);
    const activeImage = images[0] || '';

    // Update document title and breadcrumb
    if (elements.pageTitle) {
      elements.pageTitle.textContent = `${title} | Mon Chaise — যা মন চায় বেচি`;
    }
    if (elements.breadcrumbName) {
      elements.breadcrumbName.textContent = title;
    }

    if (!elements.productDetailContainer) return;

    elements.productDetailContainer.innerHTML = `
      <!-- Column 1: Showcase Slideshow & Multi-Photo Gallery -->
      <div class="lg:col-span-6 flex flex-col gap-4">
        
        <!-- Main Showcase Frame with Anti-Download Shield & Thin Nakshikantha Stitching Border -->
        <div id="slideshow-frame" class="relative w-full aspect-square md:aspect-[4/3] rounded-3xl bg-slate-50/70 dark:bg-[#101016] border border-dashed border-[#1e7e68]/35 dark:border-yellow-500/35 flex items-center justify-center p-4 sm:p-8 shadow-sm dark:shadow-2xl overflow-hidden group select-none" oncontextmenu="return false;" ondragstart="return false;">
          
          <!-- Top Badges -->
          <div class="absolute top-4 left-4 z-30 flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${isCrimsonBadge ? 'badge-crimson' : 'badge-accent'
      }">
              ${badgeText}
            </span>
          </div>

          <div class="absolute top-4 right-4 z-30 text-xs text-slate-400 dark:text-zinc-500 uppercase font-mono">
            #${prod.id}
          </div>

          <!-- Strict Anti-Download Transparent Protection Overlay Shield -->
          <div id="slideshow-zoom-trigger" class="image-protection-overlay absolute inset-0 z-20 cursor-zoom-in" title="${t('zoomBtn')}" oncontextmenu="return false;" ondragstart="return false;"></div>

          <!-- Main Image / SVG Canvas -->
          <div class="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
            ${activeImage ? `
              <img id="slideshow-main-img" src="${activeImage}" alt="${title}" class="max-h-full max-w-full object-contain pointer-events-none select-none drop-shadow-md transition-all duration-300 transform group-hover:scale-[1.03]" draggable="false" oncontextmenu="return false;" />
            ` : `
              <div class="transition-transform duration-500 group-hover:scale-105 drop-shadow-md">
                ${prod.iconSvg}
              </div>
            `}
          </div>

          <!-- Slideshow Prev / Next Buttons (visible if >1 image) -->
          ${images.length > 1 ? `
            <button type="button" id="slideshow-prev-btn" class="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-800 shadow-md flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:scale-110 active:scale-90 transition-all" title="Previous Slide">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" id="slideshow-next-btn" class="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-800 shadow-md flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:scale-110 active:scale-90 transition-all" title="Next Slide">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </button>
          ` : ''}

          <!-- Slide Counter Pill -->
          <div id="slideshow-counter" class="absolute bottom-3 left-3 z-30 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold price-tag pointer-events-none">
            ${state.lang === 'bn' ? toBengaliDigits(1) : 1} / ${state.lang === 'bn' ? toBengaliDigits(images.length || 1) : (images.length || 1)}
          </div>

          <!-- Zoom In Trigger Button -->
          <button type="button" id="slideshow-zoom-btn" class="absolute bottom-3 right-3 z-30 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-200 shadow-sm flex items-center gap-1.5 hover:border-[#1e7e68] dark:hover:border-yellow-400 transition-all active:scale-95">
            <svg class="w-4 h-4 text-[#1e7e68] dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg>
            <span>${t('zoomBtn')}</span>
          </button>
        </div>

        <!-- Thumbnail Strip for Multi-Photo Slideshow -->
        ${images.length > 1 ? `
          <div id="slideshow-thumbnails" class="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none select-none" oncontextmenu="return false;">
            ${images.map((img, idx) => `
              <button type="button" data-slide-index="${idx}" class="thumbnail-btn relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-zinc-900 border-2 overflow-hidden transition-all shrink-0 p-1 shadow-sm ${idx === 0 ? 'border-[#1e7e68] dark:border-yellow-400 ring-2 ring-[#1e7e68]/30 dark:ring-yellow-400/30' : 'border-slate-200 dark:border-zinc-800 opacity-70 hover:opacity-100'}">
                <div class="image-protection-overlay absolute inset-0 z-10 select-none" oncontextmenu="return false;" ondragstart="return false;"></div>
                <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-contain pointer-events-none select-none" draggable="false" oncontextmenu="return false;" />
              </button>
            `).join('')}
          </div>
        ` : ''}

        <!-- In-Stock Guarantee bar -->
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-950/80 border border-dashed border-[#1e7e68]/30 dark:border-yellow-500/30 text-xs text-slate-600 dark:text-zinc-400 shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${t('inStock')}</span>
          <span class="ml-auto text-slate-400 dark:text-zinc-500 text-[11px]">Free Returns if Damaged</span>
        </div>
      </div>

      <!-- Column 2: Details & Actions -->
      <div class="lg:col-span-6 flex flex-col justify-between">
        <div>
          <!-- Category Tag -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold uppercase tracking-widest text-[#166b58] dark:text-yellow-500 font-fell-sc">
              ${t(prod.category === 'weaves' ? 'catWeaves' : (prod.category === 'tech' ? 'catTech' : (prod.category === 'food' ? 'catFood' : 'catQuirks')))}
            </span>
          </div>

          <!-- Title: Calibrated prominent heading -->
          <h1 class="product-detail-title font-bold text-slate-900 dark:text-white mb-3 leading-tight font-title">
            ${title}
          </h1>

          <!-- Price Block: Calibrated optimal harmonious sizing -->
          <div class="flex items-baseline gap-2.5 sm:gap-3.5 mb-6 pb-6 border-b border-slate-200 dark:border-zinc-900 flex-wrap">
            <span class="product-detail-price price-tag font-black text-[#166b58] dark:text-yellow-400 leading-none">
              ${formatMoney(pricing.currentPrice)}
            </span>
            ${pricing.hasDiscount ? `
              <span class="product-detail-orig-price price-original font-semibold text-slate-400 dark:text-zinc-500 line-through">
                ${formatMoney(pricing.origPrice)}
              </span>
              <span class="product-detail-discount-badge px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold font-title tracking-wide">
                -${state.lang === 'bn' ? toBengaliDigits(pricing.discountPercent) : pricing.discountPercent}% ${state.lang === 'bn' ? 'ছাড়' : 'OFF'}
              </span>
            ` : ''}
            <span class="text-xs text-slate-400 dark:text-zinc-500 font-medium">
              (VAT & Tax Included)
            </span>
          </div>

          <!-- Description & Translated About This Item ("পণ্যের সম্পর্কে") -->
          <div class="mb-8">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2 font-title" data-i18n="aboutThisItem">
              ${t('aboutThisItem')}
            </h3>
            <p class="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base mb-4 secondary-text">
              ${desc}
            </p>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/60 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-serif">
              ${details}
            </div>
          </div>

          <!-- The Measuring Tape ("ফিতার মাপ") Accordion & Drape Guide -->
          ${renderTapeAccordion(prod)}

          <!-- Craftsmanship Badge -->
          <div class="mb-6 p-4 rounded-2xl bg-emerald-50/50 dark:bg-yellow-500/5 border border-emerald-200/60 dark:border-yellow-500/20">
            <p class="text-xs font-bold text-[#166b58] dark:text-yellow-400 mb-1 font-title">
              ${t('craftsmanshipTitle')}
            </p>
            <p class="text-xs text-slate-500 dark:text-zinc-400 italic secondary-text">
              ${t('craftsmanshipDesc')}
            </p>
          </div>

          <!-- Delivery Perks -->
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400 mb-8 secondary-text">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1e7e68] dark:text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>${t('deliveryPerks1')}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1e7e68] dark:text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>${t('deliveryPerks2')}</span>
            </div>
          </div>
        </div>

        <!-- Quantity & Action Buttons -->
        <div class="pt-6 border-t border-slate-200 dark:border-zinc-900 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <!-- Quantity Selector -->
          <div class="flex items-center justify-between sm:justify-start bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 px-3 py-2.5 rounded-xl">
            <button type="button" id="detail-qty-dec" class="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-base font-bold active:scale-90">-</button>
            <span id="detail-qty-display" class="price-tag px-4 text-sm font-bold text-slate-900 dark:text-white min-w-[28px] text-center">
              ${state.lang === 'bn' ? toBengaliDigits(state.currentQty) : state.currentQty}
            </span>
            <button type="button" id="detail-qty-inc" class="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-base font-bold active:scale-90">+</button>
          </div>

          <!-- Add to Cart Button -->
          <button 
            type="button" 
            id="detail-add-cart-btn" 
            class="flex-1 py-3 px-6 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-800/15 dark:shadow-yellow-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span>${t('addToCart')}</span>
          </button>

          <!-- Buy Now Button -->
          <button 
            type="button" 
            id="detail-buy-now-btn" 
            class="py-3 px-6 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:border-[#1e7e68] dark:hover:border-yellow-500/60 text-slate-800 dark:text-zinc-200 hover:text-black dark:hover:text-white font-bold text-sm sm:text-base transition-all shadow-sm"
          >
            <span>${t('buyNow')}</span>
          </button>
        </div>
      </div>
    `;

    // Apply Anti-Download to showcase frame
    applyAntiDownload(document.getElementById('slideshow-frame'));

    // Attach Slideshow Event Listeners
    document.getElementById('slideshow-prev-btn')?.addEventListener('click', () => {
      setActiveSlide(state.activeSlide - 1);
    });

    document.getElementById('slideshow-next-btn')?.addEventListener('click', () => {
      setActiveSlide(state.activeSlide + 1);
    });

    document.querySelectorAll('#slideshow-thumbnails .thumbnail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.slideIndex, 10);
        setActiveSlide(idx);
      });
    });

    // Zoom Triggers
    document.getElementById('slideshow-zoom-trigger')?.addEventListener('click', openZoomModal);
    document.getElementById('slideshow-zoom-btn')?.addEventListener('click', openZoomModal);

    // Quantity selector listeners
    document.getElementById('detail-qty-inc')?.addEventListener('click', () => {
      state.currentQty += 1;
      document.getElementById('detail-qty-display').textContent = state.lang === 'bn' ? toBengaliDigits(state.currentQty) : state.currentQty;
    });

    document.getElementById('detail-qty-dec')?.addEventListener('click', () => {
      if (state.currentQty > 1) {
        state.currentQty -= 1;
        document.getElementById('detail-qty-display').textContent = state.lang === 'bn' ? toBengaliDigits(state.currentQty) : state.currentQty;
      }
    });

    // Add to Cart listener
    document.getElementById('detail-add-cart-btn')?.addEventListener('click', () => {
      addToCart(prod.id, state.currentQty);
    });

    // Buy Now listener
    document.getElementById('detail-buy-now-btn')?.addEventListener('click', () => {
      addToCart(prod.id, state.currentQty);
      window.location.href = 'index.html#checkout-section';
    });

    // Initialize Interactive Measuring Tape ("ফিতার মাপ") Accordion & Drape Scrubber
    initTapeScrubber(prod);

    // Render Related Products
    renderRelatedProducts(prod.id);
  }

  // --- RENDER RELATED PRODUCTS ---
  function renderRelatedProducts(currentId) {
    if (!elements.relatedProductsGrid) return;

    const related = PRODUCTS.filter(p => p.id !== currentId && p.slug !== currentId).slice(0, 4);

    elements.relatedProductsGrid.innerHTML = related.map(prod => {
      const title = state.lang === 'bn' ? prod.name_bn : prod.name_en;
      const desc = state.lang === 'bn' ? (prod.short_desc_bn || prod.desc_bn) : (prod.short_desc_en || prod.desc_en);
      const badgeText = t(prod.badge);
      const isCrimsonBadge = prod.badge === 'badgeHot' || prod.badge === 'badgeLimited';
      const pricing = getProductPricing(prod);
      const linkUrl = `product.html?id=${prod.slug}`;

      return `
        <div class="product-card group relative p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
          <div class="flex items-start justify-between gap-1.5 mb-2 sm:mb-3">
            <span class="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full ${isCrimsonBadge ? 'badge-crimson' : 'badge-accent'
        }">
              ${badgeText}
            </span>
            <span class="text-[9px] sm:text-[10px] text-slate-400 dark:text-zinc-500 tracking-tighter">#${prod.id}</span>
          </div>

          <a href="${linkUrl}" class="block relative w-full aspect-square rounded-xl bg-slate-50/70 dark:bg-[#101017] border border-dashed border-[#1e7e68]/30 dark:border-yellow-500/30 flex items-center justify-center p-3 sm:p-5 mb-2.5 sm:mb-4 hover:border-[#1e7e68] dark:hover:border-yellow-500 transition-colors overflow-hidden select-none" oncontextmenu="return false;" ondragstart="return false;">
            <div class="transition-transform duration-300 group-hover:scale-110 [&>svg]:w-14 [&>svg]:h-14 sm:[&>svg]:w-16 sm:[&>svg]:h-16 flex items-center justify-center pointer-events-none">
              ${prod.iconSvg}
            </div>
            <div class="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[9px] sm:text-[10px] text-slate-400 dark:text-zinc-500 tracking-tighter">
              #${prod.id}
            </div>
          </a>

          <div class="flex-1 flex flex-col justify-between">
            <div>
              <a href="${linkUrl}" class="product-card-title block font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-[#1e7e68] dark:group-hover:text-yellow-400 transition-colors line-clamp-2 font-title">
                ${title}
              </a>
              <p class="preview-desc line-clamp-2 mb-2 sm:mb-3 leading-normal secondary-text">
                ${desc}
              </p>
            </div>

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
                <a href="${linkUrl}" class="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 text-[11px] font-semibold transition-all hover:text-black dark:hover:text-white whitespace-nowrap" title="${t('viewDetails')}">
                  ${t('viewDetails')}
                </a>
                -->
                <button type="button" data-add-cart="${prod.id}" class="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#1e7e68] hover:bg-[#166b58] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black font-bold shadow-md hover:scale-105 active:scale-95 transition-all shrink-0" title="${t('addToCart')}">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Add to Cart listener to related products
    elements.relatedProductsGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(btn.dataset.addCart, 1);
      });
    });
  }

  // --- LANGUAGE HANDLING ---
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

    renderProductPage();
    updateCartUI();
  }

  // --- THEME HANDLING ---
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('amc_theme', theme);
    const isDark = theme === 'dark';
    const htmlEl = document.documentElement;

    htmlEl.classList.toggle('dark', isDark);

    if (elements.themeIconMoon && elements.themeIconSun) {
      elements.themeIconMoon.classList.toggle('hidden', isDark);
      elements.themeIconSun.classList.toggle('hidden', !isDark);
    }

    const logoSrc = isDark ? './files/monchaise_logo.svg' : './files/monchaise_logo_green.svg';
    if (elements.navbarLogo) elements.navbarLogo.src = logoSrc;
    if (elements.footerLogo) elements.footerLogo.src = logoSrc;
    if (elements.favicon) elements.favicon.href = logoSrc;
  }

  // --- ASYNC CATALOG LOADER ---
  async function loadCatalog() {
    try {
      const resp = await fetch('data/products.json');
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          PRODUCTS = data;
          return;
        }
      }
    } catch (e) {
      console.info('Using local catalog fallback (standard for file:// protocol without local server).');
    }
  }

  // --- INITIALIZATION ---
  function init() {
    applyTheme(state.theme);
    loadCart();

    // 1. Initial Render immediately with in-memory catalog
    applyLanguage(state.lang);
    setupZoomControls();

    // 2. Refresh catalog from data/products.json if available
    loadCatalog().then(() => {
      renderProductPage();
      updateCartUI();
    });

    // Event Listeners for Header Actions
    if (elements.langToggleBtn) {
      elements.langToggleBtn.addEventListener('click', () => {
        applyLanguage(state.lang === 'bn' ? 'en' : 'bn');
      });
    }

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Drawer Listeners
    if (elements.cartToggleBtn) {
      elements.cartToggleBtn.addEventListener('click', openCartDrawer);
    }
    if (elements.closeCartBtn) {
      elements.closeCartBtn.addEventListener('click', closeCartDrawer);
    }
    if (elements.cartBackdrop) {
      elements.cartBackdrop.addEventListener('click', closeCartDrawer);
    }
    if (elements.cartProceedBtn) {
      elements.cartProceedBtn.addEventListener('click', () => {
        window.location.href = 'index.html#checkout-section';
      });
    }

    // Shared Cart Cross-Tab Synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === 'amc_cart') {
        loadCart();
      }
      if (e.key === 'amc_lang') {
        applyLanguage(e.newValue || 'bn');
      }
      if (e.key === 'amc_theme') {
        applyTheme(e.newValue || 'light');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCartDrawer();
        closeZoomModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
