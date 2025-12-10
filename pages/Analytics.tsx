import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BrainCircuit, ArrowLeft } from 'lucide-react';
import { getAnalyticsInsight } from '../services/geminiService';
import { Language } from '../types';

interface Props {
    lang: Language;
    onBack: () => void;
}

const mockYieldData = [
  { year: '2019', yield: 18 },
  { year: '2020', yield: 22 },
  { year: '2021', yield: 20 },
  { year: '2022', yield: 25 },
  { year: '2023', yield: 24 },
];

const mockPriceData = [
  { month: 'Jan', price: 1800 },
  { month: 'Feb', price: 1850 },
  { month: 'Mar', price: 1900 },
  { month: 'Apr', price: 1880 },
  { month: 'May', price: 1950 },
  { month: 'Jun', price: 2000 },
];

const mockExpenseData = [
  { name: 'Seeds', value: 4000 },
  { name: 'Fertilizer', value: 6000 },
  { name: 'Labor', value: 8000 },
  { name: 'Irrigation', value: 3000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Analytics: React.FC<Props> = ({ lang, onBack }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateInsight = async () => {
        setLoading(true);
        const data = { yield: mockYieldData, prices: mockPriceData, expenses: mockExpenseData };
        const result = await getAnalyticsInsight(data, lang);
        setInsight(result);
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Farm Analytics</h2>
                    <p className="text-gray-600 dark:text-gray-400">Visualize performance and gain AI insights</p>
                </div>
                <button 
                    onClick={handleGenerateInsight}
                    disabled={loading}
                    className="bg-bhumi-green dark:bg-bhumi-gold hover:bg-green-700 dark:hover:bg-yellow-500 text-white dark:text-bhumi-dark font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {loading ? <div className="w-4 h-4 border-2 border-white dark:border-bhumi-dark border-t-transparent rounded-full animate-spin"></div> : <BrainCircuit size={18} />}
                    {loading ? 'Analyzing...' : 'Generate AI Report'}
                </button>
            </div>

            {insight && (
                <div className="glass-panel p-6 rounded-2xl border border-bhumi-gold/30 bg-bhumi-gold/5 animate-slide-up">
                    <h3 className="font-bold text-bhumi-gold mb-2 flex items-center gap-2">
                        <BrainCircuit size={20} />
                        Gemini Insight
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">{insight}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Yield History */}
                <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                        Annual Yield (Quintals/Acre)
                    </h3>
                    <div className="h-[300px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockYieldData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="year" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="yield" fill="#2D5016" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Market Price Trends */}
                <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <DollarSign size={18} className="text-blue-600 dark:text-blue-400" />
                        Market Price Trends (₹)
                    </h3>
                    <div className="h-[300px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockPriceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill:'#3b82f6'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="glass-panel p-6 rounded-2xl md:col-span-2 lg:col-span-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <PieChartIcon size={18} className="text-orange-500 dark:text-orange-400" />
                        Expense Distribution
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockExpenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {mockExpenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        {mockExpenseData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 lg:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-green-500 bg-white dark:bg-white/5 shadow-sm">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹1.2L</span>
                        <span className="text-green-600 dark:text-green-400 text-xs mt-2">+12% vs last year</span>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-red-500 bg-white dark:bg-white/5 shadow-sm">
                         <span className="text-gray-500 dark:text-gray-400 text-sm">Total Expenses</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹45K</span>
                        <span className="text-red-600 dark:text-red-400 text-xs mt-2">+5% due to fertilizer</span>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-blue-500 bg-white dark:bg-white/5 shadow-sm">
                         <span className="text-gray-500 dark:text-gray-400 text-sm">Net Profit</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹75K</span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs mt-2">Good Margin</span>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-bhumi-gold bg-white dark:bg-white/5 shadow-sm">
                         <span className="text-gray-500 dark:text-gray-400 text-sm">Projected Yield</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white mt-1">26 Q</span>
                        <span className="text-yellow-600 dark:text-bhumi-gold text-xs mt-2">Harvest in 20 days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};