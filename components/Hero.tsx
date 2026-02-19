import React, { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowDown, Instagram, Twitter, Linkedin, Sparkles, Zap, Aperture, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);

  // 1. Advanced Canvas Particle Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Grid properties
    const gridSize = 40;
    let offset = 0;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = width < 768 ? 40 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw subtle perspective grid
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.03)';
      ctx.lineWidth = 1;
      
      // Moving floor grid effect
      offset = (offset + 0.2) % gridSize;
      
      // Vertical lines
      for(let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
      }
      
      // Horizontal lines (with movement)
      for(let y = offset; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
      }

      // Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Proximity connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Mouse Move 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!profileCardRef.current) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate rotation based on mouse position relative to center
    const x = (clientX - innerWidth / 2) / 20; // dividing by 20 dampens the effect
    const y = (clientY - innerHeight / 2) / 20;

    gsap.to(profileCardRef.current, {
      rotateY: x,
      rotateX: -y,
      transformPerspective: 1000,
      duration: 1,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    if (!profileCardRef.current) return;
    gsap.to(profileCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    });
  };

  // 3. Text Scramble & Entrance Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Helper for scramble text
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      const scrambleText = (element: HTMLElement, finalText: string) => {
          let iterations = 0;
          const interval = setInterval(() => {
              element.innerText = finalText.split("")
                  .map((letter, index) => {
                      if(index < iterations) return finalText[index];
                      return chars[Math.floor(Math.random() * chars.length)];
                  })
                  .join("");
              
              if(iterations >= finalText.length) clearInterval(interval);
              iterations += 1/3;
          }, 30);
      };

      // Animate Main Title parts
      tl.fromTo(".hero-line-1", { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power4.out" })
        .fromTo(".hero-line-2", { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.8");
      
      // Trigger scramble on the big text
      if (titleRef.current) scrambleText(titleRef.current, "GADGETS");
      
      // Animate Subtitle
      tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 1 }, "-=0.5");
      
      // Animate Buttons
      tl.from(".hero-btn", { y: 20, opacity: 0, stagger: 0.2, duration: 0.8 }, "-=0.5");

      // Animate Profile Card
      tl.from(profileCardRef.current, { 
          scale: 0.8, 
          opacity: 0, 
          rotationY: 90, 
          duration: 1.5, 
          ease: "back.out(1.7)" 
      }, "-=1.5");

      // Floating Skills
      tl.from(".skill-badge", {
          x: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5
      }, "-=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
        id="home"
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 md:pt-0"
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />
      
      {/* HUD Decor Elements */}
      <div className="absolute top-24 left-6 md:left-12 opacity-30 hidden md:block">
          <div className="flex flex-col gap-1">
              <span className="h-px w-4 bg-accent"></span>
              <span className="h-px w-8 bg-accent"></span>
              <span className="h-px w-2 bg-accent"></span>
          </div>
          <span className="text-[10px] font-mono text-accent mt-2 block">SYS.READY</span>
      </div>
      <div className="absolute bottom-12 right-6 md:right-12 opacity-30 hidden md:block text-right">
          <span className="text-[10px] font-mono text-accent block mb-2">COORD: 34.0522° N, 118.2437° W</span>
          <div className="flex flex-col gap-1 items-end">
              <span className="h-px w-12 bg-accent"></span>
              <span className="h-px w-4 bg-accent"></span>
          </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Content */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="hero-line-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-mono text-accent tracking-widest uppercase">Future Tech Available Now</span>
            </div>
            
            <div className="overflow-visible mb-2">
                <h1 className="hero-line-1 font-display text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-platinum via-platinum to-slate-500 tracking-tight leading-none">
                    CLOUDS
                </h1>
            </div>
            <div className="overflow-visible mb-8">
                <h1 ref={titleRef} className="hero-line-2 font-display text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-accent tracking-tight leading-none filter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    GADGETS
                </h1>
            </div>

            <p ref={subtitleRef} className="text-lg text-slate-400 font-light leading-relaxed max-w-xl mb-10 font-body">
                Redefining the digital lifestyle. We bridge the gap between imagination and reality with premium electronics, 
                expert social strategies, and graphic design services.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/showcase" className="hero-btn interactive group relative px-8 py-4 bg-accent text-white font-bold tracking-wider font-display overflow-hidden rounded-sm transition-transform hover:-translate-y-1 inline-flex items-center justify-center">
                    <span className="relative z-10 flex items-center gap-2">
                        START SHOPPING <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
                <Link to="/contact" className="hero-btn interactive px-8 py-4 border border-white/20 text-platinum font-display tracking-wider hover:bg-white/5 transition-colors rounded-sm inline-flex items-center justify-center">
                    CONTACT US
                </Link>
            </div>
            
            <div className="hero-btn mt-12 flex items-center gap-6 opacity-60">
                 <div className="flex items-center gap-2">
                    <div className="bg-white/10 p-2 rounded-full"><Zap size={16} className="text-accent"/></div>
                    <span className="text-xs font-mono text-platinum">FAST DELIVERY</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="bg-white/10 p-2 rounded-full"><Aperture size={16} className="text-accent"/></div>
                    <span className="text-xs font-mono text-platinum">PREMIUM QUALITY</span>
                 </div>
            </div>
        </div>

        {/* Right: 3D Profile Card */}
        <div className="order-1 lg:order-2 flex justify-center perspective-[2000px]">
            <div 
                ref={profileCardRef}
                className="relative w-[300px] md:w-[400px] aspect-[3/4] preserve-3d group cursor-pointer"
            >
                {/* Back Glow */}
                <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full transform translate-z-[-50px]"></div>

                {/* Main Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-charcoal/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl transform transition-transform shadow-accent/20">
                    
                    {/* Image */}
                    <img 
                        src="https://github.com/Joweb1/Jovibe-images/raw/refs/heads/main/profileimage.jpg" 
                        alt="Profile" 
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80"></div>

                    {/* Card Content (Bottom) */}
                    <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-xs font-mono text-green-400">AVAILABLE FOR HIRE</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-1">ALEX CLOUDS</h3>
                        <p className="text-sm text-accent font-medium mb-4">Founder & Tech Specialist</p>
                        
                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent hover:text-white transition-colors text-white"><Instagram size={18}/></a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent hover:text-white transition-colors text-white"><Twitter size={18}/></a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent hover:text-white transition-colors text-white"><Linkedin size={18}/></a>
                        </div>
                    </div>
                </div>

                {/* Floating Skill Badges (Parallax Depth) */}
                {/* UPDATED: Using CSS variables for robust theming */}
                <div 
                    className="skill-badge absolute -right-8 top-12 p-3 rounded-lg flex items-center gap-3 transition-colors duration-500 transform translate-z-[40px] border"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--card-border)',
                        backdropFilter: 'var(--card-backdrop)',
                        boxShadow: 'var(--card-shadow)',
                        color: 'var(--text-card)'
                    }}
                >
                    <div className="bg-accent/20 p-2 rounded-md"><Sparkles size={20} className="text-accent"/></div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Skill</p>
                        <p className="text-sm font-bold">Graphic Design</p>
                    </div>
                </div>

                <div 
                    className="skill-badge absolute -left-12 bottom-32 p-3 rounded-lg flex items-center gap-3 transition-colors duration-500 transform translate-z-[60px] border"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--card-border)',
                        backdropFilter: 'var(--card-backdrop)',
                        boxShadow: 'var(--card-shadow)',
                        color: 'var(--text-card)'
                    }}
                >
                    <div className="bg-blue-500/20 p-2 rounded-md"><Globe size={20} className="text-blue-400"/></div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Expertise</p>
                        <p className="text-sm font-bold">Social Growth</p>
                    </div>
                </div>

                {/* Decorative Frame Lines */}
                <div className="absolute -inset-4 border border-white/5 rounded-3xl pointer-events-none transform translate-z-[-20px] group-hover:border-accent/30 transition-colors duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent rounded-tr-3xl pointer-events-none opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent rounded-bl-3xl pointer-events-none opacity-50"></div>
            </div>
        </div>
      </div>
    </section>
  );
};