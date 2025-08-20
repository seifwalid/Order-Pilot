import { ArrowRight, ArrowUpRight, Sparkles, Play, Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeftBorderIndicatorNavbar } from "@/components/Navbar";
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LeftBorderIndicatorNavbar />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="text-left">
              <Badge
                variant="outline"
                className="bg-white/80 backdrop-blur-md text-gray-700 border border-black/30 transition-all duration-300 mb-2 font-helvetica"
              >
                <Sparkles className="mr-2 size-3.5 text-gray-600" />
                AI-Powered Restaurant Management
              </Badge>

              <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight font-helvetica">
                Transform Your Restaurant Operations with{" "}
                <span className="text-teal-600">Intelligent Order Management</span>
              </h1>

              <p className="text-l text-gray-800 mb-6 leading-relaxed font-helvetica">
                Streamline orders, reduce errors, and maximize efficiency with our AI-powered platform trusted by thousands of restaurants worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="group bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full px-8 py-4 text-lg font-helvetica"
                  asChild
                >
                  <a href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gray-300/20 rounded-3xl blur-2xl" />
              <img
                src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"
                alt="Restaurant order management system with tablet and food"
                className="relative w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Effortless Order Management Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="text-gray-900">Effortless Order Management</div>
                <div className="text-slate-500">Powered by AI</div>
              </h2>
              <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Our AI engine handles the complexity so your staff can focus on what matters most - delivering exceptional dining experiences.
              </p>
              
              <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="text-slate-500 border-b border-gray-300 pb-3">
                  <span className="relative inline-block">
                    Voice-based food ordering with real-time transcription and confirmation
                    <span className="absolute -top-1 -right-6 bg-white text-black text-[10px] font-light border border-black rounded-full w-4 h-4 flex items-center justify-center">1</span>
                  </span>
                </div>
                                  <div className="text-slate-500 border-b border-gray-300 pb-3">
                    <span className="relative inline-block">
                      Smart menu management with upsells and dynamic pricing
                      <span className="absolute -top-1 -right-6 bg-white text-black text-[10px] font-light border border-black rounded-full w-4 h-4 flex items-center justify-center">2</span>
                    </span>
                  </div>
                  <div className="text-slate-500 border-b border-gray-300 pb-3">
                    <span className="relative inline-block">
                      Role-based dashboard with live sales, orders, and performance metrics
                      <span className="absolute -top-1 -right-6 bg-white text-black text-[10px] font-light border border-black rounded-full w-4 h-4 flex items-center justify-center">3</span>
                    </span>
                  </div>
                  <div className="text-slate-500 border-b border-gray-300 pb-3">
                    <span className="relative inline-block">
                      Seamless billing and subscription management through Stripe
                      <span className="absolute -top-1 -right-6 bg-white text-black text-[10px] font-light border border-black rounded-full w-4 h-4 flex items-center justify-center">4</span>
                    </span>
                  </div>
                  <div className="text-slate-500 border-b border-gray-300 pb-3">
                    <span className="relative inline-block">
                      POS and delivery system integrations with automated order routing
                      <span className="absolute -top-1 -right-6 bg-white text-black text-[10px] font-light border border-black rounded-full w-4 h-4 flex items-center justify-center">5</span>
                    </span>
                  </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                alt="Restaurant management dashboard and technology"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Restaurants
            </h2>
            <p className="text-xl text-gray-600">
              See how restaurants are transforming their operations and increasing revenue
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">LB</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Le Bernardin</h4>
                </div>
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                "Our kitchen operations have become incredibly streamlined. Order accuracy is up 40% and our staff can focus on what they do best - creating exceptional dining experiences."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Chef Antoine Dubois</p>
                  <p className="text-sm text-gray-600">Executive Chef, Le Bernardin</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">FB</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fresh Bowl</h4>
                </div>
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                "Since implementing this system across our 12 locations, we've reduced order errors by 85%. The consistency and efficiency gains have been remarkable for our fast-casual model."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Rodriguez</p>
                  <p className="text-sm text-gray-600">Operations Manager, Fresh Bowl Chain</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">CL</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Café Luna</h4>
                </div>
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                "As a small local bistro, we needed something simple yet powerful. The interface is so intuitive that our entire team was up and running within hours. It's been a game-changer."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">David Thompson</p>
                  <p className="text-sm text-gray-600">Owner, Café Luna Bistro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven Results
            </h2>
          </div>

                      <div className="grid md:grid-cols-3 gap-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="text-center">
                <div className="text-5xl font-bold text-teal-600 mb-2">95%</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Reduction</h3>
                <p className="text-gray-600">Fewer mistakes in order processing</p>
              </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">40%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Faster Service</h3>
              <p className="text-gray-600">Average improvement in order fulfillment time</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">25%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Increase</h3>
              <p className="text-gray-600">Average growth in monthly revenue</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Flexible pricing designed to grow with your restaurant
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-gray-600 font-medium">Monthly</span>
              <button
                id="billing-toggle"
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                role="switch"
                aria-checked="false"
                aria-label="Toggle between monthly and yearly billing"
                title="Switch billing frequency"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
              </button>
              <span className="text-gray-600 font-medium">Yearly</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Save 20%</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Essential</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <span id="essential-monthly">$99</span>
                  <span id="essential-yearly" className="hidden">$79</span>
                  <span className="text-lg text-gray-600">/mo</span>
                </div>
                <p className="text-gray-600 mb-6">
                  <span id="essential-billing">Billed Monthly</span>
                </p>
                <p className="text-gray-600 mb-6">Perfect for single location restaurants ready to streamline operations with core AI-powered features.</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered order management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Basic analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Customer support (email)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Menu optimization insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Single location support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Standard integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Mobile app access</span>
                </div>
              </div>

                             <Button
                 size="lg"
                 className="w-full bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg"
                 asChild
               >
                 <a href="/signup">Choose Plan</a>
               </Button>
            </div>

                         <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-teal-600 relative text-center">
               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                 <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
               </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <span id="professional-monthly">$299</span>
                <span id="professional-yearly" className="hidden">$239</span>
                <span className="text-lg text-gray-600">/mo</span>
              </div>
              <p className="text-gray-600 mb-6">
                <span id="professional-billing">Billed Monthly</span>
              </p>
              <p className="text-gray-600 mb-6">Comprehensive solution for multi-location restaurants with advanced analytics and premium integrations.</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Essential</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Multi-location management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics & reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Priority support (phone & email)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Custom integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Staff performance insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Inventory forecasting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Revenue optimization AI</span>
                </div>
              </div>

                             <Button
                 size="lg"
                 className="w-full bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg"
                 asChild
               >
                 <a href="/signup">Choose Plan</a>
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-background">
        <div className="container max-w-4xl mx-auto">
          <h2 className="mt-2 mb-12 text-3xl font-bold md:text-6xl text-navy" style={{ fontFamily: 'Inter, sans-serif' }}>
            Frequently Asked Questions
          </h2>
          <Accordion type="multiple">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="mb-2 rounded-md border-b-0 bg-slate-100 px-5 py-2 md:mb-4"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div>
                             <div className="flex items-center space-x-2 mb-4">
                 <span className="text-xl font-bold text-white">OrderPilot</span>
               </div>
              <p className="text-gray-400 mb-4">Restaurant Industry Insights</p>
              <p className="text-gray-400 mb-4">Get the latest trends, tips, and updates delivered to your inbox</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg border-0 text-gray-900"
                />
                                 <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-r-lg transition-colors">
                   Subscribe
                 </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a>
            </div>
            <p className="text-gray-400">© 2025 OrderPilot. All rights reserved.</p>
        </div>
      </div>
      </footer>
      
      {/* Billing Toggle Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const toggle = document.getElementById('billing-toggle');
            const toggleSpan = toggle.querySelector('span');
            let isYearly = false;
            
            // Pricing elements
            const essentialMonthly = document.getElementById('essential-monthly');
            const essentialYearly = document.getElementById('essential-yearly');
            const essentialBilling = document.getElementById('essential-billing');
            const professionalMonthly = document.getElementById('professional-monthly');
            const professionalYearly = document.getElementById('professional-yearly');
            const professionalBilling = document.getElementById('professional-billing');
            
            toggle.addEventListener('click', function() {
              isYearly = !isYearly;
              
              // Update toggle appearance
              if (isYearly) {
                toggle.classList.add('bg-teal-600');
                toggleSpan.classList.remove('translate-x-1');
                toggleSpan.classList.add('translate-x-6');
                toggle.setAttribute('aria-checked', 'true');
              } else {
                toggle.classList.remove('bg-teal-600');
                toggleSpan.classList.remove('translate-x-6');
                toggleSpan.classList.add('translate-x-1');
                toggle.setAttribute('aria-checked', 'false');
              }
              
              // Update pricing display
              if (isYearly) {
                essentialMonthly.classList.add('hidden');
                essentialYearly.classList.remove('hidden');
                essentialBilling.textContent = 'Billed Yearly';
                professionalMonthly.classList.add('hidden');
                professionalYearly.classList.remove('hidden');
                professionalBilling.textContent = 'Billed Yearly';
              } else {
                essentialMonthly.classList.remove('hidden');
                essentialYearly.classList.add('hidden');
                essentialBilling.textContent = 'Billed Monthly';
                professionalMonthly.classList.remove('hidden');
                professionalYearly.classList.add('hidden');
                professionalBilling.textContent = 'Billed Monthly';
              }
            });
          });
        `
      }} />
    </div>
  );
}
