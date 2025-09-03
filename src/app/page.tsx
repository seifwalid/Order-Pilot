  "use client";
  import React, { useState, useEffect } from "react";
  import { ArrowRight, ArrowUpRight, Sparkles, Check, Mic, Layers3, Gauge, CreditCard, Truck, Tablet } from "lucide-react";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  // import { LeftBorderIndicatorNavbar } from "@/components/Navbar";
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";


    const faqs = [
      {
        question: "How quickly can we get started?",
        answer:
          "You can start seeing results within 24-48 hours. Our onboarding process includes initial setup, data integration, and staff training. Most restaurants are fully operational with our AI system within one week, with basic features working immediately after setup.",
      },
      {
        question: "Does it integrate with existing POS systems?",
        answer:
          "Yes! Our platform seamlessly integrates with all major POS systems including Square, Toast, Clover, Lightspeed, and many others. We also support custom integrations for specialized systems. Our technical team handles the entire integration process to ensure smooth data flow.",
      },
      {
        question: "What kind of training does staff need?",
        answer:
          "Minimal training is required. Our intuitive interface is designed for busy restaurant environments. We provide a 2-hour training session for managers and 30-minute sessions for staff. Most team members become proficient within their first shift using the system.",
      },
      {
        question: "How does the AI learn our restaurant's patterns?",
        answer:
          "Our AI analyzes your historical data, customer preferences, seasonal trends, and operational patterns. It continuously learns from your daily operations, adapting to your unique menu, peak hours, customer demographics, and local market conditions to provide increasingly accurate predictions and recommendations.",
      },
      {
        question: "What happens to our data?",
        answer:
          "Your data is completely secure and remains your property. We use enterprise-grade encryption, comply with all privacy regulations, and never share your information with third parties. Data is stored in secure, compliant cloud infrastructure with regular backups and 99.9% uptime guarantee.",
      },
      {
        question: "Can we customize the system for our needs?",
        answer:
          "Absolutely! Our platform is highly customizable to match your restaurant's unique requirements. You can adjust AI algorithms, customize dashboards, set specific business rules, integrate with your preferred vendors, and tailor reports to your management style. We also offer custom development for specialized needs.",
      },
    ];

    export default function HomePage() {
      const [scrollPosition, setScrollPosition] = useState(0);
      const [isHydrated, setIsHydrated] = useState(false);

      // Handle hydration
      useEffect(() => {
        setIsHydrated(true);
      }, []);

      useEffect(() => {
        if (typeof window === 'undefined' || !isHydrated) return;
        
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Smooth scroll handling - update immediately for responsive feel
        const handleScroll = () => {
          setScrollPosition(window.scrollY);
        };
        
        // Use requestAnimationFrame for smooth, synchronized updates
        let ticking = false;
        const throttledScroll = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              handleScroll();
              ticking = false;
            });
            ticking = true;
          }
        };
        
        window.addEventListener("scroll", throttledScroll, { passive: true });
        
        return () => {
          window.removeEventListener("scroll", throttledScroll);
          document.documentElement.style.scrollBehavior = 'auto';
        };
      }, [isHydrated]);

      // Calculate the transform value for the image scroll effect
      const imageTransform = isHydrated ? Math.min(scrollPosition * 0.15, 60) : 0; // Move up to 60px max - stops sooner
      const imageScale = isHydrated ? Math.min(1 + (scrollPosition * 0.0005), 1.35) : 1; // Scale effect limited to 1.35x max

      // Animated background balls effect - completely independent of scroll
      useEffect(() => {
        if (typeof window === 'undefined' || !isHydrated) return;
        
        const container = document.getElementById('animated-balls-container');
        if (!container) return;

        const numCircles = 400; // Increased from 150 to 400 for continuous wave pattern
        const circles: HTMLDivElement[] = [];

        // Create circles with initial positions - better distribution
        for (let i = 0; i < numCircles; i++) {
          const circle = document.createElement('div');
          circle.className = 'absolute rounded-full pointer-events-none';
          
          // All balls same size: 8px
          const size = 8;
          
          circle.style.width = size + 'px';
          circle.style.height = size + 'px';
          circle.style.backgroundColor = '#4a90e2';
          circle.style.position = 'absolute';
          
          // Better distribution - start from negative position to ensure full coverage
          const initialP = (i / numCircles) % 1;
          const extendedWidth = window.innerWidth * 1.5; // Extend 50% beyond screen width
          const startOffset = -window.innerWidth * 0.25; // Start 25% before screen left edge
          const initialX = startOffset + extendedWidth * initialP;
          const initialY = window.innerHeight / 2 + Math.sin(initialP * 20 + i * 0.1) * 100;
          
          circle.style.left = initialX + 'px';
          circle.style.top = initialY + 'px';
          
          container.appendChild(circle);
          circles.push(circle);
        }

        // High-performance animation loop using setInterval instead of requestAnimationFrame
        let time = 0;
        const intervalId = setInterval(() => {
          time += 0.01;
          
          circles.forEach((circle, i) => {
            const p = (i / numCircles + time * 0.02) % 1; // Slightly slower for better coverage
            const extendedWidth = window.innerWidth * 1.5; // Extend 50% beyond screen width
            const startOffset = -window.innerWidth * 0.25; // Start 25% before screen left edge
            const x = startOffset + extendedWidth * p;
            const y = window.innerHeight / 2 + Math.sin(p * 20 + time * 1.2 + i * 0.1) * 100; // Slightly slower vertical movement
            
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
          });
        }, 16); // 60fps

        // Cleanup function
        return () => {
          clearInterval(intervalId);
          // Remove all circles
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        };
      }, []); // Empty dependency array - runs once on mount

            // Force Stripe pricing table to use desktop layout
      useEffect(() => {
        if (typeof window === 'undefined' || !isHydrated) return;
        
        const forceDesktopLayout = () => {
          const stripeTable = document.querySelector('stripe-pricing-table');
          if (stripeTable && window.innerWidth >= 768) {
            // Force desktop layout by setting CSS custom properties
            stripeTable.style.setProperty('--stripe-pricing-table-layout', 'grid');
            stripeTable.style.setProperty('--stripe-pricing-table-grid-template-columns', 'repeat(4, 1fr)');
            stripeTable.style.setProperty('--stripe-pricing-table-gap', '1rem');
            stripeTable.style.setProperty('--stripe-pricing-table-border-radius', '1.5rem');
            
            // Access the shadow DOM to force layout
            const shadowRoot = stripeTable.shadowRoot;
            if (shadowRoot) {
                             const table = shadowRoot.querySelector('table');
               if (table) {
                 table.style.display = 'grid';
                 table.style.gridTemplateColumns = 'repeat(4, 1fr)';
                 table.style.gridTemplateRows = '1fr';
                 table.style.gap = '1rem';
                 table.style.maxWidth = '100%';
                 table.style.borderRadius = '1.5rem';

               }
              
                             // Also try to style individual cells
               const cells = shadowRoot.querySelectorAll('td');
               cells.forEach(cell => {
                 cell.style.display = 'block';
                 cell.style.width = '100%';
                 cell.style.borderRadius = '1.5rem';

               });
            }
          }
        };

        // Run immediately and also on window resize
        forceDesktopLayout();
        window.addEventListener('resize', forceDesktopLayout);
        
        // Try multiple times to ensure Stripe table is fully loaded
        const timeoutId1 = setTimeout(forceDesktopLayout, 500);
        const timeoutId2 = setTimeout(forceDesktopLayout, 1000);
        const timeoutId3 = setTimeout(forceDesktopLayout, 2000);
        
        return () => {
          window.removeEventListener('resize', forceDesktopLayout);
          clearTimeout(timeoutId1);
          clearTimeout(timeoutId2);
          clearTimeout(timeoutId3);
        };
      }, [isHydrated]);

      return (
        <div className="min-h-screen bg-[#0f1216] text-white relative" data-scroll-container>

          {/* Unified Background Gradient with Animated Balls */}
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ae8d5e]/15 via-[#0f1216] to-emerald-500/10" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ae8d5e]/25 via-[#ae8d5e]/10 to-transparent blur-3xl" />
            <div className="absolute -bottom-60 -left-40 h-[1400px] w-[1600px] rounded-full bg-gradient-radial from-emerald-500/20 via-emerald-500/10 to-transparent blur-3xl" />
            <div className="absolute top-1/3 -right-20 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ae8d5e]/15 via-emerald-500/10 to-transparent blur-3xl" />
            <div className="absolute top-2/3 left-1/4 h-[1100px] w-[1300px] rounded-full bg-gradient-radial from-emerald-500/15 via-[#ae8d5e]/8 to-transparent blur-3xl" />
            
            {/* Animated Balls - integrated into background */}
            <div id="animated-balls-container" className="absolute inset-0" />
          </div>
          
          {/* Navigation - Glassmorphic */}
          <header className="relative z-40 w-full">
            <div className="mx-auto max-w-7xl px-4 md:px-1 pt-6">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-3">
                  <img 
                    src="/images/logo.png" 
                    alt="OrderPilot Logo" 
                    className="w-10 h-10 md:w-14 md:h-14 object-contain"
                  />
                  <span className="font-bold tracking-tight text-white text-lg md:text-xl lg:text-2xl">OrderPilot</span>
                </a>
                
                {/* Desktop Navigation - Centered */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/2 border border-white/5 rounded-full shadow-[0_10px_20px_-15px_rgba(0,0,0,0.3)]">
                    <nav className="px-3 md:px-0 py-0">
                      <div className="flex items-center justify-center gap-1 text-sm text-white/90">
                        <a href="#features" className="hover:text-white transition-colors px-8">Features</a>
                        <a href="#about" className="hover:text-white transition-colors px-8">About</a>
                        <a href="#pricing" className="hover:text-white transition-colors px-7">Pricing</a>
                        <a href="/signup" className="inline-flex items-center justify-center h-full px-5 py-[17px] rounded-full bg-[#ae8d5e] hover:bg-[#9a7d4e] text-white text-sm font-medium shadow-lg shadow-[#ae8d5e]/30 transition-colors">
                          <span>Sign Up</span>
                          <div className="ml-4 w-6 h-6 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                            <ArrowUpRight className="size-4 text-white" />
                          </div>
                        </a>
                      </div>
                    </nav>
                  </div>
                </div>

                {/* Mobile Navigation - With Visible Background */}
                <div className="md:hidden">
                  <div className="flex items-center space-x-4 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/2 border border-white/5 rounded-full px-4 py-2 shadow-[0_10px_20px_-15px_rgba(0,0,0,0.3)]">
                    <a href="#features" className="text-white/90 hover:text-white transition-colors text-sm">Features</a>
                    <a href="#pricing" className="text-white/90 hover:text-white transition-colors text-sm">Pricing</a>
                    <a href="/signup" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#ae8d5e] hover:bg-[#9a7d4e] text-white text-sm font-medium shadow-lg shadow-[#ae8d5e]/30 transition-colors">
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>

                  {/* Hero Section */}
          <section className="relative overflow-visible min-h-[80vh] flex items-center z-10">
            <div className="relative z-10 w-full px-6">
              <div className="max-w-3xl mx-auto text-center">
                <Badge
                  className="mb-4 bg-black/70 text-white/90 backdrop-blur-md inline-flex items-center py-2 px-4 text-sm font-light"
                >
                  <Sparkles className="mr-2 size-3.5" />
                  AI-Powered Restaurant Management
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-loose font-serif">
                  Run your restaurant on autopilot
                </h1>

                <p className="mt-6 text-white/80 text-base md:text-lg font-normal">
                  Capture, route, and fulfill every order—fast, accurate, zero chaos.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="group bg-[#ae8d5e] hover:bg-[#9a7d4e] text-white shadow-lg shadow-[#ae8d5e]/30 px-6 md:px-9 py-6 md:py-7 rounded-full text-base w-full sm:w-auto">
                    <a href="/signup" className="flex items-center justify-center w-full">
                      Start Free Trial
                      <div className="ml-3 w-6 h-6 md:w-7 md:h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                        <ArrowUpRight className="size-4 text-white" />
                      </div>
                    </a>
                  </Button>
                  <div className="inline-flex items-center justify-center h-12 px-6 md:px-9 py-6 md:py-7 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white hover:text-white/100 transition-colors w-full sm:w-auto">
                    <a href="#demo" className="text-base font-medium">See Demo</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hero Visual - positioned behind buttons with scroll effect */}
          <section className="relative -mt-24 md:-mt-48 lg:-mt-56 px-6">
            <div className="max-w-5xl mx-auto">
              <div 
                id="dashboard-container"
                className={`relative rounded-[24px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur shadow-2xl h-[300px] md:h-[400px] lg:h-[520px] scroll-effect-container scroll-effect-transform`}
                style={{
                  transform: `translateY(-${imageTransform}px) scale(${imageScale})`
                }}
              >
                <img
                  src="/images/dashboard.png"
                  alt="Restaurant dashboard interface"
                  className="w-full h-full object-contain md:object-cover"
                />
                <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/40 text-white text-xs border border-white/10">Live Orders</span>
                  <span className="px-3 py-1 rounded-full bg-black/40 text-white text-xs border border-white/10">Menu Updates</span>
                  <span className="px-3 py-1 rounded-full bg-black/40 text-white text-xs border border-white/10">Billing Integration</span>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/10" />
              </div>
            </div>
          </section>

          {/* Feature Section - Cards */}
          <section id="features" className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12 mt-30 text-center">
                <h2 className="text-3xl md:text-5xl font-thin tracking-tight">Built for busy restaurants</h2>
                <p className="mt-3 text-white/70 max-w-2xl mx-auto font-thin">Outcome-driven features designed to cut errors, speed up service, and lift profits.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative w-full h-64 group cursor-pointer">
                  <div className="absolute inset-0 transition-all duration-500 transform group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-center flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                          <Mic className="size-7 text-black" />
                        </div>
                      </div>
                      <h3 className="font-extralight text-2xl text-white">Voice Ordering</h3>
                    </div>
                    {/* Back of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-left flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <p className="font-normal text-white text-base text-center leading-relaxed px-4">Real-time transcription and confirmation to reduce mistakes and speed input.</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-64 group cursor-pointer">
                  <div className="absolute inset-0 transition-all duration-500 transform group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-center flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                          <Layers3 className="size-7 text-black" />
                        </div>
                      </div>
                      <h3 className="font-extralight text-2xl text-white">Smart Menus</h3>
                    </div>
                    {/* Back of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-left flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <p className="font-normal text-white text-base text-center leading-relaxed px-4">Upsells and dynamic pricing driven by demand, time, and inventory.</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-64 group cursor-pointer">
                  <div className="absolute inset-0 transition-all duration-500 transform group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-center flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                          <Gauge className="size-7 text-black" />
                        </div>
                      </div>
                      <h3 className="font-extralight text-2xl text-white">Role Dashboards</h3>
                    </div>
                    {/* Back of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-left flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <p className="font-normal text-white text-base text-center leading-relaxed px-4">Live sales and performance views tailored for owners, managers, and staff.</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-64 group cursor-pointer">
                  <div className="absolute inset-0 transition-all duration-500 transform group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-center flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                          <CreditCard className="size-7 text-black" />
                        </div>
                      </div>
                      <h3 className="font-extralight text-2xl text-white">Seamless Billing</h3>
                    </div>
                    {/* Back of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-left flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <p className="font-normal text-white text-base text-center leading-relaxed px-4">Native Stripe integration for subscriptions, invoices, and payouts.</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-64 group cursor-pointer">
                  <div className="absolute inset-0 transition-all duration-500 transform group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-center flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                          <Truck className="size-7 text-black" />
                        </div>
                      </div>
                      <h3 className="font-extralight text-2xl text-white">POS + Delivery</h3>
                    </div>
                    {/* Back of card */}
                    <div className="absolute inset-0 rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-6 shadow-xl text-left flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <p className="font-normal text-white text-base text-center leading-relaxed px-4">Automated routing across POS and delivery partners to keep orders moving.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section - Dark/Glass */}
          <section id="resources" className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light mb-3">Trusted by Leading Restaurants</h2>
                <p className="font-light text-white/70 text-lg">See how teams transform operations and increase revenue.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                      { 
                        name: 'Le Bernardin', 
                        quote: 'Order accuracy is up 40%. The team focuses on the guest, not the tablet.',
                        person: 'Chef Eric Ripert',
                        title: 'Executive Chef & Co-Owner',
                        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop&crop=center',
                        fallback: 'LB'
                      },
                      { 
                        name: 'Fresh Bowl', 
                        quote: 'Rolled out to 12 locations. Errors down 85% and service times are faster.',
                        person: 'Sarah Chen',
                        title: 'Operations Director',
                        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center',
                        fallback: 'FB'
                      },
                      { 
                        name: 'Café Luna', 
                        quote: 'Simple yet powerful. Our staff learned it in a single shift.',
                        person: 'Marco Rodriguez',
                        title: 'General Manager',
                        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop&crop=center',
                        fallback: 'CL'
                      },
                ].map((t, i) => (
                  <div key={i} className="rounded-2xl border border-black/20 bg-black/20 backdrop-blur-xl p-8 shadow-xl">
                        <blockquote className="text-white italic text-2xl mb-12">"{t.quote}"</blockquote>
                    <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mr-4 overflow-hidden">
                            {t.image ? (
                              <img 
                                src={t.image} 
                                alt={`${t.name} logo`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                                {t.fallback}
                              </div>
                            )}
                      </div>
                      <div>
                            <h4 className="font-semibold text-white">{t.person}</h4>
                            <p className="text-white/70 text-sm">{t.title}</p>
                            <p className="text-white/50 text-xs">{t.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 px-6 relative z-10">
            <div className="mt-10 max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-light mb-3">Simple, transparent pricing</h2>
                <p className="text-white/70">Upgrade when you grow.</p>
              </div>
              <div className="flex justify-center">
                <div 
                  className="bg-[#121315] rounded-3xl p-20 mx-auto flex items-center justify-center"
                  style={{ minHeight: '800px', minWidth: '1800px' }}
                >
                  <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                  <stripe-pricing-table 
                    pricing-table-id="prctbl_1S2XqWKjRFWk6k1voyqaGSRf"
                    publishable-key="pk_test_51Ry3Y7KjRFWk6k1vNROg0ib17S1jvVelB7709Jt9z2za8KB8dfWHPf0hdVU8S7ivBJAXTqFvv14WEB7GBE8dqQJp003F6hmE1H"
                    style={{ transform: 'scale(1.2)' }}>
                  </stripe-pricing-table>
                </div>
              </div>
            </div>
          </section>

                                    {/* FAQ Section - Dark/Glass */}
              <section id="faq" className="py-20 px-6 relative z-20">
                <div className="mt-10 max-w-4xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-light mb-3">Frequently Asked Questions</h2>
                    <p className="font-light text-white/70 text-lg">Everything you need to know about OrderPilot</p>
              </div>
                  <div className="rounded-2xl bg-black/20 backdrop-blur-xl p-8 shadow-xl">
                    <Accordion type="multiple" className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition-all duration-300"
                        >
                          <AccordionTrigger className="text-left text-white hover:text-white/80 transition-colors font-light text-lg py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-white/80 font-light leading-relaxed pt-2 pb-4">
                            {faq.answer}
                          </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Footer - Dark/Glass */}
              <footer className="mt-12 py-16 px-6 relative z-20">
            <div className="max-w-7xl mx-auto">
                              <div className="text-center mb-8">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-6xl font-normal mb-6">Launch with OrderPilot</h3>
                                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a href="/signup" className="px-8 py-4 rounded-full bg-black hover:bg-black/90 text-white font-medium transition-colors flex items-center">
                        Get Started
                        <ArrowUpRight className="ml-3 size-4 text-white" />
                      </a>
                      <a href="#features" className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center">
                        Learn More
                        <div className="inline-flex items-center justify-center ml-3 w-6 h-6 rounded-full bg-black/80">
                          <ArrowUpRight className="size-4 text-white" />
                        </div>
                      </a>
                    </div>
                                      <div className="mt-8 flex justify-center">
                      <div className="flex space-x-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Follow us on Twitter" title="Follow us on Twitter">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Follow us on LinkedIn" title="Follow us on LinkedIn">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Follow us on Instagram" title="Follow us on Instagram">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      </div>
                  </div>
                    
                  </div>
                </div>
                                <div className="mt-20 border-t border-white/40 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm flex space-x-6 mb-4 md:mb-0 text-white/90">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Security</a>
                  <a href="#" className="hover:text-white transition-colors">Compliance</a>
                </div>
                    <p className="text-sm text-white/90">© 2025 OrderPilot. All rights reserved.</p>
              </div>
                  

            </div>
          </footer>
          

        </div>
      )
    }