import React, { useState } from 'react';
import { Sprout, MapPin, Calendar, Layers, ArrowLeft } from 'lucide-react';
import { getCropRecommendations } from '../services/geminiService';
import { CropRec, Language } from '../types';

interface Props {
    lang: Language;
    onBack: () => void;
}

export const CropRecommendation: React.FC<Props> = ({ lang, onBack }) => {
    const [formData, setFormData] = useState({
        soil: 'Loamy',
        season: 'Kharif',
        location: 'Odisha, India'
    });
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<CropRec[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const recs = await getCropRecommendations(formData.soil, formData.season, formData.location, lang);
        setRecommendations(recs);
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

             <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart Crop Recommendations</h2>
                <p className="text-gray-600 dark:text-gray-400">Gemini reasoning analyzes soil, weather, and market trends to suggest the best crops.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1 glass-panel p-6 rounded-2xl h-fit bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                <Layers size={16} /> Soil Type
                            </label>
                            <select 
                                value={formData.soil}
                                onChange={(e) => setFormData({...formData, soil: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none"
                            >
                                <option>Loamy</option>
                                <option>Clay</option>
                                <option>Sandy</option>
                                <option>Black</option>
                                <option>Red</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                <Calendar size={16} /> Season
                            </label>
                            <select 
                                value={formData.season}
                                onChange={(e) => setFormData({...formData, season: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none"
                            >
                                <option>Kharif (Monsoon)</option>
                                <option>Rabi (Winter)</option>
                                <option>Zaid (Summer)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                <MapPin size={16} /> Location
                            </label>
                            <input 
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none"
                                placeholder="City, State"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-bhumi-green dark:bg-bhumi-gold hover:bg-green-700 dark:hover:bg-yellow-500 text-white dark:text-bhumi-dark font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : 'Get Recommendations'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div className="md:col-span-2 space-y-4">
                    {loading && (
                        <div className="grid grid-cols-1 gap-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse flex space-x-4 bg-white dark:bg-white/5">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/4"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && recommendations.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 glass-panel rounded-2xl p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <Sprout size={48} className="mb-4 opacity-50" />
                            <p>Enter details to get AI-powered suggestions</p>
                        </div>
                    )}

                    {!loading && recommendations.map((crop, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-2xl border-l-4 border-bhumi-green hover:translate-x-1 transition-transform bg-white dark:bg-white/5 shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{crop.name}</h3>
                                <span className="bg-green-100 dark:bg-bhumi-green/20 text-bhumi-green px-3 py-1 rounded-full text-xs font-bold">
                                    {crop.suitability}% Match
                                </span>
                            </div>
                            <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm">{crop.reason}</div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1"><Calendar size={12} /> Duration: {crop.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};