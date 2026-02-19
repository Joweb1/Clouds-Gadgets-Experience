import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Cpu, Cloud, Zap, Smartphone, Radio } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

const icons = [Cpu, Cloud, Zap, Smartphone, Radio];

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const comp = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // Icon cycling logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Canvas Vortex Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
        x: number;
        y: number;
        z: number;
        size: number;
        color: string;
        
        constructor() {
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            this.z = Math.random() * width;
            this.size = Math.random() * 2;
            // Use darker purples so they are visible on both Black (Dark Mode) and White (Light Mode) backgrounds
            this.color = Math.random() > 0.5 ? '#a855f7' : '#7c3aed'; 
        }

        update(speed: number) {
            this.z -= speed;
            if (this.z <= 0) {
                this.z = width;
                this.x = (Math.random() - 0.5) * width;
                this.y = (Math.random() - 0.5) * height;
            }
        }

        draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
            const scale = 500 / (500 + this.z);
            const x2d = this.x * scale + centerX;
            const y2d = this.y * scale + centerY;
            const s = this.size * scale;

            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = scale;
            ctx.arc(x2d, y2d, s, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles: Particle[] = Array.from({ length: 400 }, () => new Particle());
    let animationId: number;
    let speed = 5;

    const animate = () => {
        // Clear canvas transparently so CSS background shows through
        ctx.clearRect(0, 0, width, height); 

        const centerX = width / 2;
        const centerY = height / 2;

        particles.forEach(p => {
            p.update(speed);
            p.draw(ctx, centerX, centerY);
        });

        if (speed < 50) speed += 0.1;
        animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // 1. Initial State
      gsap.set(".loader-content", { opacity: 0, scale: 0.9 });
      
      // 2. Fade in Loader
      tl.to(".loader-content", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      });

      // 3. Count up percentage
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
            if (percentageRef.current) {
                percentageRef.current.innerText = Math.floor(counter.val).toString().padStart(3, '0') + '%';
            }
        }
      }, "-=0.5");

      // 4. Glitch Text Reveal for Brand Name
      tl.to(".loading-text", {
          opacity: 0,
          duration: 0.2
      });
      
      tl.fromTo(textRef.current, 
        { scale: 2, opacity: 0, letterSpacing: "50px", filter: "blur(20px)" },
        { scale: 1, opacity: 1, letterSpacing: "10px", filter: "blur(0px)", duration: 1, ease: "expo.out" }
      );

      // 5. Shutter Effect Exit
      tl.to(".shutter-top", {
          height: "50vh",
          duration: 0.5,
          ease: "power2.in",
          backgroundColor: "#a855f7" // New accent
      }, "+=0.5");
      
      tl.to(".shutter-bottom", {
          height: "50vh",
          duration: 0.5,
          ease: "power2.in",
          backgroundColor: "#a855f7"
      }, "<");

      tl.to([".shutter-top", ".shutter-bottom"], {
          height: 0,
          duration: 0.8,
          ease: "expo.inOut",
          delay: 0.1
      });

      tl.to(comp.current, {
        display: "none"
      });

    }, comp);

    return () => ctx.revert();
  }, [onComplete]);

  const CurrentIcon = icons[currentIconIndex];

  return (
    <div ref={comp} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight overflow-hidden transition-colors duration-500">
        {/* Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />
        
        {/* Shutters for transition - Using bg-midnight to match theme */}
        <div className="shutter-top absolute top-0 left-0 w-full h-0 bg-midnight z-50 transition-colors duration-500"></div>
        <div className="shutter-bottom absolute bottom-0 left-0 w-full h-0 bg-midnight z-50 transition-colors duration-500"></div>

        {/* Central UI */}
        <div className="loader-content relative z-10 flex flex-col items-center justify-center w-full max-w-md">
            
            {/* Tech Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-12">
                <div className="absolute inset-0 border-4 border-platinum/10 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-accent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-accent-glow rounded-full animate-spin [animation-duration:3s]"></div>
                
                {/* Icon Morphing */}
                <div className="text-accent">
                    <CurrentIcon size={40} />
                </div>
            </div>

            {/* Percentage & Status */}
            <div className="loading-text flex flex-col items-center gap-2">
                <div ref={percentageRef} className="text-6xl font-mono font-bold text-platinum tracking-tighter transition-colors duration-500">
                    000%
                </div>
                <div className="text-accent-glow text-xs uppercase tracking-[0.5em] animate-pulse font-display">
                    System Initialization
                </div>
            </div>

            {/* Final Brand Reveal (Hidden initially) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                <h1 ref={textRef} className="opacity-0 text-5xl md:text-7xl font-display font-bold text-platinum whitespace-nowrap drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-colors duration-500">
                    CLOUDS
                </h1>
            </div>

            {/* Decor Elements */}
            <div className="absolute bottom-[-100px] flex gap-8 opacity-30">
                <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent"></div>
                <div className="w-px h-24 bg-gradient-to-b from-transparent to-accent"></div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent"></div>
            </div>
        </div>
    </div>
  );
};