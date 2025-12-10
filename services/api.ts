
import { User } from '../types';

// Simulating a delay to mimic real server latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Database Keys
const DB_KEYS = {
    USER: 'bhumi_user',
    AUTH_TOKEN: 'bhumi_auth_token',
    THEME: 'bhumi_theme',
    LANG: 'bhumi_lang'
};

// Mock Database Implementation (Using LocalStorage)
export const api = {
    auth: {
        async login(email: string, password: string): Promise<User> {
            await delay(800); // Simulate network request
            // In a real app, send POST /api/auth/login
            // For demo, we just return the stored user or a mock one if credentials match 'demo' logic
            const stored = localStorage.getItem(DB_KEYS.USER);
            if (stored) {
                const user = JSON.parse(stored);
                if (user.email === email) return user;
            }
            // Create a fresh mock user if none exists
            const newUser: User = {
                name: 'Arjun Farmer',
                email,
                location: 'Odisha, India',
                phone: '+91 98765 43210',
                memberSince: '2024',
                farmSize: '5',
                soilType: 'Clay',
                mainCrop: 'Rice',
                irrigationSource: 'Canal'
            };
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(newUser));
            return newUser;
        },

        async signup(user: User, password: string): Promise<User> {
            await delay(1000);
            // In a real app, send POST /api/auth/signup
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
            return user;
        },

        async logout(): Promise<void> {
            await delay(200);
            localStorage.removeItem(DB_KEYS.USER);
        },

        async getCurrentUser(): Promise<User | null> {
            // Check for session/token
            const stored = localStorage.getItem(DB_KEYS.USER);
            return stored ? JSON.parse(stored) : null;
        }
    },

    user: {
        async updateProfile(user: User): Promise<User> {
            await delay(600); // Simulate server processing
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
            return user;
        }
    },

    // Example of extending for other features
    crops: {
        async getHistory(): Promise<any[]> {
            await delay(500);
            return [];
        }
    }
};
