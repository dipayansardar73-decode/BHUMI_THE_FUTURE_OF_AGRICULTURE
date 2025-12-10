
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudLightning, CloudSun, Wind, Droplets, MapPin, Search, Sprout, ArrowLeft, ExternalLink } from 'lucide-react';
import { getWeatherForecast } from '../services/geminiService';
import { WeatherData, Language } from '../types';

interface Props {
    lang: Language;
    onBack: () => void;
}

export const Weather: React.FC<Props> = ({ lang, onBack }) => {
    const [location, setLocation] = useState('Odisha, India');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const data = await getWeatherForecast(location, lang);
            setWeather(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [lang]);

    const getWeatherIcon = (iconName: string, size = 24) => {
        switch (iconName) {
            case 'sunny': return <Sun size={size} className="text-yellow-500 dark:text-yellow-400" />;
            case 'rain': return <CloudRain size={size} className="text-blue-500 dark:text-blue-400" />;
            case 'storm': return <CloudLightning size={size} className="text-purple-500 dark:text-purple-400" />;
            case 'partly-cloudy': return <CloudSun size={size} className="text-orange-400 dark:text-orange-300" />;
            default: return <Cloud size={size} className="text-gray-400" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 text-gray-900 dark:text-white">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            {/* Search Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Agro-Weather</h2>
                    <p className="text-gray-500 dark:text-gray-400">Real-time forecasts for farming decisions</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
                        placeholder="Enter location..."
                        className="w-full md:w-64 bg-white dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-full py-2 pl-4 pr-10 focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none shadow-sm"
                    />
                    <button 
                        onClick={fetchWeather}
                        className="absolute right-2 top-2 text-gray-400 hover:text-bhumi-green dark:hover:text-white"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {loading && (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border-4 border-bhumi-green dark:border-bhumi-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Fetching live data for {location}...</p>
                </div>
            )}

            {!loading && weather && (
                <div className="space-y-6 animate-slide-up">
                    {/* Main Card */}
                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 dark:bg-bhumi-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                                    <MapPin size={18} /> {weather.location}
                                </div>
                                <div className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-gray-900 dark:text-white">
                                    {weather.temp}°
                                </div>
                                <div className="text-xl md:text-2xl font-medium text-bhumi-green dark:text-bhumi-gold mb-2 capitalize">
                                    {weather.condition}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 max-w-sm">{weather.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-200 dark:border-white/5">
                                    <Wind className="text-gray-500 dark:text-gray-400" />
                                    <span className="text-2xl font-bold">{weather.windSpeed} <span className="text-xs font-normal text-gray-500">km/h</span></span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Wind</span>
                                </div>
                                <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-200 dark:border-white/5">
                                    <Droplets className="text-blue-500 dark:text-blue-400" />
                                    <span className="text-2xl font-bold">{weather.humidity}<span className="text-xs font-normal text-gray-500">%</span></span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Humidity</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Forecast Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {weather.forecast.map((day, idx) => (
                            <div key={idx} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md transition-all">
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{day.day}</span>
                                {getWeatherIcon(day.icon, 32)}
                                <span className="text-lg font-bold">{day.temp}°</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">{day.condition}</span>
                            </div>
                        ))}
                    </div>

                    {/* Advisory */}
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-bhumi-green bg-white dark:bg-white/5 shadow-md">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Sprout size={20} className="text-bhumi-green" />
                            Farming Advisory
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{weather.advisory}</p>
                    </div>

                    {/* Source Attribution */}
                    {weather.sourceUrls && weather.sourceUrls.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Data Source: 
                            {weather.sourceUrls.slice(0, 2).map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noreferrer" className="ml-1 underline hover:text-bhumi-green flex inline-flex items-center gap-0.5">
                                    Link {i+1} <ExternalLink size={10}/>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
