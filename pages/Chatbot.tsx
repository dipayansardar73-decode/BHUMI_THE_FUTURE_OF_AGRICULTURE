
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ArrowLeft } from 'lucide-react';
import { chatWithBhumi } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface Props {
    lang: Language;
    onBack?: () => void;
}

export const Chatbot: React.FC<Props> = ({ lang, onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Namaste! I am Bhumi, your farming assistant. How can I help you today?', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare history for Gemini
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const responseText = await chatWithBhumi(history, userMsg.text, lang);
            
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText || "I'm sorry, I couldn't understand that.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Sorry, I'm having trouble connecting to the satellite. Please try again.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col glass-panel rounded-2xl overflow-hidden animate-fade-in relative">
           {/* Header */}
           <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bhumi-green rounded-full flex items-center justify-center">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold">Bhumi AI Assistant</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-400">Online • Gemini 3 Pro</span>
                        </div>
                    </div>
                </div>
                {onBack && (
                     <button 
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
                            msg.role === 'user' 
                            ? 'bg-bhumi-green text-white rounded-tr-none' 
                            : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                        }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                                {msg.role === 'model' ? <Sparkles size={12} /> : <User size={12} />}
                                <span>{msg.role === 'model' ? 'Bhumi' : 'You'}</span>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
           </div>

           {/* Input */}
           <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about crops, weather, or market prices..."
                        className="w-full bg-bhumi-dark border border-white/20 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:border-bhumi-gold transition-colors text-white placeholder-gray-500"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 p-2 bg-bhumi-gold hover:bg-yellow-500 text-bhumi-dark rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>
           </div>
        </div>
    );
};
