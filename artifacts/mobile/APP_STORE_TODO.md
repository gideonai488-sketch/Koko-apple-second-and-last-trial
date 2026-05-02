# 1st Koko Spot — App Store Launch Checklist

## ✅ Already Done (In App)

- [x] App renamed to **"1st Koko Spot"**
- [x] Bundle ID set: `com.firstkokospot.app`
- [x] Android package: `com.firstkokospot.app`
- [x] App scheme: `firstkokospot`
- [x] App version: `1.0.0` (iOS buildNumber: 1, Android versionCode: 1)
- [x] Supabase database connected (products, orders, order_items, profiles)
- [x] Paystack payment integration
- [x] Supabase Auth (email/password sign-in + sign-up)
- [x] Dark mode support (Light / Dark / System)
- [x] All profile sub-pages built:
  - [x] Saved Addresses
  - [x] Payment Methods
  - [x] Promo Codes
  - [x] Loyalty Points
  - [x] Notifications
  - [x] Dark Mode
  - [x] Language
  - [x] Help Center
  - [x] Privacy Policy
  - [x] Terms of Service
  - [x] Delete Account
- [x] `eas.json` created with development / preview / production profiles
- [x] App icon generated and set

---

## 🔧 You Need To Do — Before Submitting

### Step 1: Create Accounts (if not done)

- [ ] Create **Apple Developer Account** → https://developer.apple.com/enroll/
  - Cost: **$99/year**
  - Takes 1–2 days for approval
- [ ] Create **Google Play Developer Account** → https://play.google.com/console/signup
  - Cost: **$25 one-time**

### Step 2: Set Up EAS (Expo Application Services)

Run these commands in your terminal:

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account (create one at expo.dev if needed)
eas login

# Link this project to EAS (run from artifacts/mobile/)
cd artifacts/mobile
eas init

# This gives you an EAS Project ID — paste it into app.json > extra > eas > projectId
```

- [ ] Sign up at **expo.dev**
- [ ] Run `eas init` in `artifacts/mobile/`
- [ ] Replace `"YOUR_EAS_PROJECT_ID"` in `app.json` with your real EAS project ID

### Step 3: Update Placeholder Credentials in eas.json

Open `artifacts/mobile/eas.json` and fill in:

```json
"ios": {
  "appleId": "YOUR_ACTUAL_APPLE_ID_EMAIL",
  "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
  "appleTeamId": "YOUR_10_CHAR_TEAM_ID"
}
```

- [ ] `appleId` → Your Apple ID email
- [ ] `ascAppId` → Found in App Store Connect → App → App Information → Apple ID
- [ ] `appleTeamId` → Found at developer.apple.com → Membership → Team ID

### Step 4: Create App in Stores

**Apple App Store Connect:**
- [ ] Go to https://appstoreconnect.apple.com
- [ ] Create new app → Bundle ID: `com.firstkokospot.app`
- [ ] Fill in app name, description, screenshots, category (Food & Drink)
- [ ] Set pricing to Free

**Google Play Console:**
- [ ] Go to https://play.google.com/console
- [ ] Create new app → Package: `com.firstkokospot.app`
- [ ] Fill in store listing, screenshots, content rating

### Step 5: Build & Submit

```bash
cd artifacts/mobile

# Build for iOS (App Store)
eas build --platform ios --profile production

# Build for Android (Play Store)
eas build --platform android --profile production

# Submit to Apple
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

- [ ] Run iOS production build
- [ ] Run Android production build
- [ ] Submit iOS to App Store
- [ ] Submit Android to Play Store

---

## 📱 App Store Listing — Content to Prepare

### App Name
`1st Koko Spot`

### Subtitle (iOS, max 30 chars)
`Authentic West African Food`

### Description
```
1st Koko Spot brings the best of West African home cooking straight to your door.

Order fresh Jollof Rice, Banku & Tilapia, Waakye, Kelewele, Grilled Chicken, and more — all made fresh daily.

FEATURES:
• Browse our full menu with photos and descriptions
• Flash Deals with real-time countdown
• Secure payment via Paystack (cards + mobile money)
• Live order tracking
• Earn Koko Loyalty Points on every order
• Save your favourite addresses
• Dark mode support

Delivering across Accra. Mon–Sun, 7am–10pm.
```

### Keywords (iOS)
`jollof rice, ghana food, african restaurant, food delivery, accra, waakye, banku, west african`

### Category
Food & Drink

### Screenshots Needed (iOS)
- [ ] 6.7" iPhone screenshots (1290 × 2796px) — 3–5 required
- [ ] 5.5" iPhone screenshots (1242 × 2208px)
- [ ] 12.9" iPad screenshots (if tablet supported)

**Suggested screens to screenshot:**
1. Home screen (with food photos + Flash Deals)
2. Menu/item detail page
3. Cart screen
4. Sign-in screen
5. Profile screen

### Screenshots Needed (Android)
- [ ] Phone screenshots (min 320dp wide)
- [ ] Feature graphic (1024 × 500px)

---

## 🔐 Supabase — Production Setup

- [ ] In Supabase dashboard, go to **Authentication → Email Templates**
  - Customize the confirmation email with 1st Koko Spot branding
- [ ] Set up **Row Level Security (RLS)** on tables (orders, profiles)
  - Users should only see their own orders
- [ ] Set up **Site URL** in Supabase Auth settings:
  - Add: `firstkokospot://` as an allowed redirect URL
- [ ] Add your production domain to **Allowed Origins** in Supabase

---

## 💳 Paystack — Production Setup

- [ ] Log in at https://dashboard.paystack.com
- [ ] Ensure your business is verified (required for live payments)
- [ ] Set **Callback URL** and **Webhook URL** in Settings → API Keys & Webhooks
- [ ] Confirm `EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY` is your live key (already set ✅)
- [ ] Test a live GHS payment before submitting to stores

---

## 📋 Apple Review Notes

Apple will review your app. Common rejections to avoid:
- [ ] Ensure "Delete Account" works correctly (Apple requires it — already built ✅)
- [ ] Privacy Policy URL must be live on the web — host it or use a simple page
  - Quick option: paste the Privacy Policy text into a free site like notion.so
- [ ] App must work without crashing on review devices

---

## 🌐 Optional — Custom Domain

If you want a website/landing page for the app:
- Register `firstkokospot.com` at namecheap.com or godaddy.com (~$12/year)
- Host your Privacy Policy and Terms of Service there
- Add it to App Store listing as "Support URL"

---

*Generated by Replit Agent · 1st Koko Spot v1.0.0*
