import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';

// --- Tools Definition ---
const navigateTool: FunctionDeclaration = {
  name: 'navigate',
  description: 'Navigate to a specific page on the website. Use this when the user asks to go to Home, About, Showcase (products), Offerings (services), or Contact.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      page: { 
        type: Type.STRING, 
        description: 'The page path. Must be one of: "/", "/about", "/showcase", "/offerings", "/contact".' 
      },
    },
    required: ['page'],
  },
};

const themeTool: FunctionDeclaration = {
  name: 'changeTheme',
  description: 'Change the website theme between light and dark mode.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      mode: { type: Type.STRING, description: 'The theme mode: "light" or "dark".' },
    },
    required: ['mode'],
  },
};

const scrollTool: FunctionDeclaration = {
  name: 'toggleAutoScroll',
  description: 'Start or stop the auto-scrolling feature.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: { type: Type.STRING, description: '"start" or "stop"' },
    },
    required: ['action'],
  },
};

const accentTool: FunctionDeclaration = {
  name: 'setAccentColor',
  description: 'Change the main accent color of the website.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      color: { type: Type.STRING, description: 'The color hex code or name (e.g., #ff0000, red, blue).' },
    },
    required: ['color'],
  },
};

// --- Audio Utils ---
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const AIVoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Initialize
  const toggleSession = async () => {
    if (isActive) {
      stopSession();
    } else {
      await startSession();
    }
  };

  const startSession = async () => {
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          tools: [{ functionDeclarations: [navigateTool, themeTool, scrollTool, accentTool] }],
          systemInstruction: {
            parts: [{ text: "You are the advanced AI core of the Clouds Gadgets website. You have full control over the UI. You can navigate, scroll, change themes, and adjust colors. Be concise, futuristic, and helpful. When asked to change a page, execute the navigate tool." }]
          }
        },
        callbacks: {
            onopen: () => {
                console.log("AI Connected");
                setIsActive(true);
                
                // Start Microphone Processing
                const source = inputCtx.createMediaStreamSource(stream);
                const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                processorRef.current = processor;
                
                processor.onaudioprocess = (e) => {
                    const inputData = e.inputBuffer.getChannelData(0);
                    const pcm16 = new Int16Array(inputData.length);
                    for(let i=0; i<inputData.length; i++) {
                        pcm16[i] = inputData[i] * 32768;
                    }
                    const uint8 = new Uint8Array(pcm16.buffer);
                    let binary = '';
                    const len = uint8.byteLength;
                    for (let i = 0; i < len; i++) {
                        binary += String.fromCharCode(uint8[i]);
                    }
                    const b64 = btoa(binary);

                    sessionPromise.then(session => {
                        session.sendRealtimeInput({
                            media: {
                                mimeType: 'audio/pcm;rate=16000',
                                data: b64
                            }
                        });
                    });
                };
                
                source.connect(processor);
                processor.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
                // 1. Handle Audio Output
                const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    setIsSpeaking(true);
                    const bytes = base64ToUint8Array(audioData);
                    
                    const int16 = new Int16Array(bytes.buffer);
                    const float32 = new Float32Array(int16.length);
                    for(let i=0; i<int16.length; i++) {
                        float32[i] = int16[i] / 32768.0;
                    }
                    
                    const buffer = outputCtx.createBuffer(1, float32.length, 24000);
                    buffer.copyToChannel(float32, 0);
                    
                    playBuffer(buffer, outputCtx);
                }

                if (msg.serverContent?.turnComplete) {
                     setTimeout(() => setIsSpeaking(false), 800);
                }

                // 2. Handle Tool Calls
                if (msg.toolCall) {
                    for (const call of msg.toolCall.functionCalls) {
                        let result = { result: "Success" };
                        try {
                            if (call.name === 'navigate') {
                                window.dispatchEvent(new CustomEvent('ai-navigate', { detail: { page: (call.args as any).page } }));
                            } else if (call.name === 'changeTheme') {
                                window.dispatchEvent(new CustomEvent('ai-change-theme', { detail: { mode: (call.args as any).mode } }));
                            } else if (call.name === 'toggleAutoScroll') {
                                window.dispatchEvent(new CustomEvent('ai-toggle-scroll', { detail: { action: (call.args as any).action } }));
                            } else if (call.name === 'setAccentColor') {
                                window.dispatchEvent(new CustomEvent('ai-change-accent', { detail: { color: (call.args as any).color } }));
                            }
                        } catch (e) {
                            console.error(e);
                            result = { result: "Failed" };
                        }

                        sessionPromise.then(session => {
                            session.sendToolResponse({
                                functionResponses: [{
                                    id: call.id,
                                    name: call.name,
                                    response: result
                                }]
                            });
                        });
                    }
                }
            },
            onclose: () => {
                setIsActive(false);
            },
            onerror: (e) => {
                console.error("AI Error", e);
                setError("Connection Error");
                setIsActive(false);
            }
        }
      });
      
    } catch (err) {
      console.error(err);
      setError("Failed to start AI");
    }
  };

  const playBuffer = (buffer: AudioBuffer, ctx: AudioContext) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    const now = ctx.currentTime;
    const start = Math.max(now, nextStartTimeRef.current);
    source.start(start);
    nextStartTimeRef.current = start + buffer.duration;
  };

  const stopSession = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (processorRef.current) {
        processorRef.current.disconnect();
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsActive(false);
    setIsSpeaking(false);
  };

  return (
    <>
        <style>{`
            @keyframes ripple {
                0% { transform: scale(1); opacity: 0.8; }
                100% { transform: scale(2.5); opacity: 0; }
            }
            @keyframes pulse-ring {
                0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); }
                70% { box-shadow: 0 0 0 20px rgba(168, 85, 247, 0); }
                100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
            }
            @keyframes sound-bar {
                0%, 100% { height: 20%; }
                50% { height: 80%; }
            }
        `}</style>
        
        {/* Positioning: Above Chat Button (bottom-28 right-8) */}
        <div className="fixed bottom-28 right-8 z-[90] flex items-center justify-center">
            
            {/* Ambient Back Glow */}
            <div className={`absolute -inset-10 bg-accent/30 rounded-full blur-3xl transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Ripple Effects (Listening) */}
            {isActive && !isSpeaking && (
                <>
                    <div className="absolute inset-0 rounded-full border border-accent/30 animate-[ripple_2s_linear_infinite]"></div>
                    <div className="absolute inset-0 rounded-full border border-accent/30 animate-[ripple_2s_linear_infinite_1s]"></div>
                </>
            )}

            {/* Speaking Shockwave */}
            {isSpeaking && (
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
            )}

            {/* Main Interactive Orb */}
            <button 
                onClick={toggleSession}
                className={`
                    relative w-14 h-14 rounded-full flex items-center justify-center 
                    backdrop-blur-xl border transition-all duration-500 shadow-2xl overflow-hidden group
                    ${isActive 
                        ? isSpeaking 
                            ? 'bg-cyan-950/80 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.3)] scale-110' 
                            : 'bg-midnight/80 border-accent shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-105'
                        : 'bg-white/5 border-white/20 hover:border-white/50 hover:bg-white/10 hover:scale-105'
                    }
                `}
            >
                {/* Inner Gradient Core */}
                <div className={`
                    absolute inset-0 bg-gradient-to-tr transition-opacity duration-500
                    ${isActive ? 'opacity-20' : 'opacity-0'}
                    ${isSpeaking ? 'from-cyan-400 to-blue-600' : 'from-accent to-purple-600'}
                `}></div>

                {/* State Icons & Visuals */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                    
                    {/* IDLE / LISTENING State */}
                    <div className={`absolute transition-all duration-300 ${isSpeaking ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                        {isActive ? (
                             <Sparkles size={24} className="text-accent animate-pulse" />
                        ) : (
                             <Mic size={24} className="text-slate-300 group-hover:text-white transition-colors" />
                        )}
                    </div>

                    {/* SPEAKING State (Audio Visualizer) */}
                    <div className={`absolute inset-0 flex items-center justify-center gap-[3px] transition-all duration-300 ${isSpeaking ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                        {[1, 2, 3, 4].map((i) => (
                            <div 
                                key={i} 
                                className="w-1 bg-cyan-400 rounded-full"
                                style={{
                                    animation: `sound-bar 0.4s ease-in-out infinite alternate`,
                                    animationDelay: `${i * 0.1}s`,
                                    height: '20%' // Base height, animation overrides
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </button>

            {/* Status Tooltip (Floating to the left) */}
            <div className={`
                absolute right-full mr-4 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10
                flex items-center gap-2 transition-all duration-300 transform
                ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
            `}>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-bounce' : 'bg-accent animate-pulse'}`}></div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white whitespace-nowrap">
                    {isSpeaking ? 'AI Speaking' : 'Listening...'}
                </span>
            </div>

            {/* Close Button (Only appears when active) */}
            {isActive && (
                <button 
                    onClick={stopSession}
                    className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-20"
                >
                    <X size={12} />
                </button>
            )}
        </div>
    </>
  );
};