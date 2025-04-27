import React, { useState, useRef, useEffect } from 'react';
import AgentRoleConfig from '../components/AgentRoleConfig';
import { startSession, startRoundtable } from '../api';
import { motion } from 'framer-motion';

// New component for animated background
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/10 via-indigo-100/30 to-pink-100/20"></div>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className={`absolute rounded-full blur-3xl opacity-20 bg-gradient-to-br ${
          i % 2 === 0 
            ? 'from-indigo-500 via-purple-400 to-blue-500' 
            : 'from-pink-400 via-purple-500 to-indigo-400'
        }`}
        style={{
          width: `${Math.random() * 30 + 20}rem`,
          height: `${Math.random() * 30 + 20}rem`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          transform: `translate(-50%, -50%)`,
          animation: `float-${i + 1} ${Math.random() * 10 + 15}s infinite ease-in-out`
        }}
      ></div>
    ))}
  </div>
);

// Badge component for testimonials and statistics
const Badge = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-200 text-indigo-700 ${className}`}
  >
    {children}
  </motion.div>
);

// Testimonial component
const Testimonial = ({ text, author, role, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-indigo-100 relative overflow-hidden"
  >
    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-pink-300/20 rounded-full blur-md"></div>
    <div className="text-gray-700 relative z-10 italic mb-4">{text}</div>
    <div className="font-bold text-indigo-700">{author}</div>
    <div className="text-sm text-indigo-500">{role}</div>
  </motion.div>
);

// Stats component
const Stat = ({ number, label, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-100"
  >
    <div className="text-3xl text-indigo-500 mb-2">{icon}</div>
    <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">{number}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </motion.div>
);

const realismLevels = [
  { label: 'Supportive', value: 'supportive', icon: '🌟', description: 'Encouraging feedback' },
  { label: 'Realistic', value: 'realistic', icon: '⚖️', description: 'Balanced perspective' },
  { label: 'Harsh', value: 'harsh', icon: '🔥', description: 'Investor-level scrutiny' },
];

export default function IdeaSetup({ onStart }) {
  const [idea, setIdea] = useState('');
  const [realism, setRealism] = useState('realistic');
  const [agents, setAgents] = useState([
    { role: 'PM', personality: 'neutral' },
    { role: 'CTO', personality: 'neutral' },
    { role: 'Investor', personality: 'neutral' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const ideaSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const benefitsSectionRef = useRef(null);
  const testimonialsSectionRef = useRef(null);

  // Intersection observers for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    const sections = [heroSectionRef, benefitsSectionRef, ideaSectionRef, testimonialsSectionRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const handleStart = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await startSession({ idea, realism, agents });
      if (res.session_id) {
        onStart({ idea, realism, agents: res.agents, sessionId: res.session_id });
        await startRoundtable(idea);
      } else {
        setError('Failed to start session.');
      }
    } catch (e) {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 overflow-hidden relative">
      <AnimatedBackground />
      
      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg">S</div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-700 to-pink-600 bg-clip-text text-transparent">startNOW</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection(heroSectionRef)}
              className={`font-medium transition-colors duration-200 ${activeSection === 'hero' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection(benefitsSectionRef)}
              className={`font-medium transition-colors duration-200 ${activeSection === 'benefits' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
            >
              Benefits
            </button>
            <button 
              onClick={() => scrollToSection(testimonialsSectionRef)}
              className={`font-medium transition-colors duration-200 ${activeSection === 'testimonials' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection(ideaSectionRef)}
              className={`font-medium transition-colors duration-200 ${activeSection === 'idea' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
            >
              Try Now
            </button>
          </div>
          <div>
            <button 
              onClick={() => scrollToSection(ideaSectionRef)}
              className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" ref={heroSectionRef} className="pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
            <div className="lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
              <Badge className="mb-4">🚀 Trusted by 100,000+ founders</Badge>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">Turn Ideas Into</span>
                <span className="block mt-1 text-indigo-900">Startup Success</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                Get feedback, insights, and pitch decks from AI experts who know what investors <span className="italic font-semibold">really</span> want to hear.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => scrollToSection(ideaSectionRef)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  Start For Free
                </button>
                <button
                  onClick={() => scrollToSection(benefitsSectionRef)}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:shadow-lg border-2 border-indigo-200 transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  <span>See How It Works</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <Badge>⭐ 4.9/5 (2,458 reviews)</Badge>
                <Badge>🔒 100% Safe & Secure</Badge>
                <Badge>🔄 No Credit Card Required</Badge>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-pink-500/20 rounded-3xl blur-xl transform rotate-6"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-indigo-100 transform transition-all duration-500 hover:rotate-1">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="ml-auto text-xs font-medium text-gray-500">startNOW Simulation</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3 mt-1">PM</div>
                      <div>
                        <div className="text-indigo-800 font-medium">Product Manager</div>
                        <p className="text-gray-700">Your target market needs more clarity. Who exactly is this for?</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3 mt-1">CT</div>
                      <div>
                        <div className="text-purple-800 font-medium">CTO</div>
                        <p className="text-gray-700">The tech is feasible, but we'll need to consider scalability challenges.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-xl">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold mr-3 mt-1">IN</div>
                      <div>
                        <div className="text-pink-800 font-medium">Investor</div>
                        <p className="text-gray-700">I like the vision, but what's your revenue model? Show me the numbers.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Round 1 of 3</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl opacity-50"></div>
            </div>
          </div>
          
          {/* Stats row */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <Stat number="100,000+" label="Active Users" icon="👥" delay={0.1} />
            <Stat number="450,000+" label="Ideas Evaluated" icon="💭" delay={0.2} />
            <Stat number="83%" label="Success Rate" icon="📈" delay={0.3} />
            <Stat number="$120M+" label="Funding Raised" icon="💰" delay={0.4} />
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section with modern design */}
      <section id="benefits" ref={benefitsSectionRef} className="py-20 px-6 bg-gradient-to-b from-white/50 to-indigo-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">✨ Game-changing features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">Why Founders Choose</span>
              <span className="text-indigo-900"> startNOW</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our AI-powered platform simulates realistic startup feedback, helping you perfect your pitch before facing real investors.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "👥",
                title: "AI Agent Roundtable",
                description: "Collaborate with AI experts—each with unique personalities—to refine your vision and identify blind spots.",
                delay: 0.1
              },
              {
                icon: "📊",
                title: "Instant Pitch Decks",
                description: "Generate stunning 7-slide decks that address investor concerns and highlight your startup's unique strengths.",
                delay: 0.2
              },
              {
                icon: "🎯",
                title: "Realism Levels",
                description: "Switch between supportive, realistic, or harsh feedback to stress-test your ideas at different stages.",
                delay: 0.3
              },
              {
                icon: "⚙️",
                title: "Customizable Roles",
                description: "Tailor agent personalities and roles for a truly personalized simulation experience.",
                delay: 0.4
              },
              {
                icon: "📑",
                title: "Actionable Reports",
                description: "Download comprehensive session reports and risk maps to guide your next strategic steps.",
                delay: 0.5
              },
              {
                icon: "🔄",
                title: "Iterative Process",
                description: "Refine your idea through multiple rounds of feedback until it's investor-ready.",
                delay: 0.6
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: benefit.delay }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-300 group hover:scale-105"
              >
                <div className="w-14 h-14 mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:rotate-12 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Process steps */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-indigo-900">How startNOW Works</h3>
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
              {[
                { number: "01", title: "Enter Your Idea", description: "Describe your startup concept in a few sentences." },
                { number: "02", title: "Configure Simulation", description: "Choose agent roles and feedback style." },
                { number: "03", title: "Get Expert Feedback", description: "Receive insights from AI startup experts." },
                { number: "04", title: "Generate Pitch Deck", description: "Create investor-ready presentations." }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/4 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-[calc(100%-1rem)] w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
                  )}
                  <h4 className="text-xl font-bold text-indigo-800 mb-2">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsSectionRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">💬 Success stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">What Founders</span>
              <span className="text-indigo-900"> Are Saying</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "startNOW helped me identify critical flaws in my business model before I even talked to investors. Saved me months of wasted effort!",
                author: "Sara Johnson",
                role: "CEO, TechBoost (Raised $2.4M)"
              },
              {
                text: "The AI roundtable is uncanny. It raised questions that real investors asked me almost word for word later. I was prepared for everything.",
                author: "Michael Chen",
                role: "Founder, CloudScale (Raised $5.7M)"
              },
              {
                text: "I used startNOW to practice my pitch 20+ times. When the real meeting came, I felt confident and secured our seed round on the first try.",
                author: "Alex Rivera",
                role: "CTO, HealthSync (Raised $3.1M)"
              },
              {
                text: "The pitch deck generator is worth the subscription alone. It transformed my messy ideas into a coherent story that investors loved.",
                author: "Taylor Washington",
                role: "Founder, EcoFuture (Raised $1.9M)"
              },
              {
                text: "As a non-technical founder, the CTO agent helped me understand what questions I needed to answer about our tech stack. Invaluable!",
                author: "Jamie Lewis",
                role: "CEO, MarketMaven (Raised $850K)"
              },
              {
                text: "I credit startNOW with at least 25% of our funding success. The harsh feedback mode prepared me for the toughest VCs in Silicon Valley.",
                author: "Priya Sharma",
                role: "Founder, DataDrift (Raised $7.2M)"
              }
            ].map((testimonial, index) => (
              <Testimonial
                key={index}
                text={testimonial.text}
                author={testimonial.author}
                role={testimonial.role}
                index={index}
              />
            ))}
          </div>
          
          {/* Brands section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20"
          >
            <p className="text-center text-gray-500 mb-8">FEATURED IN</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
              {['TechCrunch', 'Forbes', 'Wired', 'VentureBeat', 'Inc', 'Fast Company'].map((brand, index) => (
                <div key={index} className="text-2xl font-bold text-gray-400 tracking-tight">{brand}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Idea Entry Section - completely redesigned */}
      <section id="idea" ref={ideaSectionRef} className="py-20 px-6 bg-gradient-to-t from-indigo-50/80 to-white/40">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">🚀 Launch your idea</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">Start Your Simulation</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Describe your startup idea and customize your feedback experience.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden"
          >
            <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-indigo-100">
              {/* Left column - Agent setup */}
              <div className="md:col-span-2 p-8">
                <h3 className="text-2xl font-bold text-indigo-800 mb-6">Your Feedback Panel</h3>
                
                {/* Agent configuration */}
                <div className="mb-8">
                  <h4 className="font-bold text-indigo-600 mb-4 flex items-center">
                    <span className="inline-block w-6 h-6 bg-indigo-100 rounded-full text-indigo-500 flex items-center justify-center mr-2">1</span>
                    Choose Your Experts
                  </h4>
                  <AgentRoleConfig agents={agents} setAgents={setAgents} />
                </div>
                
                {/* Realism levels */}
                <div>
                  <h4 className="font-bold text-indigo-600 mb-4 flex items-center">
                    <span className="inline-block w-6 h-6 bg-indigo-100 rounded-full text-indigo-500 flex items-center justify-center mr-2">2</span>
                    Set Feedback Style
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {realismLevels.map(l => (
                      <button
                        key={l.value}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center ${
                          realism === l.value 
                            ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 ring-2 ring-indigo-200 ring-offset-2' 
                            : 'bg-white border-gray-200 hover:border-indigo-200'
                        }`}
                        onClick={() => setRealism(l.value)}
                      >
                        <span className="text-2xl mb-2">{l.icon}</span>
                        <span className="font-bold text-indigo-700">{l.label}</span>
                        <span className="text-xs text-gray-500">{l.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sample user insights */}
                <div className="mt-10 bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2">🔍</div>
                    <h5 className="font-bold text-indigo-700">User Insights</h5>
                  </div>
                  <p className="text-sm text-gray-700">Users who choose <b>{realismLevels.find(l => l.value === realism)?.label}</b> feedback typically improve their pitch success rate by <b>{realism === 'harsh' ? '73%' : realism === 'realistic' ? '54%' : '38%'}</b>.</p>
                </div>
              </div>
              
              {/* Right column - Idea entry and submit */}
              <div className="md:col-span-3 p-8 bg-gradient-to-br from-white to-indigo-50/30">
                <h3 className="text-2xl font-bold text-indigo-800 mb-6">Describe Your Startup</h3>
                
                <div className="mb-6">
                  <h4 className="font-bold text-indigo-600 mb-4 flex items-center">
                    <span className="inline-block w-6 h-6 bg-indigo-100 rounded-full text-indigo-500 flex items-center justify-center mr-2">3</span>
                    Share Your Vision
                  </h4>
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-xl"></div>
                    <textarea
                      className="w-full border-2 border-indigo-200 rounded-xl p-5 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 text-lg shadow-inner transition-all duration-300 min-h-40 relative z-10"
                      rows={5}
                      placeholder="Describe your startup idea in detail. What problem are you solving? Who is your target audience? What's your unique approach?"
                      value={idea}
                      onChange={e => setIdea(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* AI-powered examples */}
                <div className="mb-8">
                  <h5 className="text-sm font-medium text-indigo-600 mb-2">Need inspiration? Try one of these:</h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AI-powered financial advisor for Gen Z entrepreneurs",
                      "Sustainable packaging marketplace for small businesses",
                      "Mental health platform for remote tech workers"
                    ].map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setIdea(example)}
                        className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleStart}
                  disabled={loading || !idea.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-extrabold py-4 px-6 rounded-xl text-xl shadow-xl transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting Simulation...
                      </>
                    ) : (
                      <>
                        Launch Your Startup Simulation
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </span>
                  <span className="absolute -inset-full transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-white/10 via-white/20 to-transparent"></span>
                </button>
                
                {/* Trust indicators */}
                <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure & Private
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    100,000+ Users
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced Encryption
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-white font-black text-xl">S</div>
              <span className="text-2xl font-black text-white">startNOW</span>
            </div>
            <p className="text-indigo-200 mb-6">
              The AI-powered startup simulator that helps founders perfect their pitch and build investor-ready businesses.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'linkedin', 'instagram'].map(social => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-white"></div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Use Cases', 'Success Stories', 'What\'s New'].map(item => (
                <li key={item}><a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              {['Blog', 'Help Center', 'Startup Guide', 'API Docs', 'Community'].map(item => (
                <li key={item}><a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-indigo-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-indigo-300 text-sm">© 2025 startNOW. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-indigo-300 hover:text-white text-sm transition-colors duration-200">Privacy</a>
            <a href="#" className="text-indigo-300 hover:text-white text-sm transition-colors duration-200">Terms</a>
            <a href="#" className="text-indigo-300 hover:text-white text-sm transition-colors duration-200">Cookies</a>
          </div>
        </div>
      </footer>
      
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes float-1 { 0%, 100% { transform: translate(-50%, -50%) rotate(0deg); } 50% { transform: translate(-50%, -50%) rotate(5deg) scale(1.2); } }
        @keyframes float-2 { 0%, 100% { transform: translate(-50%, -50%) rotate(0deg); } 50% { transform: translate(-50%, -50%) rotate(-5deg) scale(0.8); } }
        @keyframes float-3 { 0%, 100% { transform: translate(-50%, -50%) translate(0, 0); } 50% { transform: translate(-50%, -50%) translate(30px, -30px); } }
        @keyframes float-4 { 0%, 100% { transform: translate(-50%, -50%) translate(0, 0); } 50% { transform: translate(-50%, -50%) translate(-20px, 20px); } }
        @keyframes float-5 { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.5); } }
        @keyframes float-6 { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(0.7); } }
        @keyframes float-7 { 0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); } 50% { transform: translate(-50%, -50%) translate(15px, 15px) rotate(10deg); } }
        @keyframes float-8 { 0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); } 50% { transform: translate(-50%, -50%) translate(-25px, -25px) rotate(-8deg); } }
        
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-0 { background-position: 0% 0%; }
        .bg-pos-100 { background-position: 100% 0%; }
      `}</style>
    </div>
  );
}