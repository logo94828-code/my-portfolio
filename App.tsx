import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Shield, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Minus,
  MessageCircle,
  Globe,
  Activity,
  Cpu,
  Code2,
  Lock,
  Mail,
  X,
  Send,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Quote,
  TrendingUp,
  BarChart3,
  MousePointer2,
  Calendar,
  Check,
  Clock,
  Loader2,
  Moon,
  Sun,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
  ShieldCheck,
  Target,
  Rocket,
  UserCircle2,
  Database,
  CreditCard,
  ShoppingBag
} from 'lucide-react';

// --- Brand Icons ---
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// --- Custom Hook for Scroll Reveal ---

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

const useIntersectionObserver = (options: UseIntersectionObserverOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce) observer.unobserve(entry.target);
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isIntersecting] as const;
};

// --- Snowfall Component ---

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<{ 
    id: number; 
    left: string; 
    size: string; 
    duration: string; 
    delay: string; 
    opacity: number; 
    swayDuration: string; 
    swayDelay: string;
    swayDistance: string;
    blur: string;
  }[]>([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 120 }).map((_, i) => {
      const sizeBase = Math.random() * 5 + 2;
      return {
        id: i,
        left: `${Math.random() * 100}vw`,
        size: `${sizeBase}px`,
        duration: `${Math.random() * 12 + 10}s`,
        delay: `${Math.random() * -20}s`, 
        opacity: Math.random() * 0.5 + 0.2,
        swayDuration: `${Math.random() * 5 + 4}s`,
        swayDelay: `${Math.random() * -10}s`,
        swayDistance: `${Math.random() * 30 + 10}px`,
        blur: sizeBase < 3.5 ? '1px' : '0px'
      };
    });
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake-container"
          style={{
            left: flake.left,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
          }}
        >
          <div 
            className="snowflake-inner"
            style={{
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              filter: `blur(${flake.blur})`,
              animationDuration: flake.swayDuration,
              animationDelay: flake.swayDelay,
              // @ts-ignore
              '--sway-distance': flake.swayDistance
            } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  );
};

// --- CountUp Component ---

const CountUp: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  prefix = "", 
  suffix = "" 
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}{count}{suffix}
    </span>
  );
};

// --- Strategy Modal Component ---

const StrategyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/mdaolnll', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStep('success');
      } else {
        alert("Oops! There was a problem submitting your request. Please try again.");
      }
    } catch (error) {
      alert("Oops! There was a connection error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl bg-white dark:bg-[#0a1128] rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border dark:border-blue-900/30"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        {step === 'form' ? (
          <div className="p-10 md:p-14">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                  <Clock className="w-3 h-3" />
                  15 Minute Strategy
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-[900] tracking-tight text-zinc-950 dark:text-white mb-3 text-balance">Scale Your Digital Presence</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Claim your 15-minute high-velocity session. Let's build your roadmap.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                  <input 
                    required 
                    name="name"
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-blue-900/10 border border-zinc-100 dark:border-blue-900/20 rounded-2xl outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-blue-900/30 transition-all font-medium text-sm text-zinc-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Work Email</label>
                  <input 
                    required 
                    name="email"
                    type="email" 
                    placeholder="john@company.com" 
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-blue-900/10 border border-zinc-100 dark:border-blue-900/20 rounded-2xl outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-blue-900/30 transition-all font-medium text-sm text-zinc-900 dark:text-white" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Website URL (Optional)</label>
                <input 
                  name="website"
                  type="url" 
                  placeholder="https://yourcompany.com" 
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-blue-900/10 border border-zinc-100 dark:border-blue-900/20 rounded-2xl outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-blue-900/30 transition-all font-medium text-sm text-zinc-900 dark:text-white" 
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">What are we building?</label>
                <select 
                  required 
                  name="projectType"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-blue-900/10 border border-zinc-100 dark:border-blue-900/20 rounded-2xl outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-blue-900/30 transition-all font-medium text-sm appearance-none text-zinc-900 dark:text-white"
                >
                  <option value="" disabled selected>Select Project Type</option>
                  <option value="landing-page">Landing Page</option>
                  <option value="multiple-page">Multiple Page Website</option>
                  <option value="custom">Custom Web Application</option>
                </select>
                <div className="absolute right-6 bottom-4 pointer-events-none text-zinc-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/10 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Claim Strategy Session
                      <ArrowUpRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-6">
                No commitment required • Global reach • Limited availability
              </p>
            </form>
          </div>
        ) : (
          <div className="p-14 text-center">
             <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto mb-10 animate-bounce">
                <Check className="w-12 h-12 stroke-[3]" />
             </div>
             <h3 className="text-4xl font-[900] tracking-tight text-zinc-950 dark:text-white mb-4">You're on the list!</h3>
             <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed max-w-sm mx-auto mb-12">
               Our team is reviewing your project requirements and will reach out within 2 hours to confirm your 15-minute session.
             </p>
             <button onClick={onClose} className="bg-blue-600 dark:bg-white dark:text-blue-950 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 dark:hover:bg-zinc-200 transition-all">
                Return Home
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Shared Components ---

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xs'; variant?: 'dark' | 'blue' }> = ({ size = 'md', variant = 'dark' }) => {
  const [isPopping, setIsPopping] = useState(false);
  const containerSize = 
    size === 'xs' ? 'w-11 h-11' : 
    size === 'sm' ? 'w-10 h-10' : 
    size === 'lg' ? 'w-16 h-16' : 
    'w-13 h-13'; // md

  const dotSize = 
    size === 'xs' ? 'w-3 h-3' : 
    size === 'sm' ? 'w-2.5 h-2.5' : 
    size === 'lg' ? 'w-4.5 h-4.5' : 
    'w-3.5 h-3.5';

  const gapSize = 
    size === 'xs' ? 'gap-0.5' : 
    size === 'sm' ? 'gap-0.5' : 
    'gap-1';

  const textSize = 
    size === 'sm' ? 'text-xl' : 
    size === 'lg' ? 'text-4xl' : 
    'text-3xl';

  const containerBg = variant === 'blue' ? 'bg-blue-600 shadow-lg shadow-blue-900/40' : 'bg-blue-950 dark:bg-blue-900/40';

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    // Navigate to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger visual feedback state
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 400);

    // Particle effect logic
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 1. Create a "Shockwave" ring
    const shockwave = document.createElement('div');
    shockwave.style.position = 'fixed';
    shockwave.style.left = `${centerX}px`;
    shockwave.style.top = `${centerY}px`;
    shockwave.style.width = '10px';
    shockwave.style.height = '10px';
    shockwave.style.border = '2px solid rgba(255, 255, 255, 0.8)';
    shockwave.style.borderRadius = '50%';
    shockwave.style.pointerEvents = 'none';
    shockwave.style.zIndex = '9998';
    shockwave.style.transform = 'translate(-50%, -50%) scale(1)';
    shockwave.style.transition = 'all 0.6s cubic-bezier(0.1, 0.8, 0.3, 1)';
    document.body.appendChild(shockwave);
    
    // Trigger shockwave expansion
    requestAnimationFrame(() => {
      shockwave.style.transform = 'translate(-50%, -50%) scale(15)';
      shockwave.style.opacity = '0';
    });
    setTimeout(() => shockwave.remove(), 700);

    // 2. Create the particle explosion
    const colors = ['#6366f1', '#2563eb', '#60a5fa', '#818cf8', '#ffffff'];
    const particleCount = 45;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;
      particle.style.color = color;
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      
      const pSize = Math.random() * 6 + 2;
      particle.style.width = `${pSize}px`;
      particle.style.height = `${pSize}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 200;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--tw-translate-x', `${tx}px`);
      particle.style.setProperty('--tw-translate-y', `${ty}px`);
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }, []);

  return (
    <div 
      className={`flex items-center gap-4 cursor-pointer group select-none transition-all duration-700 [perspective:1000px] ${isPopping ? 'scale-90 opacity-70' : 'hover:scale-110 active:scale-95'}`} 
      onClick={handleLogoClick}
    >
      <div className={`${containerSize} ${containerBg} rounded-[10px] flex items-center justify-center shrink-0 overflow-hidden shadow-lg border dark:border-blue-800/50 relative transition-all duration-500 [transform-style:preserve-3d] group-hover:bg-blue-900 dark:group-hover:bg-blue-800 group-hover:shadow-blue-500/40 group-hover:border-blue-500/50 group-hover:[transform:rotateY(25deg)_rotateX(15deg)]`}>
        <div className={`grid grid-cols-2 ${gapSize} ${isPopping ? 'animate-pulse' : ''} [transform-style:preserve-3d]`}>
          <div className={`${dotSize} bg-[#6366f1] rounded-[6px] transition-all duration-300 group-hover:bg-[#818cf8] group-hover:scale-110 group-hover:[transform:translateZ(20px)]`}></div>
          <div className={`${dotSize} bg-[#2563eb] rounded-[6px] transition-all duration-300 group-hover:bg-[#60a5fa] group-hover:scale-110 group-hover:[transform:translateZ(30px)]`}></div>
          <div className={`${dotSize} bg-[#60a5fa] rounded-[6px] transition-all duration-300 group-hover:bg-[#2563eb] group-hover:scale-110 group-hover:[transform:translateZ(25px)]`}></div>
          <div className={`${dotSize} bg-[#818cf8] rounded-[6px] transition-all duration-300 group-hover:bg-[#6366f1] group-hover:scale-110 group-hover:[transform:translateZ(15px)]`}></div>
        </div>
      </div>
      {size !== 'xs' && (
        <span className={`${textSize} font-[900] tracking-[-0.06em] uppercase text-blue-600 dark:text-blue-500 transition-all duration-500 group-hover:tracking-normal group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:scale-105 origin-left [transform-style:preserve-3d] group-hover:[transform:translateZ(10px)]`}>
          Flux
        </span>
      )}
    </div>
  );
};

const ThemeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({ isDark, onToggle }) => (
  <button 
    onClick={onToggle}
    className="p-3 rounded-full bg-zinc-100 dark:bg-blue-900/40 text-zinc-600 dark:text-blue-300 hover:bg-zinc-200 dark:hover:bg-blue-800 transition-all active:scale-90 border dark:border-blue-800/50"
    aria-label="Toggle Theme"
  >
    {isDark ? <Sun className="w-5 h-5 fill-current" /> : <Moon className="w-5 h-5 fill-current" />}
  </button>
);

// --- Hero Components ---

const Sparkline = () => (
  <svg className="w-full h-12 stroke-emerald-500 fill-none" viewBox="0 0 100 20" preserveAspectRatio="none">
    <path d="M0 18 Q 10 15, 20 18 T 40 10 T 60 14 T 80 5 T 100 2" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Hero: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => (
  <section className="pt-40 pb-32 overflow-hidden relative min-h-[90vh] flex items-center">
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="w-full h-full object-cover opacity-60 dark:opacity-20 transition-opacity duration-1000 grayscale hover:grayscale-0"
      >
        <source src="https://player.vimeo.com/external/494163966.sd.mp4?s=631481845187e1f409f6e1654460f95e5d36e23b&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white dark:from-[#0a1128] dark:via-[#0a1128]/40 dark:to-[#0a1128] pointer-events-none" />
      <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
    </div>

    <div className="gradient-blur absolute inset-0 -z-10" />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-md border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Built for growth
          </div>
          <h1 className="text-6xl md:text-[100px] font-[900] tracking-[-0.05em] font-black leading-[0.85] mb-8 text-zinc-950 dark:text-white drop-shadow-sm">
            We build <br />
            websites <br />
            <span className="text-blue-700 dark:text-blue-500">that dominate.</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xl md:text-2xl font-medium max-w-xl mb-12 leading-[1.4] drop-shadow-sm">
            Stop losing leads to outdated tech. We build high-performance websites that <span className="text-blue-600 dark:text-blue-500">turn clicks into customers.</span>
          </p>
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            <button 
              onClick={onOpenModal}
              className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-10 py-5 rounded-full text-sm md:text-base font-black flex items-center justify-center gap-6 hover:brightness-110 transition-all duration-300 shadow-[0_20px_50px_rgba(37,99,235,0.25)] dark:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.98] group uppercase tracking-widest relative overflow-hidden text-center leading-tight"
            >
              <span className="relative z-10 block">
                CLAIM STRATEGY<br />SESSION
              </span>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
            </button>
            <div className="flex flex-col gap-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-[4px] border-white dark:border-[#0a1128] shadow-lg overflow-hidden relative z-[5] bg-zinc-100 dark:bg-blue-950 ring-1 ring-zinc-100 dark:ring-blue-900/40">
                    <img src={`https://picsum.photos/seed/${i + 52}/96/96`} className="w-full h-full object-cover" alt="User" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-zinc-400 dark:text-blue-400/60 uppercase tracking-[0.4em] leading-tight">Join 50+</p>
                <p className="text-[10px] font-black text-zinc-400 dark:text-blue-400/60 uppercase tracking-[0.4em] leading-tight">Leaders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[650px] hidden lg:block select-none">
          <div className="absolute top-10 left-0 bg-blue-950/90 dark:bg-[#0c1532]/95 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] w-[320px] z-30 animate-float-1 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-50 animate-pulse"></div>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Optimizing...</span>
              </div>
            </div>
            <code className="text-white text-[11px] font-mono leading-relaxed block overflow-hidden">
              <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">optimize</span> = (sys) ={">"} {'{'}<br />
              &nbsp;&nbsp;<span className="text-[#79c0ff]">return</span> sys.<span className="text-[#d2a8ff]">boost</span>({'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;ux: <span className="text-[#a5d6ff]">"elite"</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;roi: <span className="text-[#a5d6ff]">"max"</span><br />
              &nbsp;&nbsp;{'}'});<br />
              {'}'}
            </code>
          </div>

          <div className="absolute top-[-20px] right-20 bg-white/90 dark:bg-[#0c1532]/90 backdrop-blur-xl p-6 rounded-[2.5rem] card-shadow border border-zinc-50 dark:border-blue-900/30 flex items-center gap-5 z-40 animate-float-2 group hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-800 relative z-10">
                <span className="text-2xl font-black text-emerald-500">100</span>
              </div>
              <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-blue-400/40 uppercase tracking-widest mb-1">Standard</p>
              <p className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors">Perfect Vitals</p>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-emerald-400" />)}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 bg-white dark:bg-[#0c1532] p-12 rounded-[4rem] card-shadow border border-zinc-100 dark:border-blue-900/30 w-[460px] z-20 animate-float-3 group">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-[0_15px_40px_-10px_rgba(37,99,235,0.6)] group-hover:rotate-12 transition-transform duration-500">
                     <Activity className="w-7 h-7" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-blue-400/40 uppercase tracking-widest mb-1">Status Report</p>
                      <p className="text-xl font-black text-zinc-900 dark:text-white">High Velocity</p>
                   </div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Verified
                </div>
             </div>
             <div className="mb-12">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-blue-400/40 uppercase tracking-widest mb-4">Conversion Lift</p>
                <div className="flex items-end gap-3 mb-6">
                   <p className="text-8xl font-[900] tracking-tighter text-zinc-950 dark:text-white leading-none">+140%</p>
                   <TrendingUp className="w-10 h-10 text-emerald-500 mb-2 animate-bounce" />
                </div>
                <Sparkline />
             </div>
             <div className="h-px bg-zinc-100 dark:bg-blue-900/30 mb-10"></div>
             <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-4 border-white dark:border-blue-950 bg-zinc-100 dark:bg-blue-900 overflow-hidden">
                       <img src={`https://picsum.photos/seed/client${i}/64/64`} alt="Client" />
                     </div>
                   ))}
                </div>
                <button className="text-[11px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest flex items-center gap-2 group/btn hover:text-blue-700 dark:hover:text-blue-400">
                  Case Study <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

          <div className="absolute top-[45%] left-[-40px] bg-white dark:bg-[#0c1532] p-4 rounded-2xl border border-zinc-100 dark:border-blue-900/30 shadow-xl z-50 rotate-12 animate-float-2">
             <MousePointer2 className="w-6 h-6 text-zinc-950 dark:text-white fill-current" />
             <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-lg">1</div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] dark:opacity-[0.08] rotate-12">
             <Globe className="w-[700px] h-[700px] text-blue-950 dark:text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const LogoCloud: React.FC = () => (
  <div className="py-20 border-y border-zinc-100 dark:border-blue-900/30 overflow-hidden bg-white dark:bg-[#0a1128] transition-colors duration-500">
    <div className="animate-marquee flex whitespace-nowrap items-center">
      {[...Array(4)].map((_, groupIdx) => (
        <div key={groupIdx} className="flex items-center gap-24 px-12">
          {['LUMEN', 'TECHFLOW', 'VERTEX', 'MODERNA', 'QUICKLY'].map((brand, i) => (
            <span key={i} className="text-4xl font-[900] tracking-tighter text-zinc-200/60 dark:text-blue-800/40 uppercase">{brand}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const TechPill: React.FC = () => {
  const logos = ['Vercel', 'Next.js', 'Stripe', 'Supabase', 'Sanity', 'Shopify'];
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-blue-400/20 to-indigo-600/30 rounded-[5rem] blur-2xl opacity-40 group-hover:opacity-80 transition-opacity"></div>
        <div className="relative bg-[#0d1636] dark:bg-[#060c24] border border-blue-900/20 dark:border-blue-400/10 rounded-[5rem] py-8 px-6 md:px-16 flex flex-wrap items-center justify-center gap-x-12 md:gap-x-20 gap-y-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          {logos.map((logo) => (
            <span 
              key={logo} 
              className="text-xl md:text-2xl font-[800] text-blue-400/50 dark:text-blue-400/40 tracking-tighter hover:text-white transition-colors cursor-default select-none"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-10 mt-20">
        <div className="flex flex-col items-center text-center group">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Shopify Mastery</h4>
          <p className="text-zinc-500 dark:text-blue-400/60 text-xs font-bold leading-relaxed max-w-[200px] uppercase">Custom store architecture & liquid optimization</p>
        </div>
        <div className="flex flex-col items-center text-center group">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
            <CreditCard className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Payment Rails</h4>
          <p className="text-zinc-500 dark:text-blue-400/60 text-xs font-bold leading-relaxed max-w-[200px] uppercase">Secure Stripe Connect & global checkout integration</p>
        </div>
        <div className="flex flex-col items-center text-center group">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
            <Database className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Cloud Infrastructure</h4>
          <p className="text-zinc-500 dark:text-blue-400/60 text-xs font-bold leading-relaxed max-w-[200px] uppercase">Supabase database design & real-time scaling</p>
        </div>
      </div>
    </div>
  );
};

const WhyFlux: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-32 md:py-48 bg-white relative overflow-hidden border-y border-zinc-100">
      <div className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      ></div>
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-start transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex-1 flex flex-col items-start">
            <h2 className="text-8xl md:text-[140px] font-[900] tracking-[-0.08em] text-zinc-950 leading-[0.85] mb-0 flex flex-col items-start select-none">
              <span>Why</span>
              <span>FLUX</span>
              <span>wins</span>
            </h2>
            <div className="relative group mt-2 md:mt-4">
               <span className="text-8xl md:text-[140px] font-[900] italic tracking-[-0.05em] text-zinc-200/80 leading-[0.85] block select-none group-hover:text-zinc-300 transition-colors duration-500 flex flex-col items-start">
                  <span>every</span>
                  <span>time.</span>
               </span>
              <div className="absolute top-[35%] left-0 w-full h-[3px] bg-zinc-100 pointer-events-none group-hover:scale-x-110 transition-transform origin-left duration-700"></div>
            </div>
          </div>
          <div className={`lg:w-[45%] pt-16 lg:pt-24 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="flex flex-col h-full">
              <p className="text-3xl md:text-[48px] font-bold tracking-tight text-zinc-900 leading-[1.05] mb-20">
                We don’t just design. We build <span className="text-blue-600">websites that earn trust,</span> explain your value, and drive action.
              </p>
              <div className="h-px bg-zinc-100 w-full mb-16"></div>
              <div className="grid grid-cols-2 gap-12 md:gap-20">
                <div>
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-5">Status</p>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                    <span className="text-[11px] font-black text-zinc-950 uppercase tracking-widest">High Velocity</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-5">Architecture</p>
                  <span className="text-[11px] font-black text-zinc-950 uppercase tracking-widest">V2.4 / Enterprise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Ethos: React.FC = () => {
  return (
    <section className="py-48 bg-[#0a1128] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(60)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-blue-200 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2.5 + 0.5}px`,
              height: `${Math.random() * 2.5 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.4 + 0.1,
              filter: Math.random() > 0.5 ? 'blur(1px)' : 'none'
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-[80px] font-[900] tracking-[-0.05em] leading-[0.95] text-white">
            We’re a small, focused <br /> studio that builds <br /> websites <span className="text-blue-500">designed to <br /> convert.</span>
          </h2>
          <div className="w-full max-w-lg h-[2px] bg-blue-500/20 mx-auto my-16 rounded-full overflow-hidden">
             <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
          </div>
          <p className="text-3xl md:text-[52px] font-[900] tracking-[-0.05em] leading-[1.1] text-blue-400/40">
            No bloated teams. No retainers. Just <span className="text-white">clean execution</span> <br className="hidden md:block" /> and clear outcomes.
          </p>
        </div>
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  const data = [
    { role: "SaaS Founder", location: "London, UK", quote: "Flux transformed our fragmented web ecosystem into a unified high-performance asset. Internal benchmarks show a 2x increase in stability and conversion speed.", metric: "UX Architecture" },
    { role: "Product Lead", location: "Berlin, DE", quote: "The high-performance framework delivered sub-1s load times, setting a new internal standard for our digital presence. Elite execution on complex requirements.", metric: "System Speed" },
    { role: "Growth Director", location: "Singapore", quote: "By focusing on conversion-centric engineering, Flux moved our project metrics further than any cosmetic redesign. Pure technical excellence.", metric: "ROI Benchmarks" },
    { role: "Strategy Architect", location: "New York, US", quote: "Flux architects conversion engines, not just sites. Their performance-first methodology eliminated the friction in our digital acquisition funnel.", metric: "Conversion Logic" }
  ];

  return (
    <section className="py-32 bg-zinc-50/50 dark:bg-blue-950/20 relative transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Core Engineering Values</div>
            <h2 className="text-5xl md:text-7xl font-[900] tracking-tighter leading-none mb-4 text-zinc-950 dark:text-white">Conceptual Case Studies.</h2>
            <p className="text-zinc-500 dark:text-blue-400/60 text-lg max-w-2xl mx-auto font-medium">Strategic internal feedback from ecosystems engineered for elite performance.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {data.map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#0c1532]/60 p-10 rounded-[3rem] border border-zinc-100 dark:border-blue-900/30 flex flex-col hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500"><Zap className="w-5 h-5 fill-current" /></div>
                  <span className="text-[10px] font-black text-zinc-400 dark:text-blue-400/40 uppercase tracking-widest">{item.metric}</span>
                </div>
                <div className="px-3 py-1 bg-zinc-50 dark:bg-blue-950/50 border border-zinc-100 dark:border-blue-900/20 rounded-lg">
                   <span className="text-[9px] font-black text-zinc-400 dark:text-blue-400/60 uppercase tracking-widest">Internal Result</span>
                </div>
              </div>
              <blockquote className="text-zinc-900 dark:text-zinc-100 text-lg md:text-xl font-bold leading-relaxed mb-10 tracking-tight italic border-l-2 border-blue-500 pl-6">"{item.quote}"</blockquote>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-blue-950 flex items-center justify-center text-zinc-400 dark:text-blue-400/40 border dark:border-blue-800"><UserCircle2 className="w-7 h-7 stroke-[1.5]" /></div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{item.role}</h4>
                  <p className="text-[9px] font-bold text-zinc-400 dark:text-blue-400/40 uppercase tracking-widest mt-0.5">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TechPill />
      </div>
    </section>
  );
};

const MetricsSection: React.FC = () => {
  const metrics = [
    { label: "Rapid Turnaround", value: 7, prefix: "5-", sub: "Days", desc: "Concept to Launch" },
    { label: "Communication", value: 1, suffix: ":1", sub: "Sync", desc: "Direct Access" },
    { label: "Performance", value: 100, suffix: "%", sub: "%", desc: "Lighthouse v10" },
    { label: "Honest Pricing", value: 0, sub: "Hidden", desc: "No Retainer Bloat" }
  ];
  return (
    <section className="bg-[#0a1128] py-48 md:py-64 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute h-1 w-1 bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute h-0.5 w-0.5 bg-white rounded-full top-3/4 left-1/3 animate-pulse-slow"></div>
        <div className="absolute h-1 w-1 bg-white rounded-full top-1/2 left-2/3 animate-pulse"></div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-12 items-start">
          {metrics.map((metric, i) => (
            <div key={i} className="flex flex-col space-y-6 group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" style={{ animationDelay: `${i * 100}ms` }}>
              <h3 className="text-xs md:text-sm font-black tracking-[0.4em] uppercase text-zinc-100 drop-shadow-md">{metric.label}</h3>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-[7rem] font-black tracking-[-0.05em] text-white leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                  <CountUp end={metric.value} prefix={metric.prefix} suffix={metric.suffix === '%' ? '' : metric.suffix} />
                </span>
                <span className="text-2xl md:text-4xl font-black text-blue-500 ml-4">{metric.sub}</span>
              </div>
              <p className="text-[10px] md:text-[11px] font-black text-blue-200/60 tracking-[0.3em] uppercase pt-4">{metric.desc}</p>
              <div className="w-24 h-1 bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const items = [
    { title: 'Fast Website = More Trust', desc: 'Speed isn’t just a stat; it’s a first impression. We build sites that load instantly so your customers feel safe and valued from the first click.', icon: <Zap className="w-7 h-7 text-blue-600 dark:text-blue-500" />, color: 'blue' },
    { title: 'Visitors Stay Instead of Leaving', desc: 'We remove the friction that makes customers hit the back button. Your site will feel so natural and effortless that visitors won’t want to go anywhere else.', icon: <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-500" />, color: 'indigo' },
    { title: 'People Understand What You Do Instantly', desc: 'We cut through the noise with high-impact design and clear messaging. No one will ever have to guess what you do or how you can help them win.', icon: <Globe className="w-7 h-7 text-cyan-600 dark:text-cyan-500" />, color: 'cyan' },
    { title: 'Your Website Grows With You', desc: 'It handles ten visitors or ten thousand without breaking. This is the last website you’ll ever need to build.', icon: <Layers className="w-7 h-7 text-violet-600 dark:text-violet-500" />, color: 'violet' },
  ];

  return (
    <section id="features-section" className="py-40 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-[#0a1128] transition-colors duration-500"></div>
        <div className="absolute top-[-10%] right-[0%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,rgba(10,17,40,0)_70%)] animate-float-1"></div>
        <div className="absolute inset-0 opacity-[0.6] dark:opacity-[0.2]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1.5px, transparent 0), linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)`, backgroundSize: '48px 48px, 48px 48px, 48px 48px' }}></div>
      </div>
      <div ref={sectionRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white dark:bg-blue-950 border border-zinc-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[12px] font-[900] uppercase tracking-[0.5em] mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-float"><Zap className="w-4 h-4 fill-current" />The Competitive Edge</div>
        <h2 className="text-6xl md:text-[96px] font-[900] tracking-[-0.06em] mb-14 leading-[0.85]"><span className="text-zinc-950 dark:text-white">Designed to Win</span> <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 italic dark:from-blue-400 dark:via-blue-500 dark:to-blue-700">Attention and Trust.</span></h2>
        <p className="text-zinc-500 dark:text-blue-400/60 text-xl md:text-2xl max-w-4xl mx-auto font-medium leading-relaxed">We don't just build sites; we create high-conversion assets <br className="hidden md:block" />engineered to outperform the market and capture every lead.</p>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {items.map((item, idx) => (
          <div key={idx} className={`group relative p-14 rounded-[4rem] border backdrop-blur-3xl transition-all duration-1000 ease-out flex flex-col hover:-translate-y-8 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] bg-white/90 dark:bg-blue-950/90 border-zinc-100 dark:border-blue-900/30 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${200 + idx * 100}ms` }}>
            <div className={`w-28 h-28 rounded-[2.8rem] bg-zinc-50 dark:bg-blue-900/40 shadow-inner flex items-center justify-center mb-14 relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 border border-zinc-100 dark:border-blue-800`}>
              <div className="relative z-10 scale-[1.4]">{item.icon}</div>
            </div>
            <h3 className="text-2xl font-[900] mb-6 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-600 transition-colors duration-500">{item.title}</h3>
            <p className="text-zinc-600 dark:text-blue-300/80 leading-relaxed font-medium flex-1 text-[17px] group-hover:text-zinc-800 dark:group-hover:text-white transition-colors duration-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Process: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  const steps = [
    { num: '01', title: 'Revenue Audit', desc: 'We identify exactly where your current site is losing money.' },
    { num: '02', title: 'Creative Sprints', desc: 'Fast-paced design and dev with a focus on high-impact features.' },
    { num: '03', title: 'Growth Deployment', desc: 'We launch, monitor, and optimize for maximum ROI.' },
  ];
  return (
    <section id="process-section" className="py-48 md:py-64 bg-[#0a1128] text-white relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <h2 className="text-6xl md:text-[100px] font-[900] tracking-tighter leading-[0.85] mb-20">Transparent,<br /><span className="text-blue-900/60 italic">results-driven.</span></h2>
            <div className="space-y-24">
              {steps.map((step, idx) => (
                <div key={idx} className={`flex gap-12 group transition-all duration-1000 delay-${idx * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <span className="text-8xl font-[900] text-blue-900/30 group-hover:text-blue-600/50 transition-colors leading-none">{step.num}</span>
                  <div>
                    <h3 className="text-4xl font-black mb-4 tracking-tight">{step.title}</h3>
                    <p className="text-blue-300/60 text-xl max-w-sm font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`relative transition-all duration-1000 delay-500 bg-[#0c1532] border border-blue-900/40 p-12 md:p-16 rounded-[4rem] relative overflow-hidden shadow-[0_80px_140px_-40px_rgba(0,0,0,0.8)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
             <div className="flex justify-between items-start mb-20 relative">
                <div><h4 className="text-4xl font-black mb-3 tracking-tight">System Pulse</h4><p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.4em]">Global Node Deployment</p></div>
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(37,99,235,0.4)]"><Cpu className="w-8 h-8 text-white stroke-[2.5]" /></div>
             </div>
             <div className="space-y-14 mb-20">
                {['CONVERSION ARCHITECTURE', 'UI RESPONSE SPEED', 'MARKET RESONANCE'].map((label, i) => (
                  <div key={i} className="relative group/bar">
                    <div className="flex justify-between items-end mb-5"><span className="text-[11px] font-black text-blue-400 tracking-[0.3em]">{label}</span><span className="text-[12px] font-black text-blue-500 tracking-tighter">100%</span></div>
                    <div className="h-[7px] bg-blue-950/80 rounded-full overflow-hidden border border-blue-900/20"><div className="h-full bg-blue-600 w-full relative shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div></div>
                  </div>
                ))}
             </div>
             <button className="w-full bg-white text-blue-950 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-zinc-100 transition-all active:scale-95 group/btn shadow-[0_20px_40px_rgba(255,255,255,0.1)]">SYNC YOUR ROADMAP<ArrowUpRight className="w-6 h-6 group-hover/btn:translate-x-1.5 transition-transform stroke-[3]" /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const tiers = [
    { category: 'SPEED DELIVERY', name: 'Landing Page', price: '$299', suffix: '/ FLAT', desc: 'High-conversion single page build for rapid market entry.', features: ['Elite UX Architecture', 'Mobile First Precision', 'Lighthouse 100 Speed', 'Essential SEO Suite', '48h Deployment'] },
    { category: 'ENTERPRISE CHOICE', name: 'Multi-Page', price: '$899', suffix: '/ FLAT', desc: 'Full-scale digital ecosystem engineered for growth.', features: ['Unlimited Page Logic', 'Dynamic CMS Engine', 'Advanced Conversion SEO', '3rd Party API Integration', 'V2 Launch Roadmap'], isFeatured: true, badge: 'MOST POPULAR' },
    { category: 'BESPOKE LOGIC', name: 'Custom Build', price: 'Bespoke', suffix: '/ PRICING', desc: 'Bespoke software solutions for complex business needs.', features: ['Proprietary SaaS Logic', 'Cloud Infrastructure', 'Full Stack AI Features', 'Enterprise Reliability', 'Dedicated Scaling Team'] }
  ];
  return (
    <section id="pricing-section" ref={sectionRef} className="py-48 bg-[#0a1128] relative overflow-hidden">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-6xl md:text-[100px] font-[900] tracking-[-0.05em] leading-[0.85] mb-10 text-white">Pricing for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400">Impact.</span></h2>
        <p className="text-blue-300/60 text-lg md:text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">No retainers. No overhead. Just elite engineering to help you dominate your market.</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 relative z-10">
        {tiers.map((tier, i) => (
          <div key={i} className={`relative flex flex-col p-12 rounded-[3.5rem] border transition-all duration-700 group hover:-translate-y-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${tier.isFeatured ? 'bg-white border-white scale-105 z-10 shadow-[0_40px_100px_-20px_rgba(255,255,255,0.15)] text-[#0a1128]' : 'bg-[#0d1636]/60 border-blue-900/40 text-white'}`}>
            {tier.badge && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white shadow-xl z-20">{tier.badge}</div>}
            <div className="mb-12 relative z-10">
              <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${tier.isFeatured ? 'text-blue-600' : 'text-blue-500'}`}>{tier.category}</p>
              <h3 className="text-4xl font-[900] tracking-tight mb-4">{tier.name}</h3>
              <p className={`text-sm font-medium leading-relaxed mb-10 ${tier.isFeatured ? 'text-zinc-600' : 'text-blue-300/60'}`}>{tier.desc}</p>
              <div className="flex items-baseline gap-2"><span className="text-6xl font-[900] tracking-tighter">{tier.price}</span><span className={`text-xs font-black uppercase tracking-widest ${tier.isFeatured ? 'text-zinc-500' : 'text-blue-900'}`}>{tier.suffix}</span></div>
            </div>
            <div className="space-y-6 mb-16 flex-1 relative z-10">
              {tier.features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-4 group/feature">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tier.isFeatured ? 'bg-blue-600' : 'bg-blue-900/20'}`}><Check className={`w-3 h-3 ${tier.isFeatured ? 'text-white' : 'text-blue-500'}`} strokeWidth={4} /></div>
                  <span className={`text-[13px] font-bold tracking-tight ${tier.isFeatured ? 'text-[#0a1128]' : 'text-blue-100'}`}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={onOpenModal} className={`w-full py-6 rounded-[2rem] font-[900] text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${tier.isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-zinc-950 hover:bg-zinc-100'}`}>CLAIM NOW</button>
          </div>
        ))}
      </div>
    </section>
  );
};

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  const questions = [
    { q: "How fast can we launch?", a: "Most Launch MVP projects go from briefing to live in 14-21 days. Scaling Partner projects typically take 4-6 weeks depending on custom integrations." },
    { q: "How do revisions work?", a: "We value precision. We provide structured revision rounds during the prototyping phase to ensure the final UI/UX aligns perfectly with your brand's growth goals." },
    { q: "What is your typical client ROI?", a: "Our partners see an average conversion lift of 34% within the first 90 days post-launch. Revenue impact varies by sector but remains our core KPI." },
    { q: "Do you offer post-launch support?", a: "Absolutely. All plans include 30 days of hyper-care, with ongoing maintenance and performance optimization available." }
  ];
  return (
    <section className="py-32 bg-white dark:bg-[#0a1128]" id="faq-section">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-5xl font-[900] tracking-tighter text-center mb-20 text-zinc-950 dark:text-white">Everything else.</h2>
        <div className="space-y-6">
          {questions.map((item, i) => (
            <div key={i} className="border-b border-zinc-100 dark:border-blue-900/30 pb-6 transition-all">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center text-left py-8 group transition-all">
                <span className={`text-xl font-black tracking-tight ${open === i ? 'text-zinc-950 dark:text-white' : 'text-zinc-900 dark:text-blue-400/60'}`}>{item.q}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${open === i ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-zinc-50 dark:bg-blue-950 text-zinc-400'}`}>
                  {open === i ? <ChevronUp className="w-6 h-6 stroke-[3]" /> : <ChevronDown className="w-6 h-6 stroke-[3]" />}
                </div>
              </button>
              {open === i && <div className="pb-8 animate-in fade-in slide-in-from-top-4 duration-500 ease-out"><p className="text-zinc-500 dark:text-blue-300/80 text-lg leading-relaxed font-medium">{item.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => (
  <footer className="bg-[#0a1128] pt-48 pb-24 border-t border-blue-900/30 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <div className="grid md:grid-cols-3 gap-12 lg:gap-24 mb-32 items-start">
        <div className="col-span-1">
          <div className="mb-10"><Logo size="sm" /></div>
          <p className="text-blue-300/40 text-[12px] font-[800] leading-[1.6] max-w-[240px] uppercase tracking-[0.05em]">
            Engineering dominance for global digital leaders.
          </p>
        </div>
        
        <div className="flex justify-start md:justify-center">
          <div className="w-full max-w-[320px]">
            <h5 className="text-blue-400/30 text-[14px] font-[800] uppercase tracking-[0.4em] mb-12">Connect</h5>
            <ul className="space-y-10">
              <li>
                <button onClick={onOpenModal} className="flex items-center gap-6 text-white text-[15px] font-[800] uppercase tracking-[0.05em] group transition-all hover:translate-x-1">
                  <Calendar className="w-6 h-6 stroke-[2] text-white group-hover:text-blue-500 group-hover:scale-110 transition-transform" />
                  Strategy Call
                </button>
              </li>
              <li>
                <a href="https://wa.me/919868587951" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-white text-[15px] font-[800] uppercase tracking-[0.05em] group hover:text-emerald-500 transition-all hover:translate-x-1">
                  <MessageCircle className="w-6 h-6 stroke-[2] text-white group-hover:text-emerald-500 group-hover:scale-125 group-hover:rotate-6 transition-all" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:fluxworkspace0@gmail.com" className="flex items-center gap-6 text-white text-[15px] font-[800] uppercase tracking-[0.05em] group hover:text-blue-400 transition-all hover:translate-x-1">
                  <Mail className="w-4 h-4 text-zinc-300 group-hover:text-blue-400 group-hover:scale-125 transition-all" />
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-start md:justify-end">
          <div className="w-full max-w-[320px]">
            <h5 className="text-blue-400/30 text-[14px] font-[800] uppercase tracking-[0.4em] mb-12">Socials</h5>
            <ul className="space-y-10">
              <li>
                <a href="https://www.facebook.com/profile.php?id=61585670425153" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-white text-[15px] font-[800] uppercase tracking-[0.05em] group transition-all hover:translate-x-1">
                  <Facebook className="w-6 h-6 stroke-[2] text-white transition-all group-hover:text-blue-600 group-hover:scale-125 group-hover:-rotate-6" />
                  FACEBOOK
                </a>
              </li>
              <li>
                <a href="https://x.com/fluxxwork" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-white text-[15px] font-[800] uppercase tracking-[0.05em] group transition-all hover:translate-x-1">
                  <XIcon className="w-6 h-6 text-white transition-all group-hover:text-sky-400 group-hover:scale-125 group-hover:rotate-12" />
                  X / TWITTER
                </a>
              </li>
              <li>
                <a href="https://www.instagramcom/flux.studiio/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-white text-[15px] font-[800] uppercase tracking-[0.05em] group transition-all hover:translate-x-1">
                  <Instagram className="w-6 h-6 stroke-[2] text-white transition-all group-hover:text-pink-500 group-hover:scale-125 group-hover:-rotate-12" />
                  INSTAGRAM
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900/30 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-blue-900 text-[9px] font-black uppercase tracking-[0.4em]">© 2024 FLUX CREATIVE STUDIO. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-10">
           <p className="text-blue-900 text-[9px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors cursor-pointer">+91 9868587951</p>
           <p className="text-blue-900 text-[9px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors cursor-pointer">fluxworkspace0@gmail.com</p>
        </div>
      </div>
    </div>
  </footer>
);

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="fixed bottom-10 right-10 z-[100]" ref={menuRef}>
      <div className={`absolute bottom-full right-0 mb-6 w-[340px] bg-white dark:bg-[#0d1636] rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-blue-900/30 overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-blue-950 dark:bg-blue-900/40 p-6 pb-8 relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5 hover:scale-125" /></button>
          <div className="flex items-center gap-4"><Logo size="xs" variant="dark" /><div><h4 className="text-lg font-black text-white leading-tight">Flux Studio</h4><p className="text-[9px] font-bold text-blue-300/40 uppercase tracking-widest mt-0.5">Online • Growth Partner</p></div></div>
        </div>
        <div className="px-5 py-6 space-y-3">
          <a href="https://wa.me/919868587951" className="flex items-center justify-between w-full bg-[#f8fafc] dark:bg-blue-900/10 p-4 rounded-xl border border-zinc-50 dark:border-blue-900/20 hover:border-emerald-200 transition-all group hover:scale-[1.02] active:scale-95">
            <span className="text-xs font-black text-zinc-900 dark:text-blue-100">Get a quote via WhatsApp</span>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </a>
          <a href="mailto:fluxworkspace0@gmail.com" className="flex items-center justify-between w-full bg-white dark:bg-[#0c1532] border border-zinc-100 p-4 rounded-xl hover:bg-blue-50/30 transition-all group hover:scale-[1.02] active:scale-95">
            <span className="text-xs font-black text-zinc-900 dark:text-blue-100">Email our team directly</span>
            <Mail className="w-4 h-4 text-zinc-300 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
          </a>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 dark:border-blue-900/20">
            <a href="https://www.facebook.com/profile.php?id=61585670425153" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-zinc-50 dark:bg-blue-900/10 p-4 rounded-xl hover:text-blue-600 hover:scale-110 hover:-translate-y-1 transition-all group">
              <Facebook className="w-6 h-6 transition-transform group-hover:scale-110" />
            </a>
            <a href="https://x.com/fluxxwork" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-zinc-50 dark:bg-blue-900/10 p-4 rounded-xl hover:text-sky-400 hover:scale-110 hover:-translate-y-1 transition-all group">
              <XIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            </a>
            <a href="https://www.instagram.com/flux.studiio/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-zinc-50 dark:bg-blue-900/10 p-4 rounded-xl hover:text-pink-500 hover:scale-110 hover:-translate-y-1 transition-all group">
              <Instagram className="w-6 h-6 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-4 bg-[#22c55e] text-white pl-5 pr-8 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group">
        <div className="bg-white/20 rounded-full w-9 h-9 flex items-center justify-center group-hover:rotate-12 transition-transform"><MessageCircle className="w-6 h-6 fill-current" /></div>
        <span className="text-xl font-bold tracking-tight">Chat with us</span>
      </button>
    </div>
  );
};

const Navbar: React.FC<{ onOpenModal: () => void; isDark: boolean; toggleTheme: () => void }> = ({ onOpenModal, isDark, toggleTheme }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-blue-950/70 backdrop-blur-2xl border-b border-zinc-100 dark:border-blue-900/40 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-10">
          {['Work', 'Process', 'Pricing', 'FAQ'].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}-section`} className="relative group px-1 py-2 text-[11px] font-black text-zinc-950 dark:text-white uppercase tracking-[0.25em] transition-all">
              <span className="relative z-10">{label}</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <button onClick={onOpenModal} className="bg-blue-950 dark:bg-blue-600 text-white px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg">Claim Strategy <ArrowUpRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </nav>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  return (
    <div className="min-h-screen selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-500">
      <Snowfall />
      <Navbar onOpenModal={() => setIsModalOpen(true)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
      <Hero onOpenModal={() => setIsModalOpen(true)} />
      <LogoCloud />
      <div id="work-section">
        <Ethos />
        <Testimonials />
      </div>
      <WhyFlux />
      <MetricsSection />
      <Features />
      <Process />
      <Pricing onOpenModal={() => setIsModalOpen(true)} />
      <FAQ />
      <Footer onOpenModal={() => setIsModalOpen(true)} />
      <FloatingContact />
      <StrategyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
