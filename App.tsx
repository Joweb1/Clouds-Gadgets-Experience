import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import { Hero } from './components/Hero';
import { Loader } from './components/Loader';
import { CustomCursor } from './components/CustomCursor';
import { PinnedSection } from './components/PinnedSection'; // About
import { ServicesGrid } from './components/ServicesGrid'; // Offerings
import { FeaturedProducts } from './components/FeaturedProducts'; // Showcase
import { Contact } from './components/Contact'; 
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { Background } from './components/Background';
import { AutoScroll } from './components/AutoScroll';
import { AIVoiceAgent } from './components/AIVoiceAgent';
import { AIChatbot } from './components/AIChatbot';
import { ThemeToggle } from './components/ThemeToggle';

// Types
import { AINavigateDetail, AIThemeDetail, AIAccentDetail } from './types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ScrollToTop Helper
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle loader completion
  const handleLoaderComplete = () => {
    setLoading(false);
  };

  // --- EVENT BUS: AI CONTROL CENTER ---
  useEffect(() => {
    // 1. Navigation Handler
    const handleAINavigate = (e: CustomEvent<AINavigateDetail>) => {
        const page = e.detail.page.toLowerCase();
        console.log("AI Navigating to:", page);
        
        const routes: Record<string, string> = {
            'home': '/',
            '/': '/',
            'about': '/about',
            '/about': '/about',
            'showcase': '/showcase',
            'products': '/showcase',
            '/showcase': '/showcase',
            'offerings': '/offerings',
            'services': '/offerings',
            '/offerings': '/offerings',
            'contact': '/contact',
            '/contact': '/contact'
        };

        const target = routes[page] || '/';
        navigate(target);
    };

    // 2. Theme Handler
    // Handled inside ThemeToggle component, but we keep listeners here if needed for other UI reactions
    const handleAITheme = (e: CustomEvent<AIThemeDetail>) => {
        // Redundant here if ThemeToggle handles it, but good for global state if we had it
    };

    // 3. Accent Color Handler
    const handleAIAccent = (e: CustomEvent<AIAccentDetail>) => {
        const color = e.detail.color;
        // Update CSS Variable
        document.documentElement.style.setProperty('--accent', color);
    };

    // Register Listeners
    window.addEventListener('ai-navigate', handleAINavigate as EventListener);
    window.addEventListener('ai-change-theme', handleAITheme as EventListener);
    window.addEventListener('ai-change-accent', handleAIAccent as EventListener);

    return () => {
        window.removeEventListener('ai-navigate', handleAINavigate as EventListener);
        window.removeEventListener('ai-change-theme', handleAITheme as EventListener);
        window.removeEventListener('ai-change-accent', handleAIAccent as EventListener);
    };
  }, [navigate]);

  useEffect(() => {
    if (!loading && mainRef.current) {
      gsap.fromTo(mainRef.current, 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power3.out", 
            delay: 0.2,
            clearProps: "transform",
            onComplete: () => {
                // Critical: Refresh ScrollTrigger after entrance animation alters layout/positions
                ScrollTrigger.refresh();
            }
        }
      );
    }
  }, [loading]);

  return (
    <div className="relative min-h-screen bg-midnight text-platinum font-body selection:bg-accent selection:text-midnight transition-colors duration-500">
      <CustomCursor />
      <Background />
      <ScrollToTop />
      
      {loading ? (
        <Loader onComplete={handleLoaderComplete} />
      ) : (
        <>
          <Navigation />
          
          <main ref={mainRef} className="relative z-10 opacity-0 min-h-screen flex flex-col">
            <Routes>
                {/* Home: Full Experience */}
                <Route path="/" element={
                  <>
                    <Hero />
                    <PinnedSection />
                    <ServicesGrid /> {/* Offerings now comes before Featured Products */}
                    <FeaturedProducts />
                    <Contact />
                  </>
                } />
                
                {/* About: Hero + Info */}
                <Route path="/about" element={
                  <>
                    <Hero />
                    <PinnedSection />
                  </>
                } />
                
                {/* Standalone Pages */}
                <Route path="/showcase" element={<FeaturedProducts />} />
                <Route path="/offerings" element={<ServicesGrid />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
          </main>

          {/* UI Interface Layer */}
          <ThemeToggle />
          <AutoScroll />
          <AIVoiceAgent />
          <AIChatbot />
        </>
      )}
    </div>
  );
}