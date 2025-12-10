import React, { useState } from 'react';
import { PageView, User, Language } from '../../types';
import { translations } from '../../utils/translations';
import { 
    LayoutDashboard, 
    ScanLine, 
    Sprout, 
    CloudSun, 
    BarChart3, 
    User as UserIcon, 
    Menu, 
    X,
    LogOut,
    TrendingUp,
    Droplets,
    Moon,
    Sun,
    FlaskConical,
    Bug
} from 'lucide-react';
import { ChatWidget } from '../ChatWidget';

interface LayoutProps {
    children: React.ReactNode;
    currentView: PageView;
    setView: (view: PageView) => void;
    user: User | null;
    logout: () => void;
    lang: Language;
    isDark: boolean;
    toggleTheme: () => void;
}

// Updated Logo: Modern Leaf Design
export const BhumiLogo = ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="leafGrad" x1="10" y1="90" x2="90" y2="10">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>
        
        {/* Main Leaf Body */}
        <path 
            d="M50 95 C 50 95, 10 70, 10 40 C 10 15, 30 5, 50 5 C 70 5, 90 15, 90 40 C 90 70, 50 95, 50 95 Z" 
            fill="url(#leafGrad)" 
            className="drop-shadow-md"
        />
        
        {/* Central Vein */}
        <path 
            d="M50 95 Q 50 50 50 15" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.6"
        />
        
        {/* Side Veins */}
        <path d="M50 70 Q 70 60 80 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M50 70 Q 30 60 20 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M50 50 Q 70 40 75 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M50 50 Q 30 40 25 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* Water Droplet Accent */}
        <circle cx="65" cy="35" r="5" fill="#bae6fd" filter="url(#glow)" />
    </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, user, logout, lang, isDark, toggleTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = translations[lang];

    const navItems = [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
        { id: 'disease-detection', label: t.disease, icon: ScanLine },
        { id: 'yield-prediction', label: t.yield, icon: TrendingUp },
        { id: 'smart-advisory', label: t.advisory, icon: Droplets },
        { id: 'crop-recommendation', label: t.recommend, icon: Sprout },
        { id: 'weather', label: t.weather, icon: CloudSun },
        { id: 'analytics', label: t.analytics, icon: BarChart3 },
        { id: 'profile', label: t.profile, icon: UserIcon },
    ];

    return (
        <div className={`min-h-screen flex relative overflow-hidden transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900 bg-gray-50'}`}>
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-gray-200 dark:border-white/10 z-20 h-screen sticky top-0 bg-white/80 dark:bg-black/20">
                <div className="p-6 flex items-center space-x-3 border-b border-gray-200 dark:border-white/5">
                    <div className="animate-float">
                        <BhumiLogo size={42} />
                    </div>
                    <span className="text-2xl font-bold tracking-wide text-bhumi-green dark:text-white">BHUMI</span>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4 custom-scrollbar overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as PageView)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                currentView === item.id 
                                ? 'bg-bhumi-green text-white shadow-lg shadow-bhumi-green/30' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-bhumi-green dark:hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                    <button onClick={toggleTheme} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{isDark ? t.lightMode : t.darkMode}</span>
                    </button>
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span>{t.logout}</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 w-full z-30 glass-panel border-b border-gray-200 dark:border-white/10 px-4 py-3 flex justify-between items-center bg-white/95 dark:bg-[#0F1419]/95 backdrop-blur-md shadow-sm">
                <div className="flex items-center space-x-3">
                    <BhumiLogo size={36} />
                    <span className="font-bold text-xl text-bhumi-green dark:text-white tracking-wide">BHUMI</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-white">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-20 bg-white dark:bg-bhumi-dark pt-20 px-4 pb-8 overflow-y-auto md:hidden animate-fade-in">
                     <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setView(item.id as PageView);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all ${
                                    currentView === item.id 
                                    ? 'bg-bhumi-green text-white border border-white/20 shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5'
                                }`}
                            >
                                <item.icon size={22} />
                                <span className="font-medium text-lg">{item.label}</span>
                            </button>
                        ))}
                        <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-4 mt-8 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                            <LogOut size={22} />
                            <span className="font-medium text-lg">{t.logout}</span>
                        </button>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto z-10 custom-scrollbar pt-20 md:pt-0 p-4 md:p-8">
                {children}
            </main>

            {/* Floating Chat Widget */}
            <ChatWidget lang={lang} />
        </div>
    );
};