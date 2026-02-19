import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Cpu, Wifi, Battery, Zap, Layers, Smartphone } from 'lucide-react';

const products = [
    {
        id: "01",
        name: "Zenith X1",
        subtitle: "flagship series",
        category: "Smartphone",
        image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop",
        description: "The future of mobile computing with AI integration and titanium alloy frame.",
        specs: [
            { icon: Cpu, label: "A17 Pro" },
            { icon: Wifi, label: "6E Ready" },
            { icon: Battery, label: "48h Life" }
        ],
        color: "from-purple-500/20"
    },
    {
        id: "02",
        name: "Aero Buds",
        subtitle: "pro audio",
        category: "Audio",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop",
        description: "Immersive sound with adaptive noise cancellation and spatial audio tracking.",
        specs: [
            { icon: Zap, label: "Fast Chrg" },
            { icon: Layers, label: "ANC 2.0" },
            { icon: Wifi, label: "BT 5.3" }
        ],
        color: "from-blue-500/20"
    },
    {
        id: "03",
        name: "Chrono S",
        subtitle: "wearable tech",
        category: "Wearable",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop",
        description: "Advanced health monitoring meets sapphire crystal durability in a sleek form.",
        specs: [
            { icon: Smartphone, label: "eSIM" },
            { icon: Battery, label: "7 Days" },
            { icon: Layers, label: "Titanium" }
        ],
        color: "from-emerald-500/20"
    }
];

