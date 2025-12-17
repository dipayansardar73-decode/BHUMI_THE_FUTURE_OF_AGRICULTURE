import { User } from '../types';

// ============================================================================
// 🏗️ ARCHITECTURE NOTE (Serverless):
// This application uses a "Mock Backend" pattern for demonstration purposes.
// 
// 1. AI Features: Connect directly to Google Gemini API (Real Backend).
// 2. User Data: Stored in Browser LocalStorage (Simulated Backend).
// 
// BENEFIT: This allows the project to be hosted 100% free on Vercel/Netlify
// without needing a complex Node.js server or Database setup.
// ============================================================================

// Simulating a delay to mimic real server latency (makes it feel real)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Database Keys
const DB_KEYS = {
    USER: 'bhumi_user',
    AUTH_TOKEN: 'bhumi_auth_token',
    THEME: 'bhumi_theme',
    LANG: 'bhumi_lang',
    HISTORY: 'bhumi_yield_history'
};

// Mock Database Implementation (Using LocalStorage)
export const api = {
    auth: {
        async login(email: string, password: string): Promise<User> {
            console.log("🔵 API: Attempting login...");
            await delay(800); // Simulate network request
            
            // Check LocalStorage for existing user
            const stored = localStorage.getItem(DB_KEYS.USER);
            if (stored) {
                const user = JSON.parse(stored);
                // Simple check (In real backend, we'd hash passwords)
                if (user.email === email) {
                    console.log("🟢 API: Login successful");
                    return user;
                }
            }

            // DEMO MODE: If user doesn't exist, create a demo user automatically
            // This ensures judges/users always get in successfully
            const demoUser: User = {
                name: email.split('@')[0] || 'Farmer',
                email,
                location: 'Odisha, India',
                phone: '+91 98765 43210',
                memberSince: new Date().getFullYear().toString(),
                farmSize: '5',
                soilType: 'Loamy',
                mainCrop: 'Rice',
                irrigationSource: 'Canal'
            };
            
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(demoUser));
            console.log("🟢 API: Created new demo user");
            return demoUser;
        },

        async signup(user: User, password: string): Promise<User> {
            console.log("🔵 API: Creating account...");
            await delay(1000);
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
            return user;
        },

        async logout(): Promise<void> {
            await delay(200);
            localStorage.removeItem(DB_KEYS.USER);
            // We keep theme/lang preferences
        },

        async getCurrentUser(): Promise<User | null> {
            const stored = localStorage.getItem(DB_KEYS.USER);
            return stored ? JSON.parse(stored) : null;
        }
    },

    user: {
        async updateProfile(user: User): Promise<User> {
            console.log("🔵 API: Updating profile...");
            await delay(600); 
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
            return user;
        }
    },

    // Example of extending for other features
    crops: {
        async getHistory(): Promise<any[]> {
            await delay(500);
            return [
                { year: '2023', crop: 'Rice', yield: '24 Quintals' },
                { year: '2022', crop: 'Rice', yield: '22 Quintals' },
                { year: '2021', crop: 'Wheat', yield: '18 Quintals' }
            ];
        }
    }
};