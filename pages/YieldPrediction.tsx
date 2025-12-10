import React, { useState } from 'react';
import { TrendingUp, Scale, Sprout, Calendar, Droplets, Dna, ArrowLeft } from 'lucide-react';
import { getYieldPrediction } from '../services/geminiService';
import { YieldResult, Language } from '../types';

interface Props {
    lang: Language;
    onBack: () => void;
}

export const YieldPrediction: React.FC<Props> = ({ lang, onBack }) => {
    const [formData, setFormData] = useState({
        crop: 'Rice',
        area: '5',
        soil: 'Clay',
        season: 'Kharif',
        previous: 'Wheat',
        irrigation: 'Tube Well',
        seed: 'Hybrid',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<YieldResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await getYieldPrediction(formData, lang);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Precision Yield Forecast</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Gemini 3 analyzes soil, weather, and inputs to predict harvest</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 glass-panel p-6 rounded-2xl h-fit border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Crop Details</label>
                            <input type="text" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none" placeholder="Crop Name" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Area (Ac)</label>
                                <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Soil</label>
                                <select value={formData.soil} onChange={e => setFormData({...formData, soil: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none">
                                    <option>Clay</option>
                                    <option>Loam</option>
                                    <option>Sandy</option>
                                    <option>Black</option>
                                    <option>Red</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Irrigation</label>
                                <select value={formData.irrigation} onChange={e => setFormData({...formData, irrigation: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none">
                                    <option>Tube Well</option>
                                    <option>Canal</option>
                                    <option>Rainfed</option>
                                    <option>Drip</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Seed</label>
                                <select value={formData.seed} onChange={e => setFormData({...formData, seed: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none">
                                    <option>Hybrid</option>
                                    <option>Traditional</option>
                                    <option>GMO</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" disabled={loading} className="w-full bg-bhumi-green dark:bg-bhumi-gold hover:bg-green-700 dark:hover:bg-yellow-500 text-white dark:text-bhumi-dark font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50">
                            {loading ? 'Analyzing Data...' : 'Run Simulation'}
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 space-y-4">
                    {loading && (
                        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center animate-pulse text-center space-y-4 bg-white dark:bg-white/5">
                            <div className="w-16 h-16 border-4 border-bhumi-green dark:border-bhumi-gold border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">Running Agronomic Simulation...</p>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Checking Soil Data...</p>
                                <p>Analyzing Weather Patterns...</p>
                                <p>Comparing Historical Yields...</p>
                            </div>
                        </div>
                    )}
                    
                    {!loading && !result && (
                        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center text-gray-500 bg-white dark:bg-white/5">
                            <Scale size={48} className="mb-4 opacity-50" />
                            <p className="text-lg">Fill farm details to generate report</p>
                        </div>
                    )}

                    {result && (
                        <div className="glass-panel p-0 rounded-2xl border border-bhumi-green/30 dark:border-bhumi-green/50 relative overflow-hidden h-full flex flex-col animate-slide-up bg-white dark:bg-white/5 shadow-lg">
                            {/* Header Result */}
                            <div className="bg-gradient-to-r from-green-50 to-white dark:from-bhumi-green/20 dark:to-transparent p-6 border-b border-gray-200 dark:border-white/10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">Predicted Yield Output</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white">{result.predicted_yield}</span>
                                            <span className="text-xl text-bhumi-green dark:text-bhumi-gold">{result.unit}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded mb-1">
                                            <TrendingUp size={12} /> {result.confidence}% Accuracy
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Based on regional data</div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-bhumi-green dark:text-bhumi-gold">
                                        <Sprout size={16} /> Key Influencing Factors
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.influencing_factors.map((f, i) => (
                                            <span key={i} className="text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full text-gray-700 dark:text-gray-200">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        <Calendar size={16} /> Agronomist Suggestions
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.suggestions}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};