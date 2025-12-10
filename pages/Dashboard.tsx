import React from 'react';
import { CloudRain, Wind, Droplets, ThermometerSun, AlertTriangle, TrendingUp, ScanLine, Sprout, BarChart3, CloudSun, Bug, FlaskConical, Mic } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageView, User, Language } from '../types';
import { translations } from '../utils/translations';
import { VoiceAgent } from '../components/VoiceAgent';

const mockData = [
  { name: 'Jan', yield: 40 },
  { name: 'Feb', yield: 30 },
  { name: 'Mar', yield: 20 },
  { name: 'Apr', yield: 27 },
  { name: 'May', yield: 18 },
  { name: 'Jun', yield: 23 },
  { name: 'Jul', yield: 34 },
];

interface DashboardProps {
    setView: (view: PageView) => void;
    user: User | null;
    lang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView, user, lang }) => {
    const t = translations[lang];
    const firstName = user?.name ? user.name.split(' ')[0] : 'Farmer';
    const [showVoiceAgent, setShowVoiceAgent] = React.useState(false);

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-0 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{t.greeting}, {firstName}</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{t.farmConditions}</p>
                </div>
                <div className="hidden md:block bg-green-100 dark:bg-bhumi-green/20 px-4 py-2 rounded-full border border-green-200 dark:border-bhumi-green/50 text-green-700 dark:text-bhumi-green font-medium shadow-sm">
                    {t.status}: {t.optimal}
                </div>
            </div>

            {/* Weather Strip */}
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0 snap-x">
                <div className="min-w-[140px] md:min-w-0 glass-panel bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden snap-start border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-orange-500/20 rounded-full blur-xl"></div>
                    <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg w-fit text-orange-500 dark:text-orange-400 mb-2">
                        <ThermometerSun size={20} />
                    </div>
                    <div>
                        <span className="text-2xl font-bold block text-gray-900 dark:text-white">28°C</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Sunny</span>
                    </div>
                </div>

                <div className="min-w-[140px] md:min-w-0 glass-panel bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden snap-start border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg w-fit text-blue-500 dark:text-blue-400 mb-2">
                        <Droplets size={20} />
                    </div>
                    <div>
                        <span className="text-2xl font-bold block text-gray-900 dark:text-white">65%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.humidity}</span>
                    </div>
                </div>

                <div className="min-w-[140px] md:min-w-0 glass-panel bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden snap-start border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-gray-500/20 rounded-full blur-xl"></div>
                    <div className="p-2 bg-gray-100 dark:bg-gray-500/10 rounded-lg w-fit text-gray-600 dark:text-gray-400 mb-2">
                        <Wind size={20} />
                    </div>
                    <div>
                        <span className="text-2xl font-bold block text-gray-900 dark:text-white">12 km/h</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.wind}</span>
                    </div>
                </div>

                <div className="min-w-[140px] md:min-w-0 glass-panel bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden snap-start border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg w-fit text-purple-500 dark:text-purple-400 mb-2">
                        <CloudRain size={20} />
                    </div>
                    <div>
                        <span className="text-2xl font-bold block text-gray-900 dark:text-white">10%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.rain}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.quickActions}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <button onClick={() => setView('disease-detection')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform z-10">
                            <ScanLine size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.disease}</span>
                    </button>

                    <button onClick={() => setView('yield-prediction')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-bhumi-gold/20 flex items-center justify-center text-yellow-600 dark:text-bhumi-gold group-hover:scale-110 transition-transform z-10">
                            <TrendingUp size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.yield}</span>
                    </button>

                    <button onClick={() => setView('crop-recommendation')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform z-10">
                            <Sprout size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.recommend}</span>
                    </button>

                    <button onClick={() => setView('weather')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-400/20 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform z-10">
                            <CloudSun size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.weather}</span>
                    </button>

                    <button onClick={() => setView('smart-advisory')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform z-10">
                            <Droplets size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.irrigation}</span>
                    </button>

                    <button onClick={() => setView('smart-advisory')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform z-10">
                            <FlaskConical size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.fertilizer}</span>
                    </button>

                    <button onClick={() => setView('smart-advisory')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform z-10">
                            <Bug size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.pesticides}</span>
                    </button>

                     <button onClick={() => setView('analytics')} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 aspect-square md:aspect-auto md:h-32 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform z-10">
                            <BarChart3 size={24} />
                        </div>
                        <span className="font-medium text-sm text-center z-10 text-gray-800 dark:text-white">{t.analytics}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Yield Trends */}
                <div className="glass-panel bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl col-span-1 lg:col-span-2 border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <TrendingUp size={20} className="text-bhumi-green dark:text-bhumi-gold" />
                            {t.yield} Trends
                        </h3>
                    </div>
                    <div className="h-[250px] md:h-[300px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockData}>
                                <defs>
                                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="yield" stroke="#D4AF37" fillOpacity={1} fill="url(#colorYield)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts */}
                <div className="glass-panel bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl col-span-1 border border-gray-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 md:mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                        <AlertTriangle size={20} className="text-red-500" />
                        {t.activeAlerts}
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-3 rounded-xl flex gap-3 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer">
                            <AlertTriangle className="text-red-500 dark:text-red-400 shrink-0" size={18} />
                            <div>
                                <div className="text-red-600 dark:text-red-400 font-bold text-sm mb-1">High Humidity</div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">Risk of fungal disease in Rice.</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 p-3 rounded-xl flex gap-3 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-colors cursor-pointer">
                            <AlertTriangle className="text-yellow-500 dark:text-yellow-400 shrink-0" size={18} />
                            <div>
                                <div className="text-yellow-600 dark:text-yellow-400 font-bold text-sm mb-1">Pest Alert</div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">Locusts reported 50km north.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Voice Agent Trigger */}
            <div className="flex justify-center mt-8 pb-8">
                <button 
                    onClick={() => setShowVoiceAgent(true)}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-bhumi-green to-emerald-600 rounded-full text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        <Mic size={20} /> Ask Bhumi Live
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </button>
            </div>

            <VoiceAgent isOpen={showVoiceAgent} onClose={() => setShowVoiceAgent(false)} />
        </div>
    );
};