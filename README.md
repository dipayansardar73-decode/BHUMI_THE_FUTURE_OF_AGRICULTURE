# 🌾 Bhumi: Smart Farming Assistant

**Democratizing Agricultural Intelligence with AI.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-purple)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-green)](https://web.dev/progressive-web-apps/)

**Bhumi** is a Progressive Web App (PWA) that acts as an **"AI Agronomist in your pocket."** Built for small-scale farmers, it breaks language and literacy barriers by providing real-time crop disease diagnosis, hyper-local farming advice, and market insights through intuitive voice and image interactions powered by Google's Gemini AI.

> **Vision**: Cultivating the future of agriculture by empowering farmers with technology to build more sustainable, resilient, and profitable businesses.

---

## ✨ Key Features

### AI-Powered Disease Detection
Upload a photo of a crop leaf or plant. Gemini 3 Pro analyzes the image to identify diseases/pests and provides a complete diagnosis with treatment (organic/chemical) and prevention steps.

### Native Language Voice Agent (Bhumi Live)
Speak naturally to the app in your local dialect (Hindi, Odia, Bengali, Spanish, Mandarin, etc.). Get conversational advice on weather, market prices, or pest control without ever touching your screen. Features true voice-to-voice interaction with regional accents.

### Smart Advisory & Yield Prediction
Input crop details, soil type, irrigation, and seed variety. Gemini's reasoning models run complex agronomic simulations to provide:
- Personalized crop recommendations
- Precision yield forecasts (e.g., "14.0 - 17.5 Tonnes for 5 Acres")
- Expert agronomist suggestions for irrigation, fertilizer, and pest control

### Analytics Hub
Visualize your farm's performance across key metrics: annual yield trends, market price movements, and expense distribution. Generate strategic AI summaries of your data with one click.

### Grounded in Reality
AI uses the **Google Search Tool** to fetch live **market prices (Mandi rates)** and **real-time weather alerts**, ensuring advice is practical, timely, and trustworthy.

### Installable PWA
Works offline for basic functions and installs directly to your phone's home screen like a native app—no app store download required.

---

## 🚀 Live Test

**Test the application directly in your browser:**
👉 **[Live Bhumi Application](https://ai.studio.apps.drive/1vb5mhOsrY1MB02qq9fb5fE2W2nawBCQv?fullscreenApplet=true)**

*Note: You may need to allow microphone access for voice features and camera access for disease detection.*

---

## 🛠️ Tech Stack

**Frontend & UI:**
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with Glassmorphism design)
- **Icons:** Lucide React
- **Charts:** Recharts

**Artificial Intelligence:**
- **SDK:** Google GenAI SDK (`@google/genai`)
- **Vision & Reasoning:** `gemini-3-pro-preview` (Image analysis, complex agronomic logic)
- **Conversation:** `gemini-2.5-flash` (Low-latency voice agent)
- **Tools:** `googleSearch` (Live market/weather data grounding)

**Browser APIs & PWA:**
- **Speech Recognition & Synthesis:** Native browser APIs for voice interaction
- **Geolocation:** For hyper-local weather and advisory
- **Service Worker & Manifest:** Full PWA capabilities with offline support

**Architecture:**
- **Current:** Serverless/Client-side AI with mock backend using `localStorage`
- **Planned:** Firebase (Authentication & Firestore)

---

## 🔧 Local Development

### Prerequisites
- Node.js (v18 or later)
- A **Google AI Studio API Key** (Get it free from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dipayansardar73-decode/BHUMI_THE_FUTURE_OF_AGRICULTURE.git
   cd BHUMI_THE_FUTURE_OF_AGRICULTURE
