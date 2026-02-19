import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { 
    label: "Home", 
    path: "/", 
    id: "01",
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
  },
  { 
    label: "About", 
    path: "/about", 
    id: "02",
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    label: "Showcase", 
    path: "/showcase", 
    id: "03",
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
  },
  {
    label: "Offerings",
    path: "/offerings",
    id: "04",
    src: "https://images.unsplash.com/photo-1614726365723-49cfae96a604?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    label: "Contact", 
    path: "/contact", 
    id: "05",
    src: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop" 
  }
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Initial Toggle Timeline
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true })
        .to(menuRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power4.inOut",
        })
        .from(".nav-item", {
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.5")
        .from(".nav-line", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.1
        }, "-=0.8")
        .from(".nav-footer", {
            opacity: 0,
            y: 20,
            duration: 0.5
        }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Open/Close
  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isOpen]);

  // Handle Image Switching on Hover
  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
  };

  return (
    <div ref={containerRef}>
      {/* 1. TOP BAR (Always Visible) */}
      {/* IMPORTANT: text-pure-white is used so mix-blend-difference works on both dark (black) and light (white) backgrounds. */}
      {/* White text on White bg -> Difference = Black. White text on Black bg -> Difference = White. */}
      <nav className="fixed top-0 left-0 w-full z-[60] py-6 md:py-8 px-6 md:px-12 flex justify-between items-center mix-blend-difference text-pure-white">
        <Link to="/" className="interactive relative z-[60] text-2xl font-display font-bold tracking-tighter">
          CLOUDS<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-6">
            <Link to="/contact" className="hidden md:block interactive text-sm font-mono tracking-widest uppercase hover:text-accent transition-colors">
                Let's Talk
            </Link>
            
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="interactive group flex items-center gap-3 text-sm font-bold uppercase tracking-widest focus:outline-none"
            >
                <span className="hidden md:block group-hover:text-accent transition-colors">{isOpen ? 'Close' : 'Menu'}</span>
                <div className={`relative w-10 h-10 rounded-full border border-pure-white/20 flex items-center justify-center bg-pure-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:border-accent ${isOpen ? 'rotate-90' : ''}`}>
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </div>
            </button>
        </div>
      </nav>

      {/* 2. FULL SCREEN MENU OVERLAY */}
      {/* Changed bg-[#080214] to bg-midnight for theme support */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-50 bg-midnight text-white flex flex-col md:flex-row transition-colors duration-500"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        
        {/* BACKGROUND PREVIEW IMAGES */}
        <div className="absolute inset-0 z-0 opacity-20 md:opacity-40 transition-opacity duration-700 pointer-events-none">
            {menuItems.map((item, index) => (
                <img 
                    key={index}
                    src={item.src} 
                    alt={item.label}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${hoveredIndex === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100 grayscale'}`}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/80 to-transparent transition-colors duration-500"></div>
        </div>

        {/* LEFT COLUMN: LINKS */}
        <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-20 pt-20">
            <div className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="group relative"
                        onMouseEnter={() => handleHover(index)}
                        onMouseLeave={() => handleHover(null)}
                    >
                        <div className="nav-line w-full h-px bg-white/10 mb-4 group-hover:bg-accent transition-colors duration-500"></div>
                        
                        <Link 
                            to={item.path} 
                            onClick={() => setIsOpen(false)}
                            className="nav-item block relative overflow-hidden py-2"
                        >
                            <div className="flex items-baseline gap-4 md:gap-8 transition-transform duration-500 group-hover:translate-x-4">
                                <span className="text-xs md:text-sm font-mono text-accent/50 group-hover:text-accent transition-colors">
                                    {item.id}
                                </span>
                                <span className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 group-hover:to-accent transition-all duration-500">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    </div>
                ))}
                <div className="nav-line w-full h-px bg-white/10"></div>
            </div>

            {/* Footer Info in Menu */}
            <div className="nav-footer mt-12 flex gap-8 text-sm text-slate-500 font-mono">
                <div className="flex flex-col gap-2">
                    <span className="text-white">Socials</span>
                    <a href="#" className="hover:text-accent transition-colors">Instagram</a>
                    <a href="#" className="hover:text-accent transition-colors">Twitter</a>
                    <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-white">Contact</span>
                    <a href="mailto:hello@clouds.com" className="hover:text-accent transition-colors">hello@clouds.com</a>
                    <span className="">+1 (555) 123-4567</span>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: DECORATIVE (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 h-full items-center justify-center relative z-10 pointer-events-none">
             {/* Center Circle Decor */}
             <div className="relative w-[400px] h-[400px] rounded-full border border-white/5 flex items-center justify-center">
                 <div className={`w-[300px] h-[300px] rounded-full border border-white/10 transition-all duration-700 ${hoveredIndex !== null ? 'scale-110 border-accent/20' : 'scale-100'}`}></div>
                 <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-20">
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                 </div>
                 
                 {/* Dynamic Text in Circle */}
                 <div className="absolute text-center">
                     <p className="text-xs font-mono text-accent mb-2 uppercase tracking-widest">
                         {hoveredIndex !== null ? 'Navigate To' : 'Menu'}
                     </p>
                     <h2 className="text-4xl font-display font-bold text-white">
                        {hoveredIndex !== null ? menuItems[hoveredIndex].label : 'SELECT'}
                     </h2>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};