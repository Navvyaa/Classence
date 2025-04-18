import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Calendar, Trophy, Clock, ChevronDown, Menu, X } from 'lucide-react';
import heroImg from '../assets/heroImg.svg';
import logo from '../../auth/assets/Frame.svg'
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <BookOpen size={32} />,
    title: "Interactive Learning",
    description: "Engage students with dynamic content and real-time interaction tools that make learning fun and effective."
  },
  {
    icon: <Users size={32} />,
    title: "Collaborative Space",
    description: "Create an environment where students can work together, share ideas, and learn from each other."
  },
  {
    icon: <Calendar size={32} />,
    title: "Smart Scheduling",
    description: "Easily manage classes, assignments, and events with our intuitive scheduling system."
  },
  {
    icon: <Clock size={32} />,
    title: "24/7 Access",
    description: "Access course materials, assignments, and resources anytime, anywhere, on any device."
  }
];

const steps = [
  {
    step: "1",
    title: "Create Your Account",
    description: "Sign up in minutes with our simple registration process. No complex setup required.",
    image: "/api/placeholder/600/400"
  },
  {
    step: "2",
    title: "Set Up Your Class",
    description: "Customize your virtual classroom with course materials, assignments, and resources.",
    image: "/api/placeholder/600/400"
  },
  {
    step: "3",
    title: "Invite Students",
    description: "Share a simple join code or link with your students to get them started.",
    image: "/api/placeholder/600/400"
  }
];

const testimonials = [
  {
    text: "Classence has revolutionized how I manage my virtual classroom. The interface is intuitive, and my students love the interactive features.",
    name: "Sarah Johnson",
    role: "High School Teacher"
  },
  {
    text: "As a student, I appreciate how organized and accessible everything is. The collaborative tools have made remote learning feel much more engaging.",
    name: "Michael Chen",
    role: "University Student"
  },
  {
    text: "The platform has streamlined our entire educational process. We've seen increased engagement and better learning outcomes.",
    name: "Dr. Emily Martinez",
    role: "Department Head"
  },
  {
    text: "Setting up and managing classes has never been easier. The support team is fantastic, and the platform keeps getting better.",
    name: "James Wilson",
    role: "Online Tutor"
  }
];

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  const checkScrollVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollVisibility);
    return () => window.removeEventListener('scroll', checkScrollVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <ChevronDown className="text-white w-8 h-8 animate-bounce" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedSection = ({ children, className, staggerChildren = 0.2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren,
            duration: 0.8
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage = ({ src, alt, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  
  return (
    <motion.div 
      ref={ref} 
      style={{ y, scale }} 
      className={`${className} overflow-hidden`}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto rounded-2xl object-cover" 
      />
    </motion.div>
  );
};

const ClassenceLanding = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollRef = useRef(null);
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white" ref={scrollRef}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-teal-600 origin-left z-50"
        style={{ scaleX }}
      />

      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#066769]">
            <img src={logo} alt="" className="h-8" />
          </div>

          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600  hover:text-gray-900 "
              style={{ zIndex: 60 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {!isMobile && (
            <div className="space-x-6">
              <a href="#features" className="hover:text-[#066769]">Home</a>
              <a href="#steps" className="hover:text-[#066769]">Features</a>
              <a href="#testimonials" className="hover:text-[#066769]">About</a>
              <a href="#testimonials" className="hover:text-[#066769]">Contact Us</a>
              <motion.button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-[#066769] text-white rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log In
              </motion.button>
              <motion.button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-[#066769] text-white rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobile && isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "tween" }}
                className="fixed inset-0 bg-white z-50 pt-20"
              >
                <div className="flex flex-col items-center space-y-8 p-8 bg-white ">
                  <a 
                    href="#features" 
                    className="text-xl hover:text-[#066769]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a 
                    href="#steps" 
                    className="text-xl hover:text-[#066769]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#testimonials" 
                    className="text-xl hover:text-[#066769]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <a 
                    href="#testimonials" 
                    className="text-xl hover:text-[#066769]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </a>
                  <motion.button 
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-[#066769] text-white rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log In
                  </motion.button>
                  <motion.button 
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-[#066769] text-white rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <section className="min-h-screen pt-20 flex items-center bg-gradient-to-b from-teal-500 to-teal-700 relative overflow-hidden text-white">
        <ScrollIndicator />
        
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl font-bold mb-8 leading-tight"
            >
              Your Classroom,<br />Anywhere, Anytime.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl mb-12 opacity-80"
            >
              Effortlessly manage, teach, and learn with Classence —
              the all-in-one platform for education.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex space-x-6"
            >
              <motion.button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-teal-600 rounded-md text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button 
                onClick={scrollToFeatures}
                className="px-8 py-4 border-2 border-white text-white rounded-md text-lg hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ParallaxImage 
              src={heroImg} 
              alt="Online learning illustration"
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="100%" 
            height="100%" 
            className="absolute"
          >
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path 
                  d="M 80 0 L 0 0 0 80" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="min-h-screen py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-4xl font-bold mb-6 text-left sm:text-center"
              
            >
              Why Choose Classence?
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-xl text-gray-600 max-w-3xl mx-auto text-left sm:text-center"
            >
              Classence is designed to provide a seamless teaching and learning experience, empowering both students and teachers.
            </motion.p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                staggerChildren={0.1}
                className="group"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden min-h-[300px]"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div 
                    className="text-teal-600 mb-6"
                   
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

 

      <section className="min-h-screen py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
           
              <h2 className="text-5xl font-bold mb-8">
                Ready to Transform Your Classroom?
              </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Empower your teaching and learning experience with Classence.
              Start managing classes, assignments, and live sessions like never before.
            </p>
            <motion.button 
              className="px-12 py-6 bg-teal-600 text-white text-xl rounded-md hover:bg-teal-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}

            >
              Sign Up Now
            
            </motion.button>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <img src={logo} alt="Classence Logo" className="h-10 mb-6" />
              <p className="text-gray-400">
                Revolutionizing education through innovative technology and seamless learning experiences.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <nav className="space-y-4">
                <a href="#features" className="block hover:text-teal-400 transition">Home</a>
                <a href="#steps" className="block hover:text-teal-400 transition">Features</a>
                <a href="#testimonials" className="block hover:text-teal-400 transition">About</a>
                <a href="#contact" className="block hover:text-teal-400 transition">Contact</a>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <nav className="space-y-4">
                <a href="/privacy" className="block hover:text-teal-400 transition">Privacy Policy</a>
                <a href="/terms" className="block hover:text-teal-400 transition">Terms of Service</a>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-6">Connect</h4>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
                <a href="#" className="hover:text-teal-400">Twitter</a>
                <a href="#" className="hover:text-teal-400">LinkedIn</a>
                <a href="#" className="hover:text-teal-400">Facebook</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">© 2024 Classence. All rights reserved.</p>
          </div>
        </div>
      </footer>
   


    </div>
  );
};

export default ClassenceLanding;