# 🌱 BHUMI: Smart Farming Assistant

> **Empowering farmers with Gemini 3 Pro Intelligence.**  

## 📖 Overview

**Bhumi** is a production-grade, offline-capable Progressive Web App (PWA) designed to bridge the technology gap for rural farmers. By leveraging the multimodal capabilities of **Google Gemini 3 Pro**, Bhumi provides real-time disease detection, crop recommendations, and personalized farming advisory in **9 native languages**.

Unlike traditional apps that require complex backend infrastructure, Bhumi is architected as a **Serverless Client-Side AI Application**, making it zero-cost to host and incredibly fast.

---

## 🚀 Key Features

### 🤖 Powered by Google Gemini
We utilize the full spectrum of the Gemini API:
*   **Gemini 3 Pro (Vision):** Analyzing uploaded crop images to detect diseases (e.g., Blight, Rust) with confidence scores and treatment plans.
*   **Gemini 3 Pro (Reasoning):** Complex logic for Yield Prediction and Crop Recommendations based on soil parameters.
*   **Gemini 2.5 Flash:** Powering the **Real-time Voice Agent** for low-latency, conversational interactions.
*   **Google Search Grounding:** Fetching real-time weather data and market news to ensure advice is current.

### 🌾 Core Functionalities
1.  **📸 Instant Disease Detection:** Snap a photo of a crop, get instant diagnosis and cure.
2.  **🗣️ Multilingual Voice Agent:** Talk to Bhumi in Hindi, Odia, Bengali, Spanish, and more.
3.  **📊 Yield Prediction:** AI-driven forecasting of harvest quantity based on farm inputs.
4.  **🌦️ Agro-Weather:** Hyper-local weather combined with agronomic advice (e.g., "Spray pesticides today as no rain is forecast").
5.  **📉 Smart Analytics:** Visual dashboard for expenses, yield history, and market trends.
6.  **🌍 Native Language Support:** Full UI translation for 9 languages.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **AI & Logic:** Google GenAI SDK (`@google/genai`)
*   **Styling:** Tailwind CSS, Lucide Icons
*   **Visualization:** Recharts
*   **Architecture:** Serverless / Client-Side (Mock Backend via LocalStorage for demo)
*   **Deployment:** Vercel / Render

---

## ⚙️ Installation & Setup

Bhumi is designed to be easy to run. You do not need a database.

### Prerequisites
*   Node.js (v18+)
*   A Google Gemini API Key

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/bhumi.git
    cd bhumi
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 🏗️ Architecture Note

To ensure high availability and zero maintenance costs for farmers, Bhumi uses a **"Mock Backend"** pattern for this hackathon prototype:
*   **User Data:** Stored securely in the browser's `LocalStorage`.
*   **Authentication:** Simulated for instant access (judges can login immediately).
*   **AI Calls:** Direct secure calls from Client to Google Gemini API.

*Note: A Firebase configuration file is included in `services/firebase.ts` for future scalability to a cloud database.*

---



## 🔮 Future Roadmap

*   [ ] Integration with IoT Soil Sensors.
*   [ ] Community Marketplace for farmers to sell directly.
*   [ ] Offline-first AI models (Gemini Nano) for remote areas without internet.

---

Made with ❤️ by [Your Name/Team Name]

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1vb5mhOsrY1MB02qq9fb5fE2W2nawBCQv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
