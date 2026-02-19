import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

const services = [
  {
    title: "Smartphones",
    desc: "Latest models & reliable classics.",
    tags: ["iPhone", "Android", "Refurbished"],
    img: "https://github.com/Joweb1/Jovibe-images/raw/refs/heads/main/iphonemultiple.jpg"
  },
  {
    title: "Accessories",
    desc: "Cases, chargers, and audio gear.",
    tags: ["Audio", "Protection", "Power"],
    img: "https://raw.githubusercontent.com/Joweb1/Jovibe-images/refs/heads/main/iphonegray.jpg"
  },
  {
    title: "Tech Support",
    desc: "Repairs and troubleshooting.",
    tags: ["Fix", "Optimize", "Consult"],
    img: "https://raw.githubusercontent.com/Joweb1/Jovibe-images/refs/heads/main/iphonecase.jpg"
  },
  {
    title: "Creative Studio",
    desc: "Social Media & Graphic Design.",
    tags: ["Branding", "Content", "Strategy"],
    img: "https://github.com/Joweb1/Jovibe-images/raw/refs/heads/main/iphonemultiple.jpg"
  }
];

export const ServicesGrid: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=100",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-24 px-6 bg-transparent relative z-10">
      <div className="container mx-auto">
        <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end">
          <div>
             <h2 className="text-sm font-display text-accent tracking-widest mb-2 uppercase font-bold">Our Offerings</h2>
             <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Everything You Need</h3>
          </div>
          <p className="text-slate-400 mt-4 md:mt-0 max-w-md text-right font-body">
             From hardware to digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((item, idx) => (
            <div 
              key={idx} 
              className="service-card group interactive relative h-[400px] w-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl cursor-pointer hover:border-accent/50 transition-colors duration-300"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                style={{ backgroundImage: `url(${item.img})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                        </h4>
                        <p className="text-slate-300 mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 font-body">
                        {item.desc}
                        </p>
                    </div>
                    <div className="p-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm group-hover:bg-accent group-hover:text-midnight transition-colors">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-mono border border-white/10 px-2 py-1 rounded text-slate-300 bg-black/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};