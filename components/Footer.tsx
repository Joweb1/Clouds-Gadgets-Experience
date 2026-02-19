import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const Footer: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Continuous Marquee Animation
      gsap.to(marqueeRef.current, {
        xPercent: -50, 
        duration: 30,
        ease: "none",
        repeat: -1
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-charcoal/50 backdrop-blur-md text-white pt-20 pb-0 border-t border-white/5 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          <div className="mb-10 md:mb-0 max-w-sm">
            <h2 className="text-3xl font-display font-bold mb-6">CLOUDS GADGETS</h2>
            <p className="text-slate-400 font-light leading-relaxed font-body">
              Enhancing everyday life through reliable, stylish, and affordable technology.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-accent uppercase tracking-widest text-sm font-bold font-display">Contact</h4>
            <a href="https://linktr.ee/Clouds04" className="interactive text-slate-300 hover:text-white transition-colors font-body">Linktree</a>
            <span className="text-slate-500 font-body">Based in Tech City</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 pb-10 border-t border-white/5 text-sm text-slate-500 font-body">
          <p>&copy; {new Date().getFullYear()} Clouds Gadgets. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>Privacy Policy</span>
             <span>Terms of Service</span>
          </div>
        </div>
      </div>
        
      {/* Large Animated Marquee Watermark */}
      <div className="w-full mt-8 pb-4 opacity-5 pointer-events-none select-none overflow-hidden">
          <div ref={marqueeRef} className="flex whitespace-nowrap w-fit">
             {/* Duplicate text for seamless loop */}
             <h1 className="text-[12vw] leading-none font-bold font-display text-center px-8">
               CLOUDS GADGETS — FUTURE TECH —
             </h1>
             <h1 className="text-[12vw] leading-none font-bold font-display text-center px-8">
               CLOUDS GADGETS — FUTURE TECH —
             </h1>
          </div>
      </div>
    </footer>
  );
};