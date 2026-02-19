import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, TrendingUp, Cpu, Activity } from 'lucide-react';

const sections = [
    {
        id: "quality",
        title: "Military-Grade Quality",
        icon: ShieldCheck,
        desc: "Precision engineering meets rigorous stress testing. Our devices are built to withstand the extremes of modern life.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
        stat: "99.9%",
        statLabel: "Reliability"
    },
    {
        id: "tech",
        title: "Next-Gen Intelligence",
        icon: Cpu,
        desc: "Powered by 3nm processor architecture and neural engines that adapt to your workflow in real-time.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
        stat: "50TOPS",
        statLabel: "AI Performance"
    },
    {
        id: "value",
        title: "Sustainable Value",
        icon: TrendingUp,
        desc: "Premium tech doesn't have to cost the earth. Our circular economy model ensures value retention.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        stat: "0%",
        statLabel: "Carbon Footprint"
    }
];

export const PinnedSection: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textBlocksRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // We use a ref for the animation logic to avoid stale closures in GSAP callbacks
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Select elements robustly
      const blocks = gsap.utils.toArray('.content-block');
      
      blocks.forEach((block: any, i) => {
         ScrollTrigger.create({
             trigger: block,
             start: "top 55%", // Adjusted for tighter spacing: triggers slightly below center
             end: "bottom 55%", 
             onEnter: () => updateActiveSection(i),
             onEnterBack: () => updateActiveSection(i),
             markers: false, 
             id: `block-${i}`
         });
      });
      
    }, componentRef);

    return () => ctx.revert();
  }, []);

  const updateActiveSection = (index: number) => {
      if (activeIndexRef.current === index) return;

      const prevIndex = activeIndexRef.current;
      activeIndexRef.current = index;
      setActiveIndex(index); // Trigger React re-render for text styles

      // Handle Image Animation (Only if images exist - i.e. Desktop)
      const images = imagesRef.current;
      const currentImage = images[prevIndex]; 
      const nextImage = images[index]; 

      if (!nextImage || !currentImage) return;

      // Ensure we don't have conflicting animations running
      gsap.killTweensOf(images);

      // Reset everything except current and next to hidden to be safe
      images.forEach((img, i) => {
          if (i !== prevIndex && i !== index && img) {
              gsap.set(img, { zIndex: 0, autoAlpha: 0 });
          }
      });

      if (currentImage) {
          gsap.set(currentImage, { zIndex: 1, autoAlpha: 1, scale: 1, filter: "brightness(1)" });
      }
      
      gsap.set(nextImage, { zIndex: 2, autoAlpha: 1 });

      // Animate Next Image In
      gsap.fromTo(nextImage, 
          {
            clipPath: "inset(100% 0 0 0)",
            scale: 1.1,
            filter: "brightness(2) contrast(1.2)" 
          },
          {
            clipPath: "inset(0% 0 0 0)",
            scale: 1,
            filter: "brightness(1) contrast(1)",
            duration: 1,
            ease: "power3.out",
            overwrite: true
          }
      );

      // Animate Previous Image Out (Optional, creates depth)
      if (currentImage) {
          gsap.to(currentImage, {
              scale: 0.95,
              filter: "brightness(0.5)",
              duration: 1,
              ease: "power3.out",
              overwrite: true
          });
      }
  };

  return (
    <section id="about" ref={componentRef} className="relative w-full bg-transparent py-24 md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row">
        
        {/* LEFT: Scrollable Text Content */}
        {/* Reduced gap to 20 (5rem) and min-h to 25vh for much tighter spacing */}
        <div className="w-full md:w-1/2 px-6 md:px-12 py-20 flex flex-col gap-20 relative z-10 pb-24">
            {sections.map((section, i) => (
                <div 
                    key={i} 
                    ref={el => { textBlocksRef.current[i] = el }}
                    className="content-block flex flex-col justify-center min-h-[25vh] transition-opacity duration-500"
                >
                    <div 
                        className={`
                            relative p-8 md:p-10 rounded-2xl border backdrop-blur-xl transition-all duration-700
                            ${activeIndex === i 
                                ? "bg-white/10 border-accent/50 shadow-[0_0_50px_rgba(168,85,247,0.1)] translate-x-0 opacity-100 blur-none" 
                                : "bg-white/5 border-white/5 -translate-x-4 opacity-40 hover:opacity-70 grayscale blur-[2px] hover:blur-none"}
                        `}
                    >
                        {/* Glow Dot */}
                        <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full transition-all duration-500 ${activeIndex === i ? 'bg-accent shadow-[0_0_20px_#a855f7] opacity-100' : 'bg-white/10 opacity-0'}`}></div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl transition-colors duration-500 ${activeIndex === i ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white/5 text-slate-500'}`}>
                                <section.icon size={28} />
                            </div>
                            <h3 className={`text-2xl md:text-4xl font-display font-bold tracking-tight transition-colors duration-500 ${activeIndex === i ? 'text-white' : 'text-slate-500'}`}>
                                {section.title}
                            </h3>
                        </div>
                        
                        <p className={`text-base md:text-lg leading-relaxed font-body mb-6 transition-colors duration-500 ${activeIndex === i ? 'text-slate-300' : 'text-slate-600'}`}>
                            {section.desc}
                        </p>

                        {/* Mini Stat Badge */}
                        <div className={`flex items-center gap-4 border-t pt-4 transition-colors duration-500 ${activeIndex === i ? 'border-white/10' : 'border-white/5'}`}>
                            <div className={`text-3xl font-display font-bold transition-colors duration-500 ${activeIndex === i ? 'text-white' : 'text-slate-600'}`}>{section.stat}</div>
                            <div className={`text-xs font-mono uppercase tracking-widest transition-colors duration-500 ${activeIndex === i ? 'text-accent' : 'text-slate-600'}`}>{section.statLabel}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* RIGHT: Pinned Image Container (Using CSS Sticky) */}
        {/* h-screen and sticky top-0 ensures it stays in view while the left column scrolls */}
        <div className="hidden md:flex w-1/2 h-screen sticky top-0 right-0 items-center justify-center p-12">
            <div className="relative w-full h-full max-h-[80vh] rounded-3xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm">
                
                {/* Tech Overlay HUD */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {/* Corners */}
                    <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-accent/50"></div>
                    <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-accent/50"></div>
                    <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-accent/50"></div>
                    <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-accent/50"></div>
                    
                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 shadow-[0_0_20px_#a855f7] animate-[scan_4s_ease-in-out_infinite]"></div>

                    {/* Coordinates */}
                    <div className="absolute bottom-8 right-8 text-right bg-black/40 backdrop-blur-md px-4 py-2 rounded border border-white/5">
                        <div className="flex items-center gap-2 justify-end mb-1">
                            <Activity size={12} className="text-accent animate-pulse" />
                            <span className="text-[10px] font-mono text-accent">LIVE_FEED</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                            SEC_0{activeIndex + 1} // STATUS: ACTIVE
                        </span>
                    </div>
                </div>

                {/* Images */}
                <div className="relative w-full h-full bg-black">
                  {sections.map((section, i) => (
                      <div 
                          key={i}
                          ref={el => { imagesRef.current[i] = el }}
                          className="absolute inset-0 w-full h-full"
                          style={{ 
                            // Initial state: First image visible
                            zIndex: i === 0 ? 1 : 0, 
                            visibility: "visible",
                            opacity: i === 0 ? 1 : 0
                          }} 
                      >
                          <img 
                              src={section.image} 
                              alt={section.title} 
                              className="w-full h-full object-cover scale-110" // Initial slight scale
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/20"></div>
                          <div className="absolute inset-0 bg-accent/5 mix-blend-overlay"></div>
                      </div>
                  ))}
                </div>

            </div>
        </div>
      </div>
    </section>
  );
};