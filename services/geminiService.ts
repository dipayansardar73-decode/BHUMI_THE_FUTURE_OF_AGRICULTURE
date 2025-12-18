import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseResult, CropRec, YieldResult, AdvisoryResult, WeatherData } from "../types";

// ROBUST KEY RETRIEVAL:
// 1. Check process.env.API_KEY (Node/standard envs)
// 2. Check import.meta.env.VITE_API_KEY (Vite/Production builds)
// 3. Fallback to empty string (will cause error if used)
const getApiKey = () => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
        // @ts-ignore
        return import.meta.env.VITE_API_KEY;
    }
    return process.env.API_KEY || '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

const MODEL_REASONING = 'gemini-3-pro-preview';
const MODEL_VISION = 'gemini-3-pro-preview'; 
const MODEL_FAST = 'gemini-3-flash-preview';

// Helper to check if key is present for UI indicators
export const isConfigured = () => !!apiKey && apiKey.length > 0;

const getLangName = (code: string) => {
    const map: Record<string, string> = {
        en: 'English', hi: 'Hindi', or: 'Odia', bn: 'Bengali', 
        zh: 'Mandarin Chinese', es: 'Spanish', ru: 'Russian', 
        ja: 'Japanese', pt: 'Portuguese'
    };
    return map[code] || 'English';
};

// Helper to validate key existence before calls
const checkApiKey = () => {
    if (!apiKey) {
        console.error("API Key is missing! Please set VITE_API_KEY or API_KEY in your environment variables.");
        throw new Error("API Key missing. Please configure VITE_API_KEY in your .env file or deployment settings.");
    }
};

export const analyzeCropDisease = async (base64Image: string, language: string): Promise<DiseaseResult> => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const prompt = `Analyze this image of a crop. Identify if there is any disease. 
        If healthy, state it. If diseased, provide the name, confidence level (0-100), treatment, and preventative measures.
        Respond in language: ${langName}.`;

        const response = await ai.models.generateContent({
            model: MODEL_VISION,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        disease: { type: Type.STRING },
                        confidence: { type: Type.NUMBER },
                        treatment: { type: Type.STRING },
                        preventative: { type: Type.STRING }
                    },
                    required: ["disease", "confidence", "treatment", "preventative"]
                }
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        return JSON.parse(text) as DiseaseResult;
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        throw error;
    }
};

export const getCropRecommendations = async (soil: string, season: string, location: string, language: string): Promise<CropRec[]> => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const prompt = `Suggest 3 suitable crops for: Soil=${soil}, Season=${season}, Location=${location}. 
        Provide suitability percentage, reason, and duration. Language: ${langName}.`;

        const response = await ai.models.generateContent({
            model: MODEL_REASONING,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            suitability: { type: Type.NUMBER },
                            reason: { type: Type.STRING },
                            duration: { type: Type.STRING }
                        },
                        required: ["name", "suitability", "reason", "duration"]
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return [];
        return JSON.parse(text) as CropRec[];
    } catch (error) {
        console.error("Gemini Recommendation Error:", error);
        return [];
    }
};

export const chatWithBhumi = async (history: {role: string, parts: {text: string}[]}[], message: string, language: string) => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const chat = ai.chats.create({
            model: MODEL_REASONING,
            history: history,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: `You are Bhumi, a wise and friendly agricultural expert friend. 
                - Your Goal: Help farmers with practical, empathetic advice.
                - Personality: Warm, human-like, encouraging. Avoid being robotic. Speak like a knowledgeable neighbor.
                - Language Rule: You MUST strictly respond in ${langName} ONLY.
                - Capabilities: Use Google Search to provide REAL-TIME weather, prices, and news.
                - Formatting: Keep paragraphs short. Do NOT use Markdown.`
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        throw error;
    }
};

