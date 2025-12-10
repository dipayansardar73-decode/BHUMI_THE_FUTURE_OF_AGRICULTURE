import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Volume2, Sparkles } from 'lucide-react';
import { voiceAgentChat } from '../services/geminiService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const VoiceAgent: React.FC<Props> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setTranscript("Tap the orb to start speaking...");
        } else {
            window.speechSynthesis.cancel();
            if (recognitionRef.current) recognitionRef.current.stop();
        }
    }, [isOpen]);

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Voice not supported");

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // English Only as requested
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setStatus('listening');
        recognition.onend = () => {
            if (status === 'listening') setStatus('idle'); 
        };
        
        recognition.onresult = async (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            setStatus('thinking');
            
            try {
                const reply = await voiceAgentChat(text);
                setTranscript(reply || "I didn't catch that.");
                speak(reply || "Sorry?");
            } catch (e) {
                setStatus('idle');
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const speak = (text: string) => {
        setStatus('speaking');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setStatus('idle');
        window.speechSynthesis.speak(utterance);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-4 text-white/50 hover:text-white transition-colors"
            >
                <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-12 w-full max-w-lg px-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-300">
                        Bhumi Live
                    </h2>
                    <p className="text-gray-400 text-lg min-h-[60px]">{transcript}</p>
                </div>

                {/* Magical Orb */}
                <button 
                    onClick={status === 'idle' ? startListening : undefined}
                    className={`
                        relative w-48 h-48 rounded-full magical-orb
                        flex items-center justify-center
                        transition-all duration-500
                        ${status === 'listening' ? 'scale-110 animate-orb-pulse' : ''}
                        ${status === 'thinking' ? 'animate-spin opacity-80' : ''}
                        ${status === 'speaking' ? 'animate-orb-glow scale-105' : ''}
                        ${status === 'idle' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                    `}
                >
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 blur-sm"></div>
                    {status === 'idle' && <Mic size={48} className="text-white/80" />}
                    {status === 'listening' && <div className="w-20 h-20 bg-white/20 rounded-full animate-ping"></div>}
                    {status === 'thinking' && <Sparkles size={48} className="text-yellow-300 animate-pulse" />}
                    {status === 'speaking' && <Volume2 size={48} className="text-white animate-bounce" />}
                </button>

                <div className="text-white/30 text-sm uppercase tracking-widest font-medium">
                    {status === 'idle' ? 'Tap Orb to Speak' : status}
                </div>
            </div>
        </div>
    );
};