import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Send, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Entrance
      gsap.from(".contact-reveal", {
        scrollTrigger: {
            trigger: container.current,
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Decorative Line Animation
      gsap.from(".decor-line", {
          scrollTrigger: {
              trigger: container.current,
              start: "top 60%"
          },
          scaleY: 0,
          transformOrigin: "top",
          duration: 1.5,
          ease: "expo.out"
      });

    }, container);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSent(true);
        setFormState({ name: '', email: '', message: '' });
        
        // Reset success message after 3 seconds
        setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  return (
    <section id="contact" ref={container} className="relative min-h-screen w-full bg-midnight py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left: Info */}
        <div className="flex flex-col justify-center">
            <div className="contact-reveal flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-accent"></span>
                <span className="text-accent font-mono text-sm uppercase tracking-widest">Get In Touch</span>
            </div>
            
            <h2 className="contact-reveal text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-none">
                LET'S BUILD <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">THE FUTURE.</span>
            </h2>

            <p className="contact-reveal text-slate-400 text-lg leading-relaxed mb-12 max-w-md font-body">
                Have a project in mind or want to inquire about our latest gadgets? 
                We are always open to discussing new opportunities and visions.
            </p>

            <div className="contact-reveal flex flex-col gap-8">
                <div className="flex items-start gap-6 group">
                    <div className="p-4 rounded-full border border-white/10 bg-white/5 group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                        <Mail className="text-white" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-1">Email Us</h4>
                        <a href="mailto:hello@clouds.com" className="text-xl text-white font-display hover:text-accent transition-colors">hello@clouds.com</a>
                    </div>
                </div>

                <div className="flex items-start gap-6 group">
                    <div className="p-4 rounded-full border border-white/10 bg-white/5 group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                        <Phone className="text-white" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-1">Call Us</h4>
                        <p className="text-xl text-white font-display">+1 (555) 000-0000</p>
                    </div>
                </div>

                <div className="flex items-start gap-6 group">
                    <div className="p-4 rounded-full border border-white/10 bg-white/5 group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                        <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-1">Visit HQ</h4>
                        <p className="text-xl text-white font-display">123 Tech Blvd, Innovation City</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Form */}
        <div className="contact-reveal relative">
            {/* Form Container */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
                    
                    {/* Name Input */}
                    <div className="group relative">
                        <input 
                            type="text" 
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                            className="w-full bg-transparent border-b border-white/20 py-4 text-white text-lg focus:outline-none focus:border-accent transition-colors peer placeholder-transparent"
                            placeholder="Name"
                            id="name"
                        />
                        <label 
                            htmlFor="name"
                            className="absolute left-0 top-4 text-slate-500 transition-all duration-300 pointer-events-none
                                       peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent
                                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg
                                       peer-valid:-top-4 peer-valid:text-xs peer-valid:text-accent"
                        >
                            Your Name
                        </label>
                    </div>

                    {/* Email Input */}
                    <div className="group relative">
                        <input 
                            type="email" 
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                            className="w-full bg-transparent border-b border-white/20 py-4 text-white text-lg focus:outline-none focus:border-accent transition-colors peer placeholder-transparent"
                            placeholder="Email"
                            id="email"
                        />
                        <label 
                            htmlFor="email"
                            className="absolute left-0 top-4 text-slate-500 transition-all duration-300 pointer-events-none
                                       peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent
                                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg
                                       peer-valid:-top-4 peer-valid:text-xs peer-valid:text-accent"
                        >
                            Email Address
                        </label>
                    </div>

                    {/* Message Input */}
                    <div className="group relative">
                        <textarea 
                            required
                            rows={4}
                            value={formState.message}
                            onChange={(e) => setFormState({...formState, message: e.target.value})}
                            className="w-full bg-transparent border-b border-white/20 py-4 text-white text-lg focus:outline-none focus:border-accent transition-colors peer placeholder-transparent resize-none"
                            placeholder="Message"
                            id="message"
                        />
                        <label 
                            htmlFor="message"
                            className="absolute left-0 top-4 text-slate-500 transition-all duration-300 pointer-events-none
                                       peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent
                                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg
                                       peer-valid:-top-4 peer-valid:text-xs peer-valid:text-accent"
                        >
                            Tell us about your idea
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting || isSent}
                        className="interactive relative mt-4 overflow-hidden group bg-white text-midnight font-bold font-display py-4 px-8 rounded-sm hover:bg-accent hover:text-white transition-colors duration-500 flex items-center justify-between"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isSubmitting ? 'SENDING...' : isSent ? 'MESSAGE SENT' : 'SEND MESSAGE'} 
                        </span>
                        <div className="relative z-10">
                            {isSent ? <Send size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </div>
                        
                        {/* Loading Bar */}
                        {isSubmitting && (
                            <div className="absolute bottom-0 left-0 h-1 bg-accent w-full animate-progress origin-left"></div>
                        )}
                    </button>
                </form>
            </div>
            
            {/* Decor Lines around Form */}
            <div className="decor-line absolute -top-12 -bottom-12 -left-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>
        </div>

      </div>
    </section>
  );
};