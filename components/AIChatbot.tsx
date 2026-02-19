import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm the Clouds AI. Ask me about our gadgets or tell me to change the website theme." }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // AI Ref
  const chatSession = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize Chat
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSession.current = ai.chats.create({
            model: 'gemini-2.5-flash-preview',
            config: {
                systemInstruction: "You are a helpful assistant for Clouds Gadgets. You can explain products. If the user explicitly asks to perform an action on the site (like 'go to contact', 'dark mode', 'start scroll'), respond confirming you would do it if you had hands, but for now guide them to use the Voice AI (the red button) for direct control.",
            }
        });
    } catch (e) {
        console.error("Chat init failed", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSession.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        const result = await chatSession.current.sendMessageStream({ message: userMsg });
        
        let fullResponse = "";
        
        // Add empty placeholder for streaming
        setMessages(prev => [...prev, { role: 'model', text: "" }]);
        
        for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                fullResponse += c.text;
                setMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1].text = fullResponse;
                    return newArr;
                });
            }
        }
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-[80] p-4 rounded-full bg-white/5 border border-white/20 backdrop-blur-md text-platinum hover:bg-accent hover:border-accent transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={20} />
      </button>

      {/* Chat Interface - Updated BG to bg-midnight/90 for theme support */}
      <div className={`
        fixed bottom-8 right-8 z-[85] w-[350px] h-[500px] bg-midnight/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none translate-y-10'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
                <Bot className="text-accent" size={18} />
                <span className="font-display font-bold text-platinum">Clouds Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-accent/20'}`}>
                        {msg.role === 'user' ? <User size={14} className="text-slate-300" /> : <Bot size={14} className="text-accent" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                        msg.role === 'user' 
                        ? 'bg-white/10 text-platinum rounded-tr-none' 
                        : 'bg-accent/10 border border-accent/20 text-slate-500 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                         <Bot size={14} className="text-accent" />
                    </div>
                    <div className="bg-accent/10 border border-accent/20 p-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-black/5">
            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-platinum focus:outline-none focus:border-accent transition-colors placeholder:text-slate-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-full text-white hover:bg-accent-glow transition-colors disabled:opacity-50" disabled={!input.trim() || loading}>
                    <Send size={14} />
                </button>
            </div>
        </form>
      </div>
    </>
  );
};