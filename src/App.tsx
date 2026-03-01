import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Facebook, Linkedin, ArrowRight, Phone, Mail, MapPin, ChevronDown, Shield, Eye, TrendingUp, Award, Star } from 'lucide-react';

/* ─── Scroll-reveal hook ──────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Animated stat counter ──────────────────────────────────────────────── */
function AnimatedStat({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const startTime = performance.now();
        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ─── Reveal wrapper component ─────────────────────────────────────────────── */
function Reveal({ children, className = '', direction = 'up', delay = 0 }: {
  children: React.ReactNode; className?: string; direction?: 'up' | 'left' | 'right'; delay?: number;
}) {
  const ref = useReveal();
  const dirClass = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal';
  const delayClass = delay ? `delay-${delay}` : '';
  return (
    <div ref={ref} className={`${dirClass} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Main App ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-brand-cream)', color: 'var(--color-brand-dark)' }}>

      {/* ── Floating Navbar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 navbar-glass" role="banner">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c0392b]" aria-label="VCo Royal LePage Home">
            <div className="font-serif text-4xl font-bold tracking-tighter leading-none" style={{ color: 'var(--color-brand-dark)' }}>V</div>
            <div className="w-px h-10 bg-gray-300" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--color-brand-red)' }}>Royal LePage</span>
              <span className="text-[9px] tracking-widest uppercase text-gray-400">Real Estate Services Ltd., Brokerage</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {['Buy', 'Sell', 'Complimentary Valuation'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#c0392b] cursor-pointer focus-visible:outline-none focus-visible:text-[#c0392b]"
                style={{ color: 'var(--color-brand-dark)' }}
              >
                {item}
              </a>
            ))}
            <a
              href="tel:416-473-5303"
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.10em] uppercase transition-colors duration-200"
              style={{ color: 'var(--color-brand-red)' }}
              aria-label="Call us at 416-473-5303"
            >
              <Phone size={14} aria-hidden="true" />
              416-473-5303
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className={`block h-px bg-gray-900 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block h-px bg-gray-900 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-gray-900 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm px-6 py-6 flex flex-col gap-5" role="navigation" aria-label="Mobile navigation">
            {['Buy', 'Sell', 'Complimentary Valuation'].map((item) => (
              <a key={item} href="#" className="text-sm font-semibold tracking-wider uppercase hover:text-[#c0392b] transition-colors cursor-pointer">{item}</a>
            ))}
            <a href="tel:416-473-5303" className="text-sm font-semibold tracking-wider uppercase text-[#c0392b] cursor-pointer">Call: 416-473-5303</a>
          </div>
        )}
      </header>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <main>
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">

            {/* Left: Image collage */}
            <Reveal direction="left" className="lg:col-span-5">
              <div className="space-y-4">
                {/* Main book cover */}
                <div className="img-overlay-card relative aspect-[3/4] w-full shadow-2xl cursor-pointer" aria-hidden="true">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Luxury Toronto home interior – light-filled living room"
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass overlay label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                    <div className="border border-white/25 p-6 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.22)' }}>
                      <p className="section-eyebrow text-white/60 mb-3 text-center ornament">Buyer Guide 2026</p>
                      <h2 className="font-serif text-2xl md:text-3xl text-center leading-tight mb-1">Toronto Real Estate</h2>
                      <h3 className="font-serif text-xl md:text-2xl text-center italic mb-5" style={{ color: '#e8c97a' }}>Without the Guesswork.</h3>
                      <div className="border-t border-b border-white/30 py-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">Winter Edition · Vol. 2</p>
                      </div>
                      <p className="text-sm mt-4 font-serif italic text-center text-white/80">V&Co.</p>
                    </div>
                  </div>
                  {/* Premium badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase text-white border border-white/40 backdrop-blur-sm" style={{ background: 'rgba(192,57,43,0.85)' }}>
                    Free Guide
                  </div>
                </div>

                {/* 2×2 info cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Card 1: Rate */}
                  <div className="card-lift aspect-[4/3] bg-white shadow-md p-5 flex flex-col items-center justify-center text-center cursor-default">
                    <p className="section-eyebrow mb-2" style={{ fontSize: '0.6rem' }}>The 2026 Reality</p>
                    <p className="font-serif text-3xl font-bold" style={{ color: 'var(--color-brand-dark)' }}>2.25<span className="text-xl">%</span></p>
                    <p className="text-[9px] uppercase tracking-wider mt-1" style={{ color: 'var(--color-brand-muted)' }}>Overnight Lending Rate</p>
                  </div>

                  {/* Card 2: Case study */}
                  <div className="card-lift aspect-[4/3] overflow-hidden shadow-md relative cursor-default">
                    <img
                      src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Lawrence Park neighbourhood home transformation"
                      className="object-cover w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4" style={{ background: 'rgba(250,248,245,0.92)' }}>
                      <p className="section-eyebrow mb-2" style={{ fontSize: '0.6rem' }}>Case Study</p>
                      <p className="font-serif text-sm leading-tight" style={{ color: 'var(--color-brand-dark)' }}>The Lawrence Park Transformation</p>
                      <div className="flex gap-1.5 mt-3 w-full">
                        <div className="flex-1 h-2 rounded-sm" style={{ background: 'var(--color-brand-red)' }} />
                        <div className="flex-1 h-2 rounded-sm" style={{ background: 'var(--color-brand-gold)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: TRESA */}
                  <div className="card-lift aspect-[4/3] p-4 flex flex-col justify-center cursor-default" style={{ background: 'var(--color-brand-dark)' }}>
                    <p className="font-serif text-sm text-center mb-3 text-white">The Rules Have Changed</p>
                    <div className="text-[9px] space-y-2 text-white/80 uppercase tracking-wider">
                      <div className="flex justify-between border-b border-white/15 pb-1.5">
                        <span className="font-semibold text-white">Client</span>
                        <span style={{ color: '#aaa' }}>Self-Represented</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Fully Represented</span>
                        <span style={{ color: '#777' }}>No Representation</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Fiduciary Duty</span>
                        <span style={{ color: '#777' }}>No Advice</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Method */}
                  <div className="card-lift aspect-[4/3] overflow-hidden shadow-md relative cursor-default">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Toronto real estate strategic negotiation"
                      className="object-cover w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: 'linear-gradient(to top, rgba(250,248,245,0.95) 50%, transparent)' }}>
                      <p className="section-eyebrow mb-1" style={{ fontSize: '0.6rem' }}>V&Co Method</p>
                      <p className="font-serif text-sm leading-tight" style={{ color: 'var(--color-brand-dark)' }}>Strategic Negotiation</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: Copy + form */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <Reveal>
                <p className="section-eyebrow mb-5 flex items-center gap-3">
                  <span className="w-8 h-px inline-block" style={{ background: 'var(--color-brand-red)' }} aria-hidden="true" />
                  VCo Buyer Guide · Winter 2026
                </p>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] mb-6 tracking-tight" style={{ color: 'var(--color-brand-dark)' }}>
                  Master the 2026 Market:<br />
                  <span style={{ color: 'var(--color-brand-red)' }}>Clarity</span> and Control.
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--color-brand-muted)', letterSpacing: '0.01em' }}>
                  Navigate the shifting Toronto real estate landscape with <strong style={{ color: 'var(--color-brand-dark)', fontWeight: 600 }}>precision, not panic.</strong> Stabilized lending rates of <strong style={{ color: 'var(--color-brand-dark)', fontWeight: 600 }}>2.25%</strong> and a more accessible detached market mean opportunity—but only for buyers with a refined strategy.
                </p>
              </Reveal>

              {/* What you'll discover */}
              <Reveal delay={300}>
                <h2 className="font-serif text-base mb-5 tracking-wide" style={{ color: 'var(--color-brand-dark)' }}>What You Will Discover Inside:</h2>
                <ul className="space-y-4 mb-10" role="list">
                  {[
                    {
                      icon: <Shield size={15} aria-hidden="true" />,
                      title: 'The New Rules of Engagement',
                      text: 'How TRESA fundamentally changed your rights—and why self-represented buyers are legally barred from receiving strategic advice.',
                    },
                    {
                      icon: <TrendingUp size={15} aria-hidden="true" />,
                      title: 'The V&Co 5-Step Method',
                      text: 'From Deep Listening to Strategic Negotiation—a proven framework ensuring you never feel alone in the process.',
                    },
                    {
                      icon: <Eye size={15} aria-hidden="true" />,
                      title: 'Seeing What Others Miss',
                      text: 'Access off-market opportunities (20% of all deals) and hyper-local intelligence on Rosedale-Moore Park and Leaside.',
                    },
                    {
                      icon: <Award size={15} aria-hidden="true" />,
                      title: 'The Trained-Eye Advantage',
                      text: 'How to spot red flags like knob-and-tube wiring and structural issues before they become costly mistakes.',
                    },
                  ].map(({ icon, title, text }, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(192,57,43,0.1)', color: 'var(--color-brand-red)' }}>
                        {icon}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#444', letterSpacing: '0.01em' }}>
                        <strong style={{ color: 'var(--color-brand-dark)', fontWeight: 600 }}>{title}:</strong> {text}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Lead capture form */}
              <Reveal delay={400}>
                <div className="border-t border-gray-200 pt-8">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--color-brand-muted)' }}>
                    Download the Full Guide — Free
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md" noValidate>
                    <div className="flex-1">
                      <label htmlFor="email" className="sr-only">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="form-input"
                        required
                        aria-required="true"
                        aria-label="Your email address"
                      />
                    </div>
                    <button type="submit" className="btn-primary whitespace-nowrap" aria-label="Download the buyer guide">
                      Download Now <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </form>
                  {submitted && (
                    <p className="mt-3 text-sm font-medium" style={{ color: '#16a34a' }} role="status" aria-live="polite">
                      ✓ The guide is on its way to your inbox!
                    </p>
                  )}
                  <p className="mt-3 text-[11px]" style={{ color: '#aaa', letterSpacing: '0.02em' }}>
                    No spam. Unsubscribe at any time.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
        <div className="flex justify-center pb-12 -mt-4" aria-hidden="true">
          <ChevronDown size={20} className="animate-bounce text-gray-300" />
        </div>

        {/* ── Trust Stats Bar ───────────────────────────────────────────────── */}
        <section className="border-t border-b border-gray-200 py-10" aria-label="V&Co by the numbers" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: 20, suffix: '%', label: 'Off-Market Deals Accessed', prefix: '' },
                  { value: 300, suffix: '+', label: 'Toronto Families Served', prefix: '' },
                  { value: 15, suffix: '+', label: 'Years of Market Expertise', prefix: '' },
                  { value: 98, suffix: '%', label: 'Client Satisfaction Rate', prefix: '' },
                ].map(({ value, suffix, label, prefix }, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <p className="stat-number font-serif text-4xl lg:text-5xl font-bold tracking-tight">
                      <AnimatedStat target={value} suffix={suffix} prefix={prefix} />
                    </p>
                    <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--color-brand-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Social Proof / Testimonials ───────────────────────────────────── */}
        <section className="py-20 lg:py-28" aria-label="Client testimonials" style={{ background: 'var(--color-brand-cream)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-14">
                <p className="section-eyebrow mb-4">Client Stories</p>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight" style={{ color: 'var(--color-brand-dark)' }}>
                  Trusted by Toronto Buyers
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Veronica's insight into off-market listings saved us months of searching. We found our dream home in Rosedale before it ever hit MLS.",
                  name: 'Sarah & James T.',
                  area: 'Rosedale-Moore Park',
                },
                {
                  quote: 'The V&Co method gave us total confidence in negotiations. We secured our Leaside home $40K under asking—something we never expected.',
                  name: 'Michael C.',
                  area: 'Leaside',
                },
                {
                  quote: 'Understanding TRESA was critical. Veronica explained every right we had as buyers, and that knowledge was invaluable on offer night.',
                  name: 'Priya & Rahul M.',
                  area: 'Forest Hill',
                },
              ].map(({ quote, name, area }, i) => (
                <div key={i}><Reveal delay={i * 100}>
                  <div className="card-lift bg-white p-8 shadow-sm border border-gray-100 flex flex-col h-full cursor-default">
                    {/* Stars */}
                    <div className="flex gap-1 mb-5" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={14} fill="#B8860B" color="#B8860B" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed flex-1 mb-6 italic" style={{ color: '#555' }}>
                      "{quote}"
                    </blockquote>
                    <div className="border-t border-gray-100 pt-5">
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-brand-dark)' }}>{name}</p>
                      <p className="text-xs tracking-wider uppercase mt-0.5" style={{ color: 'var(--color-brand-muted)' }}>{area}</p>
                    </div>
                  </div>
                </Reveal></div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Properties / Luxury Imagery ─────────────────────────── */}
        <section className="py-20 lg:py-28" style={{ background: '#fff' }} aria-label="VCo market features">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal direction="left">
                <div className="space-y-4">
                  <div className="img-overlay-card aspect-[16/10] shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Elegant Toronto property exterior at dusk"
                      className="object-cover w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                      <p className="section-eyebrow text-white/60 mb-2">Featured Market</p>
                      <p className="font-serif text-2xl">Rosedale · Leaside · Forest Hill</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="img-overlay-card aspect-[4/3] shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Modern Toronto kitchen interior"
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="img-overlay-card aspect-[4/3] shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Bright Toronto living room with large windows"
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="right">
                <div className="flex flex-col gap-6">
                  <p className="section-eyebrow">The V&Co Method</p>
                  <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight" style={{ color: 'var(--color-brand-dark)' }}>
                    A 5-Step Framework for<br />Buying with Confidence
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-brand-muted)' }}>
                    Built on deep market knowledge and fiduciary care, our method transforms the buying process from stressful to strategic.
                  </p>
                  <ol className="space-y-5 mt-2" role="list">
                    {[
                      ['Deep Listening', 'Understanding your financial comfort and lifestyle goals.'],
                      ['Market Intelligence', 'Accessing hyper-local data and off-market opportunities.'],
                      ['Trained-Eye Tours', 'Identifying hidden value and red flags invisible to others.'],
                      ['Strategic Offer Crafting', 'Positioning your offer to win without overpaying.'],
                      ['Expert Negotiation', 'Securing the terms—not just the price—that matter most.'],
                    ].map(([step, desc], i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-serif font-bold text-xs text-white" style={{ background: 'var(--color-brand-red)' }} aria-hidden="true">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-brand-dark)' }}>{step}</p>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-brand-muted)' }}>{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <section
          className="py-20 lg:py-24 relative overflow-hidden"
          aria-label="Download call to action"
          style={{ background: 'var(--color-brand-dark)' }}
        >
          {/* Decorative background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
            <span className="font-serif text-[16vw] font-bold tracking-tighter text-white/[0.025]">V&Co</span>
          </div>
          <div className="max-w-3xl mx-auto px-6 text-center relative">
            <Reveal>
              <p className="section-eyebrow text-white/40 mb-5">Your Next Step</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6 tracking-tight">
                Download Your Free Guide<br />
                <span style={{ color: '#e8c97a' }}>and Buy with Certainty.</span>
              </h2>
              <p className="text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em', lineHeight: '1.8' }}>
                Buying a home is more than a transaction—it's a meaningful step toward finding community and a lasting investment in your future self.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" noValidate>
                <div className="flex-1">
                  <label htmlFor="email-cta" className="sr-only">Email Address</label>
                  <input
                    type="email"
                    id="email-cta"
                    name="email-cta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="form-input"
                    required
                    aria-required="true"
                    aria-label="Your email address"
                  />
                </div>
                <button type="submit" className="btn-primary" aria-label="Download the buyer guide now">
                  Get the Guide <ArrowRight size={14} aria-hidden="true" />
                </button>
              </form>
              {submitted && (
                <p className="mt-4 text-sm font-medium text-green-400" role="status" aria-live="polite">
                  ✓ Check your inbox — the guide is on its way!
                </p>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#111', color: 'rgba(255,255,255,0.6)' }} role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

            {/* Col 1: Brand */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="font-serif text-3xl font-bold text-white tracking-tighter">V</div>
                <div className="w-px h-9 bg-white/20" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--color-brand-red)' }}>Royal LePage</span>
                  <span className="text-[9px] tracking-widest uppercase text-white/30">Real Estate Services Ltd., Brokerage</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Dedicated to revolutionizing the real estate experience through innovation, excellence, and unwavering client advocacy.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: <Instagram size={18} aria-hidden="true" />, label: 'Instagram' },
                  { icon: <Facebook size={18} aria-hidden="true" />, label: 'Facebook' },
                  { icon: <Linkedin size={18} aria-hidden="true" />, label: 'LinkedIn' },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={`Visit our ${label} page`}
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-colors duration-200 hover:border-white/50 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Pages */}
            <div>
              <h3 className="font-serif text-sm text-white mb-6 tracking-wide">Pages</h3>
              <ul className="space-y-3" role="list">
                {['Home', 'Properties', 'Contact Us', 'Complimentary Valuation'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs tracking-wider uppercase transition-colors duration-200 hover:text-white cursor-pointer focus-visible:text-white"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Recognition */}
            <div>
              <h3 className="font-serif text-sm text-white mb-6 tracking-wide">Awards & Recognition</h3>
              <div className="flex flex-wrap gap-3 items-center">
                {['REALTOR®', 'SRES', 'Member'].map((badge) => (
                  <div key={badge} className="text-[10px] font-bold border border-white/20 px-2.5 py-1.5 rounded-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h3 className="font-serif text-sm text-white mb-6 tracking-wide">Contact</h3>
              <ul className="space-y-4" role="list">
                <li>
                  <a href="tel:416-473-5303" className="flex items-center gap-3 text-xs tracking-wider transition-colors duration-200 hover:text-white cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <Phone size={14} aria-hidden="true" /> (416) 473-5303
                  </a>
                </li>
                <li>
                  <a href="mailto:veronicapiper@royallepage.ca" className="flex items-start gap-3 text-xs tracking-wider transition-colors duration-200 hover:text-white cursor-pointer break-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <Mail size={14} className="shrink-0 mt-0.5" aria-hidden="true" /> veronicapiper@royallepage.ca
                  </a>
                </li>
                <li>
                  <address className="flex items-start gap-3 text-xs tracking-wider not-italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <MapPin size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                    55 St. Clair Avenue West,<br />Toronto, ON M4V 2Y7
                  </address>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom CTA strip */}
          <div className="border-t border-white/10 pt-10 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl text-white mb-1.5">Need Help Buying or Selling?</h3>
              <p className="text-xs max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Our proven, high-touch approach gets results in every Toronto neighbourhood.
              </p>
            </div>
            <a
              href="tel:416-473-5303"
              className="btn-primary shrink-0 cursor-pointer"
              aria-label="Get in touch with VCo Real Estate"
            >
              Get in Touch <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <p>© {new Date().getFullYear()} V&Co. All rights reserved.</p>
            <p>Powered by <span className="text-white/40">J.</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}