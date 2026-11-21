/**
 * ============================================================================
 * SARU (সারু) ASSISTANT — STANDALONE INTERACTIVE WEB COMPONENT
 * The Loom Shuttle Companion for Amar Mon Chaise (মঞ্চাইছে)
 * ============================================================================
 */

(function () {
  'use strict';

  // Base resting SVG thread path coordinates (anchored at 50, 140.5)
  const BASE_THREAD_PATH = 'M 50 140.5 C 57 140.5, 64 135, 70 136 C 78 138, 84 148, 80 158 C 76 168, 79 176, 86 175 C 91 173, 93 166, 90 161';
  const BASE_TIP_CX = 90;
  const BASE_TIP_CY = 161;

  // How far her irises can travel inside the eye, in SVG units.
  const GAZE_RANGE_X = 2.8;
  const GAZE_RANGE_Y = 0.9;

  // Sliding the spool's wraps by one full pattern looks the same, so it can loop forever.
  const SPOOL_PATTERN = 16;

  // What Saru remembers. Session keys last for the visit; minimised is kept between visits.
  const KEYS = {
    greeted: 'amc_saru_greeted',
    woken: 'amc_saru_woken',
    quip: 'amc_saru_quip',
    idle: 'amc_saru_idle_shown',
    minimised: 'amc_saru_minimised'
  };

  // Storage can throw in private browsing; Saru just forgets in that case.
  const readStore = (area, key) => {
    try {
      return window[area].getItem(key);
    } catch (_) {
      return null;
    }
  };
  const writeStore = (area, key, value) => {
    try {
      if (value === null) window[area].removeItem(key);
      else window[area].setItem(key, String(value));
    } catch (_) { }
  };

  // Her expression on each line of LINES.quips, in the same order.
  const QUIP_FACES = ['happy', 'worried', 'happy', 'worried', 'smug', 'neutral', 'neutral', 'worried', 'smug', 'happy', 'neutral', 'smug'];

  // Everything Saru says. She speaks Bengali in both site languages.
  const LINES = {
    mascotLabel: 'সারু: কথা বলতে চাপুন',
    mascotLabelMinimised: 'সারুকে ফিরিয়ে আনুন',
    restored: 'এই যে, আবার হাজির!',
    greetings: {
      morning: 'শুভ সকাল! মঞ্চাইছে সাইটে আপনাকে স্বাগতম!',
      afternoon: 'শুভ দুপুর! মঞ্চাইছে সাইটে আপনাকে স্বাগতম!',
      evening: 'শুভ সন্ধ্যা! মঞ্চাইছে সাইটে আপনাকে স্বাগতম!',
      night: 'শুভ রাত্রি! মঞ্চাইছে সাইটে আপনাকে স্বাগতম!'
    },
    lateNight: [
      'শুভ রাত্রি!',
      'এই রাতদুপুরে আমাদের মনে করে এখানে আসার জন্য আপনাকে ধন্যবাদ!',
      'চোখের কী অবস্থা করেছেন, দেখেছেন আয়নায়?',
      'তাড়াতাড়ি ঘুমিয়ে পড়ুন!'
    ],
    quips: [
      'হেই! আমি সারু; তাঁতের মাকু! কোনো সাহায্য লাগলে ডাক দিয়েন।',
      'আমার এক বিলাতি ভাগ্নে ছিল, ক্লিপি। কেউ কী ওর খবর জানো?',
      'তাঁতীর বুননের শব্দ শুনেই তো মন ভালো হয়ে যায়, তাই না?',
      'রুনঝুন করছে না কেন আজ?',
      'মেশিনটা একটু বেশি শব্দ করছে, তাই না?',
      'একটা নতুন রঙ খুঁজছি। ফিরোজার মধ্যে হলুদ, আবার একটু কড়া লাল, কিন্তু একটু কম গাঢ়।',
      'খাওয়াদাওয়া আজ হয়েছে ঠিকঠাক?',
      'আমার সুতো বেশি টান দিয়েন না যেন, মাথা ঘুরায়া চক্কর দেয়!',
      'আমার এক চোখে ঘুম, আরেক চোখে বাজার!',
      'তাঁতের নিখুঁত কাজের কোনো তুলনা হয় না, তাই না?',
      'আমাকে কিছু বলতে চান? তাহলে আমায় ডাবল-ক্লিক করুন (বা ফোনে হলে একটু চেপে ধরে রাখুন)।',
      'কী ভাবছেন? ফিতার মাপে কোনো খটকা?'
    ],
    dizzy: 'আরে আরে থামা! মাথা ঘুরায়া মাটিতে পইড়া যামু তো!',
    idle: 'কী ভাবছেন? ফিতার মাপে কোনো খটকা লাগলে আমায় বইলেন!',
    cartAdd: 'চমৎকার পছন্দ! তাঁতির নিপুণ হাতের কাজ কিন্তু এটা।',
    cartEmpty: 'কার্ট তো খাঁ খাঁ করতাছে! কিছু পছন্দ হইলো না?',
    checkoutError: 'ঠিকানা আর ফোন নম্বর না দিলে পার্সেল পাঠামু কার কাছে?',
    paymentCod: 'ক্যাশ অন ডেলিভারি? বেশ, পার্সেল বুইঝা পাইয়া তারপর টাকা দিয়েন।',
    paymentMfs: 'টাকা সেন্ড মানি করার পর TrxID দিতে ভুলবেন না যেন! নাইলে পার্সেল আটকায়া যাইব।',
    thanksRecommendation: 'অসাধারণ পরামর্শ! মঞ্চাইছেকে আরও সুন্দর করে তুলতে আপনার এই ভাবনা অনেক কাজে দেবে।',
    thanksQuestion: 'আপনার প্রশ্ন পেয়েছি! মঞ্চাইছে টিমের সাথে আলোচনা করে শীঘ্রই উত্তর দেওয়া হবে।',
    form: {
      nameRequired: 'অনুগ্রহ করে আপনার নাম লিখুন।',
      contactRequired: 'অনুগ্রহ করে আপনার ই-মেইল বা মোবাইল নম্বর লিখুন।',
      contactInvalid: 'অনুগ্রহ করে সঠিক ই-মেইল বা মোবাইল নম্বর লিখুন।',
      messageRequired: 'অনুগ্রহ করে বার্তা বা প্রশ্ন লিখুন।',
      sent: 'ধন্যবাদ! আপনার বার্তা সরাসরি টেলিগ্রামে পৌঁছে গেছে।',
      serverError: 'সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
      sendFailed: 'পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
    }
  };

  // Direct Inline Vector SVG Assets for 100% Reliable, Zero-Latency Mounting (Works on file:// and http/s)

  // 1. RECESSED CAVITY BACK FLOOR: Dark carved wooden interior at Z = -5.5px
  const PAKU_CAVITY_FLOOR_SVG_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 240" width="100%" height="100%" aria-hidden="true">
  <defs>
    <linearGradient id="paku-cavity-floor-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0402" />
      <stop offset="25%" stop-color="#1c0e06" />
      <stop offset="75%" stop-color="#1c0e06" />
      <stop offset="100%" stop-color="#080301" />
    </linearGradient>
    <linearGradient id="paku-cavity-floor-rim-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.80" />
      <stop offset="18%" stop-color="#000000" stop-opacity="0" />
      <stop offset="82%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.80" />
    </linearGradient>
  </defs>
  <!-- Deep Carved Wooden Cavity Floor -->
  <rect x="35" y="110" width="30" height="80.5" rx="8" ry="8" fill="url(#paku-cavity-floor-dark)" stroke="#0a0502" stroke-width="1.2" />
  <rect x="35" y="110" width="30" height="80.5" rx="8" ry="8" fill="url(#paku-cavity-floor-rim-shadow)" />
  <!-- Spindle mounting brackets recessed into chamber ends -->
  <path d="M 46 111.5 L 54 111.5 L 53 116.5 L 47 116.5 Z" fill="#754e19" stroke="#120803" stroke-width="0.8" />
  <path d="M 46 189 L 54 189 L 53 184 L 47 184 Z" fill="#754e19" stroke="#120803" stroke-width="0.8" />
</svg>`;

  // 2. SPOOL LAYER: Floating Spool pirn and Living crimson thread at Z = 0px
  const PAKU_SPOOL_SVG_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 240" width="100%" height="100%" aria-hidden="true">
  <defs>
    <style>
      <![CDATA[
      #living-thread-arm {
        stroke: #BD3A54;
        transition: stroke 0.3s ease;
      }
      #living-thread-tip {
        fill: #BD3A54;
        transition: fill 0.3s ease;
      }
      .dark #living-thread-arm,
      :root.dark #living-thread-arm,
      [data-theme="dark"] #living-thread-arm {
        stroke: #f2c200 !important;
      }
      .dark #living-thread-tip,
      :root.dark #living-thread-tip,
      [data-theme="dark"] #living-thread-tip {
        fill: #f2c200 !important;
      }
      .zzz-glyph {
        fill: #BD3A54;
        transition: fill 0.3s ease;
      }
      .dark .zzz-glyph,
      :root.dark .zzz-glyph,
      [data-theme="dark"] .zzz-glyph {
        fill: #f2c200 !important;
      }
      ]]>
    </style>
  </defs>
  <g id="paku-spool-layer-group">
    <clipPath id="paku-spool-clip"><path d="M 45 119 C 41 121.5, 39 134, 39 150 C 39 166, 41 177, 44.5 181 L 55.5 181 C 59 177, 61 166, 61 150 C 61 134, 59 121.5, 55 119 Z" /></clipPath>
    <g id="paku-spool">
      <rect id="paku-spindle-rod" x="48.8" y="113" width="2.4" height="74" rx="1.2" fill="#d9c8a7" stroke="#3d2f19" stroke-width="0.6" />
      <rect x="44" y="116" width="12" height="3" rx="1.5" fill="#a67c3b" stroke="#1a1008" stroke-width="0.8" />
      <rect x="43" y="181" width="14" height="3.5" rx="1.7" fill="#a67c3b" stroke="#1a1008" stroke-width="0.8" />
      <g id="spool-package">
        <path id="spool-base-volume" d="M 45 119 C 41 121.5, 39 134, 39 150 C 39 166, 41 177, 44.5 181 L 55.5 181 C 59 177, 61 166, 61 150 C 61 134, 59 121.5, 55 119 Z" fill="#135d49" stroke="#092d23" stroke-width="1.2" />
        <g clip-path="url(#paku-spool-clip)">
        <g id="spool-dense-green-thread" stroke="#0e4738" stroke-width="0.9" fill="none">
          <line x1="39" y1="120" x2="61" y2="120" />
          <line x1="39" y1="122" x2="61" y2="122" stroke="#197a60" />
          <line x1="39" y1="124" x2="61" y2="124" />
          <line x1="39" y1="126" x2="61" y2="126" stroke="#197a60" />
          <line x1="39" y1="128" x2="61" y2="128" />
          <line x1="39" y1="130" x2="61" y2="130" stroke="#197a60" />
          <line x1="39" y1="132" x2="61" y2="132" />
          <line x1="39" y1="134" x2="61" y2="134" stroke="#197a60" />
          <line x1="39" y1="136" x2="61" y2="136" />
          <line x1="39" y1="138" x2="61" y2="138" stroke="#197a60" />
          <line x1="39" y1="140" x2="61" y2="140" />
          <line x1="39" y1="142" x2="61" y2="142" stroke="#197a60" />
          <line x1="39" y1="144" x2="61" y2="144" />
          <line x1="39" y1="146" x2="61" y2="146" stroke="#197a60" />
          <line x1="39" y1="148" x2="61" y2="148" />
          <line x1="39" y1="150" x2="61" y2="150" stroke="#197a60" />
          <line x1="39" y1="152" x2="61" y2="152" />
          <line x1="39" y1="154" x2="61" y2="154" stroke="#197a60" />
          <line x1="39" y1="156" x2="61" y2="156" />
          <line x1="39" y1="158" x2="61" y2="158" stroke="#197a60" />
          <line x1="39" y1="160" x2="61" y2="160" />
          <line x1="39" y1="162" x2="61" y2="162" stroke="#197a60" />
          <line x1="39" y1="164" x2="61" y2="164" />
          <line x1="39" y1="166" x2="61" y2="166" stroke="#197a60" />
          <line x1="39" y1="168" x2="61" y2="168" />
          <line x1="39" y1="170" x2="61" y2="170" stroke="#197a60" />
          <line x1="39" y1="172" x2="61" y2="172" />
          <line x1="39" y1="174" x2="61" y2="174" stroke="#197a60" />
          <line x1="39" y1="176" x2="61" y2="176" />
          <line x1="39" y1="178" x2="61" y2="178" stroke="#197a60" />
          <line x1="39" y1="180" x2="61" y2="180" />
        </g>
        <g id="spool-cross-threads" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="39 85 61 93 39 101 61 109 39 117 61 125 39 133 61 141 39 149 61 157 39 165 61 173 39 181 61 189 39 197" stroke="#BD3A54" stroke-width="1.8" />
          <polyline points="61 85 39 93 61 101 39 109 61 117 39 125 61 133 39 141 61 149 39 157 61 165 39 173 61 181 39 189 61 197" stroke="#d4af37" stroke-width="1.3" stroke-opacity="0.85" />
        </g>
        </g>
        <path d="M 47.5 120 C 45.5 130, 45 145, 45 160 C 45 169, 46.5 177, 47.5 180 L 50 180 C 49 177, 47.5 169, 47.5 160 C 47.5 145, 48 130, 50 120 Z" fill="#ffffff" opacity="0.18" />
      </g>
    </g>
  </g>
</svg>`;

  // 3. FRONT FACE: Front wooden shell with transparent cavity window cutout, Devi face, eyes, and brass caps at Z = +6px
  const PAKU_FRONT_SVG_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 240" width="100%" height="100%" aria-label="সারু (Saru) — The Loom Shuttle Mascot">
  <!-- =================================================== -->
  <!-- 1. <defs> LAYER: Wood Shading, Brass & Thread Assets -->
  <!-- =================================================== -->
  <defs>
    <!-- Warm Chestnut / Teak Wood Base Gradient (Clean, artisanal woodblock tone) -->
    <linearGradient id="paku-wood-fill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#693b1b" />
      <stop offset="10%" stop-color="#8a5328" />
      <stop offset="42%" stop-color="#ad7444" />
      <stop offset="55%" stop-color="#b67c4a" />
      <stop offset="88%" stop-color="#8a5328" />
      <stop offset="100%" stop-color="#5e3417" />
    </linearGradient>

    <!-- Wood Lateral Cylindrical Shadow Overlay -->
    <linearGradient id="paku-wood-shading" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a1205" stop-opacity="0.65" />
      <stop offset="12%" stop-color="#2a1205" stop-opacity="0" />
      <stop offset="88%" stop-color="#2a1205" stop-opacity="0" />
      <stop offset="100%" stop-color="#2a1205" stop-opacity="0.70" />
    </linearGradient>

    <!-- Antique Brass Conical Tip Gradient -->
    <linearGradient id="paku-brass-cap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#73541e" />
      <stop offset="18%" stop-color="#a68035" />
      <stop offset="45%" stop-color="#fae395" />
      <stop offset="60%" stop-color="#d6b052" />
      <stop offset="85%" stop-color="#a68035" />
      <stop offset="100%" stop-color="#634718" />
    </linearGradient>

    <!-- Cutout Cavity Window Mask (Transparent opening into hollow chamber) -->
    <mask id="paku-cavity-hole-mask">
      <rect x="0" y="0" width="100" height="240" fill="#ffffff" />
      <rect x="36" y="111.5" width="28" height="77.5" rx="7" ry="7" fill="#000000" />
    </mask>

    <!-- Cutout Cavity Deep Interior -->
    <linearGradient id="paku-cavity-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#120803" />
      <stop offset="20%" stop-color="#1c0e06" />
      <stop offset="80%" stop-color="#1c0e06" />
      <stop offset="100%" stop-color="#0d0502" />
    </linearGradient>

    <style>
      <![CDATA[
      /* Extended Living Thread: Red for Light Mode, Yellow for Dark Mode */
      #living-thread-arm {
        stroke: #BD3A54;
        transition: stroke 0.3s ease;
      }
      #living-thread-tip {
        fill: #BD3A54;
        transition: fill 0.3s ease;
      }

      /* Dark Mode Overrides */
      .dark #living-thread-arm,
      :root.dark #living-thread-arm,
      [data-theme="dark"] #living-thread-arm {
        stroke: #f2c200 !important;
      }
      .dark #living-thread-tip,
      :root.dark #living-thread-tip,
      [data-theme="dark"] #living-thread-tip {
        fill: #f2c200 !important;
      }

      /* Sleepy Z Z Z indicator glyphs */
      .zzz-glyph {
        fill: #BD3A54;
        transition: fill 0.3s ease;
      }
      .dark .zzz-glyph,
      :root.dark .zzz-glyph,
      [data-theme="dark"] .zzz-glyph {
        fill: #f2c200 !important;
      }
      ]]>
    </style>
  </defs>

  <!-- Root Animated Container -->
  <g id="paku-body" class="paku-body">

    <!-- ======================================================= -->
    <!-- 2. <g id="paku-hull" mask="url(#paku-cavity-hole-mask)">: The Main Wooden Shuttle Body    -->
    <!-- ======================================================= -->
    <g id="paku-hull" mask="url(#paku-cavity-hole-mask)">
      <!-- Main Canoe Hull: Perfectly symmetrical slender canoe hull spanning y=10 to y=230 -->
      <path id="paku-wood-body"
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 28 44, 21 54, 21 78
           C 20 95, 20 145, 21 162
           C 21 186, 28 196, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 72 196, 79 186, 79 162
           C 80 145, 80 95, 79 78
           C 79 54, 72 44, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-wood-fill)"
        stroke="#1a1008"
        stroke-width="1.6" />

      <!-- Outer Contour Lateral Shading Overlay -->
      <path
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 28 44, 21 54, 21 78
           C 20 95, 20 145, 21 162
           C 21 186, 28 196, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 72 196, 79 186, 79 162
           C 80 145, 80 95, 79 78
           C 79 54, 72 44, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-wood-shading)" />

      <!-- Artisanal Wood Grain Strands (Confined strictly between brass caps: y=44 to y=198) -->
      <g id="paku-wood-grain" stroke="#48250f" stroke-width="0.75" stroke-linecap="round" fill="none">
        <path d="M 34 44 C 26 52, 23.5 66, 23.5 88 C 23.5 110, 23.5 140, 23.5 156 C 23.5 176, 26 190, 34 198" />
        <path d="M 66 44 C 74 52, 76.5 66, 76.5 88 C 76.5 110, 76.5 140, 76.5 156 C 76.5 176, 74 190, 66 198" />
        <path d="M 50 193 L 50 199" />
      </g>

      <!-- Top Brass Conical Cap (y=10 to y=37, perfectly flush with hull curves) -->
      <g id="paku-metal-tip-top">
        <path
          d="M 50 10
             C 43 18, 36 27, 33.5 37
             C 39 39.5, 61 39.5, 66.5 37
             C 64 27, 57 18, 50 10 Z"
          fill="url(#paku-brass-cap)"
          stroke="#1a1008"
          stroke-width="1.6" />
        <!-- Specular Highlight Ridge -->
        <path d="M 50 11 L 47 38 L 53 38 Z" fill="#ffffff" opacity="0.25" />
        <!-- Rivets (3 distinct brass pins matching reference) -->
        <circle cx="41" cy="32.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="50" cy="34.0" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="59" cy="32.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
      </g>

      <!-- Bottom Brass Conical Cap (y=203 to y=230, perfectly symmetric mirror of top cap) -->
      <g id="paku-metal-tip-bottom">
        <path
          d="M 33.5 203
             C 39 200.5, 61 200.5, 66.5 203
             C 64 213, 57 222, 50 230
             C 43 222, 36 213, 33.5 203 Z"
          fill="url(#paku-brass-cap)"
          stroke="#1a1008"
          stroke-width="1.6" />
        <!-- Specular Highlight Ridge -->
        <path d="M 47 202 L 53 202 L 50 229 Z" fill="#ffffff" opacity="0.25" />
        <!-- Rivets (3 distinct brass pins matching reference) -->
        <circle cx="41" cy="207.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="50" cy="206.0" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="59" cy="207.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
      </g>

      <!-- Internal Cavity: Centered vertical cutout slot (y=95 to y=190, width=28: x=36 to x=64) -->
      <g id="paku-cavity">
        <!-- Carved Outer Bevel Rim -->
        <rect x="35" y="110" width="30" height="80.5" rx="8" ry="8"
          fill="none"
          stroke="#3d1d0c"
          stroke-width="1.8" />
        <rect x="35" y="110" width="30" height="80.5" rx="8" ry="8"
          fill="none"
          stroke="#1a1008"
          stroke-width="1.4" />

        <!-- Cavity opening is a true physical window through the wooden front shell -->

        <!-- Top Spindle Bracket -->
        <path d="M 46 111.5 L 54 111.5 L 53 116.5 L 47 116.5 Z" fill="#8c6428" stroke="#1a1008" stroke-width="0.8" />
        <!-- Bottom Spindle Bracket -->
        <path d="M 46 189 L 54 189 L 53 184 L 47 184 Z" fill="#8c6428" stroke="#1a1008" stroke-width="0.8" />
      </g>
    

    <!-- ======================================================= -->
    <!-- 4. <g id="paku-face">: Classical Serene Devi Expressions  -->
    <!-- ======================================================= -->
    <!-- Exact 1:1 mathematical vector extraction of user reference (media_1788585335432.png) -->
    <g id="paku-face" transform="translate(50 42) scale(1.28) translate(-50 -42)">
      <!-- 1. Forehead Ornamental Chandan Design (চন্দন নকশা ও চন্দ্রবিন্দু) -->
      <g id="paku-chandan" fill="#ffffff">
        <!-- Top Central White Disc Nestled in Crescent -->
        <path id="paku-chandan-top-disc" d="M 49.81 42.5 L 49.44 42.58 L 49.15 42.83 L 48.85 42.92 L 48.41 43.33 L 48.19 43.66 L 47.89 44.49 L 47.89 45.24 L 48.11 45.74 L 48.11 45.99 L 48.78 46.82 L 49.07 47.07 L 50.19 47.32 L 51.15 46.98 L 51.89 46.24 L 52.11 45.82 L 52.19 45.41 L 52.19 44.41 L 52.11 43.99 L 51.81 43.41 L 51.22 42.83 L 51.07 42.83 L 50.78 42.58 L 50.41 42.5 Z" />

        <!-- Upward-Curving Crescent Moon Cradling Top Disc -->
        <path id="paku-chandan-crescent" d="M 56.26 44.16 L 55.96 43.5 L 55.89 44.66 L 55.67 45.49 L 55.37 46.24 L 55.22 46.4 L 55.15 46.74 L 54.48 47.81 L 53.22 49.14 L 52.7 49.48 L 52.56 49.48 L 52.41 49.64 L 51.96 49.72 L 51.52 49.97 L 51.07 49.97 L 50.63 50.14 L 49.3 50.14 L 48.93 49.97 L 48.48 49.97 L 47.3 49.39 L 46.33 48.64 L 45.74 47.98 L 45.3 47.32 L 44.63 46.07 L 44.56 45.74 L 44.33 45.41 L 44.19 44.66 L 44.19 43.58 L 43.96 43.66 L 43.96 43.91 L 43.74 44.33 L 43.67 44.99 L 43.74 46.9 L 43.96 47.48 L 43.96 47.9 L 44.7 49.56 L 45.89 50.97 L 46.48 51.47 L 46.63 51.47 L 46.85 51.72 L 47.52 52.05 L 47.74 52.05 L 47.89 52.22 L 48.41 52.3 L 48.93 52.55 L 49.74 52.63 L 51.37 52.55 L 52.48 52.22 L 52.63 52.05 L 52.85 52.05 L 53.15 51.8 L 53.44 51.72 L 53.67 51.47 L 53.81 51.47 L 55.07 50.14 L 55.52 49.48 L 56.04 48.23 L 56.33 46.98 L 56.41 46.32 L 56.41 45.07 Z" />

        <!-- Halo / Necklace of 13 Radiant Chandan Beads -->
        <g id="paku-chandan-necklace">
          <path id="chandan-dot-0" d="M 50.11 53.79 L 49.81 54.04 L 49.81 54.37 L 50.04 54.62 L 50.33 54.62 L 50.56 54.37 L 50.56 54.13 L 50.41 53.88 Z" />
          <path id="chandan-dot-1" d="M 52.56 53.63 L 52.33 53.63 L 52.04 53.88 L 52.11 54.21 L 52.41 54.37 L 52.7 54.21 L 52.78 53.88 Z" />
          <path id="chandan-dot-2" d="M 47.44 53.79 L 47.37 54.04 L 47.44 54.21 L 47.67 54.46 L 47.89 54.54 L 48.19 54.37 L 48.33 54.04 L 48.19 53.71 L 47.96 53.54 L 47.59 53.63 Z" />
          <path id="chandan-dot-3" d="M 54.56 52.88 L 54.26 52.96 L 54.04 53.3 L 54.33 53.63 L 54.48 53.63 L 54.78 53.38 L 54.85 53.13 Z" />
          <path id="chandan-dot-4" d="M 45.59 52.8 L 45.44 52.96 L 45.44 53.38 L 45.67 53.63 L 46.11 53.63 L 46.26 53.46 L 46.26 53.05 L 45.96 52.71 Z" />
          <path id="chandan-dot-5" d="M 55.81 51.3 L 55.52 51.8 L 55.81 52.22 L 56.04 52.22 L 56.41 51.88 L 56.41 51.55 L 56.18 51.3 Z" />
          <path id="chandan-dot-6" d="M 44.11 51.3 L 43.96 51.39 L 43.89 51.8 L 44.04 52.05 L 44.41 52.22 L 44.56 52.13 L 44.63 51.55 L 44.56 51.39 L 44.41 51.3 Z" />
          <path id="chandan-dot-7" d="M 57.15 49.31 L 56.93 49.48 L 56.85 49.64 L 56.85 49.97 L 57.07 50.22 L 57.37 50.22 L 57.59 49.97 L 57.67 49.64 L 57.44 49.31 Z" />
          <path id="chandan-dot-8" d="M 42.78 49.39 L 42.7 49.97 L 42.85 50.14 L 43.37 50.06 L 43.44 49.72 L 43.3 49.39 L 43.15 49.31 Z" />
          <path id="chandan-dot-9" d="M 57.74 46.82 L 57.44 47.15 L 57.44 47.48 L 57.67 47.73 L 57.89 47.73 L 58.18 47.48 L 58.26 47.15 L 58.18 46.98 L 57.96 46.82 Z" />
          <path id="chandan-dot-10" d="M 42.19 46.65 L 42.04 46.74 L 41.89 47.07 L 41.89 47.23 L 42.11 47.57 L 42.33 47.65 L 42.63 47.32 L 42.63 46.98 L 42.48 46.74 Z" />
          <path id="chandan-dot-11" d="M 42.11 44.66 L 41.89 44.74 L 41.89 45.16 L 42.11 45.16 L 42.26 44.99 L 42.26 44.83 Z" />
          <path id="chandan-dot-12" d="M 58.04 44.49 L 57.67 44.58 L 57.59 44.74 L 57.59 45.07 L 57.96 45.41 L 58.26 45.07 L 58.26 44.83 Z" />
        </g>

        <!-- Lower Central Bindi Disc (Centered between arched brows) -->
        <path id="paku-chandan-lower-bindi" d="M 49.59 56.28 L 49.22 56.53 L 48.85 57.03 L 48.7 57.53 L 48.7 58.03 L 48.85 58.53 L 49.15 58.94 L 49.52 59.19 L 49.81 59.27 L 50.48 59.27 L 50.78 59.19 L 51.07 58.94 L 51.44 58.44 L 51.52 58.11 L 51.52 57.45 L 51.37 56.95 L 51.07 56.53 L 50.7 56.28 L 50.26 56.2 Z" />
      </g>

      <!-- 2. Classical Devi Eyebrows & Continuous Nose Bridge Lines -->
      <g id="paku-eyebrows-and-nose" fill="#111111">
        <!-- Left Arched Brow & Continuous Nose Bridge Contour -->
        <path id="paku-nose-left" d="M 47.15 61.85 L 47.37 62.43 L 47.37 62.76 L 47.59 63.26 L 47.89 64.67 L 47.89 65.09 L 48.11 66.0 L 48.11 66.75 L 48.33 68.08 L 48.41 69.57 L 48.41 72.15 L 48.56 74.14 L 48.56 76.3 L 48.78 76.88 L 48.93 75.88 L 49.0 74.47 L 49.0 69.16 L 48.93 67.91 L 48.78 67.33 L 48.7 66.0 L 48.48 65.25 L 48.48 64.75 L 48.26 64.17 L 48.26 63.84 L 47.96 63.01 L 47.96 62.68 L 47.74 62.26 L 47.74 62.01 L 47.59 61.77 L 47.67 61.1 Z" />
        <path id="paku-brow-left" d="M 30.04 54.79 L 30.33 54.87 L 30.33 56.45 L 30.63 56.45 L 31.15 56.2 L 31.52 56.2 L 32.04 55.87 L 32.63 55.87 L 33.52 55.62 L 36.78 55.62 L 37.59 55.87 L 38.19 55.87 L 38.48 55.95 L 38.7 56.12 L 39.0 56.12 L 39.3 56.2 L 39.52 56.37 L 39.96 56.45 L 40.33 56.7 L 40.56 56.7 L 41.22 57.03 L 41.37 57.2 L 41.67 57.28 L 43.3 58.36 L 44.78 59.61 L 46.26 61.1 L 46.85 61.52 L 47.15 61.85 L 47.67 61.1 L 47.44 60.52 L 47.3 60.35 L 47.3 60.19 L 47.0 59.77 L 47.0 59.61 L 46.11 58.28 L 44.26 56.28 L 43.3 55.45 L 42.85 55.21 L 42.63 54.96 L 42.11 54.62 L 41.96 54.62 L 41.67 54.37 L 41.37 54.29 L 41.07 54.04 L 40.56 53.79 L 40.33 53.79 L 39.96 53.54 L 39.67 53.54 L 39.15 53.3 L 37.82 52.96 L 35.89 52.88 L 34.48 53.05 L 34.19 53.21 L 33.52 53.3 L 33.08 53.54 L 32.78 53.54 L 32.04 53.79 L 31.67 54.04 L 31.45 54.04 Z" />

        <!-- Right Arched Brow & Continuous Nose Bridge Contour -->
        <path id="paku-nose-right" d="M 52.63 61.18 L 52.63 61.68 L 52.48 61.93 L 52.48 62.18 L 52.26 62.68 L 52.26 63.09 L 52.04 63.68 L 51.96 64.42 L 51.81 64.75 L 51.74 65.83 L 51.52 66.66 L 51.52 67.66 L 51.3 69.32 L 51.3 75.38 L 51.37 76.38 L 51.52 76.88 L 51.67 76.46 L 51.67 74.39 L 51.96 67.83 L 52.11 67.33 L 52.11 66.66 L 52.19 66.08 L 52.41 65.34 L 52.41 64.84 L 52.63 64.26 L 52.63 63.84 L 52.93 62.84 L 53.0 61.85 Z" />
        <path id="paku-brow-right" d="M 69.89 54.46 L 69.44 54.29 L 69.07 54.04 L 68.7 53.96 L 68.55 53.79 L 68.11 53.71 L 67.67 53.46 L 67.22 53.46 L 66.7 53.21 L 65.37 52.96 L 62.41 52.96 L 61.81 53.21 L 61.44 53.21 L 61.07 53.3 L 60.63 53.54 L 60.33 53.54 L 59.96 53.79 L 59.74 53.79 L 59.37 54.04 L 59.0 54.13 L 58.11 54.62 L 57.89 54.87 L 57.74 54.87 L 57.52 55.12 L 56.93 55.45 L 56.63 55.79 L 56.33 55.95 L 55.44 56.78 L 54.48 57.86 L 53.52 59.27 L 53.44 59.52 L 53.22 59.77 L 53.22 59.94 L 53.0 60.19 L 52.78 60.69 L 52.63 61.18 L 53.0 61.85 L 53.37 61.43 L 53.67 61.35 L 54.26 60.85 L 55.59 59.52 L 56.26 58.94 L 56.48 58.86 L 57.0 58.36 L 57.15 58.36 L 57.37 58.11 L 59.07 57.03 L 59.44 56.95 L 59.74 56.7 L 59.96 56.7 L 60.33 56.45 L 60.85 56.37 L 61.07 56.2 L 61.67 56.12 L 62.26 55.87 L 63.89 55.62 L 65.89 55.62 L 67.59 55.95 L 68.11 56.2 L 68.55 56.2 L 68.92 56.37 L 69.59 56.45 L 69.67 54.46 Z" />

        <!-- Classical Sculpted Nostrils & Columella Base -->
        <path id="paku-nostril-base" d="M 46.26 78.95 L 46.26 79.37 L 46.41 79.7 L 46.93 80.28 L 47.3 80.53 L 47.74 80.62 L 47.96 80.78 L 48.63 80.86 L 49.44 81.69 L 50.78 81.69 L 51.22 81.45 L 51.44 81.11 L 51.81 80.78 L 52.19 80.78 L 53.07 80.53 L 53.22 80.37 L 53.37 80.37 L 53.89 79.78 L 54.04 79.45 L 54.04 78.95 L 53.67 78.12 L 53.52 78.04 L 53.37 78.87 L 53.22 79.12 L 52.78 79.54 L 51.3 79.87 L 51.0 80.37 L 50.63 80.7 L 50.41 80.78 L 49.89 80.78 L 49.67 80.7 L 49.07 79.95 L 47.81 79.62 L 47.3 79.29 L 46.85 78.62 L 46.78 78.04 L 46.56 78.21 Z" />
      </g>

      <!-- 3. Double Eyelid Creases (Parallel echoing lines) -->
      <g id="paku-eyelid-creases" fill="#111111">
        <path id="paku-crease-left" d="M 30.33 60.69 L 30.93 60.69 L 31.45 60.52 L 32.19 60.52 L 33.08 60.27 L 33.74 60.27 L 34.56 60.02 L 35.52 59.94 L 37.67 59.94 L 38.56 60.02 L 39.67 60.27 L 40.11 60.52 L 40.33 60.52 L 41.15 60.85 L 42.78 61.93 L 43.67 62.76 L 45.0 64.26 L 45.37 64.84 L 45.74 65.17 L 45.74 65.0 L 45.59 64.84 L 45.59 64.67 L 45.37 64.34 L 45.3 64.01 L 44.85 63.18 L 44.26 62.35 L 43.52 61.52 L 42.19 60.44 L 41.15 59.86 L 40.33 59.52 L 40.04 59.52 L 39.82 59.36 L 39.0 59.27 L 38.63 59.11 L 37.89 59.02 L 36.48 59.02 L 35.74 59.11 L 35.22 59.27 L 34.33 59.36 L 33.74 59.61 L 33.37 59.61 L 32.93 59.86 L 32.56 59.86 L 31.74 60.19 L 30.56 60.35 L 30.41 60.44 Z" />
        <path id="paku-crease-right" d="M 69.96 60.44 L 68.18 60.02 L 67.96 59.86 L 67.67 59.86 L 67.22 59.61 L 66.48 59.52 L 65.89 59.27 L 65.37 59.27 L 64.41 59.02 L 62.18 59.02 L 61.67 59.11 L 61.3 59.27 L 60.55 59.36 L 59.22 59.86 L 58.56 60.19 L 58.41 60.35 L 58.11 60.44 L 57.89 60.69 L 57.74 60.69 L 56.78 61.52 L 55.44 63.09 L 55.0 63.92 L 54.93 64.26 L 54.7 64.59 L 54.48 65.17 L 54.48 65.42 L 54.63 65.34 L 55.3 64.34 L 57.52 61.93 L 59.15 60.85 L 60.55 60.27 L 60.93 60.27 L 61.52 60.02 L 62.18 59.94 L 64.18 59.86 L 65.89 60.02 L 66.63 60.27 L 67.07 60.27 L 67.81 60.52 L 69.07 60.69 L 69.89 60.6 L 69.59 60.52 Z" />
      </g>

      <!-- 4. Eyes: white almond, iris clipped inside it, outline on top -->
      <g id="paku-eyes">
        <g id="paku-eye-left">
          <clipPath id="paku-eye-clip-left"><path d="M 30.33 64.34 L 30.48 64.42 L 30.85 64.42 L 31.3 64.59 L 33.3 64.67 L 33.82 64.84 L 35.15 64.92 L 36.5 65.02 L 38 65.2 L 39.5 65.6 L 40.7 66 L 41.59 66.25 L 42.04 66.5 L 42.48 66.58 L 42.78 66.83 L 43.0 66.83 L 43.22 67.08 L 43.52 67.16 L 43.89 67.41 L 44.41 67.91 L 44.56 67.91 L 45.15 68.41 L 45.15 68.66 L 44.85 68.91 L 44.19 68.99 L 44.04 69.16 L 43.52 69.24 L 43.15 69.49 L 42.85 69.49 L 42.41 69.74 L 41.59 69.82 L 41.22 69.99 L 39.37 69.99 L 38.78 69.82 L 37.59 69.74 L 37.0 69.49 L 36.63 69.49 L 36.19 69.24 L 35.67 69.16 L 34.56 68.66 L 34.26 68.41 L 34.11 68.41 L 33.22 67.83 L 33.0 67.58 L 32.78 67.5 L 31.3 66.17 L 30.33 65.09 Z" /></clipPath>
          <path id="paku-sclera-left" d="M 30.33 64.34 L 30.48 64.42 L 30.85 64.42 L 31.3 64.59 L 33.3 64.67 L 33.82 64.84 L 35.15 64.92 L 36.5 65.02 L 38 65.2 L 39.5 65.6 L 40.7 66 L 41.59 66.25 L 42.04 66.5 L 42.48 66.58 L 42.78 66.83 L 43.0 66.83 L 43.22 67.08 L 43.52 67.16 L 43.89 67.41 L 44.41 67.91 L 44.56 67.91 L 45.15 68.41 L 45.15 68.66 L 44.85 68.91 L 44.19 68.99 L 44.04 69.16 L 43.52 69.24 L 43.15 69.49 L 42.85 69.49 L 42.41 69.74 L 41.59 69.82 L 41.22 69.99 L 39.37 69.99 L 38.78 69.82 L 37.59 69.74 L 37.0 69.49 L 36.63 69.49 L 36.19 69.24 L 35.67 69.16 L 34.56 68.66 L 34.26 68.41 L 34.11 68.41 L 33.22 67.83 L 33.0 67.58 L 32.78 67.5 L 31.3 66.17 L 30.33 65.09 Z" fill="#ffffff" stroke="#ffffff" stroke-width="0.3" />
          <g clip-path="url(#paku-eye-clip-left)">
            <g id="pupil-left">
              <g class="paku-iris" id="paku-iris-left">
                <circle cx="38.3" cy="65.4" r="3.1" fill="#111111" />
                <circle cx="37.3" cy="66.30000000000001" r="0.7" fill="#ffffff" />
              </g>
            </g>
          </g>
          <g transform="translate(38.35 66.5) scale(0.72) translate(-38.35 -66.5)">
          <g id="spiral-left" class="paku-spiral-pupil" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round">
            <path d="M 38.35 66.50
                     C 38.75 66.10, 39.40 66.30, 39.50 66.85
                     C 39.65 67.65, 38.70 68.35, 37.85 68.15
                     C 36.65 67.85, 36.15 66.25, 36.65 65.10
                     C 37.30 63.60, 39.50 63.15, 40.95 64.00
                     C 42.60 64.95, 42.95 67.75, 41.70 69.45
                     C 40.85 70.60, 39.50 71.05, 38.20 70.95" />
          </g>
          </g>
          <path id="paku-eye-contour-left" d="M 30.33 62.76 L 30.33 64.34 L 30.48 64.42 L 30.85 64.42 L 31.3 64.59 L 33.3 64.67 L 33.82 64.84 L 35.15 64.92 L 36.5 65.02 L 38 65.2 L 39.5 65.6 L 40.7 66 L 41.59 66.25 L 42.04 66.5 L 42.48 66.58 L 42.78 66.83 L 43.0 66.83 L 43.22 67.08 L 43.52 67.16 L 43.89 67.41 L 44.41 67.91 L 44.56 67.91 L 45.15 68.41 L 45.15 68.66 L 44.85 68.91 L 44.19 68.99 L 44.04 69.16 L 43.52 69.24 L 43.15 69.49 L 42.85 69.49 L 42.41 69.74 L 41.59 69.82 L 41.22 69.99 L 39.37 69.99 L 38.78 69.82 L 37.59 69.74 L 37.0 69.49 L 36.63 69.49 L 36.19 69.24 L 35.67 69.16 L 34.56 68.66 L 34.26 68.41 L 34.11 68.41 L 33.22 67.83 L 33.0 67.58 L 32.78 67.5 L 31.3 66.17 L 30.33 65.09 L 30.26 67.0 L 30.04 67.0 L 30.56 67.41 L 31.08 67.99 L 32.26 68.99 L 32.48 69.07 L 32.7 69.32 L 32.85 69.32 L 33.08 69.57 L 33.59 69.9 L 33.74 69.9 L 34.04 70.15 L 35.07 70.65 L 35.52 70.73 L 35.89 70.98 L 36.19 70.98 L 36.7 71.23 L 38.41 71.56 L 40.48 71.56 L 41.15 71.48 L 41.52 71.31 L 42.26 71.23 L 42.78 70.98 L 43.07 70.98 L 43.52 70.73 L 44.63 70.4 L 46.19 69.57 L 46.56 69.24 L 46.7 68.91 L 46.26 67.91 L 45.3 66.75 L 44.63 66.17 L 43.89 65.67 L 43.59 65.59 L 43.44 65.42 L 42.78 65.09 L 42.41 65.0 L 42.26 64.84 L 41.82 64.75 L 41.37 64.51 L 41.07 64.51 L 40.56 64.26 L 39.89 64.17 L 39.67 64.01 L 39.22 63.92 L 38.63 63.92 L 37.37 63.68 L 36.48 63.68 L 35.67 63.43 L 35.15 63.43 L 34.33 63.18 L 32.63 63.09 L 31.96 62.93 L 31.0 62.93 L 30.56 62.76 Z" fill="#111111" />
        </g>
        <g id="paku-eye-right">
          <clipPath id="paku-eye-clip-right"><path d="M 69.59 65.59 L 68.26 66.83 L 67.89 67.08 L 67.52 67.5 L 66.78 68.08 L 66.55 68.16 L 66.33 68.41 L 66.18 68.41 L 66.04 68.57 L 65.74 68.66 L 65.44 68.91 L 65.07 68.99 L 64.7 69.24 L 64.41 69.24 L 63.96 69.49 L 63.3 69.57 L 63.0 69.74 L 61.59 69.9 L 59.37 69.9 L 58.18 69.74 L 57.96 69.57 L 57.37 69.49 L 56.93 69.24 L 56.48 69.16 L 56.33 68.99 L 55.89 68.91 L 55.67 68.74 L 55.44 68.74 L 55.22 68.49 L 55.22 68.33 L 57.0 66.83 L 57.89 66.5 L 58.26 66.25 L 58.63 66.25 L 58.78 66.08 L 59.0 66.08 L 60 65.85 L 61.5 65.4 L 63 65.15 L 64.2 65 L 65.15 64.92 L 65.52 64.84 L 66.55 64.84 L 67.15 64.67 L 68.04 64.59 L 69.0 64.59 L 69.44 64.42 L 69.89 64.42 L 69.59 64.34 Z" /></clipPath>
          <path id="paku-sclera-right" d="M 69.59 65.59 L 68.26 66.83 L 67.89 67.08 L 67.52 67.5 L 66.78 68.08 L 66.55 68.16 L 66.33 68.41 L 66.18 68.41 L 66.04 68.57 L 65.74 68.66 L 65.44 68.91 L 65.07 68.99 L 64.7 69.24 L 64.41 69.24 L 63.96 69.49 L 63.3 69.57 L 63.0 69.74 L 61.59 69.9 L 59.37 69.9 L 58.18 69.74 L 57.96 69.57 L 57.37 69.49 L 56.93 69.24 L 56.48 69.16 L 56.33 68.99 L 55.89 68.91 L 55.67 68.74 L 55.44 68.74 L 55.22 68.49 L 55.22 68.33 L 57.0 66.83 L 57.89 66.5 L 58.26 66.25 L 58.63 66.25 L 58.78 66.08 L 59.0 66.08 L 60 65.85 L 61.5 65.4 L 63 65.15 L 64.2 65 L 65.15 64.92 L 65.52 64.84 L 66.55 64.84 L 67.15 64.67 L 68.04 64.59 L 69.0 64.59 L 69.44 64.42 L 69.89 64.42 L 69.59 64.34 Z" fill="#ffffff" stroke="#ffffff" stroke-width="0.3" />
          <g clip-path="url(#paku-eye-clip-right)">
            <g id="pupil-right">
              <g class="paku-iris" id="paku-iris-right">
                <circle cx="62" cy="65.45" r="3.1" fill="#111111" />
                <circle cx="61" cy="66.35000000000001" r="0.7" fill="#ffffff" />
              </g>
            </g>
          </g>
          <g transform="translate(61.65 66.5) scale(0.72) translate(-61.65 -66.5)">
          <g id="spiral-right" class="paku-spiral-pupil" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round">
            <path d="M 61.65 66.50
                     C 62.05 66.10, 62.70 66.30, 62.80 66.85
                     C 62.95 67.65, 62.00 68.35, 61.15 68.15
                     C 59.95 67.85, 59.45 66.25, 59.95 65.10
                     C 60.60 63.60, 62.80 63.15, 64.25 64.00
                     C 65.90 64.95, 66.25 67.75, 65.00 69.45
                     C 64.15 70.60, 62.80 71.05, 61.50 70.95" />
          </g>
          </g>
          <path id="paku-eye-contour-right" d="M 69.59 62.84 L 69.07 62.84 L 68.18 63.09 L 66.7 63.18 L 65.3 63.43 L 64.33 63.43 L 62.63 63.68 L 61.52 63.68 L 61.07 63.76 L 60.78 63.92 L 60.04 64.01 L 59.81 64.17 L 59.3 64.26 L 58.33 64.59 L 56.78 65.34 L 55.22 66.5 L 54.7 67.16 L 54.48 67.33 L 54.18 67.91 L 53.96 68.16 L 53.67 68.82 L 53.74 68.99 L 54.11 69.32 L 55.07 69.9 L 56.78 70.65 L 57.3 70.73 L 57.67 70.98 L 57.96 70.98 L 58.41 71.23 L 59.67 71.48 L 62.18 71.48 L 63.59 71.23 L 64.11 70.98 L 64.41 70.98 L 64.78 70.73 L 65.0 70.73 L 65.37 70.48 L 65.74 70.4 L 66.04 70.15 L 66.18 70.15 L 66.48 69.9 L 67.22 69.57 L 68.48 68.74 L 69.67 67.74 L 69.96 67.41 L 69.59 67.33 L 69.59 65.59 L 68.26 66.83 L 67.89 67.08 L 67.52 67.5 L 66.78 68.08 L 66.55 68.16 L 66.33 68.41 L 66.18 68.41 L 66.04 68.57 L 65.74 68.66 L 65.44 68.91 L 65.07 68.99 L 64.7 69.24 L 64.41 69.24 L 63.96 69.49 L 63.3 69.57 L 63.0 69.74 L 61.59 69.9 L 59.37 69.9 L 58.18 69.74 L 57.96 69.57 L 57.37 69.49 L 56.93 69.24 L 56.48 69.16 L 56.33 68.99 L 55.89 68.91 L 55.67 68.74 L 55.44 68.74 L 55.22 68.49 L 55.22 68.33 L 57.0 66.83 L 57.89 66.5 L 58.26 66.25 L 58.63 66.25 L 58.78 66.08 L 59.0 66.08 L 60 65.85 L 61.5 65.4 L 63 65.15 L 64.2 65 L 65.15 64.92 L 65.52 64.84 L 66.55 64.84 L 67.15 64.67 L 68.04 64.59 L 69.0 64.59 L 69.44 64.42 L 69.89 64.42 L 69.59 64.34 Z" fill="#111111" />
        </g>
        <!-- Closed eyes while asleep -->
        <g id="paku-eyes-closed" fill="none" stroke="#111111" stroke-width="1.3" stroke-linecap="round">
          <path d="M 30.4 64.8 C 34 68.8, 40 70.6, 46.3 68.6" />
          <path d="M 33.5 67.6 L 32.4 69.2 M 37 69.2 L 36.4 71 M 41 69.6 L 41 71.4" stroke-width="0.8" />
          <path d="M 69.6 64.8 C 66 68.8, 60 70.6, 53.7 68.6" />
          <path d="M 66.5 67.6 L 67.6 69.2 M 63 69.2 L 63.6 71 M 59 69.6 L 59 71.4" stroke-width="0.8" />
        </g>
      </g>

      <!-- 6. Sculpted Devi Lips (Defined Cupid's Bow + Voluptuous Crescent) -->
      <g id="paku-mouth" fill="#111111">
      <g id="paku-lips">
        <!-- Upper Lip with Defined Sculpted Cupid's Bow -->
        <path id="paku-lip-upper" d="M 56.78 85.1 L 56.7 84.85 L 56.11 84.85 L 55.74 85.02 L 54.48 85.02 L 54.18 84.85 L 53.81 84.85 L 53.52 84.77 L 53.3 84.6 L 52.19 84.35 L 51.3 84.6 L 50.48 85.18 L 50.04 85.18 L 49.81 85.1 L 49.52 84.85 L 49.37 84.85 L 49.07 84.6 L 48.63 84.44 L 47.74 84.52 L 47.44 84.6 L 47.22 84.77 L 46.63 84.85 L 46.04 85.1 L 44.78 85.1 L 44.33 84.93 L 43.89 84.93 L 43.89 85.1 L 44.26 85.51 L 45.59 86.1 L 46.93 86.35 L 48.04 86.43 L 48.41 86.59 L 49.3 86.68 L 51.07 86.68 L 52.11 86.59 L 53.22 86.35 L 53.89 86.35 L 54.56 86.1 L 54.93 86.1 L 55.37 85.85 L 55.81 85.76 L 55.96 85.6 L 56.33 85.51 Z" />

        <!-- Voluptuous Crescent Lower Lip (Separated by wood skin gap) -->
        <path id="paku-lip-lower" d="M 53.67 87.92 L 53.67 87.59 L 53.52 87.51 L 52.93 87.59 L 52.26 87.84 L 50.93 88.01 L 49.74 88.01 L 48.11 87.84 L 47.44 87.59 L 46.78 87.67 L 46.93 88.01 L 47.37 88.5 L 47.59 88.59 L 47.81 88.84 L 48.26 89.09 L 48.78 89.17 L 49.0 89.33 L 49.37 89.42 L 51.15 89.42 L 52.26 89.09 L 52.56 88.84 L 52.7 88.84 L 53.37 88.34 Z" />
      </g>
        <path class="paku-mouth-alt paku-mouth-happy" d="M 43.4 84.2 C 46 85.6, 48.4 85.2, 50 85.7 C 51.6 85.2, 54 85.6, 56.9 84.2 C 56 88.4, 53 90.2, 50 90.2 C 47 90.2, 44.2 88.4, 43.4 84.2 Z" />
        <path class="paku-mouth-alt paku-mouth-worried" d="M 44.6 88.3 C 46.6 85.9, 53.6 85.9, 55.6 88.3 C 53.4 87.2, 46.8 87.2, 44.6 88.3 Z" />
        <path class="paku-mouth-alt paku-mouth-smug" d="M 44.8 87 C 47.6 87.7, 52.4 87.3, 56.6 84.4 C 55.8 87.6, 52.6 89.2, 49.4 89 C 47.4 88.9, 45.8 88.1, 44.8 87 Z" />
        <ellipse class="paku-mouth-alt paku-mouth-alarmed" cx="50" cy="87.2" rx="2.7" ry="3.2" />
        <path class="paku-mouth-alt paku-mouth-dizzy" d="M 44 87 q 1.5 -2 3 0 t 3 0 t 3 0 t 3 0" fill="none" stroke="#111111" stroke-width="1.1" stroke-linecap="round" />
      </g>
    </g>
    </g> <!-- /#paku-hull -->

    <!-- ======================================================= -->
    <!-- 5. <g id="living-thread">: Interactive Arm / Limb       -->
    <!-- ======================================================= -->
    <!-- An SVG <path> with stroke-width="2.4" stroke-linecap="round" fill="none" -->
    <!-- Red for Light Mode, Yellow for Dark Mode via CSS -->
    <g id="living-thread">
      <!-- Anchored cleanly to the central thread crossing joint (50, 140.5), sweeping out the right side -->
      <path id="living-thread-arm"
        d="M 50 140.5
           C 57 140.5, 64 135, 70 136
           C 78 138, 84 148, 80 158
           C 76 168, 79 176, 86 175
           C 91 173, 93 166, 90 161"
        stroke="#BD3A54"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none" />

      <!-- Interactive Thread Pointer Tip -->
      <circle id="living-thread-tip" cx="90" cy="161" r="1.6" fill="#BD3A54" />

      <!-- Sleepy "Z Z Z" Floating Snore Indicator -->
      <g id="living-thread-zzz" class="paku-thread-zzz">
        <text class="zzz-glyph zzz-1" x="91" y="157" font-size="7" font-family="'GaramondHalhed', 'Purno', Georgia, serif" font-weight="bold" font-style="italic">z</text>
        <text class="zzz-glyph zzz-2" x="95" y="148" font-size="9" font-family="'GaramondHalhed', 'Purno', Georgia, serif" font-weight="bold" font-style="italic">Z</text>
        <text class="zzz-glyph zzz-3" x="99" y="138" font-size="11" font-family="'GaramondHalhed', 'Purno', Georgia, serif" font-weight="bold" font-style="italic">Z</text>
      </g>

      <!-- Draggable Hit Area for Beyblade Thread Pull -->
      <path id="living-thread-hitarea"
        d="M 50 140.5
           C 57 140.5, 64 135, 70 136
           C 78 138, 84 148, 80 158
           C 76 168, 79 176, 86 175
           C 91 173, 93 166, 90 161"
        stroke="transparent"
        stroke-width="22"
        stroke-linecap="round"
        fill="none"
        style="cursor: grab; pointer-events: stroke;" />
      <circle id="living-thread-hitarea-tip" cx="90" cy="161" r="14" fill="transparent" style="cursor: grab; pointer-events: all;" />
    </g>

  </g>
</svg
  </g>
</svg>`;

  // 4. BACK FACE: Solid polished teak hardwood and metal brass caps at Z = -6px (No eyes, no cavity)
  const PAKU_BACK_SVG_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 240" width="100%" height="100%" aria-label="সারু (Saru) — The Loom Shuttle Back Face">
  <!-- =================================================== -->
  <!-- 1. <defs> LAYER: Wood Shading, Brass & Luster Gradients -->
  <!-- =================================================== -->
  <defs>
    <!-- Warm Chestnut / Teak Wood Base Gradient -->
    <linearGradient id="paku-back-wood-fill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#693b1b" />
      <stop offset="10%" stop-color="#8a5328" />
      <stop offset="42%" stop-color="#ad7444" />
      <stop offset="55%" stop-color="#b67c4a" />
      <stop offset="88%" stop-color="#8a5328" />
      <stop offset="100%" stop-color="#5e3417" />
    </linearGradient>

    <!-- Wood Lateral Cylindrical Shadow Overlay -->
    <linearGradient id="paku-back-wood-shading" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a1205" stop-opacity="0.65" />
      <stop offset="12%" stop-color="#2a1205" stop-opacity="0" />
      <stop offset="88%" stop-color="#2a1205" stop-opacity="0" />
      <stop offset="100%" stop-color="#2a1205" stop-opacity="0.70" />
    </linearGradient>

    <!-- Polished Hardwood Centerline Sheen Highlight -->
    <linearGradient id="paku-back-wood-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="44%" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="56%" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>

    <!-- Antique Brass Conical Tip Gradient -->
    <linearGradient id="paku-back-brass-cap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#73541e" />
      <stop offset="18%" stop-color="#a68035" />
      <stop offset="45%" stop-color="#fae395" />
      <stop offset="60%" stop-color="#d6b052" />
      <stop offset="85%" stop-color="#a68035" />
      <stop offset="100%" stop-color="#634718" />
    </linearGradient>
  </defs>

  <!-- Root Container for Reverse Shuttle -->
  <g id="paku-body-back">
    <g id="paku-hull-back">
      <!-- Main Solid Canoe Hull: Symmetrical slender canoe hull spanning y=10 to y=230 -->
      <path id="paku-wood-body-back"
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 28 44, 21 54, 21 78
           C 20 95, 20 145, 21 162
           C 21 186, 28 196, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 72 196, 79 186, 79 162
           C 80 145, 80 95, 79 78
           C 79 54, 72 44, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-back-wood-fill)"
        stroke="#1a1008"
        stroke-width="1.6" />

      <!-- Outer Contour Lateral Shading Overlay -->
      <path
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 28 44, 21 54, 21 78
           C 20 95, 20 145, 21 162
           C 21 186, 28 196, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 72 196, 79 186, 79 162
           C 80 145, 80 95, 79 78
           C 79 54, 72 44, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-back-wood-shading)" />

      <!-- Continuous Full-Length Artisanal Wood Grain (Solid Teak, uninterrupted across whole height) -->
      <g id="paku-back-wood-grain" stroke="#48250f" stroke-width="0.75" stroke-linecap="round" fill="none">
        <!-- Flank Contour Grain Lines -->
        <path d="M 34 44 C 27 65, 26 100, 25 120 C 24 140, 26 175, 34 198" opacity="0.85" />
        <path d="M 66 44 C 73 65, 74 100, 75 120 C 76 140, 74 175, 66 198" opacity="0.85" />

        <!-- Mid-Body Flowing Grain Strands -->
        <path d="M 39 48 C 34 72, 33 110, 33 120 C 33 130, 35 168, 40 194" opacity="0.7" />
        <path d="M 61 48 C 66 72, 67 110, 67 120 C 67 130, 65 168, 60 194" opacity="0.7" />

        <!-- Inner Subtle Heartwood Grain Lines -->
        <path d="M 44 54 C 41 80, 40 112, 40 120 C 40 128, 42 160, 45 188" opacity="0.6" />
        <path d="M 56 54 C 59 80, 60 112, 60 120 C 60 128, 58 160, 55 188" opacity="0.6" />

        <!-- Center Spine Soft Grain Veins -->
        <path d="M 48 60 C 47 88, 47 115, 47.5 120 C 48 125, 48 152, 48.5 182" opacity="0.45" />
        <path d="M 52 60 C 53 88, 53 115, 52.5 120 C 52 125, 52 152, 51.5 182" opacity="0.45" />
        <path d="M 50 42 L 50 56" opacity="0.5" />
        <path d="M 50 184 L 50 198" opacity="0.5" />
      </g>

      <!-- Polished Curved Hardwood Centerline Sheen / Luster -->
      <path
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 28 44, 21 54, 21 78
           C 20 95, 20 145, 21 162
           C 21 186, 28 196, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 72 196, 79 186, 79 162
           C 80 145, 80 95, 79 78
           C 79 54, 72 44, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-back-wood-sheen)" />

      <!-- Top Brass Conical Cap (y=10 to y=37, identical mirror to front) -->
      <g id="paku-metal-tip-top-back">
        <path
          d="M 50 10
             C 43 18, 36 27, 33.5 37
             C 39 39.5, 61 39.5, 66.5 37
             C 64 27, 57 18, 50 10 Z"
          fill="url(#paku-back-brass-cap)"
          stroke="#1a1008"
          stroke-width="1.6" />
        <!-- Specular Highlight Ridge -->
        <path d="M 50 11 L 47 38 L 53 38 Z" fill="#ffffff" opacity="0.25" />
        <!-- Rivets (3 distinct brass pins matching front) -->
        <circle cx="41" cy="32.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="50" cy="34.0" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="59" cy="32.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
      </g>

      <!-- Bottom Brass Conical Cap (y=203 to y=230, identical mirror to front) -->
      <g id="paku-metal-tip-bottom-back">
        <path
          d="M 33.5 203
             C 39 200.5, 61 200.5, 66.5 203
             C 64 213, 57 222, 50 230
             C 43 222, 36 213, 33.5 203 Z"
          fill="url(#paku-back-brass-cap)"
          stroke="#1a1008"
          stroke-width="1.6" />
        <!-- Specular Highlight Ridge -->
        <path d="M 47 202 L 53 202 L 50 229 Z" fill="#ffffff" opacity="0.25" />
        <!-- Rivets (3 distinct brass pins matching front) -->
        <circle cx="41" cy="207.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="50" cy="206.0" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
        <circle cx="59" cy="207.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
      </g>
    </g>
  </g>
</svg>`;

  // 5. SIDE FACE: Slender teak profile with delivery eyelet at 90deg / 270deg
  const PAKU_SIDE_SVG_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 240" width="100%" height="100%" aria-label="সারু (Saru) — The Loom Shuttle Side Profile">
  <!-- =================================================== -->
  <!-- 1. <defs> LAYER: Wood Shading, Brass & Eyelet Gradients -->
  <!-- =================================================== -->
  <defs>
    <!-- Warm Chestnut / Teak Wood Base Gradient for Slender Profile -->
    <linearGradient id="paku-side-wood-fill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5e3417" />
      <stop offset="15%" stop-color="#8a5328" />
      <stop offset="50%" stop-color="#b67c4a" />
      <stop offset="85%" stop-color="#8a5328" />
      <stop offset="100%" stop-color="#5e3417" />
    </linearGradient>

    <!-- Lateral Cylindrical Shadow Overlay -->
    <linearGradient id="paku-side-wood-shading" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a1205" stop-opacity="0.75" />
      <stop offset="18%" stop-color="#2a1205" stop-opacity="0" />
      <stop offset="82%" stop-color="#2a1205" stop-opacity="0" />
      <stop offset="100%" stop-color="#2a1205" stop-opacity="0.75" />
    </linearGradient>

    <!-- Polished Hardwood Centerline Sheen Highlight -->
    <linearGradient id="paku-side-wood-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="42%" stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.22" />
      <stop offset="58%" stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>

    <!-- Antique Brass Conical Tip Gradient -->
    <linearGradient id="paku-side-brass-cap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#73541e" />
      <stop offset="18%" stop-color="#a68035" />
      <stop offset="48%" stop-color="#fae395" />
      <stop offset="60%" stop-color="#d6b052" />
      <stop offset="85%" stop-color="#a68035" />
      <stop offset="100%" stop-color="#634718" />
    </linearGradient>

    <!-- Eyelet Metal Rim Gradient -->
    <radialGradient id="paku-side-eyelet-rim" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fae395" />
      <stop offset="50%" stop-color="#d6b052" />
      <stop offset="85%" stop-color="#8c6428" />
      <stop offset="100%" stop-color="#543c16" />
    </radialGradient>
  </defs>

  <!-- Root Container for Side Profile Shuttle -->
  <g id="paku-body-side">
    <g id="paku-hull-side">
      <!-- Slender Lateral Hull: Slimmer boat silhouette tapering from x=34 to x=66 (width=32px) -->
      <path id="paku-wood-body-side"
        d="M 50 10
           C 46 18, 41 27, 39 37
           C 37 55, 34 85, 34 120
           C 34 155, 37 185, 39 203
           C 41 213, 46 222, 50 230
           C 54 222, 59 213, 61 203
           C 63 185, 66 155, 66 120
           C 66 85, 63 55, 61 37
           C 59 27, 54 18, 50 10 Z"
        fill="url(#paku-side-wood-fill)"
        stroke="#1a1008"
        stroke-width="1.6" />

      <!-- Outer Contour Lateral Shading Overlay -->
      <path
        d="M 50 10
           C 46 18, 41 27, 39 37
           C 37 55, 34 85, 34 120
           C 34 155, 37 185, 39 203
           C 41 213, 46 222, 50 230
           C 54 222, 59 213, 61 203
           C 63 185, 66 155, 66 120
           C 66 85, 63 55, 61 37
           C 59 27, 54 18, 50 10 Z"
        fill="url(#paku-side-wood-shading)" />

      <!-- Artisanal Longitudinal Side Wood Grain Strands -->
      <g id="paku-side-wood-grain" stroke="#48250f" stroke-width="0.75" stroke-linecap="round" fill="none">
        <path d="M 40 44 C 36 65, 35 95, 35 120 C 35 145, 36 175, 40 198" opacity="0.8" />
        <path d="M 60 44 C 64 65, 65 95, 65 120 C 65 145, 64 175, 60 198" opacity="0.8" />
        <path d="M 44 48 C 42 75, 41 100, 41 120 C 41 140, 42 165, 44 194" opacity="0.65" />
        <path d="M 56 48 C 58 75, 59 100, 59 120 C 59 140, 58 165, 56 194" opacity="0.65" />
        <path d="M 47 54 C 46 80, 46 105, 46 120 C 46 135, 46 160, 47 188" opacity="0.5" />
        <path d="M 53 54 C 54 80, 54 105, 54 120 C 54 135, 54 160, 53 188" opacity="0.5" />
        <path d="M 50 42 L 50 56" opacity="0.45" />
        <path d="M 50 184 L 50 198" opacity="0.45" />
      </g>

      <!-- Centerline Luster Highlight -->
      <path
        d="M 50 10
           C 46 18, 41 27, 39 37
           C 37 55, 34 85, 34 120
           C 34 155, 37 185, 39 203
           C 41 213, 46 222, 50 230
           C 54 222, 59 213, 61 203
           C 63 185, 66 155, 66 120
           C 66 85, 63 55, 61 37
           C 59 27, 54 18, 50 10 Z"
        fill="url(#paku-side-wood-sheen)" />

      <!-- Top Brass Conical Cap (Side Profile, y=10 to y=37) -->
      <g id="paku-metal-tip-top-side">
        <path
          d="M 50 10
             C 46 18, 41 27, 39 37
             C 43 38.8, 57 38.8, 61 37
             C 59 27, 54 18, 50 10 Z"
          fill="url(#paku-side-brass-cap)"
          stroke="#1a1008"
          stroke-width="1.6" />
        <!-- Specular Highlight Ridge -->
        <path d="M 50 11 L 48 38 L 52 38 Z" fill="#ffffff" opacity="0.28" />
        <!-- Center Pin Rivet -->
        <circle cx="50" cy="33.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
      </g>

      <!-- Bottom Brass Conical Cap (Side Profile, y=203 to y=230) -->
      <g id="paku-metal-tip-bottom-side">
        <path
          d="M 39 203
             C 43 201.2, 57 201.2, 61 203
             C 59 213, 54 222, 50 230
             C 46 222, 41 213, 39 203 Z"
          fill="url(#paku-side-brass-cap)"
          stroke="#1a1008"
          stroke-width="1.6" />
        <!-- Specular Highlight Ridge -->
        <path d="M 48 202 L 52 202 L 50 229 Z" fill="#ffffff" opacity="0.28" />
        <!-- Center Pin Rivet -->
        <circle cx="50" cy="206.5" r="1.1" fill="#edd690" stroke="#1a1008" stroke-width="0.8" />
      </g>

      <!-- Authentic Loom Shuttle Thread Delivery Eyelet (সুতার ছিদ্র) at y=140.5 -->
      <g id="paku-side-eyelet">
        <!-- Outer carved recess bevel -->
        <circle cx="50" cy="140.5" r="5" fill="#3d1d0c" stroke="#1a1008" stroke-width="0.9" />
        <!-- Polished brass eyelet grommet -->
        <circle cx="50" cy="140.5" r="3.8" fill="url(#paku-side-eyelet-rim)" stroke="#1a1008" stroke-width="0.7" />
        <!-- Interior cavity hole -->
        <circle cx="50" cy="140.5" r="2.1" fill="#120803" stroke="#050201" stroke-width="0.5" />
        <!-- Brass glint highlight -->
        <circle cx="48.8" cy="139.3" r="0.8" fill="#ffffff" opacity="0.65" />
      </g>
    </g>
  </g>
</svg>`;

  class SaruAssistant extends HTMLElement {
    constructor() {
      super();
      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.currentDrag = { x: 0, y: 0 };
      this.dragScale = 1;
      this.wasDragAction = false;
      this.speechTimer = null;
      this.idleTimer = null;
      this.blinkTimer = null;
      this.spinRaf = null;
      this.dizzyTimeout = null;
      this.throwFrame = null;
      this.throwLine = null;
      this.isMinimised = false;
      this.modalReturnFocus = null;
      this.speechDuration = 0;
      this.faceTimer = null;
      this.talkTimer = null;
      this.glanceTimer = null;
      this.sequenceTimeouts = [];
      this.isModalOpen = false;
      this.modalIdleInterval = null;
      this.touchHoldTimer = null;
      this.lastUserActivity = performance.now();
      this.inquiryType = 'question';
    }

    connectedCallback() {
      this.render();
      this.applyMinimised(readStore('localStorage', KEYS.minimised) === '1');
      this.initSvgElements();
      this.setupBlinkTimer();
      this.setupGazeTracking();
      this.setupThreadPull();
      this.setupClickInteraction();
      this.setupSpeechBubble();
      this.setupInquiryModal();
      this.setupIdleTimer();
      this.setupAppHooks();
      this.setupInitialGreeting();
    }

    disconnectedCallback() {
      if (this.speechTimer) clearTimeout(this.speechTimer);
      if (this.idleTimer) clearTimeout(this.idleTimer);
      if (this.blinkTimer) clearTimeout(this.blinkTimer);
      if (this.faceTimer) clearTimeout(this.faceTimer);
      if (this.talkTimer) clearTimeout(this.talkTimer);
      if (this.glanceTimer) clearTimeout(this.glanceTimer);
      if (this.spinRaf) cancelAnimationFrame(this.spinRaf);
      if (this.dizzyTimeout) clearTimeout(this.dizzyTimeout);
      if (this.touchHoldTimer) clearTimeout(this.touchHoldTimer);
      if (this.modalIdleInterval) clearInterval(this.modalIdleInterval);
      this.clearSequenceTimeouts();
      this.cancelThrow();
      this.classList.remove('paku-sleeping');
    }

    render() {
      this.innerHTML = `
        <div class="paku-container" id="paku-container">
          <!-- Mascot Shuttle Wrapper with 3D Perspective Stage -->
          <div class="paku-mascot-wrapper" id="paku-mascot-wrapper" role="button" tabindex="0" aria-label="${LINES.mascotLabel}" title="সারু: মঞ্চাইছে “অ-এআই” সহকারী">
            <div class="paku-reactor" id="paku-reactor">
            <div class="paku-stage" id="paku-stage">
              <div id="paku-shuttle-wrapper" class="paku-shuttle-3d">
                <!-- LAYER 1: Recessed Cavity Floor (Back wall of chamber, Z = -5.5px) -->
                <div class="paku-face paku-cavity-floor" id="paku-cavity-floor">
                  ${PAKU_CAVITY_FLOOR_SVG_TEMPLATE}
                </div>

                <!-- LAYER 2: Floating Spool & Living Thread (Z = 0px) -->
                <div class="paku-face paku-spool-layer" id="paku-spool-layer">
                  ${PAKU_SPOOL_SVG_TEMPLATE}
                </div>

                <!-- LAYER 3: FRONT SHELL: Cutout Window, Beveled Rim, Devi Face, Eyes, Brass Caps (Z = +6px) -->
                <div class="paku-face paku-face-front" id="paku-face-front">
                  ${PAKU_FRONT_SVG_TEMPLATE}
                </div>

                <!-- LAYER 4: BACK FACE: Solid polished teak hardwood and metal brass caps (Z = -6px, rotateY(180deg)) -->
                <div class="paku-face paku-face-back" id="paku-face-back">
                  ${PAKU_BACK_SVG_TEMPLATE}
                </div>

                <!-- LAYER 5: RIGHT SIDE PROFILE: Slender teak profile with delivery eyelet (rotateY(90deg)) -->
                <div class="paku-face paku-face-right" id="paku-face-right">
                  ${PAKU_SIDE_SVG_TEMPLATE}
                </div>

                <!-- LAYER 6: LEFT SIDE PROFILE: Mirrored side profile (rotateY(270deg)) -->
                <div class="paku-face paku-face-left" id="paku-face-left">
                  ${PAKU_SIDE_SVG_TEMPLATE}
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- 18th-century Lal Khata Torn Paper Speech Bubble -->
          <div class="paku-speech-bubble" id="paku-speech-bubble">
            <button type="button" class="paku-speech-close" id="paku-speech-close" title="বন্ধ করুন" aria-label="Close">&times;</button>
            <span class="paku-speech-text" id="paku-speech-text" role="status" aria-live="polite"></span>
            <div class="paku-speech-actions" id="paku-speech-actions" hidden>
              <button type="button" class="paku-speech-action" data-action="question">প্রশ্ন করুন</button>
              <button type="button" class="paku-speech-action" data-action="recommendation">পরামর্শ দিন</button>
              <button type="button" class="paku-speech-action paku-speech-action-quiet" data-action="minimise">লুকিয়ে থাকো</button>
            </div>
          </div>

          <!-- Saru Inquiry & Recommendation Modal ("সারুর দপ্তর") -->
          <div class="paku-modal-overlay" id="paku-modal-overlay"></div>
          <div class="paku-modal-container" id="paku-ask-modal" inert role="dialog" aria-modal="true" aria-labelledby="paku-modal-title">
            <div class="paku-modal-header">
              <div class="paku-modal-title-group">
                <div class="paku-modal-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="21 41 58 50" width="100%" height="100%" fill="currentColor" fill-rule="evenodd">
                    <g id="paku-icon-chandan">
                      <path d="M 49.81 42.5 L 49.44 42.58 L 49.15 42.83 L 48.85 42.92 L 48.41 43.33 L 48.19 43.66 L 47.89 44.49 L 47.89 45.24 L 48.11 45.74 L 48.11 45.99 L 48.78 46.82 L 49.07 47.07 L 50.19 47.32 L 51.15 46.98 L 51.89 46.24 L 52.11 45.82 L 52.19 45.41 L 52.19 44.41 L 52.11 43.99 L 51.81 43.41 L 51.22 42.83 L 51.07 42.83 L 50.78 42.58 L 50.41 42.5 Z" />
                      <path d="M 56.26 44.16 L 55.96 43.5 L 55.89 44.66 L 55.67 45.49 L 55.37 46.24 L 55.22 46.4 L 55.15 46.74 L 54.48 47.81 L 53.22 49.14 L 52.7 49.48 L 52.56 49.48 L 52.41 49.64 L 51.96 49.72 L 51.52 49.97 L 51.07 49.97 L 50.63 50.14 L 49.3 50.14 L 48.93 49.97 L 48.48 49.97 L 47.3 49.39 L 46.33 48.64 L 45.74 47.98 L 45.3 47.32 L 44.63 46.07 L 44.56 45.74 L 44.33 45.41 L 44.19 44.66 L 44.19 43.58 L 43.96 43.66 L 43.96 43.91 L 43.74 44.33 L 43.67 44.99 L 43.74 46.9 L 43.96 47.48 L 43.96 47.9 L 44.7 49.56 L 45.89 50.97 L 46.48 51.47 L 46.63 51.47 L 46.85 51.72 L 47.52 52.05 L 47.74 52.05 L 47.89 52.22 L 48.41 52.3 L 48.93 52.55 L 49.74 52.63 L 51.37 52.55 L 52.48 52.22 L 52.63 52.05 L 52.85 52.05 L 53.15 51.8 L 53.44 51.72 L 53.67 51.47 L 53.81 51.47 L 55.07 50.14 L 55.52 49.48 L 56.04 48.23 L 56.33 46.98 L 56.41 46.32 L 56.41 45.07 Z" />
                      <g>
                        <path d="M 50.11 53.79 L 49.81 54.04 L 49.81 54.37 L 50.04 54.62 L 50.33 54.62 L 50.56 54.37 L 50.56 54.13 L 50.41 53.88 Z" />
                        <path d="M 52.56 53.63 L 52.33 53.63 L 52.04 53.88 L 52.11 54.21 L 52.41 54.37 L 52.7 54.21 L 52.78 53.88 Z" />
                        <path d="M 47.44 53.79 L 47.37 54.04 L 47.44 54.21 L 47.67 54.46 L 47.89 54.54 L 48.19 54.37 L 48.33 54.04 L 48.19 53.71 L 47.96 53.54 L 47.59 53.63 Z" />
                        <path d="M 54.56 52.88 L 54.26 52.96 L 54.04 53.3 L 54.33 53.63 L 54.48 53.63 L 54.78 53.38 L 54.85 53.13 Z" />
                        <path d="M 45.59 52.8 L 45.44 52.96 L 45.44 53.38 L 45.67 53.63 L 46.11 53.63 L 46.26 53.46 L 46.26 53.05 L 45.96 52.71 Z" />
                        <path d="M 55.81 51.3 L 55.52 51.8 L 55.81 52.22 L 56.04 52.22 L 56.41 51.88 L 56.41 51.55 L 56.18 51.3 Z" />
                        <path d="M 44.11 51.3 L 43.96 51.39 L 43.89 51.8 L 44.04 52.05 L 44.41 52.22 L 44.56 52.13 L 44.63 51.55 L 44.56 51.39 L 44.41 51.3 Z" />
                        <path d="M 57.15 49.31 L 56.93 49.48 L 56.85 49.64 L 56.85 49.97 L 57.07 50.22 L 57.37 50.22 L 57.59 49.97 L 57.67 49.64 L 57.44 49.31 Z" />
                        <path d="M 42.78 49.39 L 42.7 49.97 L 42.85 50.14 L 43.37 50.06 L 43.44 49.72 L 43.3 49.39 L 43.15 49.31 Z" />
                        <path d="M 57.74 46.82 L 57.44 47.15 L 57.44 47.48 L 57.67 47.73 L 57.89 47.73 L 58.18 47.48 L 58.26 47.15 L 58.18 46.98 L 57.96 46.82 Z" />
                        <path d="M 42.19 46.65 L 42.04 46.74 L 41.89 47.07 L 41.89 47.23 L 42.11 47.57 L 42.33 47.65 L 42.63 47.32 L 42.63 46.98 L 42.48 46.74 Z" />
                        <path d="M 42.11 44.66 L 41.89 44.74 L 41.89 45.16 L 42.11 45.16 L 42.26 44.99 L 42.26 44.83 Z" />
                        <path d="M 58.04 44.49 L 57.67 44.58 L 57.59 44.74 L 57.59 45.07 L 57.96 45.41 L 58.26 45.07 L 58.26 44.83 Z" />
                      </g>
                      <path d="M 49.59 56.28 L 49.22 56.53 L 48.85 57.03 L 48.7 57.53 L 48.7 58.03 L 48.85 58.53 L 49.15 58.94 L 49.52 59.19 L 49.81 59.27 L 50.48 59.27 L 50.78 59.19 L 51.07 58.94 L 51.44 58.44 L 51.52 58.11 L 51.52 57.45 L 51.37 56.95 L 51.07 56.53 L 50.7 56.28 L 50.26 56.2 Z" />
                    </g>
                    <g id="paku-icon-eyebrows-and-nose">
                      <path d="M 23.80 59.20 L 24.80 58.80 L 26.20 58.00 L 28.20 57.20 L 30.33 56.45 L 30.63 56.45 L 31.15 56.20 L 31.52 56.20 L 32.04 55.87 L 32.63 55.87 L 33.52 55.62 L 36.78 55.62 L 37.59 55.87 L 38.19 55.87 L 38.48 55.95 L 38.70 56.12 L 39.00 56.12 L 39.30 56.20 L 39.52 56.37 L 39.96 56.45 L 40.33 56.70 L 40.56 56.70 L 41.22 57.03 L 41.37 57.20 L 41.67 57.28 L 43.30 58.36 L 44.78 59.61 L 46.26 61.10 L 46.85 61.52 L 47.15 61.85 L 47.37 62.43 L 47.37 62.76 L 47.59 63.26 L 47.89 64.67 L 47.89 65.09 L 48.11 66.00 L 48.11 66.75 L 48.33 68.08 L 48.41 69.57 L 48.41 72.15 L 48.56 74.14 L 48.56 76.30 L 48.78 76.88 L 48.93 75.88 L 49.00 74.47 L 49.00 69.16 L 48.93 67.91 L 48.78 67.33 L 48.70 66.00 L 48.48 65.25 L 48.48 64.75 L 48.26 64.17 L 48.26 63.84 L 47.96 63.01 L 47.96 62.68 L 47.74 62.26 L 47.74 62.01 L 47.59 61.77 L 47.67 61.10 L 47.44 60.52 L 47.30 60.35 L 47.30 60.19 L 47.00 59.77 L 47.00 59.61 L 46.11 58.28 L 44.26 56.28 L 43.30 55.45 L 42.85 55.21 L 42.63 54.96 L 42.11 54.62 L 41.96 54.62 L 41.67 54.37 L 41.37 54.29 L 41.07 54.04 L 40.56 53.79 L 40.33 53.79 L 39.96 53.54 L 39.67 53.54 L 39.15 53.30 L 37.82 52.96 L 35.89 52.88 L 34.48 53.05 L 34.19 53.21 L 33.52 53.30 L 33.08 53.54 L 32.78 53.54 L 32.04 53.79 L 31.67 54.04 L 31.45 54.04 L 30.04 54.79 L 28.50 55.40 L 26.80 56.40 L 25.20 57.60 Z" />
                      <path d="M 76.20 59.20 L 75.20 58.80 L 73.80 58.00 L 71.80 57.20 L 69.67 56.45 L 69.37 56.45 L 68.85 56.20 L 68.48 56.20 L 67.96 55.87 L 67.37 55.87 L 66.48 55.62 L 63.22 55.62 L 62.41 55.87 L 61.81 55.87 L 61.52 55.95 L 61.30 56.12 L 61.00 56.12 L 60.70 56.20 L 60.48 56.37 L 60.04 56.45 L 59.67 56.70 L 59.44 56.70 L 58.78 57.03 L 58.63 57.20 L 58.33 57.28 L 56.70 58.36 L 55.22 59.61 L 53.74 61.10 L 53.15 61.52 L 52.85 61.85 L 52.63 62.43 L 52.63 62.76 L 52.41 63.26 L 52.11 64.67 L 52.11 65.09 L 51.89 66.00 L 51.89 66.75 L 51.67 68.08 L 51.59 69.57 L 51.59 72.15 L 51.44 74.14 L 51.44 76.30 L 51.22 76.88 L 51.07 75.88 L 51.00 74.47 L 51.00 69.16 L 51.07 67.91 L 51.22 67.33 L 51.30 66.00 L 51.52 65.25 L 51.52 64.75 L 51.74 64.17 L 51.74 63.84 L 52.04 63.01 L 52.04 62.68 L 52.26 62.26 L 52.26 62.01 L 52.41 61.77 L 52.33 61.10 L 52.56 60.52 L 52.70 60.35 L 52.70 60.19 L 53.00 59.77 L 53.00 59.61 L 53.89 58.28 L 55.74 56.28 L 56.70 55.45 L 57.15 55.21 L 57.37 54.96 L 57.89 54.62 L 58.04 54.62 L 58.33 54.37 L 58.63 54.29 L 58.93 54.04 L 59.44 53.79 L 59.67 53.79 L 60.04 53.54 L 60.33 53.54 L 60.85 53.30 L 62.18 52.96 L 64.11 52.88 L 65.52 53.05 L 65.81 53.21 L 66.48 53.30 L 66.92 53.54 L 67.22 53.54 L 67.96 53.79 L 68.33 54.04 L 68.55 54.04 L 69.96 54.79 L 71.50 55.40 L 73.20 56.40 L 74.80 57.60 Z" />
                      <path d="M 46.26 78.95 L 46.26 79.37 L 46.41 79.7 L 46.93 80.28 L 47.3 80.53 L 47.74 80.62 L 47.96 80.78 L 48.63 80.86 L 49.44 81.69 L 50.78 81.69 L 51.22 81.45 L 51.44 81.11 L 51.81 80.78 L 52.19 80.78 L 53.07 80.53 L 53.22 80.37 L 53.37 80.37 L 53.89 79.78 L 54.04 79.45 L 54.04 78.95 L 53.67 78.12 L 53.52 78.04 L 53.37 78.87 L 53.22 79.12 L 52.78 79.54 L 51.3 79.87 L 51.0 80.37 L 50.63 80.7 L 50.41 80.78 L 49.89 80.78 L 49.67 80.7 L 49.07 79.95 L 47.81 79.62 L 47.3 79.29 L 46.85 78.62 L 46.78 78.04 L 46.56 78.21 Z" />
                    </g>
                    <g id="paku-icon-creases">
                      <path d="M 26.20 61.20 L 28.00 60.90 L 30.33 60.69 L 30.93 60.69 L 31.45 60.52 L 32.19 60.52 L 33.08 60.27 L 33.74 60.27 L 34.56 60.02 L 35.52 59.94 L 37.67 59.94 L 38.56 60.02 L 39.67 60.27 L 40.11 60.52 L 40.33 60.52 L 41.15 60.85 L 42.78 61.93 L 43.67 62.76 L 45.00 64.26 L 45.37 64.84 L 45.74 65.17 L 45.74 65.00 L 45.59 64.84 L 45.59 64.67 L 45.37 64.34 L 45.30 64.01 L 44.85 63.18 L 44.26 62.35 L 43.52 61.52 L 42.19 60.44 L 41.15 59.86 L 40.33 59.52 L 40.04 59.52 L 39.82 59.36 L 39.00 59.27 L 38.63 59.11 L 37.89 59.02 L 36.48 59.02 L 35.74 59.11 L 35.22 59.27 L 34.33 59.36 L 33.74 59.61 L 33.37 59.61 L 32.93 59.86 L 32.56 59.86 L 31.74 60.19 L 30.56 60.35 L 30.41 60.44 L 28.00 60.75 Z" />
                      <path d="M 73.80 61.20 L 72.00 60.90 L 69.67 60.69 L 69.07 60.69 L 68.55 60.52 L 67.81 60.52 L 66.92 60.27 L 66.26 60.27 L 65.44 60.02 L 64.48 59.94 L 62.33 59.94 L 61.44 60.02 L 60.33 60.27 L 59.89 60.52 L 59.67 60.52 L 58.85 60.85 L 57.22 61.93 L 56.33 62.76 L 55.00 64.26 L 54.63 64.84 L 54.26 65.17 L 54.26 65.00 L 54.41 64.84 L 54.41 64.67 L 54.63 64.34 L 54.70 64.01 L 55.15 63.18 L 55.74 62.35 L 56.48 61.52 L 57.81 60.44 L 58.85 59.86 L 59.67 59.52 L 59.96 59.52 L 60.18 59.36 L 61.00 59.27 L 61.37 59.11 L 62.11 59.02 L 63.52 59.02 L 64.26 59.11 L 64.78 59.27 L 65.67 59.36 L 66.26 59.61 L 66.63 59.61 L 67.07 59.86 L 67.44 59.86 L 68.26 60.19 L 69.44 60.35 L 69.59 60.44 L 72.00 60.75 Z" />
                    </g>
                    <g id="paku-icon-eyes" fill-rule="evenodd">
                      <path fill-rule="evenodd" d="M 23.50 63.20 L 24.80 63.90 L 26.20 64.80 L 28.20 65.90 L 30.04 67.00 L 30.56 67.41 L 31.08 67.99 L 32.26 68.99 L 32.48 69.07 L 32.70 69.32 L 32.85 69.32 L 33.08 69.57 L 33.59 69.90 L 33.74 69.90 L 34.04 70.15 L 35.07 70.65 L 35.52 70.73 L 35.89 70.98 L 36.19 70.98 L 36.70 71.23 L 38.41 71.56 L 40.48 71.56 L 41.15 71.48 L 41.52 71.31 L 42.26 71.23 L 42.78 70.98 L 43.07 70.98 L 43.52 70.73 L 44.63 70.40 L 46.19 69.57 L 46.56 69.24 L 46.70 68.91 L 46.26 67.91 L 45.30 66.75 L 44.63 66.17 L 43.89 65.67 L 43.59 65.59 L 43.44 65.42 L 42.78 65.09 L 42.41 65.00 L 42.26 64.84 L 41.82 64.75 L 41.37 64.51 L 41.07 64.51 L 40.56 64.26 L 39.89 64.17 L 39.67 64.01 L 39.22 63.92 L 38.63 63.92 L 37.37 63.68 L 36.48 63.68 L 35.67 63.43 L 35.15 63.43 L 34.33 63.18 L 32.63 63.09 L 31.96 62.93 L 31.00 62.93 L 30.56 62.76 L 28.50 62.60 L 26.50 62.60 L 24.80 62.80 Z M 27.20 64.75 L 28.80 64.55 L 30.33 64.34 L 30.48 64.42 L 30.85 64.42 L 31.30 64.59 L 33.30 64.67 L 33.82 64.84 L 35.15 64.92 L 35.30 65.09 L 35.37 65.34 L 35.45 66.25 L 35.89 67.25 L 36.48 67.91 L 36.63 67.91 L 36.85 68.16 L 37.67 68.49 L 38.78 68.49 L 39.52 68.24 L 40.33 67.66 L 40.85 67.00 L 40.93 66.75 L 41.30 66.25 L 41.59 66.25 L 42.04 66.50 L 42.48 66.58 L 42.78 66.83 L 43.00 66.83 L 43.22 67.08 L 43.52 67.16 L 43.89 67.41 L 44.41 67.91 L 44.56 67.91 L 45.15 68.41 L 45.15 68.66 L 44.85 68.91 L 44.19 68.99 L 44.04 69.16 L 43.52 69.24 L 43.15 69.49 L 42.85 69.49 L 42.41 69.74 L 41.59 69.82 L 41.22 69.99 L 39.37 69.99 L 38.78 69.82 L 37.59 69.74 L 37.00 69.49 L 36.63 69.49 L 36.19 69.24 L 35.67 69.16 L 34.56 68.66 L 34.26 68.41 L 34.11 68.41 L 33.22 67.83 L 33.00 67.58 L 32.78 67.50 L 31.30 66.17 L 30.33 65.09 L 28.80 64.95 Z" />
                      <path fill-rule="evenodd" d="M 76.50 63.20 L 75.20 63.90 L 73.80 64.80 L 71.80 65.90 L 69.96 67.00 L 69.44 67.41 L 68.92 67.99 L 67.74 68.99 L 67.52 69.07 L 67.30 69.32 L 67.15 69.32 L 66.92 69.57 L 66.41 69.90 L 66.26 69.90 L 65.96 70.15 L 64.93 70.65 L 64.48 70.73 L 64.11 70.98 L 63.81 70.98 L 63.30 71.23 L 61.59 71.56 L 59.52 71.56 L 58.85 71.48 L 58.48 71.31 L 57.74 71.23 L 57.22 70.98 L 56.93 70.98 L 56.48 70.73 L 55.37 70.40 L 53.81 69.57 L 53.44 69.24 L 53.30 68.91 L 53.74 67.91 L 54.70 66.75 L 55.37 66.17 L 56.11 65.67 L 56.41 65.59 L 56.56 65.42 L 57.22 65.09 L 57.59 65.00 L 57.74 64.84 L 58.18 64.75 L 58.63 64.51 L 58.93 64.51 L 59.44 64.26 L 60.11 64.17 L 60.33 64.01 L 60.78 63.92 L 61.37 63.92 L 62.63 63.68 L 63.52 63.68 L 64.33 63.43 L 64.85 63.43 L 65.67 63.18 L 67.37 63.09 L 68.04 62.93 L 69.00 62.93 L 69.44 62.76 L 71.50 62.60 L 73.50 62.60 L 75.20 62.80 Z M 72.80 64.75 L 71.20 64.55 L 69.67 64.34 L 69.52 64.42 L 69.15 64.42 L 68.70 64.59 L 66.70 64.67 L 66.18 64.84 L 64.85 64.92 L 64.70 65.09 L 64.63 65.34 L 64.55 66.25 L 64.11 67.25 L 63.52 67.91 L 63.37 67.91 L 63.15 68.16 L 62.33 68.49 L 61.22 68.49 L 60.48 68.24 L 59.67 67.66 L 59.15 67.00 L 59.07 66.75 L 58.70 66.25 L 58.41 66.25 L 57.96 66.50 L 57.52 66.58 L 57.22 66.83 L 57.00 66.83 L 56.78 67.08 L 56.48 67.16 L 56.11 67.41 L 55.59 67.91 L 55.44 67.91 L 54.85 68.41 L 54.85 68.66 L 55.15 68.91 L 55.81 68.99 L 55.96 69.16 L 56.48 69.24 L 56.85 69.49 L 57.15 69.49 L 57.59 69.74 L 58.41 69.82 L 58.78 69.99 L 60.63 69.99 L 61.22 69.82 L 62.41 69.74 L 63.00 69.49 L 63.37 69.49 L 63.81 69.24 L 64.33 69.16 L 65.44 68.66 L 65.74 68.41 L 65.89 68.41 L 66.78 67.83 L 67.00 67.58 L 67.22 67.50 L 68.70 66.17 L 69.67 65.09 L 71.20 64.95 Z" />
                    </g>
                    <g id="paku-icon-lips">
                      <path d="M 56.78 85.1 L 56.7 84.85 L 56.11 84.85 L 55.74 85.02 L 54.48 85.02 L 54.18 84.85 L 53.81 84.85 L 53.52 84.77 L 53.3 84.6 L 52.19 84.35 L 51.3 84.6 L 50.48 85.18 L 50.04 85.18 L 49.81 85.1 L 49.52 84.85 L 49.37 84.85 L 49.07 84.6 L 48.63 84.44 L 47.74 84.52 L 47.44 84.6 L 47.22 84.77 L 46.63 84.85 L 46.04 85.1 L 44.78 85.1 L 44.33 84.93 L 43.89 84.93 L 43.89 85.1 L 44.26 85.51 L 45.59 86.1 L 46.93 86.35 L 48.04 86.43 L 48.41 86.59 L 49.3 86.68 L 51.07 86.68 L 52.11 86.59 L 53.22 86.35 L 53.89 86.35 L 54.56 86.1 L 54.93 86.1 L 55.37 85.85 L 55.81 85.76 L 55.96 85.6 L 56.33 85.51 Z" />
                      <path d="M 53.67 87.92 L 53.67 87.59 L 53.52 87.51 L 52.93 87.59 L 52.26 87.84 L 50.93 88.01 L 49.74 88.01 L 48.11 87.84 L 47.44 87.59 L 46.78 87.67 L 46.93 88.01 L 47.37 88.5 L 47.59 88.59 L 47.81 88.84 L 48.26 89.09 L 48.78 89.17 L 49.0 89.33 L 49.37 89.42 L 51.15 89.42 L 52.26 89.09 L 52.56 88.84 L 52.7 88.84 L 53.37 88.34 Z" />
                    </g>
                  </svg>
                </div>
                <div>
                  <h3 class="paku-modal-title" id="paku-modal-title">সারুর দপ্তর: জিজ্ঞাসা ও পরামর্শ</h3>
                  <p class="paku-modal-subtitle"><span class="saru-name">Saru</span>'s Desk: Questions & Suggestions</p>
                </div>
              </div>
              <button type="button" class="paku-modal-close-btn" id="paku-modal-close-btn" aria-label="Close modal">&times;</button>
            </div>
            <form class="paku-modal-body" id="paku-ask-form">
              <div class="paku-type-selector">
                <button type="button" class="paku-type-pill active" data-type="question" id="paku-pill-question">
                  <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:14px;height:14px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"></line>
                  </svg>
                  <span>জিজ্ঞাসা / Ask</span>
                </button>
                <button type="button" class="paku-type-pill" data-type="recommendation" id="paku-pill-recommendation">
                  <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="width:14px;height:14px;">
                    <path d="M12 2C13.2 4.2 14.5 6.2 14.5 8.2A2.5 2.5 0 0 1 9.5 8.2C9.5 6.2 10.8 4.2 12 2Z" fill="currentColor"/>
                    <path d="M12 4.5C12.5 5.6 13.2 6.7 13.2 7.7A1.2 1.2 0 0 1 10.8 7.7C10.8 6.7 11.5 5.6 12 4.5Z" fill="#fff" opacity="0.8"/>
                    <path d="M2.5 13.5C3.5 17.5 7 20 12 20S20.5 17.5 21.5 13.5C19.5 15 16 15.8 12 15.8S4.5 15 2.5 13.5Z" fill="currentColor"/>
                    <ellipse cx="12" cy="13.5" rx="9.5" ry="2.2" fill="currentColor" opacity="0.5"/>
                  </svg>
                  <span>পরামর্শ / Suggest</span>
                </button>
              </div>

              <div class="paku-form-group">
                <label class="paku-form-label" for="paku-user-name">আপনার নাম / Your Name <span style="color:#bd3a54;">*</span></label>
                <input type="text" id="paku-user-name" class="paku-form-input" placeholder="যেমন: ফাহমিদা মুন" required maxlength="100" />
              </div>

              <div class="paku-form-group">
                <label class="paku-form-label" for="paku-user-contact">ই-মেইল বা ফোন নম্বর / Email or Phone <span style="color:#bd3a54;">*</span></label>
                <input type="text" id="paku-user-contact" class="paku-form-input" placeholder="যেমন: 017... অথবা name@example.com" required maxlength="100" />
              </div>

              <div class="paku-form-group">
                <label class="paku-form-label" for="paku-user-message" id="paku-message-label">আপনার জিজ্ঞাসা / Your Question <span style="color:#bd3a54;">*</span></label>
                <textarea id="paku-user-message" class="paku-form-textarea" placeholder="কী জানতে চান বা মঞ্চাইছে নিয়ে কোনো জিজ্ঞাসা..." required maxlength="2000"></textarea>
              </div>

              <div class="paku-form-status" id="paku-form-status"></div>

              <button type="submit" class="paku-form-submit-btn" id="paku-submit-btn">
                <span>পাঠিয়ে দিন / Send to <span class="saru-name">Saru</span></span>
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>
      `;

      const closeBtn = this.querySelector('#paku-speech-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.dismissSpeech();
        });
      }
    }

    initSvgElements() {
      this.shuttleWrapper = this.querySelector('#paku-shuttle-wrapper');
      this.cavityFloor = this.querySelector('#paku-cavity-floor');
      this.spoolLayer = this.querySelector('#paku-spool-layer');
      this.faceFront = this.querySelector('#paku-face-front');
      this.faceBack = this.querySelector('#paku-face-back');
      this.faceRight = this.querySelector('#paku-face-right');
      this.faceLeft = this.querySelector('#paku-face-left');
      this.bodyEl = this.querySelector('#paku-body') || this.querySelector('#paku-mascot');
      this.hullEl = this.querySelector('#paku-hull');
      this.eyesEl = this.querySelector('#paku-eyes');
      this.pupilLeft = this.querySelector('#pupil-left');
      this.pupilRight = this.querySelector('#pupil-right');
      this.threadArm = this.querySelector('#living-thread-arm');
      this.threadTip = this.querySelector('#living-thread-tip');
      this.threadHitArea = this.querySelector('#living-thread-hitarea');
      this.threadHitAreaTip = this.querySelector('#living-thread-hitarea-tip');

      this.reactor = this.querySelector('#paku-reactor');
      this.crossThreads = this.querySelector('#spool-cross-threads');
      if (this.reactor) {
        this.reactor.addEventListener('animationend', (e) => {
          if (e.target === this.reactor) this.reactor.className = 'paku-reactor';
        });
      }

      // Bind thread events
      this.bindThreadEvents();
    }

    // --- EXPRESSIONS: neutral, happy, worried, smug, alarmed, dizzy ---
    setFace(face = 'neutral', holdMs = 0) {
      if (this.faceTimer) {
        clearTimeout(this.faceTimer);
        this.faceTimer = null;
      }
      if (face === 'neutral') delete this.dataset.face;
      else this.dataset.face = face;

      if (holdMs > 0) {
        this.faceTimer = setTimeout(() => this.setFace(), holdMs);
      }
    }

    // --- ONE-OFF BODY REACTIONS: hop, nod, wiggle, shake, dizzy ---
    react(name) {
      if (!this.reactor) return;
      if (this.isMinimised && !this.classList.contains('paku-alerting')) return;

      this.reactor.className = 'paku-reactor';
      void this.reactor.offsetWidth; // Restart if the same reaction is already playing
      this.reactor.classList.add(`react-${name}`);
    }

    // Her mouth moves for roughly as long as the line takes to read aloud.
    startTalking(length) {
      if (this.talkTimer) clearTimeout(this.talkTimer);
      this.classList.add('paku-talking');
      this.talkTimer = setTimeout(() => this.stopTalking(), Math.max(500, Math.min(2600, length * 55)));
    }

    stopTalking() {
      if (this.talkTimer) {
        clearTimeout(this.talkTimer);
        this.talkTimer = null;
      }
      this.classList.remove('paku-talking');
    }

    // --- TIME PERIOD AND GREETING HELPER ---
    getTimePeriod(hour) {
      if (typeof hour !== 'number') {
        hour = new Date().getHours();
      }
      // 1am to 4am (1:00 AM to 4:59 AM)
      if (hour >= 1 && hour <= 4) {
        return 'late_night';
      }
      if (hour >= 5 && hour < 12) {
        return 'morning';
      }
      if (hour >= 12 && hour < 17) {
        return 'afternoon';
      }
      if (hour >= 17 && hour < 20) {
        return 'evening';
      }
      return 'night';
    }

    setSleepy(isSleepy) {
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (isSleepy) {
        this.setFace();
        this.classList.add('paku-sleeping');
        if (wrapper) wrapper.classList.add('paku-sleeping');
      } else {
        if (this.classList.contains('paku-sleeping')) writeStore('sessionStorage', KEYS.woken, 1);
        this.classList.remove('paku-sleeping');
        if (wrapper) wrapper.classList.remove('paku-sleeping');
      }
    }

    clearSequenceTimeouts() {
      if (this.sequenceTimeouts && this.sequenceTimeouts.length) {
        this.sequenceTimeouts.forEach(t => clearTimeout(t));
      }
      this.sequenceTimeouts = [];
    }

    playIntro(forcedHour) {
      this.clearSequenceTimeouts();
      const period = this.getTimePeriod(forcedHour);

      if (period !== 'late_night') {
        this.setSleepy(false);
        this.say(LINES.greetings[period], 'normal', 6000, { actions: true, face: 'happy' });
        this.react('hop');
        return;
      }

      // Late night (1am - 4am) sequence with animated Z Z Z thread
      this.startLateNightSleepySequence();
    }

    startLateNightSleepySequence() {
      this.clearSequenceTimeouts();
      this.setSleepy(true);

      // She says goodnight, then stays asleep until someone pulls her thread or
      // otherwise interacts with her.
      const [goodNight, thanks, eyes, bedtime] = LINES.lateNight;
      this.say(goodNight, 'normal', 3000);

      const t1 = setTimeout(() => this.say(thanks, 'normal', 4200), 3400);
      const t2 = setTimeout(() => this.say(eyes, 'normal', 4000), 7900);
      const t3 = setTimeout(() => this.say(bedtime, 'normal', 4500), 12200);

      this.sequenceTimeouts.push(t1, t2, t3);
    }

    // --- INITIAL GREETING ON LOAD ---
    setupInitialGreeting() {
      // She greets once per visit. On later pages she's simply there, and still
      // asleep during the late-night hours unless someone has already woken her.
      setTimeout(() => {
        const greeted = readStore('sessionStorage', KEYS.greeted) === '1';
        if (this.isMinimised || greeted) {
          const woken = readStore('sessionStorage', KEYS.woken) === '1';
          if (this.getTimePeriod() === 'late_night' && !woken) this.setSleepy(true);
          return;
        }

        const bubble = this.querySelector('#paku-speech-bubble');
        if (bubble && !bubble.classList.contains('visible')) {
          writeStore('sessionStorage', KEYS.greeted, 1);
          this.playIntro();
        }
      }, 1200);
    }

    // --- CLICK ON SHUTTLE INTERACTION ---
    setupClickInteraction() {
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (!wrapper) return;

      wrapper.addEventListener('click', () => {
        if (this.isDragging || this.wasDragAction) return;
        if (this.touchHoldTriggered) {
          this.touchHoldTriggered = false;
          return;
        }
        this.activate();
      });

      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.activate();
        }
      });
    }

    activate() {
      this.clearSequenceTimeouts();
      this.setSleepy(false);

      if (this.isMinimised) {
        this.setMinimised(false);
        return;
      }

      // Picks up where she left off, including across pages.
      const index = parseInt(readStore('sessionStorage', KEYS.quip), 10) || 0;
      const line = index % LINES.quips.length;
      this.say(LINES.quips[line], 'normal', 5500, { actions: true, face: QUIP_FACES[line] });
      this.react('wiggle');
      writeStore('sessionStorage', KEYS.quip, (index + 1) % LINES.quips.length);
      this.triggerBlink();
    }

    // --- MINIMISE: ONLY HER EYES PEEK OUT FROM THE CORNER ---
    applyMinimised(isMinimised) {
      this.isMinimised = isMinimised;
      if (!isMinimised) this.classList.remove('paku-alerting');
      this.classList.toggle('paku-minimised', isMinimised);
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (wrapper) wrapper.setAttribute('aria-label', isMinimised ? LINES.mascotLabelMinimised : LINES.mascotLabel);
    }

    setMinimised(isMinimised) {
      if (isMinimised) {
        this.clearSequenceTimeouts();
        this.hideSpeech();
        this.applyMinimised(true);
        writeStore('localStorage', KEYS.minimised, 1);
        return;
      }

      this.applyMinimised(false);
      writeStore('localStorage', KEYS.minimised, null);
      writeStore('sessionStorage', KEYS.greeted, 1);
      this.say(LINES.restored, 'normal', 5500, { actions: true, face: 'happy' });
      this.react('hop');
    }

    // --- SPEECH BUBBLE BUTTONS & HOLDING IT OPEN ---
    setupSpeechBubble() {
      const bubble = this.querySelector('#paku-speech-bubble');
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      const actions = this.querySelector('#paku-speech-actions');
      if (!bubble || !wrapper || !actions) return;

      actions.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        if (action === 'minimise') {
          const hadFocus = bubble.contains(document.activeElement);
          this.setMinimised(true);
          if (hadFocus) wrapper.focus({ preventScroll: true });
        } else {
          this.openAskModal(action);
        }
      });

      // The bubble stays while someone is reading or reaching for its buttons.
      const hold = () => {
        if (this.speechTimer) {
          clearTimeout(this.speechTimer);
          this.speechTimer = null;
        }
      };
      const release = () => {
        if (!bubble.classList.contains('visible') || this.speechDuration <= 0) return;
        hold();
        this.speechTimer = setTimeout(() => this.hideSpeech(), 2500);
      };
      bubble.addEventListener('mouseenter', hold);
      bubble.addEventListener('focusin', hold);
      bubble.addEventListener('mouseleave', release);
      bubble.addEventListener('focusout', release);
    }

    // --- INQUIRY & RECOMMENDATION MODAL CONTROLLER ---
    setupInquiryModal() {
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (wrapper) {
        // Desktop double click
        wrapper.addEventListener('dblclick', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openAskModal('question');
        });

        // Mobile tap-and-hold (long-press ~550ms)
        let touchStartPos = { x: 0, y: 0 };
        wrapper.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches[0]) {
            touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            this.touchHoldTriggered = false;
            if (this.touchHoldTimer) clearTimeout(this.touchHoldTimer);
            this.touchHoldTimer = setTimeout(() => {
              this.touchHoldTriggered = true;
              this.openAskModal('question');
              if (navigator.vibrate) {
                try { navigator.vibrate(40); } catch (_) { }
              }
            }, 550);
          }
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
          if (e.touches && e.touches[0]) {
            const dist = Math.hypot(e.touches[0].clientX - touchStartPos.x, e.touches[0].clientY - touchStartPos.y);
            if (dist > 10 && this.touchHoldTimer) {
              clearTimeout(this.touchHoldTimer);
              this.touchHoldTimer = null;
            }
          }
        }, { passive: true });

        const cancelHold = () => {
          if (this.touchHoldTimer) {
            clearTimeout(this.touchHoldTimer);
            this.touchHoldTimer = null;
          }
        };
        wrapper.addEventListener('touchend', cancelHold, { passive: true });
        wrapper.addEventListener('touchcancel', cancelHold, { passive: true });
      }

      // Close modal bindings
      const overlay = this.querySelector('#paku-modal-overlay');
      const closeBtn = this.querySelector('#paku-modal-close-btn');
      if (overlay) {
        overlay.addEventListener('click', () => this.closeAskModal());
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeAskModal());
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.isModalOpen) {
            this.closeAskModal();
          } else if (this.querySelector('#paku-speech-bubble.visible')) {
            const hadFocus = this.querySelector('#paku-speech-bubble').contains(document.activeElement);
            this.dismissSpeech();
            if (hadFocus) this.querySelector('#paku-mascot-wrapper').focus({ preventScroll: true });
          }
        } else if (e.key === 'Tab' && this.isModalOpen) {
          this.keepFocusInModal(e);
        }
      });

      // Pill buttons for inquiry type
      const pillQuestion = this.querySelector('#paku-pill-question');
      const pillRec = this.querySelector('#paku-pill-recommendation');
      if (pillQuestion) {
        pillQuestion.addEventListener('click', () => this.setInquiryType('question'));
      }
      if (pillRec) {
        pillRec.addEventListener('click', () => this.setInquiryType('recommendation'));
      }

      // Wire submit event
      this.setupFormSubmission();
    }

    keepFocusInModal(e) {
      const modal = this.querySelector('#paku-ask-modal');
      const controls = [...modal.querySelectorAll('button:not([disabled]), input, textarea')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!modal.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    openAskModal(initialType = 'question') {
      if (!this.isModalOpen) {
        // A bubble button is about to disappear, so focus returns to Saru instead.
        const active = document.activeElement;
        const inBubble = this.querySelector('#paku-speech-bubble').contains(active);
        this.modalReturnFocus = inBubble ? this.querySelector('#paku-mascot-wrapper') : active;
      }

      this.clearSequenceTimeouts();
      this.setSleepy(false);
      this.hideSpeech();

      this.isModalOpen = true;
      this.classList.add('paku-modal-open');
      this.lastUserActivity = 0; // Immediately in idle state looking at form
      this.setInquiryType(initialType);

      const overlay = this.querySelector('#paku-modal-overlay');
      const modal = this.querySelector('#paku-ask-modal');
      if (overlay) overlay.classList.add('active');
      if (modal) {
        modal.inert = false;
        modal.classList.add('active');
      }

      const nameInput = this.querySelector('#paku-user-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 150);
      }

      const pLeft = this.pupilLeft || this.querySelector('#pupil-left');
      const pRight = this.pupilRight || this.querySelector('#pupil-right');
      if (pLeft && pRight) {
        pLeft.style.transform = 'translate(-2.4px, 0.8px)';
        pRight.style.transform = 'translate(-2.4px, 0.8px)';
      }

      this.startModalIdleEyeCycle();
    }

    closeAskModal() {
      this.isModalOpen = false;
      this.classList.remove('paku-modal-open');
      const overlay = this.querySelector('#paku-modal-overlay');
      const modal = this.querySelector('#paku-ask-modal');
      if (overlay) overlay.classList.remove('active');
      if (modal) {
        modal.inert = true;
        modal.classList.remove('active');
      }

      const returnTo = this.modalReturnFocus;
      this.modalReturnFocus = null;
      if (returnTo && returnTo !== document.body) returnTo.focus({ preventScroll: true });

      this.stopModalIdleEyeCycle();

      const pLeft = this.pupilLeft || this.querySelector('#pupil-left');
      const pRight = this.pupilRight || this.querySelector('#pupil-right');
      if (pLeft && pRight) {
        pLeft.style.transform = 'translate(0px, 0px)';
        pRight.style.transform = 'translate(0px, 0px)';
      }
    }

    setInquiryType(type) {
      this.inquiryType = type === 'recommendation' ? 'recommendation' : 'question';
      const pillQuestion = this.querySelector('#paku-pill-question');
      const pillRec = this.querySelector('#paku-pill-recommendation');
      const messageLabel = this.querySelector('#paku-message-label');
      const messageInput = this.querySelector('#paku-user-message');

      if (this.inquiryType === 'question') {
        if (pillQuestion) pillQuestion.classList.add('active');
        if (pillRec) pillRec.classList.remove('active');
        if (messageLabel) {
          messageLabel.innerHTML = 'আপনার জিজ্ঞাসা / Your Question <span style="color:#bd3a54;">*</span>';
        }
        if (messageInput) {
          messageInput.placeholder = 'কী জানতে চান বা মঞ্চাইছে নিয়ে কোনো জিজ্ঞাসা...';
        }
      } else {
        if (pillRec) pillRec.classList.add('active');
        if (pillQuestion) pillQuestion.classList.remove('active');
        if (messageLabel) {
          messageLabel.innerHTML = 'আপনার পরামর্শ / Your Recommendation <span style="color:#bd3a54;">*</span>';
        }
        if (messageInput) {
          messageInput.placeholder = 'কীভাবে আরও সুন্দর করা যায়, নতুন কোনো ভাবনার কথা...';
        }
      }
    }

    startModalIdleEyeCycle() {
      this.stopModalIdleEyeCycle();
      let glanceAtUser = false;
      let lastGlanceSwitch = performance.now();

      this.modalIdleInterval = setInterval(() => {
        if (!this.isModalOpen) return;
        const now = performance.now();
        // PC idle threshold > 1.5s or on touch/mobile
        const isIdle = (now - this.lastUserActivity) > 1500;

        if (isIdle) {
          const eyes = this.querySelector('#paku-eyes');
          if (eyes && (eyes.classList.contains('dizzy') || eyes.classList.contains('blinking'))) return;

          // Toggle between looking down at the form and glancing up at user
          const timeSinceSwitch = now - lastGlanceSwitch;
          if (!glanceAtUser && timeSinceSwitch > 3500) {
            glanceAtUser = true;
            lastGlanceSwitch = now;
          } else if (glanceAtUser && timeSinceSwitch > 1200) {
            glanceAtUser = false;
            lastGlanceSwitch = now;
          }

          const pLeft = this.pupilLeft || this.querySelector('#pupil-left');
          const pRight = this.pupilRight || this.querySelector('#pupil-right');
          if (pLeft && pRight) {
            if (glanceAtUser) {
              // Glancing at user
              pLeft.style.transform = 'translate(0px, 0px)';
              pRight.style.transform = 'translate(0px, 0px)';
            } else {
              // Looking down towards the inquiry form modal
              pLeft.style.transform = 'translate(-2.4px, 0.8px)';
              pRight.style.transform = 'translate(-2.4px, 0.8px)';
            }
          }
        }
      }, 150);
    }

    stopModalIdleEyeCycle() {
      if (this.modalIdleInterval) {
        clearInterval(this.modalIdleInterval);
        this.modalIdleInterval = null;
      }
    }

    setupFormSubmission() {
      const form = this.querySelector('#paku-ask-form');
      const statusEl = this.querySelector('#paku-form-status');
      const submitBtn = this.querySelector('#paku-submit-btn');
      const nameInput = this.querySelector('#paku-user-name');
      const contactInput = this.querySelector('#paku-user-contact');
      const messageInput = this.querySelector('#paku-user-message');

      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = (nameInput && nameInput.value || '').trim();
        const contact = (contactInput && contactInput.value || '').trim();
        const message = (messageInput && messageInput.value || '').trim();
        const type = this.inquiryType;

        if (!name) {
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = LINES.form.nameRequired;
          }
          if (nameInput) nameInput.focus();
          return;
        }

        if (!contact) {
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = LINES.form.contactRequired;
          }
          if (contactInput) contactInput.focus();
          return;
        }

        // Fast client validation for email or phone
        const isClientValid = (function (raw) {
          let str = raw.trim().replace(/[০-৯]/g, d => ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'].indexOf(d));
          if (str.includes('@')) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
          }
          let cleaned = str.replace(/[\s\-\(\)\.]/g, '');
          if (cleaned.startsWith('+88')) cleaned = cleaned.slice(3);
          else if (cleaned.startsWith('88')) cleaned = cleaned.slice(2);
          return /^01[3-9]\d{8}$/.test(cleaned) || /^\+?[0-9]{7,15}$/.test(cleaned);
        })(contact);

        if (!isClientValid) {
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = LINES.form.contactInvalid;
          }
          if (contactInput) contactInput.focus();
          return;
        }

        if (!message) {
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = LINES.form.messageRequired;
          }
          if (messageInput) messageInput.focus();
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>পাঠানো হচ্ছে... / Sending...</span>';
        }
        if (statusEl) {
          statusEl.className = 'paku-form-status';
          statusEl.style.display = 'none';
        }

        try {
          let res;
          try {
            res = await fetch('/api/ask-saru', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, contact, type, message })
            });
            if (res.status === 404) {
              res = await fetch('/api/ask-paku', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, contact, type, message })
              });
            }
          } catch (_) {
            res = await fetch('/api/ask-paku', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, contact, type, message })
            });
          }

          let data = {};
          try {
            data = await res.json();
          } catch (_) { }

          if (res.ok && data.success !== false) {
            if (statusEl) {
              statusEl.className = 'paku-form-status success';
              statusEl.textContent = data.message || LINES.form.sent;
            }

            if (form) form.reset();

            // Close modal after 1.2s and celebrate with dialogue and blink
            setTimeout(() => {
              this.closeAskModal();
              if (type === 'recommendation') {
                this.say(LINES.thanksRecommendation, 'normal', 6500, { face: 'happy' });
                this.react('hop');
              } else {
                this.say(LINES.thanksQuestion, 'normal', 6500, { face: 'happy' });
                this.react('hop');
              }
              this.triggerBlink();
            }, 1200);
          } else {
            throw new Error(data.error || LINES.form.serverError);
          }
        } catch (err) {
          this.shake();
          this.setFace('worried', 2500);
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = err.message || LINES.form.sendFailed;
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>পাঠিয়ে দিন / Send to <span class="saru-name">Saru</span></span><svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
          }
        }
      });
    }

    // --- SPEECH BUBBLE CONTROLLER ---
    say(message, mood = 'normal', duration = 6000, { actions = false, face = null, urgent = false } = {}) {
      // Minimised means quiet, except for urgent lines: she pops up to say them, then goes back.
      if (urgent && this.isMinimised) this.classList.add('paku-alerting');
      if (this.isMinimised && !this.classList.contains('paku-alerting')) return;

      const bubble = this.querySelector('#paku-speech-bubble');
      const textEl = this.querySelector('#paku-speech-text');
      if (!bubble || !textEl) return;

      textEl.textContent = message;
      this.speechDuration = duration;
      this.setFace(face || (mood === 'alarmed' ? 'alarmed' : 'neutral'));
      this.startTalking(message.length);

      const actionsEl = this.querySelector('#paku-speech-actions');
      if (actionsEl) actionsEl.hidden = !actions;

      // Mood classes
      bubble.classList.remove('mood-dizzy', 'mood-alarmed');
      if (mood === 'dizzy') bubble.classList.add('mood-dizzy');
      if (mood === 'alarmed') bubble.classList.add('mood-alarmed');

      // Clear existing speech timer
      if (this.speechTimer) {
        clearTimeout(this.speechTimer);
        this.speechTimer = null;
      }

      bubble.classList.remove('visible');
      void bubble.offsetWidth; // Trigger reflow for re-animation
      bubble.classList.add('visible');

      if (duration > 0) {
        this.speechTimer = setTimeout(() => {
          this.hideSpeech();
        }, duration);
      }
    }

    dismissSpeech() {
      this.clearSequenceTimeouts();
      this.hideSpeech();
    }

    hideSpeech() {
      this.classList.remove('paku-alerting');
      this.stopTalking();
      this.setFace();

      const bubble = this.querySelector('#paku-speech-bubble');
      if (bubble) {
        bubble.classList.remove('visible');
      }
      if (this.speechTimer) {
        clearTimeout(this.speechTimer);
        this.speechTimer = null;
      }
    }

    // --- VIOLENT SHAKE ON MISSING CHECKOUT FIELDS ---
    shake() {
      this.clearSequenceTimeouts();
      this.setSleepy(false);
      this.react('shake');
    }

    // --- TRUE 3D ON-AXIS BEYBLADE VERTICAL SPIN (rotateY) ---
    spin(strength = 1) {
      // A gentle tug gives 2 turns, a long pull gives 8.
      const duration = 1400 + 1800 * strength; // ms
      const totalRotation = 360 * Math.round(2 + 6 * strength);

      this.clearSequenceTimeouts();
      this.setSleepy(false);

      const shuttle = this.shuttleWrapper || this.querySelector('#paku-shuttle-wrapper');
      const eyes = this.querySelector('#paku-eyes');

      if (!shuttle) return;

      // Trigger dizzy eyes on front face
      if (eyes) eyes.classList.add('dizzy');

      // Add 3D Beyblade spin class
      shuttle.classList.remove('beyblade-spinning-3d');
      void shuttle.offsetWidth;
      shuttle.classList.add('beyblade-spinning-3d');

      // Bengali dizzy dialogue
      this.say(LINES.dizzy, 'dizzy', duration + 3200, { face: 'dizzy' });

      // Cancel any prior spin RAF or dizzy timeout
      if (this.spinRaf) {
        cancelAnimationFrame(this.spinRaf);
        this.spinRaf = null;
      }
      if (this.dizzyTimeout) {
        clearTimeout(this.dizzyTimeout);
        this.dizzyTimeout = null;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        shuttle.classList.remove('beyblade-spinning-3d');
        this.dizzyTimeout = setTimeout(() => {
          if (eyes) eyes.classList.remove('dizzy');
          this.triggerBlink();
        }, 2800);
        return;
      }

      // Smooth on-axis Beyblade spin with synchronized 4-phase face culling & strict opacity invariant = 1.000
      const startTime = performance.now();

      const lFront = this.faceFront;
      const lSpool = this.spoolLayer;
      const lFloor = this.cavityFloor;
      const lBack = this.faceBack;
      const lSideLeft = this.faceLeft;
      const lSideRight = this.faceRight;

      const updateAngle = (deg, tilt = 0) => {
        let norm = deg % 360;
        if (norm < 0) norm += 360;

        let frontOp = 0;
        let backOp = 0;
        let sideLeftOp = 0;
        let sideRightOp = 0;

        // 4 Quadrants:
        // Zone 1: Front dominant [310..360] and [0..50]
        // Zone 2: Side Left dominant [70..110] (40-degree wide solid window)
        // Zone 3: Back dominant [130..230] (100-degree wide solid window)
        // Zone 4: Side Right dominant [250..290] (40-degree wide solid window)
        // Smooth cross-fades with invariant sum = 1.000:
        // [50..70]: Front -> Side Left
        // [110..130]: Side Left -> Back
        // [230..250]: Back -> Side Right
        // [290..310]: Side Right -> Front

        if (norm >= 0 && norm < 50) {
          frontOp = 1;
        } else if (norm >= 50 && norm < 70) {
          const t = (norm - 50) / 20;
          frontOp = 1 - t;
          sideLeftOp = t;
        } else if (norm >= 70 && norm < 110) {
          sideLeftOp = 1;
        } else if (norm >= 110 && norm < 130) {
          const t = (norm - 110) / 20;
          sideLeftOp = 1 - t;
          backOp = t;
        } else if (norm >= 130 && norm < 230) {
          backOp = 1;
        } else if (norm >= 230 && norm < 250) {
          const t = (norm - 230) / 20;
          backOp = 1 - t;
          sideRightOp = t;
        } else if (norm >= 250 && norm < 290) {
          sideRightOp = 1;
        } else if (norm >= 290 && norm < 310) {
          const t = (norm - 290) / 20;
          sideRightOp = 1 - t;
          frontOp = t;
        } else { // 310..360
          frontOp = 1;
        }

        shuttle.style.transform = `rotateZ(${tilt.toFixed(2)}deg) rotateY(${deg.toFixed(2)}deg)`;
        if (lFront) lFront.style.opacity = frontOp;
        if (lSpool) lSpool.style.opacity = frontOp;
        if (lFloor) lFloor.style.opacity = frontOp;
        if (lBack) lBack.style.opacity = backOp;
        if (lSideLeft) lSideLeft.style.opacity = sideLeftOp;
        if (lSideRight) lSideRight.style.opacity = sideRightOp;
      };

      const step = (now) => {
        const elapsed = now - startTime;
        const p = Math.min(1.0, elapsed / duration);
        // easeOutCubic: 1 - pow(1 - p, 3)
        const ease = 1 - Math.pow(1 - p, 3);
        const deg = ease * totalRotation;

        // Leans and wobbles like a spinning top, upright again as she starts and stops.
        updateAngle(deg, Math.sin(elapsed / 85) * 6 * Math.sin(Math.PI * p));

        if (p < 1.0) {
          this.spinRaf = requestAnimationFrame(step);
        } else {
          this.spinRaf = null;
          updateAngle(totalRotation);
          shuttle.style.transform = 'rotateY(0deg)';
          if (lFront) lFront.style.opacity = 1;
          if (lSpool) lSpool.style.opacity = 1;
          if (lFloor) lFloor.style.opacity = 1;
          if (lBack) lBack.style.opacity = 0;
          if (lSideLeft) lSideLeft.style.opacity = 0;
          if (lSideRight) lSideRight.style.opacity = 0;
          shuttle.classList.remove('beyblade-spinning-3d');
          this.react('dizzy');
          // Keep spinning spiral eyes dizzy for 2.8s after spinning stops
          if (this.dizzyTimeout) clearTimeout(this.dizzyTimeout);
          this.dizzyTimeout = setTimeout(() => {
            if (eyes) eyes.classList.remove('dizzy');
            this.triggerBlink();
          }, 2800);
        }
      };

      this.spinRaf = requestAnimationFrame(step);
    }

    // --- BLINKING: IRREGULAR GAPS, WITH THE OCCASIONAL DOUBLE BLINK ---
    setupBlinkTimer() {
      const scheduleNext = () => {
        this.blinkTimer = setTimeout(() => {
          this.triggerBlink();
          if (Math.random() < 0.18) setTimeout(() => this.triggerBlink(), 260);
          scheduleNext();
        }, 2000 + Math.random() * 5000);
      };
      scheduleNext();
    }

    triggerBlink() {
      const eyes = this.querySelector('#paku-eyes');
      if (!eyes || eyes.classList.contains('dizzy') || this.classList.contains('paku-sleeping')) return;

      eyes.classList.remove('blinking');
      void eyes.offsetWidth;
      eyes.classList.add('blinking');
      setTimeout(() => {
        eyes.classList.remove('blinking');
      }, 220);
    }

    blink() {
      this.triggerBlink();
    }

    // --- GAZE: FOLLOWS THE CURSOR, AND LOOKS AROUND WHEN NOTHING IS HAPPENING ---
    setupGazeTracking() {
      let isTicking = false;
      window.addEventListener('mousemove', (e) => {
        this.lastUserActivity = performance.now();
        if (isTicking || this.isDragging || this.throwFrame) return;
        isTicking = true;

        requestAnimationFrame(() => {
          isTicking = false;
          this.lookAt(e.clientX, e.clientY);
        });
      }, { passive: true });

      window.addEventListener('keydown', () => {
        this.lastUserActivity = performance.now();
      }, { passive: true });

      this.scheduleGlance();
    }

    lookAt(clientX, clientY) {
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (!wrapper) return;

      // The custom element itself has no height (its content is fixed), so measure her body.
      const rect = wrapper.getBoundingClientRect();
      const deltaX = clientX - (rect.left + rect.width * 0.5);
      const deltaY = clientY - (rect.top + rect.height * 0.3);
      const distance = Math.hypot(deltaX, deltaY) || 1;
      const reach = Math.min(1, distance / 160);

      this.setGaze((deltaX / distance) * GAZE_RANGE_X * reach, (deltaY / distance) * GAZE_RANGE_Y * reach);
    }

    setGaze(x, y) {
      if (!this.pupilLeft || !this.pupilRight) return;
      if (this.eyesEl && this.eyesEl.classList.contains('dizzy')) return;

      const value = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      this.pupilLeft.style.transform = value;
      this.pupilRight.style.transform = value;
    }

    // Touch screens have no cursor to follow, so this is all phone visitors see of her gaze.
    scheduleGlance() {
      this.glanceTimer = setTimeout(() => {
        const idle = performance.now() - this.lastUserActivity > 3000;
        if (idle && !this.isModalOpen && !this.isDragging) {
          const spots = [[-GAZE_RANGE_X, 0], [GAZE_RANGE_X, 0], [0, GAZE_RANGE_Y], [0, 0], [0, 0]];
          const [x, y] = spots[Math.floor(Math.random() * spots.length)];
          this.setGaze(x, y);
        }
        this.scheduleGlance();
      }, 2500 + Math.random() * 3500);
    }

    // --- BEYBLADE THREAD PULL INTERACTION ---
    setupThreadPull() {
      window.addEventListener('mousemove', (e) => this.onDragMove(e.clientX, e.clientY));
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          this.onDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('mouseup', () => this.onDragEnd());
      window.addEventListener('touchend', () => this.onDragEnd());
      window.addEventListener('touchcancel', () => this.onDragEnd());
    }

    bindThreadEvents() {
      const targets = [
        this.querySelector('#living-thread-hitarea'),
        this.querySelector('#living-thread-hitarea-tip'),
        this.querySelector('#living-thread-arm'),
        this.querySelector('#living-thread-tip'),
        this.querySelector('#living-thread')
      ].filter(Boolean);

      targets.forEach(el => {
        el.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.onDragStart(e.clientX, e.clientY);
        });

        el.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches[0]) {
            e.preventDefault();
            this.onDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: false });
      });
    }

    onDragStart(clientX, clientY) {
      this.clearSequenceTimeouts();
      this.setSleepy(false);

      this.isDragging = true;
      this.wasDragAction = false;
      this.dragStart = { x: clientX, y: clientY };
      this.currentDrag = { x: 0, y: 0 };

      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (wrapper) {
        wrapper.classList.add('paku-pulling');
        // Screen pixels to SVG units (viewBox 100 x 240); the mascot is smaller on phones.
        this.dragScale = Math.max(100 / wrapper.offsetWidth, 240 / wrapper.offsetHeight);
      }
    }

    onDragMove(clientX, clientY) {
      if (!this.isDragging) return;

      const dx = clientX - this.dragStart.x;
      const dy = clientY - this.dragStart.y;
      this.currentDrag = { x: dx, y: dy };

      if (Math.hypot(dx, dy) > 6) {
        this.wasDragAction = true;
      }

      const svgDx = dx * this.dragScale;
      const svgDy = dy * this.dragScale;

      this.updateDeformedThread(svgDx, svgDy);
    }

    updateDeformedThread(svgDx, svgDy) {
      const arm = this.querySelector('#living-thread-arm');
      const tip = this.querySelector('#living-thread-tip');
      const hitArm = this.querySelector('#living-thread-hitarea');
      const hitTip = this.querySelector('#living-thread-hitarea-tip');
      if (!arm || !tip) return;

      // Spring resistance / tension curve
      const pullDist = Math.hypot(svgDx, svgDy);
      if (this.crossThreads) {
        this.crossThreads.setAttribute('transform', `translate(0 ${((pullDist * 0.45) % SPOOL_PATTERN).toFixed(2)})`);
      }
      const maxPull = 120;
      const damping = Math.min(1.0, 1.0 / (1.0 + (pullDist / maxPull) * 0.35));

      const tipX = BASE_TIP_CX + svgDx * damping;
      const tipY = BASE_TIP_CY + svgDy * damping;

      const c1x = 50 + (svgDx * 0.15) * damping;
      const c1y = 140.5 + (svgDy * 0.15) * damping;
      const c2x = 57 + svgDx * 0.3 * damping;
      const c2y = 140.5 + svgDy * 0.3 * damping;
      const c3x = 70 + svgDx * 0.45 * damping;
      const c3y = 136 + svgDy * 0.45 * damping;

      const c4x = 78 + svgDx * 0.6 * damping;
      const c4y = 138 + svgDy * 0.6 * damping;
      const c5x = 84 + svgDx * 0.75 * damping;
      const c5y = 148 + svgDy * 0.75 * damping;
      const c6x = 80 + svgDx * 0.85 * damping;
      const c6y = 158 + svgDy * 0.85 * damping;

      const c7x = 76 + svgDx * 0.9 * damping;
      const c7y = 168 + svgDy * 0.9 * damping;
      const c8x = 79 + svgDx * 0.95 * damping;
      const c8y = 176 + svgDy * 0.95 * damping;
      const c9x = 86 + svgDx * 0.98 * damping;
      const c9y = 175 + svgDy * 0.98 * damping;

      const c10x = 91 + svgDx * damping;
      const c10y = 173 + svgDy * damping;
      const c11x = 93 + svgDx * damping;
      const c11y = 166 + svgDy * damping;

      const newD = `M 50 140.5 C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${c3x.toFixed(1)} ${c3y.toFixed(1)} C ${c4x.toFixed(1)} ${c4y.toFixed(1)}, ${c5x.toFixed(1)} ${c5y.toFixed(1)}, ${c6x.toFixed(1)} ${c6y.toFixed(1)} C ${c7x.toFixed(1)} ${c7y.toFixed(1)}, ${c8x.toFixed(1)} ${c8y.toFixed(1)}, ${c9x.toFixed(1)} ${c9y.toFixed(1)} C ${c10x.toFixed(1)} ${c10y.toFixed(1)}, ${c11x.toFixed(1)} ${c11y.toFixed(1)}, ${tipX.toFixed(1)} ${tipY.toFixed(1)}`;

      arm.setAttribute('d', newD);
      tip.setAttribute('cx', tipX.toFixed(1));
      tip.setAttribute('cy', tipY.toFixed(1));

      if (hitArm) hitArm.setAttribute('d', newD);
      if (hitTip) {
        hitTip.setAttribute('cx', tipX.toFixed(1));
        hitTip.setAttribute('cy', tipY.toFixed(1));
      }
    }

    onDragEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;

      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (wrapper) wrapper.classList.remove('paku-pulling');

      const totalDist = Math.hypot(this.currentDrag.x, this.currentDrag.y);

      // Snap thread back into place
      this.snapThreadBack(() => {
        // If dragged beyond 50px, fire the true 3D on-axis Beyblade spin!
        if (totalDist > 50) {
          this.spin(Math.min(1, (totalDist - 50) / 200));
        }
      });

      setTimeout(() => {
        this.wasDragAction = false;
      }, 150);
    }

    snapThreadBack(onComplete) {
      const arm = this.querySelector('#living-thread-arm');
      const tip = this.querySelector('#living-thread-tip');
      const hitArm = this.querySelector('#living-thread-hitarea');
      const hitTip = this.querySelector('#living-thread-hitarea-tip');
      if (!arm || !tip) {
        if (onComplete) onComplete();
        return;
      }

      const startX = parseFloat(tip.getAttribute('cx')) || BASE_TIP_CX;
      const startY = parseFloat(tip.getAttribute('cy')) || BASE_TIP_CY;
      const startTime = performance.now();
      const duration = 220; // ms

      const animateSnap = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / duration);

        const s = 1.70158;
        const p = 1.0 - progress;
        const overshootFactor = p * p * ((s + 1) * p - s);

        const currentX = BASE_TIP_CX + (startX - BASE_TIP_CX) * overshootFactor;
        const currentY = BASE_TIP_CY + (startY - BASE_TIP_CY) * overshootFactor;

        const currentDx = currentX - BASE_TIP_CX;
        const currentDy = currentY - BASE_TIP_CY;

        this.updateDeformedThread(currentDx, currentDy);

        if (progress < 1.0) {
          requestAnimationFrame(animateSnap);
        } else {
          if (this.crossThreads) this.crossThreads.removeAttribute('transform');
          arm.setAttribute('d', BASE_THREAD_PATH);
          tip.setAttribute('cx', BASE_TIP_CX);
          tip.setAttribute('cy', BASE_TIP_CY);
          if (hitArm) hitArm.setAttribute('d', BASE_THREAD_PATH);
          if (hitTip) {
            hitTip.setAttribute('cx', BASE_TIP_CX);
            hitTip.setAttribute('cy', BASE_TIP_CY);
          }
          if (onComplete) onComplete();
        }
      };

      requestAnimationFrame(animateSnap);
    }

    // --- IDLE REMINDER CONTROLLER ---
    setupIdleTimer() {
      const resetIdle = () => {
        if (this.idleTimer) clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
          const alreadyShown = readStore('sessionStorage', KEYS.idle) === '1';
          if (!alreadyShown && !this.isMinimised && !this.isDragging && !this.classList.contains('paku-sleeping')) {
            writeStore('sessionStorage', KEYS.idle, 1);
            this.say(LINES.idle, 'normal', 7000, { actions: true, face: 'smug' });
            this.triggerBlink();
          }
        }, 45000); // 45 seconds
      };

      window.addEventListener('mousemove', resetIdle, { passive: true });
      window.addEventListener('keydown', resetIdle, { passive: true });
      window.addEventListener('scroll', resetIdle, { passive: true });
      resetIdle();
    }

    // --- THREAD THROW: she flings her thread into the bag when something is added ---
    // Returns the milliseconds until it lands, or 0 if she did not throw.
    throwThread() {
      this.cancelThrow();

      const stayStill = this.isMinimised || this.isModalOpen || this.isDragging || this.spinRaf
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (stayStill) return 0;

      const tip = this.querySelector('#living-thread-tip');
      const arm = this.querySelector('#living-thread-arm');
      const bag = this.findVisibleBag();
      if (!tip || !arm || !bag) return 0;

      const WINDUP_MS = 140;
      const FLIGHT_MS = 430;
      const SNAP_MS = 130;
      const SLIP_MS = 300;
      const LANDS_AT = WINDUP_MS + FLIGHT_MS;
      const SAMPLES = 28;

      const svgNs = 'http://www.w3.org/2000/svg';
      const line = document.createElementNS(svgNs, 'svg');
      line.setAttribute('class', 'paku-throw-line');
      line.setAttribute('aria-hidden', 'true');
      const strand = document.createElementNS(svgNs, 'polyline');
      const bead = document.createElementNS(svgNs, 'circle');
      bead.setAttribute('r', '2.4');

      // Same colour as her own thread, which changes with the theme.
      const colour = getComputedStyle(arm).stroke;
      strand.style.stroke = colour;
      bead.style.fill = colour;
      line.append(strand, bead);
      this.appendChild(line);
      this.throwLine = line;

      const centreOf = (el) => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      };
      const progress = (elapsed, length) => Math.max(0, Math.min(1, elapsed / length));

      const liftHeight = this.querySelector('#paku-mascot-wrapper').getBoundingClientRect().height * 1.1;
      const bagCentre = centreOf(bag.icon);
      this.lookAt(bagCentre.x, bagCentre.y);
      this.react('throw');

      const start = performance.now();
      let landed = false;

      const frame = (now) => {
        const elapsed = now - start;
        if (elapsed < WINDUP_MS) {
          this.throwFrame = requestAnimationFrame(frame);
          return;
        }

        const flight = progress(elapsed - WINDUP_MS, FLIGHT_MS);
        const snap = progress(elapsed - LANDS_AT, SNAP_MS);
        const slip = progress(elapsed - LANDS_AT - SNAP_MS, SLIP_MS);
        if (slip === 1) {
          this.cancelThrow();
          return;
        }

        // Her tip bead is what flies; once the thread lets go she has a new one.
        this.classList.toggle('paku-throwing', slip === 0);

        // Measured every frame, so the thread stays on her as she floats and on the bag as it tugs.
        const from = centreOf(tip);
        const to = centreOf(bag.icon);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.hypot(dx, dy) || 1;

        if (flight === 1 && !landed) {
          landed = true;
          bead.remove();
          bag.button.animate([
            { transform: 'none' },
            { transform: `translate(${(-dx / length * 4).toFixed(1)}px, ${(-dy / length * 4).toFixed(1)}px) scale(1.1)`, offset: 0.35 },
            { transform: 'none' }
          ], { duration: 420, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' });
        }

        // Always bow towards the middle of the screen, so the arc stays in view.
        const side = dy > 0 ? -1 : 1;
        const normalX = (dy / length) * side;
        const normalY = (-dx / length) * side;

        // Slack in the air, then pulled taut on landing with a small overshoot.
        const slack = (1 - snap) - 0.12 * Math.sin(snap * Math.PI);

        // It leaves her tip going straight up, so it clears her body before bending to the bag.
        const liftX = from.x + dx / 3;
        const liftY = from.y + dy / 3;
        const firstX = liftX + (from.x - liftX) * slack;
        const firstY = liftY + (from.y - liftHeight - liftY) * slack;
        const bow = Math.min(length * 0.16, 70) * slack;
        const secondX = from.x + dx * 0.66 + normalX * bow;
        const secondY = from.y + dy * 0.66 + normalY * bow;

        const headAt = 1 - Math.pow(1 - flight, 3);
        const tailAt = slip * slip;
        const ripple = 7 * (1 - snap);

        const points = [];
        let headX = from.x;
        let headY = from.y;
        for (let i = 0; i <= SAMPLES; i++) {
          const u = tailAt + (headAt - tailAt) * (i / SAMPLES);
          const v = 1 - u;
          const wave = Math.sin(u * Math.PI * 3 - elapsed * 0.02) * Math.sin(u * Math.PI) * ripple;
          headX = v * v * v * from.x + 3 * v * v * u * firstX + 3 * v * u * u * secondX + u * u * u * to.x + normalX * wave;
          headY = v * v * v * from.y + 3 * v * v * u * firstY + 3 * v * u * u * secondY + u * u * u * to.y + normalY * wave;
          points.push(`${headX.toFixed(1)},${headY.toFixed(1)}`);
        }
        strand.setAttribute('points', points.join(' '));
        bead.setAttribute('cx', headX.toFixed(1));
        bead.setAttribute('cy', headY.toFixed(1));

        this.throwFrame = requestAnimationFrame(frame);
      };

      this.throwFrame = requestAnimationFrame(frame);
      return LANDS_AT;
    }

    cancelThrow() {
      if (this.throwFrame) cancelAnimationFrame(this.throwFrame);
      if (this.throwLine) this.throwLine.remove();
      this.throwFrame = null;
      this.throwLine = null;
      this.classList.remove('paku-throwing');
    }

    // The bag she can actually see: on screen and not covered by a dialog or the cart drawer.
    findVisibleBag() {
      for (const id of ['cart-trigger-btn', 'mobile-nav-cart-btn']) {
        const button = document.getElementById(id);
        const icon = button && button.querySelector('svg');
        if (!icon) continue;

        const rect = icon.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;

        const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        if (top && button.contains(top)) return { button, icon };
      }
      return null;
    }

    celebrateCartAdd() {
      const landsIn = this.throwThread();
      const speak = () => this.say(LINES.cartAdd, 'normal', 5000, { face: 'happy' });

      if (landsIn) {
        this.setFace('happy', landsIn + 400);
        this.sequenceTimeouts.push(setTimeout(speak, landsIn));
      } else {
        speak();
        this.react('hop');
      }
    }

    // --- APP EVENT HOOKS ---
    setupAppHooks() {
      // 1. Add to cart event
      window.addEventListener('paku:cart-add', (e) => {
        this.clearSequenceTimeouts();
        this.setSleepy(false);
        // Next tick: the button that added it may also be closing a dialog over the bag.
        this.sequenceTimeouts.push(setTimeout(() => this.celebrateCartAdd(), 0));
      });

      // 2. Checkout form validation error
      window.addEventListener('paku:checkout-error', (e) => {
        this.clearSequenceTimeouts();
        this.setSleepy(false);
        // An empty bag is a different problem from missing delivery details.
        const bagIsEmpty = JSON.parse(localStorage.getItem('amc_cart') || '[]').length === 0;
        this.say(bagIsEmpty ? LINES.cartEmpty : LINES.checkoutError, 'alarmed', 6500, { urgent: true });
        this.shake();
      });

      // 3. Payment method selection
      window.addEventListener('paku:payment-select', (e) => {
        this.clearSequenceTimeouts();
        this.setSleepy(false);
        const method = e.detail && e.detail.method;
        if (method === 'cod') {
          this.say(LINES.paymentCod, 'normal', 5500, { face: 'happy' });
          this.react('nod');
        } else if (method === 'mfs') {
          this.say(LINES.paymentMfs, 'normal', 6500, { face: 'worried' });
          this.react('nod');
        }
      });

      // Direct DOM click bindings
      setTimeout(() => {
        const cartBtn = document.getElementById('cart-trigger-btn') || document.querySelector('[data-cart-trigger]');
        if (cartBtn) {
          cartBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('amc_cart') || '[]');
            if (cart.length === 0) {
              this.clearSequenceTimeouts();
              this.setSleepy(false);
              this.say(LINES.cartEmpty, 'normal', 5000, { face: 'smug' });
            }
          });
        }
      }, 1000);
    }
  }

  const PakuAssistant = SaruAssistant;

  // Register custom elements (both 'saru-assistant' and 'paku-assistant' alias)
  if (!customElements.get('saru-assistant')) {
    customElements.define('saru-assistant', SaruAssistant);
  }
  if (!customElements.get('paku-assistant')) {
    customElements.define('paku-assistant', class extends SaruAssistant {});
  }

  // Expose global helper API
  const getAssistantEl = () => document.querySelector('saru-assistant, paku-assistant');

  window.saru = {
    say: (msg, mood, dur) => {
      const el = getAssistantEl();
      if (el && typeof el.say === 'function') {
        el.say(msg, mood, dur);
      }
    },
    spin: () => {
      const el = getAssistantEl();
      if (el && typeof el.spin === 'function') {
        el.spin();
      }
    },
    shake: () => {
      const el = getAssistantEl();
      if (el && typeof el.shake === 'function') {
        el.shake();
      }
    },
    playIntro: (forcedHour) => {
      const el = getAssistantEl();
      if (el && typeof el.playIntro === 'function') {
        el.playIntro(forcedHour);
      }
    },
    blink: () => {
      const el = getAssistantEl();
      if (el && typeof el.blink === 'function') {
        el.blink();
      }
    },
    setSleepy: (isSleepy) => {
      const el = getAssistantEl();
      if (el && typeof el.setSleepy === 'function') {
        el.setSleepy(isSleepy);
      }
    },
    openAsk: (type) => {
      const el = getAssistantEl();
      if (el && typeof el.openAskModal === 'function') {
        el.openAskModal(type);
      }
    },
    closeAsk: () => {
      const el = getAssistantEl();
      if (el && typeof el.closeAskModal === 'function') {
        el.closeAskModal();
      }
    }
  };
  window.paku = window.saru;

  // Auto-inject if not already present in DOM when page is loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('saru-assistant, paku-assistant')) {
      const el = document.createElement('saru-assistant');
      document.body.appendChild(el);
    }
  });

})();
