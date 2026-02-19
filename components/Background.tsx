import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const blobs = blobRefs.current;
    
    // Create a smooth, organic motion for each blob
    blobs.forEach((blob, i) => {
       if (!blob) return;
       
       // Randomize start positions slightly
       gsap.set(blob, {
           x: Math.random() * 200 - 100,
           y: Math.random() * 200 - 100,
           scale: 0.8 + Math.random() * 0.4,
           opacity: 0
       });
       
       // Fade in initially
       gsap.to(blob, { opacity: i === 2 ? 0.2 : 0.4, duration: 2 });

       // Motion path - Organic Drifting
       gsap.to(blob, {
           x: "random(-200, 200)", // Drifts relative to initial position
           y: "random(-150, 150)",
           rotation: "random(-45, 45)",
           scale: "random(0.8, 1.4)",
           duration: "random(15, 25)", // Slow, heavy movement
           ease: "sine.inOut",
           repeat: -1,
           yoyo: true,
           repeatRefresh: true // Crucial: picks new random values on each repeat
       });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-midnight transition-colors duration-500">
      {/* Deep Atmosphere Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-deep to-midnight transition-colors duration-500"></div>

      {/* Animated Cloud Blobs - Adjusted colors for Light Mode Visibility */}
      
      {/* Blob 1: Top Left - Deep Purple -> Lighter Purple in Light Mode */}
      <div 
        ref={el => { if(el) blobRefs.current[0] = el }}
        className="absolute w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px] -top-[10%] -left-[10%]"
      />
      
      {/* Blob 2: Bottom Right - Indigo/Blue */}
      <div 
        ref={el => { if(el) blobRefs.current[1] = el }}
        className="absolute w-[70vw] h-[70vw] rounded-full bg-indigo-500/20 blur-[140px] -bottom-[20%] -right-[10%]"
      />

      {/* Blob 3: Center Highlight - Accent Glow */}
      <div 
        ref={el => { if(el) blobRefs.current[2] = el }}
        className="absolute w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Blob 4: Floating Variant */}
      <div 
        ref={el => { if(el) blobRefs.current[3] = el }}
        className="absolute w-[40vw] h-[40vw] rounded-full bg-violet-600/20 blur-[130px] top-[10%] right-[20%]"
      />

      {/* Texture Overlays */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay"></div>
      
      {/* Subtle Digital Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
    </div>
  );
};