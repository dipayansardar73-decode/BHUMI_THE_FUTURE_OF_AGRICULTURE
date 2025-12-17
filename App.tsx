import React, { useState, useEffect } from 'react';
import { Layout, BhumiLogo } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { Chatbot } from './pages/Chatbot';
import { CropRecommendation } from './pages/CropRecommendation';
import { YieldPrediction } from './pages/YieldPrediction';
import { SmartAdvisory } from './pages/SmartAdvisory';
import { Weather } from './pages/Weather';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { PageView, User, Language } from './types';
import { translations } from './utils/translations';
import { api } from './services/api';
import { isConfigured } from './services/geminiService';
import { Languages, Mail, Lock, User as UserIcon, MapPin, ArrowRight, Sprout, Droplets, Layers, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
    const [view, setView] = useState<PageView>('language');
    const [user, setUser] = useState<User | null>(null);
    const [lang, setLang] = useState<Language>('en');
    const [isDark, setIsDark] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);

    // Auth States
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Additional Signup Details
    const [farmSize, setFarmSize] = useState('');
    const [soilType, setSoilType] = useState('Loamy');
    const [mainCrop, setMainCrop] = useState('');
    const [irrigationSource, setIrrigationSource] = useState('Rainfed');
    const [resetSent, setResetSent] = useState(false);

    // Initial Load
    useEffect(() => {
        const initApp = async () => {
            try {
                // Check if API key is present
                if (!isConfigured()) {
                    setApiKeyMissing(true);
                }

                const storedLang = localStorage.getItem('bhumi_lang') as Language;
                if (storedLang) setLang(storedLang);

                const storedTheme = localStorage.getItem('bhumi_theme');
                if (storedTheme === 'dark') {
                    setIsDark(true);
                    document.documentElement.classList.add('dark');
                } else {
                    setIsDark(false);
                    document.documentElement.classList.remove('dark');
                }

                const currentUser = await api.auth.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setView('dashboard');
                }
            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setInitialCheckDone(true);
            }
        };
        initApp();
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('bhumi_theme', newTheme ? 'dark' : 'light');
        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setLoading(true);
            try {
                const loggedInUser = await api.auth.login(email, password);
                setUser(loggedInUser);
                setView('dashboard');
            } catch (e) {
                console.error("Login failed", e);
                alert("Login failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (email && password && name) {
            setLoading(true);
            const newUser: User = { 
                name, 
                email, 
                location, 
                memberSince: new Date().getFullYear().toString(),
                farmSize,
                soilType,
                mainCrop,
                irrigationSource
            };
            try {
                const signedUpUser = await api.auth.signup(newUser, password);
                setUser(signedUpUser);
                setView('dashboard');
            } catch (e) {
                console.error("Signup failed", e);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleForgot = (e: React.FormEvent) => {
        e.preventDefault();
        setResetSent(true);
        setTimeout(() => {
            setResetSent(false);
            setAuthMode('login');
        }, 3000);
    };

    const handleLogout = async () => {
        await api.auth.logout();
        setUser(null);
        setView('auth');
        setAuthMode('login');
        setEmail('');
        setPassword('');
    };

    const selectLanguage = (l: Language) => {
        setLang(l);
        localStorage.setItem('bhumi_lang', l);
        setView('auth');
    };

    const goBack = () => setView('dashboard');
    const t = translations[lang];

    // Show loading spinner while checking auth status
    if (!initialCheckDone) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1419]">
                 <div className="flex flex-col items-center gap-4 animate-pulse">
                    <BhumiLogo size={60} />
                    <div className="text-bhumi-green font-bold">Loading Bhumi...</div>
                 </div>
            </div>
        );
    }

    const ApiKeyBanner = () => (
        apiKeyMissing ? (
            <div className="bg-red-500 text-white text-xs md:text-sm font-bold text-center p-2 fixed top-0 w-full z-50 flex items-center justify-center gap-2 shadow-lg">
                <AlertTriangle size={16} />
                <span>Setup Required: Add <code>VITE_API_KEY</code> to your environment variables.</span>
            </div>
        ) : null
    );

    // Language Selection Screen
    if (view === 'language') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white dark:bg-[#0F1419] transition-colors duration-500">
                <ApiKeyBanner />
                <div className="z-10 text-center space-y-8 animate-fade-in w-full max-w-4xl mt-6">
                    <div className="flex justify-center mb-6 animate-float">
                        <BhumiLogo size={120} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">BHUMI</h1>
                        <p className="text-bhumi-green dark:text-bhumi-gold text-xl font-light tracking-widest uppercase">Smart Farming Assistant</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                        {[
                            { code: 'en', label: 'English', native: 'English' },
                            { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
                            { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
                            { code: 'bn', label: 'Bengali', native: 'বাংলা' },
                            { code: 'zh', label: 'Mandarin', native: '中文' },
                            { code: 'es', label: 'Spanish', native: 'Español' },
                            { code: 'ru', label: 'Russian', native: 'Русский' },
                            { code: 'ja', label: 'Japanese', native: '日本語' },
                            { code: 'pt', label: 'Portuguese', native: 'Português' },
                        ].map((l) => (
                            <button 
                                key={l.code}
                                onClick={() => selectLanguage(l.code as Language)} 
                                className="glass-panel p-6 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 hover:border-bhumi-green dark:hover:border-bhumi-gold group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-bhumi-green/5 dark:bg-bhumi-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <span className="relative text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-bhumi-green dark:group-hover:text-bhumi-gold transition-colors">
                                    {l.native}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">{l.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Auth Screen
    if (view === 'auth') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative bg-gray-50 dark:bg-[#0F1419] transition-colors duration-500">
                <ApiKeyBanner />
                <div className={`w-full ${authMode === 'signup' ? 'max-w-2xl' : 'max-w-md'} glass-panel p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-2xl z-10 animate-slide-up mt-6`}>
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gray-100 dark:bg-white/5 rounded-full mb-4 border border-gray-200 dark:border-white/10">
                            <BhumiLogo size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {authMode === 'login' ? t.loginTitle : authMode === 'signup' ? t.signupTitle : 'Reset Password'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {t.subtitle}
                        </p>
                    </div>

                    {authMode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                    placeholder={t.email}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                    placeholder={t.password}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setAuthMode('forgot')} className="text-sm text-bhumi-green dark:text-bhumi-gold hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-bhumi-green dark:bg-bhumi-gold hover:bg-green-700 dark:hover:bg-yellow-500 text-white dark:text-bhumi-dark font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    )}

                    {authMode === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-bold text-bhumi-green dark:text-bhumi-gold mb-2 uppercase tracking-wide">Personal Info</h3>
                                </div>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder={t.name}
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder={t.email}
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="password" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder={t.password}
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="password" 
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder="Confirm Password"
                                    />
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <h3 className="text-sm font-bold text-bhumi-green dark:text-bhumi-gold mb-2 uppercase tracking-wide">Farm Details</h3>
                                </div>
                                 <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder={t.location}
                                    />
                                </div>
                                <div className="relative">
                                    <Sprout className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        value={mainCrop}
                                        onChange={(e) => setMainCrop(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder="Main Crop"
                                    />
                                </div>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <select 
                                        value={soilType}
                                        onChange={(e) => setSoilType(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors appearance-none"
                                    >
                                        <option>Loamy</option>
                                        <option>Clay</option>
                                        <option>Sandy</option>
                                        <option>Black</option>
                                        <option>Red</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <Droplets className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <select 
                                        value={irrigationSource}
                                        onChange={(e) => setIrrigationSource(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors appearance-none"
                                    >
                                        <option>Rainfed</option>
                                        <option>Canal</option>
                                        <option>Tube Well</option>
                                        <option>Drip</option>
                                    </select>
                                </div>
                                 <div className="relative md:col-span-2">
                                    <input 
                                        type="text" 
                                        value={farmSize}
                                        onChange={(e) => setFarmSize(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                        placeholder="Farm Size (Acres)"
                                    />
                                </div>
                            </div>
                           
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-bhumi-green hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all mt-4 shadow-lg disabled:opacity-70"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    {authMode === 'forgot' && (
                        <div className="space-y-6">
                            {resetSent ? (
                                <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-center border border-green-500/30">
                                    <p>Reset link sent to {email}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleForgot} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-bhumi-green dark:bg-bhumi-gold hover:bg-green-700 dark:hover:bg-yellow-500 text-white dark:text-bhumi-dark font-bold py-3 rounded-xl transition-all">
                                        Send Reset Link
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                        {authMode === 'login' ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                New to Bhumi? <button onClick={() => setAuthMode('signup')} className="text-bhumi-green dark:text-white font-bold hover:underline transition-colors">Create Account</button>
                            </p>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Already have an account? <button onClick={() => setAuthMode('login')} className="text-bhumi-green dark:text-white font-bold hover:underline transition-colors">Log In</button>
                            </p>
                        )}
                        <button onClick={() => setView('language')} className="mt-4 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-2 mx-auto">
                            <Languages size={12} /> Change Language
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderPage = () => {
        switch (view) {
            case 'dashboard': return <Dashboard setView={setView} user={user} lang={lang} />;
            case 'disease-detection': return <DiseaseDetection lang={lang} onBack={goBack} />;
            case 'yield-prediction': return <YieldPrediction lang={lang} onBack={goBack} />;
            case 'smart-advisory': return <SmartAdvisory lang={lang} onBack={goBack} />;
            case 'chatbot': return <Chatbot lang={lang} />;
            case 'crop-recommendation': return <CropRecommendation lang={lang} onBack={goBack} />;
            case 'weather': return <Weather lang={lang} onBack={goBack} />;
            case 'analytics': return <Analytics lang={lang} onBack={goBack} />;
            case 'profile': return <Profile user={user} setUser={setUser} onBack={goBack} />;
            default: return <Dashboard setView={setView} user={user} lang={lang} />;
        }
    };

    return (
        <Layout 
            currentView={view} 
            setView={setView} 
            user={user} 
            logout={handleLogout}
            lang={lang}
            isDark={isDark}
            toggleTheme={toggleTheme}
        >
            <ApiKeyBanner />
            {renderPage()}
        </Layout>
    );
};

export default App;