import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, RefreshCw, ScanLine, ArrowLeft } from 'lucide-react';
import { analyzeCropDisease } from '../services/geminiService';
import { DiseaseResult, Language } from '../types';

interface Props {
    lang: Language;
    onBack: () => void;
}

export const DiseaseDetection: React.FC<Props> = ({ lang, onBack }) => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiseaseResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        try {
            // Remove data:image/...;base64, prefix
            const base64Data = image.split(',')[1];
            const data = await analyzeCropDisease(base64Data, lang);
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Disease Detection</h2>
                <p className="text-gray-600 dark:text-gray-400">Upload a photo of your crop to identify diseases instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-gray-400 dark:border-gray-700 relative overflow-hidden bg-white dark:bg-white/5">
                    {image ? (
                        <div className="relative w-full h-full flex flex-col items-center">
                            <img src={image} alt="Crop" className="max-h-[300px] rounded-lg object-contain mb-4" />
                            <div className="flex space-x-4">
                                <button 
                                    onClick={() => { setImage(null); setResult(null); }}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-all text-white"
                                >
                                    <RefreshCw size={16} /> Reset
                                </button>
                                <button 
                                    onClick={handleAnalyze}
                                    disabled={loading || !!result}
                                    className="px-6 py-2 bg-bhumi-green hover:bg-green-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Camera size={18} />}
                                    {loading ? 'Analyzing...' : 'Analyze Crop'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-bhumi-green/10 dark:bg-bhumi-gold/20 rounded-full flex items-center justify-center mx-auto text-bhumi-green dark:text-bhumi-gold">
                                <Upload size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload Image</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Support JPG, PNG</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-bhumi-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Select File
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {loading && (
                        <div className="glass-panel p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center space-y-4 animate-pulse bg-white dark:bg-white/5">
                            <div className="w-16 h-16 border-4 border-bhumi-green dark:border-bhumi-gold border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg text-gray-900 dark:text-white">Gemini 3 is analyzing your crop...</p>
                            <p className="text-sm text-gray-500">Scanning for symptoms and patterns</p>
                        </div>
                    )}

                    {!loading && !result && (
                        <div className="glass-panel p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center text-gray-500 bg-white dark:bg-white/5">
                            <ScanLine size={48} className="mb-4 opacity-50" />
                            <p>Results will appear here</p>
                        </div>
                    )}

                    {result && (
                        <div className="glass-panel p-0 rounded-2xl overflow-hidden animate-slide-up h-full bg-white dark:bg-white/5 shadow-lg">
                            <div className={`p-4 ${result.disease.toLowerCase().includes('healthy') ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'} border-b border-gray-200 dark:border-white/10`}>
                                <div className="flex items-center gap-3">
                                    {result.disease.toLowerCase().includes('healthy') ? (
                                        <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                                    ) : (
                                        <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                                    )}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{result.disease}</h3>
                                </div>
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Confidence: {result.confidence}%</div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="text-bhumi-green dark:text-bhumi-gold font-bold mb-2 uppercase text-sm tracking-wider">Treatment</h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.treatment}</p>
                                </div>
                                <div>
                                    <h4 className="text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase text-sm tracking-wider">Prevention</h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.preventative}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};