// Simplified Agent for Voice interaction (Faster Model)
export const voiceAgentChat = async (message: string) => {
    if (!apiKey) return "Please configure your API Key to chat with Bhumi.";
    try {
        const chat = ai.chats.create({
            model: MODEL_FAST,
            config: {
                 systemInstruction: `You are Bhumi, a magical farm spirit voice. 
                 Keep answers VERY short (1-2 sentences), conversational, and helpful. 
                 You are talking to a farmer. Be instant and warm.`
            }
        });
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        return "I am having trouble hearing you clearly.";
    }
};

export const getYieldPrediction = async (data: any, language: string): Promise<YieldResult> => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const prompt = `Act as an expert agronomist. Predict crop yield based on detailed inputs: 
        Crop: ${data.crop}, Area: ${data.area} acres, Soil: ${data.soil}, Season: ${data.season}, Previous Crop: ${data.previous}, Irrigation: ${data.irrigation}, Seed Variety: ${data.seed}.
        Language: ${langName}.
        Provide output in JSON format including yield range, unit, confidence, influencing factors, and agronomic suggestions.`;

        const response = await ai.models.generateContent({
            model: MODEL_REASONING,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        predicted_yield: { type: Type.STRING, description: "e.g. 2.5 - 3.0" },
                        unit: { type: Type.STRING, description: "e.g. Tonnes" },
                        confidence: { type: Type.NUMBER },
                        influencing_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestions: { type: Type.STRING }
                    },
                    required: ["predicted_yield", "unit", "confidence", "influencing_factors", "suggestions"]
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No data");
        return JSON.parse(text) as YieldResult;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getSmartAdvisory = async (data: any, language: string): Promise<AdvisoryResult> => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const prompt = `Provide specific agricultural advice for:
        Crop: ${data.crop}, Stage: ${data.stage}, Problem: ${data.problem || 'General Care'}.
        Language: ${langName}.
        Return JSON with specific fields for Irrigation, Fertilizer, and Pesticides.`;

        const response = await ai.models.generateContent({
            model: MODEL_REASONING,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        irrigation: { type: Type.STRING },
                        fertilizer: { type: Type.STRING },
                        pesticides: { type: Type.STRING }
                    },
                    required: ["irrigation", "fertilizer", "pesticides"]
                }
            }
        });
        return JSON.parse(response.text || '{}') as AdvisoryResult;
    } catch (e) {
        console.error(e);
        return { irrigation: "N/A", fertilizer: "N/A", pesticides: "N/A" };
    }
};

export const getWeatherForecast = async (location: string, language: string): Promise<WeatherData> => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const prompt = `Get current weather and 5-day forecast for ${location}. 
        Provide a short farming advisory.
        Translate to ${langName}.
        Return JSON schema.`;

        const response = await ai.models.generateContent({
            model: MODEL_REASONING,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        temp: { type: Type.NUMBER },
                        humidity: { type: Type.NUMBER },
                        windSpeed: { type: Type.NUMBER },
                        condition: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        forecast: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    temp: { type: Type.NUMBER },
                                    icon: { type: Type.STRING, enum: ['sunny', 'rain', 'cloudy', 'storm', 'partly-cloudy'] },
                                    condition: { type: Type.STRING }
                                }
                            }
                        },
                        advisory: { type: Type.STRING }
                    },
                    required: ["temp", "humidity", "windSpeed", "condition", "location", "description", "forecast", "advisory"]
                }
            }
        });
        
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sourceUrls = grounding?.map((g: any) => g.web?.uri).filter((u: any) => u) || [];

        const data = JSON.parse(response.text || '{}') as WeatherData;
        data.sourceUrls = sourceUrls;
        return data;
    } catch (e) {
        console.error("Weather Error", e);
        throw e;
    }
};

export const getAnalyticsInsight = async (data: any, language: string): Promise<string> => {
    checkApiKey();
    try {
        const langName = getLangName(language);
        const prompt = `Analyze this agricultural data and provide strategic insights in ${langName}.
        Data: ${JSON.stringify(data)}
        Use search to check market prices in India.
        Keep it concise.`;

        const response = await ai.models.generateContent({
            model: MODEL_REASONING,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        return response.text || "Analysis unavailable.";
    } catch (e) {
        return "Could not generate analysis.";
    }
};