import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeftBorderIndicatorNavbar } from "@/components/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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

export default async function HomePage() {
  const { user } = await getUser()
  
  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard')
  }

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
    </div>
  )
}
