import React, { useState } from 'react';
import { Droplets, Bug, FlaskConical, LayoutGrid, ArrowLeft } from 'lucide-react';
import { getSmartAdvisory } from '../services/geminiService';
import { AdvisoryResult, Language } from '../types';

interface Props {
    lang: Language;
    onBack: () => void;
}

type Tab = 'all' | 'irrigation' | 'fertilizer' | 'pesticides';

export const SmartAdvisory: React.FC<Props> = ({ lang, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [formData, setFormData] = useState({
        crop: 'Rice',
        stage: 'Vegetative',
        problem: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AdvisoryResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await getSmartAdvisory(formData, lang);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart Farming Advisory</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Comprehensive guide for farm management</p>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-bhumi-green dark:bg-bhumi-gold text-white dark:text-bhumi-dark' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'}`}
                >
                    <LayoutGrid size={16} /> All
                </button>
                <button 
                    onClick={() => setActiveTab('irrigation')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'irrigation' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'}`}
                >
                    <Droplets size={16} /> Irrigation
                </button>
                <button 
                    onClick={() => setActiveTab('fertilizer')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'fertilizer' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'}`}
                >
                    <FlaskConical size={16} /> Fertilizer
                </button>
                <button 
                    onClick={() => setActiveTab('pesticides')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'pesticides' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'}`}
                >
                    <Bug size={16} /> Pesticides
                </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Crop</label>
                        <input type="text" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Growth Stage</label>
                        <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none">
                            <option>Sowing</option>
                            <option>Vegetative</option>
                            <option>Flowering</option>
                            <option>Harvest</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Specific Problem (Optional)</label>
                        <input type="text" placeholder="e.g. Yellow leaves" value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} className="w-full bg-gray-50 dark:bg-bhumi-dark border border-gray-300 dark:border-white/20 rounded-lg p-3 text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none" />
                    </div>
                    <div className="md:col-span-3">
                        <button type="submit" disabled={loading} className="w-full bg-bhumi-green dark:bg-bhumi-gold hover:bg-green-700 dark:hover:bg-yellow-500 text-white dark:text-bhumi-dark font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
                            {loading ? 'Consulting AI...' : 'Get Advice'}
                        </button>
                    </div>
                 </form>

                 {result && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
                        {(activeTab === 'all' || activeTab === 'irrigation') && (
                            <div className={`bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 p-4 rounded-xl ${activeTab !== 'all' ? 'md:col-span-3' : ''}`}>
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-3">
                                    <Droplets size={20} /> Irrigation
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.irrigation}</p>
                            </div>
                        )}
                        {(activeTab === 'all' || activeTab === 'fertilizer') && (
                            <div className={`bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 p-4 rounded-xl ${activeTab !== 'all' ? 'md:col-span-3' : ''}`}>
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold mb-3">
                                    <FlaskConical size={20} /> Fertilizer
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.fertilizer}</p>
                            </div>
                        )}
                        {(activeTab === 'all' || activeTab === 'pesticides') && (
                            <div className={`bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-4 rounded-xl ${activeTab !== 'all' ? 'md:col-span-3' : ''}`}>
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-3">
                                    <Bug size={20} /> Pest Control
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.pesticides}</p>
                            </div>
                        )}
                     </div>
                 )}
            </div>
        </div>
    );
};