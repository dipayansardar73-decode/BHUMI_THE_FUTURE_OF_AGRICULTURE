import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageSquareText, Minimize2, Mic, Volume2, StopCircle } from 'lucide-react';
import { chatWithBhumi } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface Props {
    lang: Language;
}

const speechLangMap: Record<Language, string> = {
    en: 'en-US', hi: 'hi-IN', or: 'or-IN', bn: 'bn-IN',
    zh: 'zh-CN', es: 'es-ES', ru: 'ru-RU', ja: 'ja-JP', pt: 'pt-BR'
};

export const ChatWidget: React.FC<Props> = ({ lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const greetings: Record<Language, string> = {
            en: "Namaste! I am Bhumi. How can I help you?",
            hi: "नमस्ते! मैं भूमि हूँ। मैं आपकी कैसे मदद कर सकती हूँ?",
            or: "ନମସ୍କାର! ମୁଁ ଭୂମି | ମୁଁ ତୁମକୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
            bn: "নমস্কার! আমি ভূমি। আপনাকে কীভাবে সাহায্য করতে পারি?",
            zh: "你好！我是Bhumi。我能为你做什么？",
            es: "¡Hola! Soy Bhumi. ¿Cómo puedo ayudarte?",
            ru: "Здравствуйте! Я Бхуми. Чем могу помочь?",
            ja: "こんにちは！ブミです。どのようなご用件でしょうか？",
            pt: "Olá! Sou Bhumi. Como posso ajudar?"
        };
        setMessages([{ id: '1', role: 'model', text: greetings[lang], timestamp: Date.now() }]);
    }, [lang]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const formatText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-bhumi-green dark:text-bhumi-gold">{part.slice(2, -2)}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

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
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const responseText = await chatWithBhumi(history, userMsg.text, lang);
            
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText || "I couldn't understand that.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice input not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = speechLangMap[lang];
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Optional: Auto send
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const speakText = (text: string) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        // Clean markdown
        const cleanText = text.replace(/\*/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Strictly find voice match
        const targetLang = speechLangMap[lang];
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(targetLang.split('-')[0]));
        
        if (voice) {
            utterance.voice = voice;
        }
        utterance.lang = targetLang;
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-40 flex flex-col items-end pointer-events-none w-full md:w-auto">
            <div className={`
                pointer-events-auto
                w-full md:w-[400px] 
                bg-white dark:bg-[#0F1419] 
                border-t md:border border-gray-200 dark:border-white/20 
                rounded-t-2xl md:rounded-2xl shadow-2xl 
                flex flex-col 
                transition-all duration-300 origin-bottom-right
                overflow-hidden
                ${isOpen ? 'h-[80vh] md:h-[500px] opacity-100 scale-100' : 'h-0 opacity-0 scale-90'}
            `}>
                <div className="p-4 bg-bhumi-green flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot size={18} />
                        </div>
                        <span className="font-bold">Bhumi Assistant</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                        <Minimize2 size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50 dark:bg-black/40">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-bhumi-green text-white rounded-tr-none' 
                                : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-white/5'
                            }`}>
                                {formatText(msg.text)}
                            </div>
                             {msg.role === 'model' && (
                                <button 
                                    onClick={() => speakText(msg.text)}
                                    className={`mt-1 transition-colors ${isSpeaking ? 'text-bhumi-green' : 'text-gray-400 hover:text-bhumi-green'}`}
                                    title="Read aloud"
                                >
                                    <Volume2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-white/10 rounded-2xl rounded-tl-none p-3 flex gap-1 items-center border border-gray-200 dark:border-white/5">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F1419]">
                    <div className="relative flex items-center gap-2">
                         <button 
                            onClick={toggleVoiceInput}
                            className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'}`}
                            title="Voice Input"
                        >
                            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                        </button>
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask Bhumi..."
                                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-white focus:border-bhumi-green dark:focus:border-bhumi-gold outline-none transition-colors"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-1 top-1 p-2 bg-bhumi-green text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    pointer-events-auto
                    w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
                    mb-4 mr-4 md:mb-0 md:mr-0
                    hover:scale-110 active:scale-95
                    ${isOpen ? 'bg-red-500 rotate-90' : 'bg-bhumi-green animate-orb-glow'}
                `}
            >
                {isOpen ? <X size={24} className="text-white" /> : <MessageSquareText size={28} className="text-white" />}
            </button>
        </div>
    );
};