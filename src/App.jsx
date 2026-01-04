import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  Instagram, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles,
  Users,
  FileText,
  DollarSign
} from 'lucide-react';

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-gold-500 hover:bg-gold-600 text-white focus:ring-gold-500 shadow-lg shadow-gold-500/20",
    secondary: "bg-[#2D2424] text-white border border-gold-500/30 hover:bg-gray-800 focus:ring-gray-500", // Softened black to warm charcoal
    outline: "bg-transparent border-2 border-[#2D2424] text-[#2D2424] hover:bg-[#2D2424] hover:text-white",
    white: "bg-white text-[#2D2424] hover:bg-pink-50 shadow-lg"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
      {Icon && <Icon className="ml-2 w-4 h-4" />}
    </button>
  );
};

const PackageCard = ({ title, price, description, features, recommended = false, onSelect }) => (
  <div className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
    recommended 
      ? 'bg-[#2D2424] text-white shadow-2xl scale-105 border border-gold-500 z-10' // Warm charcoal bg
      : 'bg-white text-gray-800 shadow-xl border border-pink-100 hover:shadow-2xl hover:-translate-y-1'
  }`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
        Most Popular
      </div>
    )}
    <div className="mb-6">
      <h3 className={`text-2xl font-serif font-bold mb-2 ${recommended ? 'text-gold-400' : 'text-[#2D2424]'}`}>{title}</h3>
      <p className={`text-sm mb-4 h-10 ${recommended ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{price}</span>
        {price !== 'Custom' && <span className={`text-sm ml-1 ${recommended ? 'text-gray-400' : 'text-gray-500'}`}>/ event</span>}
      </div>
    </div>
    
    <div className="flex-grow space-y-3 mb-8">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-start">
          <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${recommended ? 'text-gold-500' : 'text-gold-600'}`} />
          <span className={`text-sm leading-relaxed ${recommended ? 'text-gray-200' : 'text-gray-600'}`}>{feature}</span>
        </div>
      ))}
    </div>

    <Button 
      variant={recommended ? 'primary' : 'secondary'} 
      className="w-full"
      onClick={onSelect}
    >
      Choose Plan
    </Button>
  </div>
);

const QuizModal = ({ isOpen, onClose, onResult }) => {
  const [step, setStep] = useState(0);
  
  if (!isOpen) return null;

  const questions = [
    {
      question: "How involved do you want to be in the planning process?",
      options: [
        { text: "I want to DIY it, but need a professional roadmap.", score: "essentials" },
        { text: "I'll handle the day-of, but need help finding vendors.", score: "signature" },
        { text: "I'm busy! I want someone to handle everything.", score: "elite" }
      ]
    },
    {
      question: "What is your main stressor right now?",
      options: [
        { text: "Not knowing where to start or how to style it.", score: "essentials" },
        { text: "Finding reliable vendors and managing the budget.", score: "signature" },
        { text: "Coordinating all the moving parts and design details.", score: "elite" }
      ]
    }
  ];

  const handleAnswer = (score) => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onResult(score);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2424]/60 backdrop-blur-sm">
      <div className="bg-[#FFF5F7] rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-fadeIn border border-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold text-[#2D2424]">Let's find your match</h3>
          <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-full text-[#2D2424]"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="mb-8">
          <div className="flex space-x-2 mb-6">
            {questions.map((_, idx) => (
              <div key={idx} className={`h-1 flex-1 rounded-full ${idx <= step ? 'bg-gold-500' : 'bg-gray-300'}`} />
            ))}
          </div>
          <h4 className="text-xl font-medium mb-6 text-[#2D2424]">{questions[step].question}</h4>
          <div className="space-y-3">
            {questions[step].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.score)}
                className="w-full text-left p-4 bg-white border border-pink-100 rounded-xl hover:border-gold-500 hover:bg-white/80 transition-colors flex justify-between items-center group shadow-sm"
              >
                <span className="text-gray-700">{option.text}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gold-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleQuizResult = (result) => {
    setShowQuiz(false);
    const element = document.getElementById('packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // In a real app, use a toast notification instead of alert
      setTimeout(() => alert(`Based on your answers, we recommend the ${result.toUpperCase()} package!`), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans text-[#2D2424] selection:bg-gold-200">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {!logoError ? (
              <img 
                src="Luxe vision logo.png" 
                alt="Luxe Vision" 
                className="h-12 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className={`font-serif text-2xl tracking-widest font-bold ${scrolled ? 'text-[#2D2424]' : 'text-[#2D2424] md:text-white'}`}>
                LUXE<span className="text-gold-500">VISION</span>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex space-x-8 ${scrolled ? 'text-gray-600' : 'text-white'}`}>
            {['About', 'Services', 'Process', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm uppercase tracking-wider font-medium hover:text-gold-500 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button variant={scrolled ? 'primary' : 'white'} onClick={() => scrollToSection('contact')}>
              Book Consultation
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className={`md:hidden ${scrolled ? 'text-[#2D2424]' : 'text-[#2D2424]'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#FFF5F7] shadow-xl p-6 md:hidden flex flex-col space-y-4">
            {['About', 'Services', 'Process', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-left text-lg font-medium py-2 border-b border-pink-200 text-[#2D2424]"
              >
                {item}
              </button>
            ))}
            <Button variant="primary" className="w-full" onClick={() => scrollToSection('contact')}>Book Now</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-[#2D2424]">
        {/* Background Image with Softer Overlay */}
        <div className="absolute inset-0 z-0">
          {!heroImageError ? (
             <img 
               src="https://images.unsplash.com/photo-1522413452208-996ff3f3e740?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
               alt="Event Setup with Cherry Blossoms" 
               className="w-full h-full object-cover"
               onError={() => setHeroImageError(true)}
             />
          ) : (
            // Fallback gradient if image fails
            <div className="w-full h-full bg-gradient-to-br from-[#2D2424] via-[#4A3B3B] to-[#2D2424]"></div>
          )}
          {/* Softer overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D2424]/50 via-[#2D2424]/30 to-[#2D2424]/60"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <div className="animate-fade-in-up">
            <h2 className="text-gold-300 font-medium tracking-[0.2em] uppercase mb-4 text-sm md:text-base">Event Consultation & Coordinating</h2>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-md">
              Your Vision.<br />Our Reality.
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10 font-light">
              Think of us as your middleman. You tell us your vision, and we source the vendors, design the details, and coordinate the chaos.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button variant="primary" onClick={() => scrollToSection('packages')}>View Packages</Button>
              <Button variant="white" onClick={() => setShowQuiz(true)} icon={Sparkles}>Find Your Package</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Modal */}
      <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} onResult={handleQuizResult} />

      {/* Intro / About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-100 rounded-full opacity-60"></div>
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Planning" 
                  className="rounded-lg shadow-xl relative z-10 border-4 border-white"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-2">Who We Are</h3>
              <h2 className="text-4xl font-serif font-bold mb-6 text-[#2D2424]">We Are Your Event Middleman</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Luxe Vision is an event consultation and coordinating service covering everything from birthdays and weddings to corporate showers. 
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We bridge the gap between your Pinterest board and the real world. Whether you need help sourcing vendors, creating mood boards, or designing digital invites, we've got you.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#FFF5F7] rounded-lg border border-pink-100">
                  <Users className="w-8 h-8 text-gold-500 mb-2" />
                  <h4 className="font-bold text-[#2D2424]">Expert Vendor Sourcing</h4>
                  <p className="text-xs text-gray-500">We find the best teams for you.</p>
                </div>
                <div className="p-4 bg-[#FFF5F7] rounded-lg border border-pink-100">
                  <FileText className="w-8 h-8 text-gold-500 mb-2" />
                  <h4 className="font-bold text-[#2D2424]">Vision Blueprints</h4>
                  <p className="text-xs text-gray-500">Detailed PDFs & moodboards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-[#FFF5F7]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 text-[#2D2424]">Curated Packages</h2>
            <p className="text-gray-600">
              Three levels of service to fit your budget and planning style. Every package is customizable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Package 1 */}
            <PackageCard 
              title="Luxe Essentials"
              price="$75 - $150"
              description="A starter package for DIY planners who want clarity and professional direction."
              features={[
                "1-Hour Virtual Consultation",
                "Customized Pinterest Moodboard",
                "Event Concept Summary (PDF)",
                "Vendor Recommendations List (3-5 per category)",
                "Canva Invitation Template (1 Design)",
                "No on-site coordination"
              ]}
              onSelect={() => scrollToSection('contact')}
            />

            {/* Package 2 */}
            <PackageCard 
              title="Luxe Signature"
              price="$150 - $350"
              recommended={true}
              description="Our high-value mid-level service. 70% planning done for you."
              features={[
                "Everything in Essentials",
                "Full Event Vision Board Slides",
                "Vendor Sourcing & Intro Coordination",
                "Digital Invitation Suite (Invites, Menu, Welcome Sign)",
                "Event Budget Planner",
                "Event Timeline Template",
                "Check-in calls & meetings"
              ]}
              onSelect={() => scrollToSection('contact')}
            />

            {/* Package 3 */}
            <PackageCard 
              title="Luxe Elite"
              price="$350 - $800+"
              description="The top-tier luxury hybrid experience. High-touch consulting."
              features={[
                "Everything in Signature",
                "Full Event Design Blueprint (20+ Page PDF)",
                "Full Vendor Management (Quotes & Negotiation)",
                "Up to 5 Digital Assets Designed",
                "Final Event Day Strategy Guide",
                "Unlimited Messaging Support"
              ]}
              onSelect={() => scrollToSection('contact')}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 italic">
              * Prices vary depending on location and market. 50% deposit required to secure booking.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-[#2D2424] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <h2 className="text-4xl font-serif font-bold text-white">How It Works</h2>
            <p className="text-gray-300 mt-4 md:mt-0 max-w-md text-right">
              From the first hello to the final timeline, we keep it organized and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Consult", desc: "We meet virtually to discuss your theme, budget, and vision." },
              { step: "02", title: "Proposal", desc: "You receive a custom proposal and contract." },
              { step: "03", title: "Deposit", desc: "A 50% non-refundable deposit secures your date." },
              { step: "04", title: "Planning", desc: "We create your moodboards, source vendors, and design assets." },
              { step: "05", title: "Delivery", desc: "You receive your final Guide/Blueprint and execute a flawless event." }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="text-6xl font-serif font-bold text-gray-700 mb-4 group-hover:text-gold-500 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-pink-50">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-[#FFF5F7] rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-pink-100">
            
            {/* Contact Info */}
            <div className="bg-[#2D2424] text-white p-10 md:w-2/5 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6">Let's start planning</h3>
                <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                  Fill out the form and tell us a bit about your event. We'll get back to you within 24 hours.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-gold-500 w-5 h-5" />
                    <span>hello@luxevision.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Instagram className="text-gold-500 w-5 h-5" />
                    <span>@LUXEVISION</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-gold-500 w-5 h-5" />
                    <span>Mon - Fri | 8 AM - 4 PM</span>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <div className="w-12 h-1 bg-gold-500 mb-4"></div>
                <p className="text-xs text-gray-400">Serving clients virtually & locally.</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-10 md:w-3/5">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Name</label>
                    <input type="text" className="w-full border-b border-gray-300 py-2 focus:border-gold-500 outline-none bg-transparent text-gray-800 placeholder-gray-400" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Event Date</label>
                    <input type="date" className="w-full border-b border-gray-300 py-2 focus:border-gold-500 outline-none bg-transparent text-gray-800" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Event Type</label>
                  <select className="w-full border-b border-gray-300 py-2 focus:border-gold-500 outline-none bg-transparent text-gray-800">
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Corporate Event</option>
                    <option>Baby Shower</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Interested Package</label>
                  <select className="w-full border-b border-gray-300 py-2 focus:border-gold-500 outline-none bg-transparent text-gray-800">
                    <option>Luxe Essentials ($75-$150)</option>
                    <option>Luxe Signature ($150-$350)</option>
                    <option>Luxe Elite ($350-$800+)</option>
                    <option>Unsure / Need Advice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Your Vision</label>
                  <textarea className="w-full border-b border-gray-300 py-2 focus:border-gold-500 outline-none bg-transparent h-24 resize-none text-gray-800 placeholder-gray-400" placeholder="Tell us about your theme, colors, or vibes..."></textarea>
                </div>

                <Button variant="primary" className="w-full">
                  Send Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2424] text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-serif font-bold mb-2">LUXE<span className="text-gold-500">VISION</span></h2>
            <p className="text-gray-400 text-sm">Turning your vision into reality, one detail at a time.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gold-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold-500 transition-colors">Email</a>
            <a href="#" className="hover:text-gold-500 transition-colors">WhatsApp</a>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Luxe Vision Event Coordinating. All rights reserved.
        </div>
      </footer>
      
      {/* CSS for custom animations */}
      <style>{`
        .text-gold-300 { color: #E5C558; }
        .text-gold-400 { color: #D4AF37; }
        .text-gold-500 { color: #C5A028; }
        .text-gold-600 { color: #B08D20; }
        .bg-gold-500 { background-color: #D4AF37; }
        .bg-gold-600 { background-color: #C5A028; }
        .border-gold-500 { border-color: #D4AF37; }
        .shadow-gold-500\\/20 { --tw-shadow-color: rgba(212, 175, 55, 0.2); }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}