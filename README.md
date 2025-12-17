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
   Install dependencies:

bash
npm install
# or
yarn install
# or
pnpm install
Configure Environment Variables:
Create a .env.local file in the root directory:

env
VITE_GEMINI_API_KEY=your_actual_api_key_here
Start the development server:

bash
npm run dev
The app will open at http://localhost:5173

Build for Production:

bash
npm run build
The optimized files will be in the dist/ folder, ready for deployment.

🔧 Core AI Implementations
Disease Detection Pipeline
User uploads crop image

Image sent to Gemini 3 Pro with structured prompt

AI returns JSON with disease identification, confidence score, and treatment plan

Response displayed in user's preferred language

Yield Prediction Engine
Farmer inputs 7+ parameters (soil type, irrigation method, seed variety, acreage, etc.)

Gemini 3 Pro performs agronomic simulation based on training data

Returns precise yield range with influencing factors and expert suggestions

All calculations performed client-side for privacy

Voice Interaction System
Browser SpeechRecognition captures audio in native language

Text sent to Gemini 2.5 Flash for low-latency processing

AI responds in same language with agricultural advice

Browser Text-to-Speech delivers response with regional accent

Real-Time Data Integration
User queries about market prices or weather

Gemini uses googleSearch tool to fetch current data

AI synthesizes search results with contextual advice

Grounded information delivered to farmer

🌍 Impact & Innovation
Economic Impact
Yield Increase: Early disease detection can save up to 20% of harvest

Cost Reduction: Prevents overuse of fertilizers and pesticides

Market Awareness: Real-time price analysis for better selling decisions

Social Innovation
9+ Languages Deeply Integrated: AI generates responses natively in the user's chosen language

Voice-First Design: Hands-free operation suitable for field use

Accessibility: No English requirement or complex forms

Technical Innovation
Client-Side AI Architecture: Fast, privacy-focused, cost-effective hosting

Multimodal Processing: Combines image analysis with reasoning capabilities

Real-Time Grounding: Integrates live web data with AI reasoning

🔮 Roadmap
IoT Integration: Connect with soil moisture & NPK sensors (Arduino/ESP32)

Community Marketplace: Peer-to-peer platform for selling produce and renting equipment

Government Scheme Assistant: Automated matching with agricultural subsidies

Expanded Language Support: Additional regional languages and dialects

Backend Integration: Firebase for authentication and data persistence

🤝 Contributing
We welcome contributions to enhance Bhumi's capabilities for farmers worldwide!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

Please ensure your code follows the existing style and includes appropriate documentation.

📄 License
Distributed under the MIT License. See LICENSE for more information.

👥 Team
Project Lead & Developer:

Dipayan Sardar - dipayansardar73@gmail.com

Acknowledgments
Google for the Gemini API

The open-source community for React, Vite, Tailwind CSS, and other libraries

Farmers worldwide who inspire this work

📬 Contact
GitHub Repository: https://github.com/dipayansardar73-decode/BHUMI_THE_FUTURE_OF_AGRICULTURE

Contact Email: dipayansardar73@gmail.com


