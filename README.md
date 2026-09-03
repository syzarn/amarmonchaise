# মঞ্চাইছে | Mon Chaise
> **"যা মন চায় বেচি" (We sell whatever our heart desires)**  
> *যার যা, যেমনে মন চায় (To each their own, however the heart pleases)*

A fast, modern, mobile-friendly bilingual (Bangla-English) e-commerce storefront crafted in clean HTML5, Tailwind CSS, and pure vanilla JavaScript without any heavy frameworks.

---

## 🎨 Design & Aesthetic

- **Theme Inspiration**: Derived directly from the official embroidered profile image:
  - **AMOLED Pitch Black**: Deep canvas (`#040406` / `#0a0a0f`) with a subtle microscopic fabric weave texture.
  - **Golden Yellow Accent**: `#f2c200`, matching the hand-embroidered `"মঞ্চাইছে"` logo.
  - **Handloom Crimson**: `#dc2626` / `#991b1b`, reflecting traditional tribal Chakma/indigenous weave motifs.
  - **Profile Picture Border Decorations**: Scalable SVG borders (`assets/tribal-border.svg`) recreating the crimson chevron weave bands, golden-yellow stepped temple/pagoda spires, geometric teeth, and double-stitched rules across the page ending border, dividers, and accents.
  - **Typography**:
    - **Bengali**: Local `GaramondHalhed` (`files/GaramondHalhed.ttf` and `files/GaramondHalhed-Italic.ttf`).
    - **Decorative / Headline English**: `IM Fell English` (`files/IM Fell English/IM Fell English Regular.otf`, `IM Fell English Italic.otf`, and `IM Fell English SC Regular.otf`).

---

## ✨ Features

1. **Bilingual Engine (BN / EN)**:
   - Instant language switch between বাংলা and English with zero page reloads.
   - Converts numerals to Bengali digits (যেমন: ৳১,৮৫০ / ৳1,850).
   - Remembers user preference in `localStorage`.

2. **Eclectic Product Catalog**:
   - **First Product: ঐতিহ্যবাহী হাতে বোনা থামি (Traditional Handloom Thami)** — indigenous woven wrap textile directly matching the profile photo's pattern.
   - Quirky, nostalgic, and handcrafted items ("selling whatever crosses our mind").
   - Filter pills by category (Handloom & Weaves, Quirks & Oddities, Tea & Aromas, Tech & Desk Toys).
   - Real-time client-side search.
   - Quick View modal for inspecting product details and backstories.

3. **Slide-Over Cart Drawer**:
   - Off-canvas slide-out drawer with backdrop blur and touch gestures.
   - Quantity adjusters (`+` / `-`), remove items, and live subtotal calculation.
   - Cart badge indicator on the floating/header button.
   - Cart persistence via `localStorage`.

4. **BD Smart Checkout & MFS Support**:
   - Customer details: Full Name, Phone Number (BD format: `01...` 11 digits), Delivery Address.
   - **Dynamic District Selection**:
     - *Inside Dhaka* (৳60 delivery fee)
     - *Outside Dhaka* (৳120 delivery fee)
     - Dynamically updates the grand total in real time.
   - **Payment Methods**:
     - **Cash on Delivery (COD)**.
     - **MFS (bKash / Nagad / Rocket / upay)**:
       - Displays official personal numbers with **one-click copy** buttons.
       - Clear step-by-step Send Money instructions.
       - Conditional required fields: **Sender Phone Number** and **TrxID**.
   - Submits payload via JSON POST to `/api/checkout`.
   - Beautiful Order Confirmation Modal with full printable receipt.

5. **Toast Notifications & Loading States**:
   - Minimalist animated toast alerts (Success, Error, Info).
   - Loading spinner on submit button with anti-double-submission lock.

---

## 🚀 How to Run

### Option 1: Standalone (No server needed)
Double-click `index.html` or open it in any web browser. Everything works entirely client-side.

### Option 2: Using the Lightweight Server (with real `/api/checkout`)
Run the included zero-dependency Python dev server:

```bash
python server.py
```

Then visit:
```
http://localhost:8000
```
