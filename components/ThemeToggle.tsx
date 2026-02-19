import React, { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import gsap from 'gsap';

type Theme = 'system' | 'dark' | 'light';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    // Load from local storage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) setTheme(savedTheme);
    }, []);

    // Apply Theme
    useEffect(() => {
        const root = document.documentElement;
        
        const applyTheme = (targetTheme: 'dark' | 'light') => {
            root.setAttribute('data-theme', targetTheme);
            if (targetTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (theme === 'system') {
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(systemIsDark ? 'dark' : 'light');
            localStorage.removeItem('theme');
            
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    // Handle Cycle
    const cycleTheme = () => {
        const states: Theme[] = ['system', 'dark', 'light'];
        const currentIndex = states.indexOf(theme);
        const nextIndex = (currentIndex + 1) % states.length;
        const nextTheme = states[nextIndex];
        
        // Animate Out
        gsap.to(iconRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                setTheme(nextTheme);
                // Animate In (from bottom)
                gsap.fromTo(iconRef.current, 
                    { y: 20, opacity: 0, rotate: -45 },
                    { y: 0, opacity: 1, rotate: 0, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        });
    };

    // AI Listener
    useEffect(() => {
        const handleAITheme = (e: CustomEvent<{ mode: string }>) => {
            const mode = e.detail.mode;
            if (mode === 'light' || mode === 'dark') {
                setTheme(mode);
            } else {
                setTheme('system');
            }
        };
        window.addEventListener('ai-change-theme', handleAITheme as EventListener);
        return () => window.removeEventListener('ai-change-theme', handleAITheme as EventListener);
    }, []);

    const getIcon = () => {
        switch(theme) {
            case 'light': return <Sun size={20} />;
            case 'dark': return <Moon size={20} />;
            case 'system': return <Monitor size={20} />;
        }
    };

    const getLabel = () => {
         switch(theme) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'system': return 'System';
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={cycleTheme}
            // Using direct CSS variables for ultimate reliability between themes
            className="fixed bottom-8 left-8 z-[90] h-12 px-4 rounded-full flex items-center gap-3 transition-all duration-300 group border"
            style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--card-border)',
                backdropFilter: 'var(--card-backdrop)',
                boxShadow: 'var(--card-shadow)',
                color: 'var(--text-card)'
            }}
            aria-label="Toggle Theme"
        >
            <div ref={iconRef} className="text-accent group-hover:scale-110 transition-transform duration-300">
                {getIcon()}
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap">
                {getLabel()}
            </span>
        </button>
    );
};