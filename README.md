# Fahim-er Banglish Translator ✨

A modern, fast, and social-media-friendly **Banglish (Romanized Bangla) translator** that transforms **any language** into natural Banglish — optimized for chats, posts, and everyday communication.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Google Gemini AI**.

---

## 🚀 Live Demo
[https://banglish-translator.vercel.app](https://banglish-translator.vercel.app)

---

## ✨ Features

- 🌍 **Multi-language input**
  - Supports Bangla, English, Chinese, Japanese, Arabic, Hindi, Russian, German, and more
- 📝 **Strict Bangla → Banglish transliteration**
  - Word-by-word conversion (no paraphrasing)
- 💬 **Natural conversational Banglish**
  - Optimized for chats & social media
- 🔧 **Smart Banglish handling**
  - Fixes spelling if the input is already Banglish
- ⚡ **Fast AI-powered conversion**
  - Powered by Google Gemini (`gemini-2.5-flash`)
- 🎯 **Usage limits**
  - Enforced by the server against authenticated Firebase users
- 🌗 **Light / Dark mode**
  - System-aware theme toggle
- ⌨️ **Keyboard support**
  - `Ctrl + Enter` / `Cmd + Enter` to convert
- ♿ **Accessible by design**
  - Screen-reader & keyboard friendly
- 🎨 **Polished UI**
  - Smooth animations & typing effect

---

## ✨ Core Capabilities

### 🌍 Multi-Language Support
- Supports:
  - Bangla
  - English
  - Hindi
  - Chinese
  - Japanese
  - Arabic
  - Russian
  - German
- Converts everything into **Banglish**

## 🎭 Style-Based Banglish Conversion

The translator supports **multiple writing styles**, allowing users to generate Banglish that perfectly matches their tone and context.

---

## ✅ Available Styles

| Style | Description |
|------|-------------|
| **Casual** | Natural, everyday Banglish for chatting |
| **Funny** | Light humor, playful tone, fun expressions |
| **Professional** | Clean, polite, office-friendly Banglish |
| **Romantic** | Soft, emotional, expressive tone |
| **Attitude** | Confident, bold, stylish Banglish |
| **Facebook Post** | Social-friendly, expressive writing |
| **Storytelling** | Narrative flow with emotional depth |

---

## 🧠 Smart Style Engine

Each style follows a **strict rule-based AI prompt system** to ensure high-quality and consistent output:

- ✅ Converts **any language → Banglish**
- ✅ Preserves meaning and sentence structure
- ✅ Fixes spelling if input is already Banglish
- ✅ Keeps tone consistent per selected style
- ✅ Prevents unwanted English output
- ✅ Emoji usage controlled per style
- ✅ No hallucination or unnecessary rewriting

---

## 🎯 How It Works

1. User selects a **style** (Casual, Funny, Professional, etc.)
2. User enters text in **any language**
3. AI applies:
   - Global Banglish conversion rules  
   - Style-specific tone logic  
4. Output is returned as **natural Banglish**

---

### 🔤 Smart Banglish Conversion
- ✅ Word-by-word Bangla transliteration  
- ✅ Fixes spelling if input is already Banglish  
- ✅ Converts foreign languages naturally  
- ✅ Keeps sentence structure  
- ✅ Preserves punctuation & tone  

---

### ⚡ AI-Powered
- Powered by **Google Gemini (gemini-2.5-flash)**
- Optimized prompt engineering for:
  - Accuracy
  - Speed
  - Chat-style output
  - Zero hallucination

---

### 🧠 Smart Usage & Credit System

#### FREE Users
- Daily usage limit enforced by the server
- Auto reset every 24 hours
- Ideal for casual use

#### Paid Users
- Monthly credit limit
- No daily restriction
- Higher conversion quota

#### 🔄 Realtime Updates
- Live usage tracking
- Firestore `onSnapshot` listener
- UI updates instantly

---

### 📊 Credit Tracking
- Daily usage (Free plan)
- Monthly usage (Paid plans)
- Auto reset system
- Live credit display
- Upgrade CTA when limit reached

---

## 🔁 Credit Logic

### FREE Users
- 2 conversions per day
- Resets every 24 hours
- Daily limit enforced

### Paid Users
- Monthly quota
- No daily limit
- Resets monthly

---

### 🔐 Authentication
- Google Sign-In (Firebase Auth)
- Secure session handling
- Firestore user profile
- Auto user creation

---

### 💳 Upgrade Flow
- Upgrade modal
- Centralized upgrade handler
- Ready for Stripe / LemonSqueezy
- Plan-based UI rendering

---

## 💳 Payment Gateway & Subscription System (Bangladesh 🇧🇩)

The project includes a **Bangladesh-ready subscription payment system** designed for SaaS-style upgrades, using **SSLCommerz** as the primary payment gateway.

This system is built with **security-first backend pricing logic**, ensuring users cannot manipulate plan prices from the client side.

---

### 🔐 Secure Pricing Architecture

- Frontend sends **only the selected plan name**
- All prices are defined **server-side**
- Payment amount is calculated securely on the backend
- Prevents price tampering via DevTools or API calls

```ts
FREE → ৳0  
STARTER → ৳499  
PRO → ৳999  
BUSINESS → ৳2999
```
---

### 🎨 UI / UX Highlights
- Modern glassmorphism UI
- Responsive design
- Smooth typing animation
- Dark / Light mode
- Keyboard shortcuts  
  - `Ctrl + Enter`
  - `Cmd + Enter`
- Accessible (ARIA + keyboard support)

---

### 🧠 Intelligent Logic
- Monthly limit checked first
- Daily limit only for FREE users
- Auto reset logic
- Safe fallback handling

---

## 🧠 Conversion Rules

The AI prompt enforces the following rules:

- Convert **ALL languages** into Banglish
- **Bangla text**
  - Strict transliteration (no rewriting)
- **Already Banglish**
  - Fix spelling mistakes only
  - Do NOT change sentence structure
- **English & other languages**
  - Convert to natural spoken Banglish
- Preserve:
  - Punctuation
  - Casual English words (`hi`, `hello`, `ok`, `wow`)
- Output:
  - Banglish only
  - No explanations

---

## ♿ Accessibility Highlights

- Screen-reader-only labels
- Keyboard navigation (Tab order)
- Focus-visible states
- ARIA attributes for buttons and text areas
- Semantic HTML structure
- Form submission via Ctrl+Enter / Cmd+Enter

---

## 🧩 Future Improvements

- IP-level rate limiting
- Conversion history
- Language detection badge
- Offline fallback rules
- PWA support

---

## 🚧 Current Limitations

- Usage limits are account-based; general IP-level rate limiting is not configured
- Conversion requests require Google sign-in and Firebase Admin credentials on the server
- Free-tier Gemini API constraints
- Conversion input is limited to 4,000 characters

---

## 🛠 Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Lucide Icons
- Sonner (toast notifications)

### Backend
- Firebase Auth
- Firestore
- Google Gemini AI
- Next.js API Routes

## 🧪 Testing

### Server credentials

Conversion requests require a Firebase ID token and use the Firebase Admin SDK
to verify the user and atomically enforce the account's usage limits. Configure
`FIREBASE_SERVICE_ACCOUNT_JSON` with the service account JSON for the Firebase
project, or configure Application Default Credentials in the server environment.
Set `FIREBASE_PROJECT_ID` to the same project as the client Firebase config, or
ensure `NEXT_PUBLIC_PROJECT_ID` is available to the server. Never expose service
account credentials to the browser.

This project uses **Jest** and **React Testing Library** for testing React components and frontend logic.

### How to Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

```

## ⭐ Support
If you like this project, please give it a ⭐ on GitHub!