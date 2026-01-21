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
- 🎯 **Daily usage limit**
  - Lightweight client-side limit (suitable for testing & demos)
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
- Daily soft limit
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

- Server-side rate limiting
- User accounts and login
- Conversion history
- Language detection badge
- Offline fallback rules
- PWA support

---

## 🚧 Current Limitations

- Client-side usage limit (4 conversions/day)
- No authentication
- Free-tier Gemini API constraints
- Max input length limited to 200 characters for free testing

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