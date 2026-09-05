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
  <rect x="35" y="93.5" width="30" height="97" rx="8" ry="8" fill="url(#paku-cavity-floor-dark)" stroke="#0a0502" stroke-width="1.2" />
  <rect x="35" y="93.5" width="30" height="97" rx="8" ry="8" fill="url(#paku-cavity-floor-rim-shadow)" />
  <!-- Spindle mounting brackets recessed into chamber ends -->
  <path d="M 46 95 L 54 95 L 53 100 L 47 100 Z" fill="#754e19" stroke="#120803" stroke-width="0.8" />
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
    <!-- ======================================================= -->
    <!-- 3. <g id="paku-spool">: Dense Wound Handloom Thread Pirn -->
    <!-- ======================================================= -->
    <!-- Dense Spool with Green base, Crimson red, & Gold threads -->
    <g id="paku-spool">
      <!-- Central Spindle Rod -->
      <rect id="paku-spindle-rod" x="48.8" y="97" width="2.4" height="90" rx="1.2" fill="#d9c8a7" stroke="#3d2f19" stroke-width="0.6" />

      <!-- Top & Bottom Wooden Spool Stopper Rings -->
      <rect x="44" y="100.5" width="12" height="3" rx="1.5" fill="#a67c3b" stroke="#1a1008" stroke-width="0.8" />
      <rect x="43" y="180.5" width="14" height="3.5" rx="1.7" fill="#a67c3b" stroke="#1a1008" stroke-width="0.8" />

      <!-- Dense Spool Bobbin Package -->
      <g id="spool-package">
        <!-- Base Dense Emerald Green Thread Core Shape -->
        <path id="spool-base-volume"
          d="M 45 103.5
             C 41 106, 39 122, 39 142
             C 39 162, 41 176, 44.5 180.5
             L 55.5 180.5
             C 59 176, 61 162, 61 142
             C 61 122, 59 106, 55 103.5 Z"
          fill="#135d49"
          stroke="#092d23"
          stroke-width="1.2" />

        <!-- High-Density Fine Green Spun Wraps -->
        <g id="spool-dense-green-thread" stroke="#0e4738" stroke-width="0.9" stroke-linecap="round" fill="none">
          <line x1="44" y1="106" x2="56" y2="106" />
          <line x1="43" y1="108" x2="57" y2="108" stroke="#197a60" />
          <line x1="42" y1="110" x2="58" y2="110" />
          <line x1="41.5" y1="112" x2="58.5" y2="112" stroke="#197a60" />
          <line x1="41" y1="114" x2="59" y2="114" />
          <line x1="40.5" y1="116" x2="59.5" y2="116" stroke="#197a60" />
          <line x1="40" y1="118" x2="60" y2="118" />
          <line x1="39.8" y1="120" x2="60.2" y2="120" stroke="#197a60" />
          <line x1="39.5" y1="122" x2="60.5" y2="122" />
          <line x1="39.2" y1="124" x2="60.8" y2="124" stroke="#197a60" />
          <line x1="39.2" y1="126" x2="60.8" y2="126" />
          <line x1="39" y1="128" x2="61" y2="128" stroke="#197a60" />
          <line x1="39" y1="130" x2="61" y2="130" />
          <line x1="39" y1="132" x2="61" y2="132" stroke="#197a60" />
          <line x1="39" y1="134" x2="61" y2="134" />
          <line x1="39" y1="136" x2="61" y2="136" stroke="#197a60" />
          <line x1="39" y1="138" x2="61" y2="138" />
          <line x1="39" y1="140" x2="61" y2="140" stroke="#197a60" />
          <line x1="39" y1="142" x2="61" y2="142" />
          <line x1="39" y1="144" x2="61" y2="144" stroke="#197a60" />
          <line x1="39" y1="146" x2="61" y2="146" />
          <line x1="39" y1="148" x2="61" y2="148" stroke="#197a60" />
          <line x1="39.2" y1="150" x2="60.8" y2="150" />
          <line x1="39.2" y1="152" x2="60.8" y2="152" stroke="#197a60" />
          <line x1="39.5" y1="154" x2="60.5" y2="154" />
          <line x1="39.8" y1="156" x2="60.2" y2="156" stroke="#197a60" />
          <line x1="40" y1="158" x2="60" y2="158" />
          <line x1="40.5" y1="160" x2="59.5" y2="160" stroke="#197a60" />
          <line x1="41" y1="162" x2="59" y2="162" />
          <line x1="41.5" y1="164" x2="58.5" y2="164" stroke="#197a60" />
          <line x1="42" y1="166" x2="58" y2="166" />
          <line x1="42.5" y1="168" x2="57.5" y2="168" stroke="#197a60" />
          <line x1="43" y1="170" x2="57" y2="170" />
          <line x1="43.5" y1="172" x2="56.5" y2="172" stroke="#197a60" />
          <line x1="44" y1="174" x2="56" y2="174" />
          <line x1="44.5" y1="176" x2="55.5" y2="176" stroke="#197a60" />
          <line x1="45" y1="178" x2="55" y2="178" />
        </g>

        <!-- Both Colored Threads Co-existing on Spool: Handloom Crimson & Antique Gold Cross-Wraps -->
        <g id="spool-cross-threads" stroke-linecap="round" fill="none">
          <!-- Crimson Thread Bands (Light Mode Theme Thread) -->
          <g stroke="#BD3A54" stroke-width="1.8">
            <path d="M 44 105 L 57 114" />
            <path d="M 56 112 L 41 123" />
            <path d="M 40 121 L 60 135" />
            <path d="M 61 133 L 39 148" />
            <path d="M 39 146 L 61 160" />
            <path d="M 60 158 L 41 171" />
            <path d="M 42 169 L 56 179" />
          </g>

          <!-- Golden Accent Thread Bands (Dark Mode Theme Thread) -->
          <g stroke="#d4af37" stroke-width="1.3" stroke-opacity="0.85">
            <path d="M 56 105 L 43 114" />
            <path d="M 41 112 L 59 123" />
            <path d="M 60 121 L 40 135" />
            <path d="M 39 133 L 61 148" />
            <path d="M 61 146 L 39 160" />
            <path d="M 41 158 L 60 171" />
            <path d="M 58 169 L 44 179" />
          </g>
        </g>

        <!-- Subtle Thread Specular Sheen -->
        <path
          d="M 47.5 104
             C 45.5 116, 45 138, 45 158
             C 45 168, 46.5 177, 47.5 180
             L 50 180
             C 49 177, 47.5 168, 47.5 158
             C 47.5 138, 48 116, 50 104 Z"
          fill="#ffffff"
          opacity="0.18" />
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
      <rect x="36" y="95" width="28" height="94" rx="7" ry="7" fill="#000000" />
    </mask>

    <!-- Cutout Cavity Deep Interior -->
    <linearGradient id="paku-cavity-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#120803" />
      <stop offset="20%" stop-color="#1c0e06" />
      <stop offset="80%" stop-color="#1c0e06" />
      <stop offset="100%" stop-color="#0d0502" />
    </linearGradient>

    <!-- Ambient Drop Shadow -->
    <filter id="paku-mascot-shadow" x="-25%" y="-15%" width="150%" height="130%">
      <feDropShadow dx="1" dy="3.5" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.30" />
    </filter>

    <style>
      <![CDATA[
      /* Interactive Mascot Styling & Theming */
      #paku-hull {
        transform-origin: 50px 120px;
        will-change: transform;
      }
      #paku-eyes {
        transform-origin: 50px 66px;
        will-change: transform;
      }
      #pupil-left, #pupil-right {
        will-change: transform;
        transition: transform 0.1s ease-out;
      }

      #paku-body, #paku-mascot {
        transform-origin: 50px 120px;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      #paku-eye-left, #paku-eye-right {
        transform-origin: 50px 71px;
      }
      #paku-pupil-left, #paku-pupil-right {
        transition: transform 0.25s ease-out;
      }

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
  <g id="paku-body" class="paku-body" filter="url(#paku-mascot-shadow)">

    <!-- ======================================================= -->
    <!-- 2. <g id="paku-hull" mask="url(#paku-cavity-hole-mask)">: The Main Wooden Shuttle Body    -->
    <!-- ======================================================= -->
    <g id="paku-hull" mask="url(#paku-cavity-hole-mask)">
      <!-- Main Canoe Hull: Perfectly symmetrical slender canoe hull spanning y=10 to y=230 -->
      <path id="paku-wood-body"
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 31 47, 26 75, 23 100
           C 22 110, 22 130, 23 140
           C 26 165, 31 193, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 69 193, 74 165, 77 140
           C 78 130, 78 110, 77 100
           C 74 75, 69 47, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-wood-fill)"
        stroke="#1a1008"
        stroke-width="1.6" />

      <!-- Outer Contour Lateral Shading Overlay -->
      <path
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 31 47, 26 75, 23 100
           C 22 110, 22 130, 23 140
           C 26 165, 31 193, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 69 193, 74 165, 77 140
           C 78 130, 78 110, 77 100
           C 74 75, 69 47, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-wood-shading)" />

      <!-- Artisanal Wood Grain Strands (Confined strictly between brass caps: y=44 to y=198) -->
      <g id="paku-wood-grain" stroke="#48250f" stroke-width="0.75" stroke-linecap="round" fill="none">
        <path d="M 34 44 C 27 65, 26 120, 26 140 C 26 165, 28 185, 34 198" />
        <path d="M 66 44 C 73 65, 74 120, 74 140 C 74 165, 72 185, 66 198" />
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
        <rect x="35" y="93.5" width="30" height="97" rx="8" ry="8"
          fill="none"
          stroke="#3d1d0c"
          stroke-width="1.8" />
        <rect x="35" y="93.5" width="30" height="97" rx="8" ry="8"
          fill="none"
          stroke="#1a1008"
          stroke-width="1.4" />

        <!-- Cavity opening is a true physical window through the wooden front shell -->

        <!-- Top Spindle Bracket -->
        <path d="M 46 95 L 54 95 L 53 100 L 47 100 Z" fill="#8c6428" stroke="#1a1008" stroke-width="0.8" />
        <!-- Bottom Spindle Bracket -->
        <path d="M 46 189 L 54 189 L 53 184 L 47 184 Z" fill="#8c6428" stroke="#1a1008" stroke-width="0.8" />
      </g>
    

    <!-- ======================================================= -->
    <!-- 4. <g id="paku-face">: Classical Serene Devi Expressions  -->
    <!-- ======================================================= -->
    <!-- Exact 1:1 mathematical vector extraction of user reference (media_1788585335432.png) -->
    <g id="paku-face">
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
        <path id="paku-brow-nose-left" d="M 30.04 54.79 L 30.33 54.87 L 30.33 56.45 L 30.63 56.45 L 31.15 56.2 L 31.52 56.2 L 32.04 55.87 L 32.63 55.87 L 33.52 55.62 L 36.78 55.62 L 37.59 55.87 L 38.19 55.87 L 38.48 55.95 L 38.7 56.12 L 39.0 56.12 L 39.3 56.2 L 39.52 56.37 L 39.96 56.45 L 40.33 56.7 L 40.56 56.7 L 41.22 57.03 L 41.37 57.2 L 41.67 57.28 L 43.3 58.36 L 44.78 59.61 L 46.26 61.1 L 46.85 61.52 L 47.15 61.85 L 47.37 62.43 L 47.37 62.76 L 47.59 63.26 L 47.89 64.67 L 47.89 65.09 L 48.11 66.0 L 48.11 66.75 L 48.33 68.08 L 48.41 69.57 L 48.41 72.15 L 48.56 74.14 L 48.56 76.3 L 48.78 76.88 L 48.93 75.88 L 49.0 74.47 L 49.0 69.16 L 48.93 67.91 L 48.78 67.33 L 48.7 66.0 L 48.48 65.25 L 48.48 64.75 L 48.26 64.17 L 48.26 63.84 L 47.96 63.01 L 47.96 62.68 L 47.74 62.26 L 47.74 62.01 L 47.59 61.77 L 47.67 61.1 L 47.44 60.52 L 47.3 60.35 L 47.3 60.19 L 47.0 59.77 L 47.0 59.61 L 46.11 58.28 L 44.26 56.28 L 43.3 55.45 L 42.85 55.21 L 42.63 54.96 L 42.11 54.62 L 41.96 54.62 L 41.67 54.37 L 41.37 54.29 L 41.07 54.04 L 40.56 53.79 L 40.33 53.79 L 39.96 53.54 L 39.67 53.54 L 39.15 53.3 L 37.82 52.96 L 35.89 52.88 L 34.48 53.05 L 34.19 53.21 L 33.52 53.3 L 33.08 53.54 L 32.78 53.54 L 32.04 53.79 L 31.67 54.04 L 31.45 54.04 Z" />

        <!-- Right Arched Brow & Continuous Nose Bridge Contour -->
        <path id="paku-brow-nose-right" d="M 69.89 54.46 L 69.44 54.29 L 69.07 54.04 L 68.7 53.96 L 68.55 53.79 L 68.11 53.71 L 67.67 53.46 L 67.22 53.46 L 66.7 53.21 L 65.37 52.96 L 62.41 52.96 L 61.81 53.21 L 61.44 53.21 L 61.07 53.3 L 60.63 53.54 L 60.33 53.54 L 59.96 53.79 L 59.74 53.79 L 59.37 54.04 L 59.0 54.13 L 58.11 54.62 L 57.89 54.87 L 57.74 54.87 L 57.52 55.12 L 56.93 55.45 L 56.63 55.79 L 56.33 55.95 L 55.44 56.78 L 54.48 57.86 L 53.52 59.27 L 53.44 59.52 L 53.22 59.77 L 53.22 59.94 L 53.0 60.19 L 52.78 60.69 L 52.63 61.18 L 52.63 61.68 L 52.48 61.93 L 52.48 62.18 L 52.26 62.68 L 52.26 63.09 L 52.04 63.68 L 51.96 64.42 L 51.81 64.75 L 51.74 65.83 L 51.52 66.66 L 51.52 67.66 L 51.3 69.32 L 51.3 75.38 L 51.37 76.38 L 51.52 76.88 L 51.67 76.46 L 51.67 74.39 L 51.96 67.83 L 52.11 67.33 L 52.11 66.66 L 52.19 66.08 L 52.41 65.34 L 52.41 64.84 L 52.63 64.26 L 52.63 63.84 L 52.93 62.84 L 53.0 61.85 L 53.37 61.43 L 53.67 61.35 L 54.26 60.85 L 55.59 59.52 L 56.26 58.94 L 56.48 58.86 L 57.0 58.36 L 57.15 58.36 L 57.37 58.11 L 59.07 57.03 L 59.44 56.95 L 59.74 56.7 L 59.96 56.7 L 60.33 56.45 L 60.85 56.37 L 61.07 56.2 L 61.67 56.12 L 62.26 55.87 L 63.89 55.62 L 65.89 55.62 L 67.59 55.95 L 68.11 56.2 L 68.55 56.2 L 68.92 56.37 L 69.59 56.45 L 69.67 54.46 Z" />

        <!-- Classical Sculpted Nostrils & Columella Base -->
        <path id="paku-nostril-base" d="M 46.26 78.95 L 46.26 79.37 L 46.41 79.7 L 46.93 80.28 L 47.3 80.53 L 47.74 80.62 L 47.96 80.78 L 48.63 80.86 L 49.44 81.69 L 50.78 81.69 L 51.22 81.45 L 51.44 81.11 L 51.81 80.78 L 52.19 80.78 L 53.07 80.53 L 53.22 80.37 L 53.37 80.37 L 53.89 79.78 L 54.04 79.45 L 54.04 78.95 L 53.67 78.12 L 53.52 78.04 L 53.37 78.87 L 53.22 79.12 L 52.78 79.54 L 51.3 79.87 L 51.0 80.37 L 50.63 80.7 L 50.41 80.78 L 49.89 80.78 L 49.67 80.7 L 49.07 79.95 L 47.81 79.62 L 47.3 79.29 L 46.85 78.62 L 46.78 78.04 L 46.56 78.21 Z" />
      </g>

      <!-- 3. Double Eyelid Creases (Parallel echoing lines) -->
      <g id="paku-eyelid-creases" fill="#111111">
        <path id="paku-crease-left" d="M 30.33 60.69 L 30.93 60.69 L 31.45 60.52 L 32.19 60.52 L 33.08 60.27 L 33.74 60.27 L 34.56 60.02 L 35.52 59.94 L 37.67 59.94 L 38.56 60.02 L 39.67 60.27 L 40.11 60.52 L 40.33 60.52 L 41.15 60.85 L 42.78 61.93 L 43.67 62.76 L 45.0 64.26 L 45.37 64.84 L 45.74 65.17 L 45.74 65.0 L 45.59 64.84 L 45.59 64.67 L 45.37 64.34 L 45.3 64.01 L 44.85 63.18 L 44.26 62.35 L 43.52 61.52 L 42.19 60.44 L 41.15 59.86 L 40.33 59.52 L 40.04 59.52 L 39.82 59.36 L 39.0 59.27 L 38.63 59.11 L 37.89 59.02 L 36.48 59.02 L 35.74 59.11 L 35.22 59.27 L 34.33 59.36 L 33.74 59.61 L 33.37 59.61 L 32.93 59.86 L 32.56 59.86 L 31.74 60.19 L 30.56 60.35 L 30.41 60.44 Z" />
        <path id="paku-crease-right" d="M 69.96 60.44 L 68.18 60.02 L 67.96 59.86 L 67.67 59.86 L 67.22 59.61 L 66.48 59.52 L 65.89 59.27 L 65.37 59.27 L 64.41 59.02 L 62.18 59.02 L 61.67 59.11 L 61.3 59.27 L 60.55 59.36 L 59.22 59.86 L 58.56 60.19 L 58.41 60.35 L 58.11 60.44 L 57.89 60.69 L 57.74 60.69 L 56.78 61.52 L 55.44 63.09 L 55.0 63.92 L 54.93 64.26 L 54.7 64.59 L 54.48 65.17 L 54.48 65.42 L 54.63 65.34 L 55.3 64.34 L 57.52 61.93 L 59.15 60.85 L 60.55 60.27 L 60.93 60.27 L 61.52 60.02 L 62.18 59.94 L 64.18 59.86 L 65.89 60.02 L 66.63 60.27 L 67.07 60.27 L 67.81 60.52 L 69.07 60.69 L 69.89 60.6 L 69.59 60.52 Z" />
      </g>

      <!-- 4. Left Eye: Classical Elongated Almond Devi Eye (পটলচেরা চোখ) -->
      <g id="paku-eyes">
        <g id="paku-eye-left">
          <path id="paku-sclera-left" d="M 30.26 64.67 L 30.56 65.09 L 31.82 66.33 L 33.08 67.41 L 34.19 68.16 L 35.37 68.74 L 35.67 68.74 L 36.04 68.99 L 36.63 69.07 L 36.85 69.24 L 37.15 69.32 L 37.59 69.32 L 38.33 69.57 L 41.15 69.65 L 41.89 69.57 L 42.41 69.32 L 42.7 69.32 L 43.15 69.07 L 43.67 68.99 L 44.04 68.74 L 44.41 68.74 L 44.85 68.49 L 43.3 67.33 L 43.0 67.25 L 42.85 67.08 L 42.19 66.75 L 41.67 66.66 L 41.52 66.5 L 41.3 66.58 L 41.07 66.91 L 41.0 67.16 L 40.48 67.83 L 39.89 68.33 L 39.59 68.41 L 39.3 68.66 L 38.48 68.82 L 37.96 68.82 L 37.22 68.66 L 36.33 68.08 L 35.52 67.08 L 35.22 66.33 L 35.0 65.17 L 34.48 65.17 L 34.41 65.09 L 33.22 65.09 L 32.48 65.0 L 31.89 64.84 L 30.93 64.84 L 30.56 64.75 L 30.48 64.67 Z" fill="#ffffff" />
          <g id="pupil-left">
            <path id="paku-eye-contour-left" d="M 30.33 62.76 L 30.33 64.34 L 30.48 64.42 L 30.85 64.42 L 31.3 64.59 L 33.3 64.67 L 33.82 64.84 L 35.15 64.92 L 35.3 65.09 L 35.37 65.34 L 35.45 66.25 L 35.89 67.25 L 36.48 67.91 L 36.63 67.91 L 36.85 68.16 L 37.67 68.49 L 38.78 68.49 L 39.52 68.24 L 40.33 67.66 L 40.85 67.0 L 40.93 66.75 L 41.3 66.25 L 41.59 66.25 L 42.04 66.5 L 42.48 66.58 L 42.78 66.83 L 43.0 66.83 L 43.22 67.08 L 43.52 67.16 L 43.89 67.41 L 44.41 67.91 L 44.56 67.91 L 45.15 68.41 L 45.15 68.66 L 44.85 68.91 L 44.19 68.99 L 44.04 69.16 L 43.52 69.24 L 43.15 69.49 L 42.85 69.49 L 42.41 69.74 L 41.59 69.82 L 41.22 69.99 L 39.37 69.99 L 38.78 69.82 L 37.59 69.74 L 37.0 69.49 L 36.63 69.49 L 36.19 69.24 L 35.67 69.16 L 34.56 68.66 L 34.26 68.41 L 34.11 68.41 L 33.22 67.83 L 33.0 67.58 L 32.78 67.5 L 31.3 66.17 L 30.33 65.09 L 30.26 67.0 L 30.04 67.0 L 30.56 67.41 L 31.08 67.99 L 32.26 68.99 L 32.48 69.07 L 32.7 69.32 L 32.85 69.32 L 33.08 69.57 L 33.59 69.9 L 33.74 69.9 L 34.04 70.15 L 35.07 70.65 L 35.52 70.73 L 35.89 70.98 L 36.19 70.98 L 36.7 71.23 L 38.41 71.56 L 40.48 71.56 L 41.15 71.48 L 41.52 71.31 L 42.26 71.23 L 42.78 70.98 L 43.07 70.98 L 43.52 70.73 L 44.63 70.4 L 46.19 69.57 L 46.56 69.24 L 46.7 68.91 L 46.26 67.91 L 45.3 66.75 L 44.63 66.17 L 43.89 65.67 L 43.59 65.59 L 43.44 65.42 L 42.78 65.09 L 42.41 65.0 L 42.26 64.84 L 41.82 64.75 L 41.37 64.51 L 41.07 64.51 L 40.56 64.26 L 39.89 64.17 L 39.67 64.01 L 39.22 63.92 L 38.63 63.92 L 37.37 63.68 L 36.48 63.68 L 35.67 63.43 L 35.15 63.43 L 34.33 63.18 L 32.63 63.09 L 31.96 62.93 L 31.0 62.93 L 30.56 62.76 Z" fill="#111111" />
          </g>
          <!-- Dizzy Spinning Spiral Pupil (Left Eye) -->
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

      <!-- 5. Right Eye: Classical Elongated Almond Devi Eye (পটলচেরা চোখ) -->
      <g id="paku-eye-right">
          <path id="paku-sclera-right" d="M 69.96 64.84 L 69.44 64.75 L 68.33 64.84 L 67.22 65.09 L 65.89 65.09 L 65.22 65.25 L 65.22 66.0 L 65.0 66.42 L 65.0 66.66 L 64.7 67.25 L 63.96 68.08 L 63.07 68.66 L 62.41 68.82 L 61.67 68.82 L 61.0 68.66 L 60.7 68.41 L 60.55 68.41 L 59.89 67.83 L 59.52 67.41 L 59.44 67.16 L 58.93 66.42 L 58.41 66.5 L 58.04 66.75 L 57.74 66.75 L 57.44 67.0 L 57.3 67.0 L 57.0 67.25 L 56.7 67.33 L 55.81 68.16 L 55.74 68.16 L 55.52 68.49 L 55.89 68.49 L 56.18 68.74 L 56.48 68.74 L 56.85 68.99 L 57.52 69.24 L 58.18 69.32 L 58.48 69.49 L 58.85 69.57 L 62.26 69.57 L 63.0 69.32 L 63.52 69.32 L 63.81 69.24 L 64.04 69.07 L 64.55 68.99 L 64.93 68.74 L 65.15 68.74 L 65.44 68.49 L 65.67 68.49 L 66.92 67.66 L 69.44 65.42 L 69.59 65.17 L 69.67 65.17 Z" fill="#ffffff" />
          <g id="pupil-right">
            <path id="paku-eye-contour-right" d="M 69.59 62.84 L 69.07 62.84 L 68.18 63.09 L 66.7 63.18 L 65.3 63.43 L 64.33 63.43 L 62.63 63.68 L 61.52 63.68 L 61.07 63.76 L 60.78 63.92 L 60.04 64.01 L 59.81 64.17 L 59.3 64.26 L 58.33 64.59 L 56.78 65.34 L 55.22 66.5 L 54.7 67.16 L 54.48 67.33 L 54.18 67.91 L 53.96 68.16 L 53.67 68.82 L 53.74 68.99 L 54.11 69.32 L 55.07 69.9 L 56.78 70.65 L 57.3 70.73 L 57.67 70.98 L 57.96 70.98 L 58.41 71.23 L 59.67 71.48 L 62.18 71.48 L 63.59 71.23 L 64.11 70.98 L 64.41 70.98 L 64.78 70.73 L 65.0 70.73 L 65.37 70.48 L 65.74 70.4 L 66.04 70.15 L 66.18 70.15 L 66.48 69.9 L 67.22 69.57 L 68.48 68.74 L 69.67 67.74 L 69.96 67.41 L 69.59 67.33 L 69.59 65.59 L 68.26 66.83 L 67.89 67.08 L 67.52 67.5 L 66.78 68.08 L 66.55 68.16 L 66.33 68.41 L 66.18 68.41 L 66.04 68.57 L 65.74 68.66 L 65.44 68.91 L 65.07 68.99 L 64.7 69.24 L 64.41 69.24 L 63.96 69.49 L 63.3 69.57 L 63.0 69.74 L 61.59 69.9 L 59.37 69.9 L 58.18 69.74 L 57.96 69.57 L 57.37 69.49 L 56.93 69.24 L 56.48 69.16 L 56.33 68.99 L 55.89 68.91 L 55.67 68.74 L 55.44 68.74 L 55.22 68.49 L 55.22 68.33 L 57.0 66.83 L 57.89 66.5 L 58.26 66.25 L 58.63 66.25 L 58.78 66.08 L 59.0 66.08 L 59.22 66.33 L 59.44 66.83 L 59.96 67.58 L 60.63 68.16 L 61.44 68.49 L 62.63 68.49 L 62.93 68.41 L 63.81 67.91 L 64.41 67.25 L 64.78 66.58 L 65.0 65.59 L 65.0 65.09 L 65.15 64.92 L 65.52 64.84 L 66.55 64.84 L 67.15 64.67 L 68.04 64.59 L 69.0 64.59 L 69.44 64.42 L 69.89 64.42 L 69.59 64.34 Z" fill="#111111" />
          </g>
          <!-- Dizzy Spinning Spiral Pupil (Right Eye) -->
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
      </g>

      <!-- 6. Sculpted Devi Lips (Defined Cupid's Bow + Voluptuous Crescent) -->
      <g id="paku-lips" fill="#111111">
        <!-- Upper Lip with Defined Sculpted Cupid's Bow -->
        <path id="paku-lip-upper" d="M 56.78 85.1 L 56.7 84.85 L 56.11 84.85 L 55.74 85.02 L 54.48 85.02 L 54.18 84.85 L 53.81 84.85 L 53.52 84.77 L 53.3 84.6 L 52.19 84.35 L 51.3 84.6 L 50.48 85.18 L 50.04 85.18 L 49.81 85.1 L 49.52 84.85 L 49.37 84.85 L 49.07 84.6 L 48.63 84.44 L 47.74 84.52 L 47.44 84.6 L 47.22 84.77 L 46.63 84.85 L 46.04 85.1 L 44.78 85.1 L 44.33 84.93 L 43.89 84.93 L 43.89 85.1 L 44.26 85.51 L 45.59 86.1 L 46.93 86.35 L 48.04 86.43 L 48.41 86.59 L 49.3 86.68 L 51.07 86.68 L 52.11 86.59 L 53.22 86.35 L 53.89 86.35 L 54.56 86.1 L 54.93 86.1 L 55.37 85.85 L 55.81 85.76 L 55.96 85.6 L 56.33 85.51 Z" />

        <!-- Voluptuous Crescent Lower Lip (Separated by wood skin gap) -->
        <path id="paku-lip-lower" d="M 53.67 87.92 L 53.67 87.59 L 53.52 87.51 L 52.93 87.59 L 52.26 87.84 L 50.93 88.01 L 49.74 88.01 L 48.11 87.84 L 47.44 87.59 L 46.78 87.67 L 46.93 88.01 L 47.37 88.5 L 47.59 88.59 L 47.81 88.84 L 48.26 89.09 L 48.78 89.17 L 49.0 89.33 L 49.37 89.42 L 51.15 89.42 L 52.26 89.09 L 52.56 88.84 L 52.7 88.84 L 53.37 88.34 Z" />
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

    <!-- Ambient Drop Shadow -->
    <filter id="paku-back-shadow" x="-25%" y="-15%" width="150%" height="130%">
      <feDropShadow dx="1" dy="3.5" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.30" />
    </filter>
  </defs>

  <!-- Root Container for Reverse Shuttle -->
  <g id="paku-body-back" filter="url(#paku-back-shadow)">
    <g id="paku-hull-back">
      <!-- Main Solid Canoe Hull: Symmetrical slender canoe hull spanning y=10 to y=230 -->
      <path id="paku-wood-body-back"
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 31 47, 26 75, 23 100
           C 22 110, 22 130, 23 140
           C 26 165, 31 193, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 69 193, 74 165, 77 140
           C 78 130, 78 110, 77 100
           C 74 75, 69 47, 66.5 37
           C 64 27, 57 18, 50 10 Z"
        fill="url(#paku-back-wood-fill)"
        stroke="#1a1008"
        stroke-width="1.6" />

      <!-- Outer Contour Lateral Shading Overlay -->
      <path
        d="M 50 10
           C 43 18, 36 27, 33.5 37
           C 31 47, 26 75, 23 100
           C 22 110, 22 130, 23 140
           C 26 165, 31 193, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 69 193, 74 165, 77 140
           C 78 130, 78 110, 77 100
           C 74 75, 69 47, 66.5 37
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
           C 31 47, 26 75, 23 100
           C 22 110, 22 130, 23 140
           C 26 165, 31 193, 33.5 203
           C 36 213, 43 222, 50 230
           C 57 222, 64 213, 66.5 203
           C 69 193, 74 165, 77 140
           C 78 130, 78 110, 77 100
           C 74 75, 69 47, 66.5 37
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

    <!-- Ambient Drop Shadow -->
    <filter id="paku-side-shadow" x="-25%" y="-15%" width="150%" height="130%">
      <feDropShadow dx="1" dy="3.5" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.30" />
    </filter>
  </defs>

  <!-- Root Container for Side Profile Shuttle -->
  <g id="paku-body-side" filter="url(#paku-side-shadow)">
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
      this.wasDragAction = false;
      this.speechTimer = null;
      this.idleTimer = null;
      this.blinkTimer = null;
      this.spinRaf = null;
      this.dizzyTimeout = null;
      this.hasShownIdleMessage = false;
      this.sequenceTimeouts = [];
      this.isModalOpen = false;
      this.modalIdleInterval = null;
      this.touchHoldTimer = null;
      this.lastUserActivity = performance.now();
      this.inquiryType = 'question';
    }

    connectedCallback() {
      this.render();
      this.initSvgElements();
      this.setupBlinkTimer();
      this.setupGazeTracking();
      this.setupThreadPull();
      this.setupClickInteraction();
      this.setupInquiryModal();
      this.setupIdleTimer();
      this.setupAppHooks();
      this.setupInitialGreeting();
    }

    disconnectedCallback() {
      if (this.speechTimer) clearTimeout(this.speechTimer);
      if (this.idleTimer) clearTimeout(this.idleTimer);
      if (this.blinkTimer) clearInterval(this.blinkTimer);
      if (this.spinRaf) cancelAnimationFrame(this.spinRaf);
      if (this.dizzyTimeout) clearTimeout(this.dizzyTimeout);
      if (this.touchHoldTimer) clearTimeout(this.touchHoldTimer);
      if (this.modalIdleInterval) clearInterval(this.modalIdleInterval);
      this.clearSequenceTimeouts();
      this.setSleepy(false);
    }

    render() {
      this.innerHTML = `
        <div class="paku-container" id="paku-container">
          <!-- 18th-century Lal Khata Torn Paper Speech Bubble -->
          <div class="paku-speech-bubble" id="paku-speech-bubble" role="status" aria-live="polite">
            <button type="button" class="paku-speech-close" id="paku-speech-close" title="বন্ধ করুন" aria-label="Close">&times;</button>
            <span class="paku-speech-text" id="paku-speech-text"></span>
          </div>

          <!-- Mascot Shuttle Wrapper with 3D Perspective Stage -->
          <div class="paku-mascot-wrapper" id="paku-mascot-wrapper" title="সারু: মঞ্চাইছে “অ-এআই” সহকারী">
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

          <!-- Saru Inquiry & Recommendation Modal ("সারুর দপ্তর") -->
          <div class="paku-modal-overlay" id="paku-modal-overlay"></div>
          <div class="paku-modal-container" id="paku-ask-modal" role="dialog" aria-modal="true" aria-labelledby="paku-modal-title">
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

      // Bind thread events
      this.bindThreadEvents();
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

    getTimeGreetingWord(period) {
      switch (period) {
        case 'morning': return 'সকাল';
        case 'afternoon': return 'দুপুর';
        case 'evening': return 'সন্ধ্যা';
        case 'late_night':
        case 'night':
        default:
          return 'রাত্রি';
      }
    }

    setSleepy(isSleepy) {
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (isSleepy) {
        this.classList.add('paku-sleeping');
        if (wrapper) wrapper.classList.add('paku-sleeping');
      } else {
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
        const word = this.getTimeGreetingWord(period);
        this.say(`শুভ ${word}! মঞ্চাইছে সাইটে আপনাকে স্বাগতম!`, 'normal', 6000);
        return;
      }

      // Late night (1am - 4am) sequence with animated Z Z Z thread
      this.startLateNightSleepySequence();
    }

    startLateNightSleepySequence() {
      this.clearSequenceTimeouts();
      this.setSleepy(true);

      // Bubble 1: "শুভ রাত্রি!" (t = 0)
      this.say('শুভ রাত্রি!', 'normal', 3000);

      // Bubble 2: "এই রাতদুপুরে আমাদের মনে করে এখানে আসার জন্য আপনাকে ধন্যবাদ!" (t = 3400ms)
      const t1 = setTimeout(() => {
        this.say('এই রাতদুপুরে আমাদের মনে করে এখানে আসার জন্য আপনাকে ধন্যবাদ!', 'normal', 4200);
      }, 3400);

      // Bubble 3: "চোখের কী অবস্থা করেছেন, দেখেছেন আয়নায়?" (t = 7900ms)
      const t2 = setTimeout(() => {
        this.say('চোখের কী অবস্থা করেছেন, দেখেছেন আয়নায়?', 'normal', 4000);
      }, 7900);

      // Bubble 4: "তাড়াতাড়ি ঘুমিয়ে পড়ুন!" (t = 12200ms)
      const t3 = setTimeout(() => {
        this.say('তাড়াতাড়ি ঘুমিয়ে পড়ুন!', 'normal', 4500);
      }, 12200);

      // End of sequence: smoothly wake up and remove sleepy ZZZ (t = 17000ms)
      const t4 = setTimeout(() => {
        this.setSleepy(false);
      }, 17000);

      this.sequenceTimeouts.push(t1, t2, t3, t4);
    }

    // --- INITIAL GREETING ON LOAD ---
    setupInitialGreeting() {
      // Warm, polite time-based initial greeting shortly after page load
      setTimeout(() => {
        const bubble = this.querySelector('#paku-speech-bubble');
        if (bubble && !bubble.classList.contains('visible')) {
          this.playIntro();
        }
      }, 1200);
    }

    // --- CLICK ON SHUTTLE INTERACTION ---
    setupClickInteraction() {
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (!wrapper) return;

      const quips = [
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
      ];
      let quipIndex = 0;

      wrapper.addEventListener('click', (e) => {
        if (e.target.closest('#paku-speech-close')) return;
        if (this.isDragging || this.wasDragAction) return;
        if (this.touchHoldTriggered) {
          this.touchHoldTriggered = false;
          return;
        }

        this.clearSequenceTimeouts();
        this.setSleepy(false);

        const line = quips[quipIndex % quips.length];
        quipIndex++;
        this.say(line, 'normal', 5500);
        this.triggerBlink();
      });
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
        if (e.key === 'Escape' && this.isModalOpen) {
          this.closeAskModal();
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

    openAskModal(initialType = 'question') {
      this.clearSequenceTimeouts();
      this.setSleepy(false);
      this.hideSpeech();

      this.isModalOpen = true;
      this.lastUserActivity = 0; // Immediately in idle state looking at form
      this.setInquiryType(initialType);

      const overlay = this.querySelector('#paku-modal-overlay');
      const modal = this.querySelector('#paku-ask-modal');
      if (overlay) overlay.classList.add('active');
      if (modal) modal.classList.add('active');

      const nameInput = this.querySelector('#paku-user-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 150);
      }

      const pLeft = this.pupilLeft || this.querySelector('#pupil-left');
      const pRight = this.pupilRight || this.querySelector('#pupil-right');
      if (pLeft && pRight) {
        pLeft.style.transform = 'translate(-0.75px, 1.35px)';
        pRight.style.transform = 'translate(-0.75px, 1.35px)';
      }

      this.startModalIdleEyeCycle();
    }

    closeAskModal() {
      this.isModalOpen = false;
      const overlay = this.querySelector('#paku-modal-overlay');
      const modal = this.querySelector('#paku-ask-modal');
      if (overlay) overlay.classList.remove('active');
      if (modal) modal.classList.remove('active');

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
              pLeft.style.transform = 'translate(0px, -0.25px)';
              pRight.style.transform = 'translate(0px, -0.25px)';
            } else {
              // Looking down towards the inquiry form modal
              pLeft.style.transform = 'translate(-0.75px, 1.35px)';
              pRight.style.transform = 'translate(-0.75px, 1.35px)';
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
      const messageInput = this.querySelector('#paku-user-message');

      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = (nameInput && nameInput.value || '').trim();
        const message = (messageInput && messageInput.value || '').trim();
        const type = this.inquiryType;

        if (!name) {
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = 'অনুগ্রহ করে আপনার নাম লিখুন।';
          }
          if (nameInput) nameInput.focus();
          return;
        }

        if (!message) {
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = 'অনুগ্রহ করে বার্তা বা প্রশ্ন লিখুন।';
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
              body: JSON.stringify({ name, type, message })
            });
            if (res.status === 404) {
              res = await fetch('/api/ask-paku', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, message })
              });
            }
          } catch (_) {
            res = await fetch('/api/ask-paku', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, type, message })
            });
          }

          let data = {};
          try {
            data = await res.json();
          } catch (_) { }

          if (res.ok && data.success !== false) {
            if (statusEl) {
              statusEl.className = 'paku-form-status success';
              statusEl.textContent = data.message || 'ধন্যবাদ! আপনার বার্তা সরাসরি টেলিগ্রামে পৌঁছে গেছে।';
            }

            if (form) form.reset();

            // Close modal after 1.2s and celebrate with dialogue and blink
            setTimeout(() => {
              this.closeAskModal();
              if (type === 'recommendation') {
                this.say('অসাধারণ পরামর্শ! মঞ্চাইছেকে আরও সুন্দর করে তুলতে আপনার এই ভাবনা অনেক কাজে দেবে।', 'normal', 6500);
              } else {
                this.say('আপনার প্রশ্ন পেয়েছি! মঞ্চাইছে টিমের সাথে আলোচনা করে শীঘ্রই উত্তর দেওয়া হবে।', 'normal', 6500);
              }
              this.triggerBlink();
            }, 1200);
          } else {
            throw new Error(data.error || 'সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
          }
        } catch (err) {
          this.shake();
          if (statusEl) {
            statusEl.className = 'paku-form-status error';
            statusEl.textContent = err.message || 'পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
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
    say(message, mood = 'normal', duration = 6000) {
      const bubble = this.querySelector('#paku-speech-bubble');
      const textEl = this.querySelector('#paku-speech-text');
      if (!bubble || !textEl) return;

      textEl.textContent = message;

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
      this.setSleepy(false);
      this.hideSpeech();
    }

    hideSpeech() {
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
      const wrapper = this.querySelector('#paku-mascot-wrapper');
      if (!wrapper) return;

      this.clearSequenceTimeouts();
      this.setSleepy(false);

      wrapper.classList.remove('shake');
      void wrapper.offsetWidth;
      wrapper.classList.add('shake');

      setTimeout(() => {
        wrapper.classList.remove('shake');
      }, 700);
    }

    // --- TRUE 3D ON-AXIS BEYBLADE VERTICAL SPIN (rotateY) ---
    spin() {
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
      this.say('আরে আরে থামা! মাথা ঘুরায়া মাটিতে পইড়া যামু তো!', 'dizzy', 6000);

      // Cancel any prior spin RAF or dizzy timeout
      if (this.spinRaf) {
        cancelAnimationFrame(this.spinRaf);
        this.spinRaf = null;
      }
      if (this.dizzyTimeout) {
        clearTimeout(this.dizzyTimeout);
        this.dizzyTimeout = null;
      }

      // Smooth on-axis Beyblade spin with synchronized 4-phase face culling & strict opacity invariant = 1.000
      const duration = 2400; // ms
      const totalRotation = 2160; // 6 full turns (rotateY)
      const startTime = performance.now();

      const lFront = this.faceFront;
      const lSpool = this.spoolLayer;
      const lFloor = this.cavityFloor;
      const lBack = this.faceBack;
      const lSideLeft = this.faceLeft;
      const lSideRight = this.faceRight;

      const updateAngle = (deg) => {
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

        shuttle.style.transform = `rotateY(${deg.toFixed(2)}deg)`;
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

        updateAngle(deg);

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

    // --- CONSTANT BLINK CONTROLLER (EVERY 4 SECONDS) ---
    setupBlinkTimer() {
      if (this.blinkTimer) clearInterval(this.blinkTimer);
      this.blinkTimer = setInterval(() => {
        this.triggerBlink();
      }, 4000);
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

    // --- SUBTLE GAZE TRACKING ---
    setupGazeTracking() {
      let isTicking = false;
      window.addEventListener('mousemove', (e) => {
        this.lastUserActivity = performance.now();
        if (isTicking || this.isDragging) return;
        isTicking = true;

        requestAnimationFrame(() => {
          isTicking = false;
          if (!this.pupilLeft || !this.pupilRight) return;
          const eyes = this.querySelector('#paku-eyes');
          if (eyes && eyes.classList.contains('dizzy')) return;

          const rect = this.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          // Origin approx at eye center
          const centerX = rect.left + rect.width * 0.5;
          const centerY = rect.top + rect.height * 0.28;

          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const distance = Math.hypot(deltaX, deltaY) || 1;

          // Subtle clamp: max 1.2px horizontal, 0.7px vertical
          const maxShiftX = 1.2;
          const maxShiftY = 0.7;

          const shiftX = Math.max(-maxShiftX, Math.min(maxShiftX, (deltaX / distance) * Math.min(distance / 120, maxShiftX)));
          const shiftY = Math.max(-maxShiftY, Math.min(maxShiftY, (deltaY / distance) * Math.min(distance / 120, maxShiftY)));

          const transformVal = `translate(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px)`;
          this.pupilLeft.style.transform = transformVal;
          this.pupilRight.style.transform = transformVal;
        });
      }, { passive: true });

      window.addEventListener('keydown', () => {
        this.lastUserActivity = performance.now();
      }, { passive: true });
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
      if (wrapper) wrapper.classList.add('paku-pulling');
    }

    onDragMove(clientX, clientY) {
      if (!this.isDragging) return;

      const dx = clientX - this.dragStart.x;
      const dy = clientY - this.dragStart.y;
      this.currentDrag = { x: dx, y: dy };

      if (Math.hypot(dx, dy) > 6) {
        this.wasDragAction = true;
      }

      // Scale screen pixels into SVG coordinates
      const svgScale = 1.15;
      const svgDx = dx * svgScale;
      const svgDy = dy * svgScale;

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
          this.spin();
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
          if (!this.hasShownIdleMessage && !this.isDragging) {
            this.hasShownIdleMessage = true;
            this.say('কী ভাবছেন? ফিতার মাপে কোনো খটকা লাগলে আমায় বইলেন!', 'normal', 7000);
            this.triggerBlink();
          }
        }, 45000); // 45 seconds
      };

      window.addEventListener('mousemove', resetIdle, { passive: true });
      window.addEventListener('keydown', resetIdle, { passive: true });
      window.addEventListener('scroll', resetIdle, { passive: true });
      resetIdle();
    }

    // --- APP EVENT HOOKS ---
    setupAppHooks() {
      // 1. Add to cart event
      window.addEventListener('paku:cart-add', (e) => {
        this.clearSequenceTimeouts();
        this.setSleepy(false);
        this.say('চমৎকার পছন্দ! তাঁতির নিপুণ হাতের কাজ কিন্তু এটা।', 'normal', 5000);
        this.triggerBlink();
      });

      // 2. Checkout form validation error
      window.addEventListener('paku:checkout-error', (e) => {
        this.clearSequenceTimeouts();
        this.setSleepy(false);
        this.shake();
        this.say('ঠিকানা আর ফোন নম্বর না দিলে পার্সেল পাঠামু কার কাছে?', 'alarmed', 6500);
      });

      // 3. Payment method selection
      window.addEventListener('paku:payment-select', (e) => {
        this.clearSequenceTimeouts();
        this.setSleepy(false);
        const method = e.detail && e.detail.method;
        if (method === 'cod') {
          this.say('ক্যাশ অন ডেলিভারি? বেশ, পার্সেল বুইঝা পাইয়া তারপর টাকা দিয়েন।', 'normal', 5500);
        } else if (method === 'mfs') {
          this.say('টাকা সেন্ড মানি করার পর TrxID দিতে ভুলবেন না যেন! নাইলে পার্সেল আটকায়া যাইব।', 'normal', 6500);
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
              this.say('কার্ট তো খাঁ খাঁ করতাছে! কিছু পছন্দ হইলো না?', 'normal', 5000);
            }
          });
        }

        const mfsRadio = document.querySelector('input[name="paymentMethod"][value="mfs"]');
        if (mfsRadio) {
          mfsRadio.addEventListener('change', () => {
            if (mfsRadio.checked) {
              this.clearSequenceTimeouts();
              this.setSleepy(false);
              this.say('টাকা সেন্ড মানি করার পর TrxID দিতে ভুলবেন না যেন! নাইলে পার্সেল আটকায়া যাইব।', 'normal', 6500);
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