export const FeaturedProducts: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = cardsRef.current.filter(Boolean);
            const totalCards = cards.length;

            if (totalCards === 0) return;

            // --- 1. SETUP ---
            // Stack cards on top of each other
            // Card 0: Center, Visible
            // Card 1..N: Right, Hidden, Scaled Down
            gsap.set(cards, { 
                clearProps: "all" 
            });
            
            gsap.set(cards, { 
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                xPercent: 100, 
                scale: 0.85,
                autoAlpha: 0, // visibility: hidden, opacity: 0
                zIndex: (i) => i
            });
            
            // First card is the starting point
            gsap.set(cards[0], { 
                xPercent: 0, 
                scale: 1, 
                autoAlpha: 1 
            });

            // --- 2. SCROLL TRIGGER ---
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true, 
                    pinSpacing: true, // Crucial: Ensures subsequent content is pushed down
                    start: "top top",
                    // Significantly increased scroll distance: 1.5x viewport height per card + buffer
                    // This creates a much "taller" scrollbar experience, preventing premature overlap
                    end: () => `+=${window.innerHeight * (totalCards + 1) * 1.5}`, 
                    scrub: 1, 
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
                defaults: { ease: "none" } // Linear easing for direct scroll control
            });

            // --- 3. ANIMATION ---
            // Create a sequence: Card exits -> Next Card enters
            cards.forEach((card, i) => {
                if (i === totalCards - 1) return; // Last card stays
                
                const nextCard = cards[i + 1];

                tl
                // Current Card Exits
                .to(card, {
                    scale: 0.85,
                    xPercent: -20, // Parallax push to left
                    autoAlpha: 0,
                    filter: "blur(10px)",
                    duration: 1,
                    ease: "power2.inOut"
                })
                // Next Card Enters
                .fromTo(nextCard, 
                    { 
                        xPercent: 100, 
                        scale: 0.85, 
                        autoAlpha: 1 // Make visible immediately when starting motion
                    },
                    {
                        xPercent: 0,
                        scale: 1,
                        autoAlpha: 1,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power2.inOut"
                    }, 
                    "<" // Start at same time as exit
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const renderIntro = () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-charcoal to-midnight overflow-hidden relative border-r border-white/5">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
             
             {/* Decorative Circles */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

             <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
                <div className="inline-block mb-4 px-4 py-1 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md">
                    <span className="text-accent text-xs font-mono tracking-widest uppercase">2024 Collection</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-platinum mb-2 tracking-tight">CURATED</h2>
                <h1 className="text-6xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-platinum to-platinum/10 tracking-tighter mix-blend-overlay">
                    GADGETS
                </h1>
                <p className="mt-8 max-w-md mx-auto text-slate-400 font-light leading-relaxed">
                    A showcase of engineering excellence. Scroll to explore the devices redefining our digital horizon.
                </p>
                
                <div className="mt-12 flex items-center justify-center gap-4 text-platinum/50 animate-pulse">
                    <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
                    <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
             </div>
        </div>
    );

    const renderProduct = (product: any) => (
         // CHANGED: Use semantic variable-based colors (midnight/charcoal) instead of fixed hex
         <div className="w-full h-full bg-midnight bg-gradient-to-br from-charcoal via-midnight to-charcoal overflow-hidden relative border-r border-white/5 transition-colors duration-500">
             
             {/* 1. Atmospheric Background */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className={`absolute inset-0 bg-gradient-to-br ${product.color} to-transparent opacity-10`}></div>
                 {/* Atmosphere Glow */}
                 <div className="absolute top-1/2 right-1/4 w-[50vw] h-[50vw] bg-accent/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
             </div>

             {/* 2. Content Container */}
             <div className="relative z-10 w-full h-full container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-16">
                 {/* Text Content */}
                 <div className="order-2 md:order-1 md:col-span-5 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-px w-8 bg-accent"></span>
                        <span className="text-accent font-mono text-sm uppercase tracking-widest">{product.category}</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-display font-bold text-platinum mb-2 leading-none">
                        {product.name}
                    </h2>
                    <p className="text-xl text-slate-500 font-light mb-8 italic font-display">{product.subtitle}</p>
                    
                    <p className="text-slate-300 mb-10 text-lg leading-relaxed max-w-md font-body border-l-2 border-white/10 pl-6">
                        {product.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-2">
                        {product.specs.map((spec: any, i: number) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-lg backdrop-blur-sm flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                                <spec.icon size={20} className="text-accent" />
                                <span className="text-[10px] md:text-xs font-mono text-slate-300 uppercase tracking-wider">{spec.label}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Product Image Section - NEW COMPACT SIZE */}
                 <div className="order-1 md:order-2 md:col-span-7 relative h-[50vh] md:h-[60vh] flex items-center justify-center p-4">
                    
                    {/* Floating Container - Reduced Width */}
                    <div className="relative w-full max-w-[300px] md:max-w-[380px] aspect-[3/4] group">
                        
                        {/* Animated Border Gradient Ring */}
                        <div className="absolute -inset-[2px] rounded-[2.5rem] bg-gradient-to-b from-accent via-purple-500 to-accent/20 opacity-30 blur-sm group-hover:opacity-70 group-hover:blur-md transition-all duration-500"></div>

                        {/* Main Image Card with Curved Borders */}
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-midnight shadow-2xl shadow-purple-900/30 transition-colors duration-500">
                            
                            {/* Image with Hover Scale */}
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                            />
                            
                            {/* Inner Highlight/Sheen */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>
                            
                            {/* Glassmorphism Details Overlay (Bottom Reveal) */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                                <div className="flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    <div>
                                        <p className="text-accent text-xs font-mono mb-1">DESIGNED IN 2024</p>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 ring-1 ring-black"></div>
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 ring-1 ring-black"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-500 ring-1 ring-black"></div>
                                        </div>
                                    </div>
                                    <Sparkles className="text-white/50" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge (Animation defined in style block below) */}
                        {/* UPDATED: Using CSS variables for robust theming */}
                        <div 
                            className="absolute -top-6 -right-6 md:-right-12 p-4 rounded-2xl transition-colors duration-500 border"
                            style={{
                                animation: "float 6s ease-in-out infinite",
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--card-border)',
                                backdropFilter: 'var(--card-backdrop)',
                                boxShadow: 'var(--card-shadow)',
                                color: 'var(--text-card)'
                            }}
                        >
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/20 rounded-lg">
                                    <Sparkles size={18} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-mono uppercase">Edition</p>
                                    <p className="text-sm font-bold">Signature</p>
                                </div>
                             </div>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
    );

    return (
        <section id="showcase" ref={sectionRef} className="relative h-screen w-full bg-midnight z-20 overflow-hidden transition-colors duration-500">
             <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>

            <div ref={pinContainerRef} className="relative w-full h-full overflow-hidden perspective-1000">
                {/* 0. INTRO CARD (Index 0) */}
                <div 
                    ref={el => { if(el) cardsRef.current[0] = el }} 
                    className="absolute inset-0 w-full h-full will-change-transform"
                >
                    {renderIntro()}
                </div>

                {/* PRODUCT CARDS (Indices 1 to N) */}
                {products.map((product, index) => (
                    <div 
                        key={product.id} 
                        ref={el => { if(el) cardsRef.current[index + 1] = el }} 
                        className="absolute inset-0 w-full h-full will-change-transform"
                    >
                        {renderProduct(product)}
                    </div>
                ))}
            </div>
        </section>
    );
};