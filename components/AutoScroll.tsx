import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export const AutoScroll: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  
  // Logic State
  const waitEndTime = useRef<number>(0);
  const stepAccumulator = useRef<number>(0);
  const lastSection = useRef<string>('normal');

  useEffect(() => {
    // CRITICAL FIX: Disable CSS smooth scrolling when auto-scroll is active.
    // CSS 'scroll-behavior: smooth' conflicts with JS 'window.scrollBy' in a loop, causing shaking/jerking.
    const html = document.documentElement;
    if (isScrolling) {
        html.style.scrollBehavior = 'auto';
    } else {
        html.style.scrollBehavior = ''; // Reverts to CSS class (scroll-smooth)
    }

    const performScroll = () => {
      if (!isScrolling) return;

      const timeNow = Date.now();

      // 1. Handle Waiting Period (Pause)
      if (timeNow < waitEndTime.current) {
         animationFrameRef.current = requestAnimationFrame(performScroll);
         return;
      }

      // 2. Identify Current Section Context
      const viewportHeight = window.innerHeight;
      let currentSection = 'normal';
      
      const showcaseEl = document.getElementById('showcase');
      const aboutEl = document.getElementById('about');

      // Check Showcase (GSAP Pinned Section)
      if (showcaseEl) {
           const parent = showcaseEl.parentElement;
           const target = parent?.classList.contains('pin-spacer') ? parent : showcaseEl;
           const rect = target.getBoundingClientRect();
           
           // We are "active" in showcase if the top is pinned (<=0) and there is still scrollable height (>0)
           if (rect.top <= 0.5 && rect.bottom > 50) {
               currentSection = 'showcase';
           }
      }

      // Check About (CSS Sticky Section)
      if (currentSection === 'normal' && aboutEl) {
           const rect = aboutEl.getBoundingClientRect();
           if (rect.top <= viewportHeight * 0.3 && rect.bottom > viewportHeight * 0.5) {
               currentSection = 'about';
           }
      }

      // Reset accumulator if section changes
      if (currentSection !== lastSection.current) {
          stepAccumulator.current = 0;
          lastSection.current = currentSection;
      }

      // 3. Execute Scroll Behavior
      let speed = 0;

      if (currentSection === 'showcase') {
          // BEHAVIOR: Fast "Swipe" -> Pause -> Repeat
          const stepTarget = viewportHeight * 1.5;
          
          speed = 35; // Increased speed for faster swipe
          
          window.scrollBy(0, speed);
          stepAccumulator.current += speed;

          if (stepAccumulator.current >= stepTarget) {
              waitEndTime.current = timeNow + 1000; // Reduced wait time (1.0s)
              stepAccumulator.current = 0;
          }

      } else if (currentSection === 'about') {
          // BEHAVIOR: Read -> Scroll -> Read
          const stepTarget = viewportHeight * 0.8;
          
          speed = 20; // Increased speed
          
          window.scrollBy(0, speed);
          stepAccumulator.current += speed;

          if (stepAccumulator.current >= stepTarget) {
              waitEndTime.current = timeNow + 1000; // Reduced wait time (1.0s)
              stepAccumulator.current = 0;
          }

      } else {
          // BEHAVIOR: General Fast Scanning
          speed = 8.0; // Doubled general speed
          window.scrollBy(0, speed);
      }

      // 4. Stop at Bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
        setIsScrolling(false);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(performScroll);
    };

    if (isScrolling) {
      waitEndTime.current = 0;
      stepAccumulator.current = 0;
      animationFrameRef.current = requestAnimationFrame(performScroll);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScrolling]);

  // AI Control Listener
  useEffect(() => {
    const handleAIControl = (e: CustomEvent<{ action: 'start' | 'stop' }>) => {
      setIsScrolling(e.detail.action === 'start');
    };

    window.addEventListener('ai-toggle-scroll', handleAIControl as EventListener);

    return () => {
      window.removeEventListener('ai-toggle-scroll', handleAIControl as EventListener);
    };
  }, []);

  return (
    <button
      onClick={() => setIsScrolling(!isScrolling)}
      className={`fixed bottom-48 right-8 z-[90] p-4 rounded-full border backdrop-blur-md transition-all duration-300 group
        ${isScrolling ? 'bg-accent border-accent text-midnight' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}
      `}
      aria-label="Toggle Auto Scroll"
    >
      <div className="relative">
        {isScrolling ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
        
        {isScrolling && (
            <div className="absolute -inset-4 border border-accent rounded-full animate-ping opacity-20"></div>
        )}
      </div>
    </button>
  );
};