"use client";

import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {Mail, MapPin, MessageSquare, Phone, Send, Sparkles, User} from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const ContactPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger fluid simulation if available
    const simulationInstance = (
      window as unknown as Window & { fluidSimulation: any }
    ).fluidSimulation;
    if (simulationInstance) {
      simulationInstance.multipleSplats(3);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const inputVariants = {
    initial: {
      borderColor: "rgba(108, 99, 255, 0.5)",
      boxShadow: "0 0 0 rgba(108, 99, 255, 0)"
    },
    focus: {
      borderColor: "rgba(108, 99, 255, 1)",
      boxShadow: "0 0 20px rgba(108, 99, 255, 0.3)"
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-black text-white relative overflow-hidden"
    >
      {/* Interactive background gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
              mousePosition.y * 100
            }%, rgba(108,99,255,0.15), transparent 50%),
                        radial-gradient(circle at ${
                          100 - mousePosition.x * 100
                        }% ${
              100 - mousePosition.y * 100
            }%, rgba(108,99,255,0.08), transparent 30%)`,
          }}
          transition={{ type: "tween", duration: 0.2 }}
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h1
              variants={fadeInVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #6C63FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(108,99,255,0.3)",
              }}
            >
              Contact Us
            </motion.h1>
            <motion.div
              variants={fadeInVariants}
              className="flex justify-center items-center space-x-2 text-purple-400"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-lg">Get in Touch</span>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.p
              variants={fadeInVariants}
              className="text-center text-gray-300 text-lg mb-16 max-w-3xl mx-auto leading-relaxed"
            >
              We&apos;re currently in our early stages but are always eager to connect with creators, brands, and potential partners. Here&apos;s how to reach us.
            </motion.p>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                variants={fadeInVariants}
                className="space-y-8"
              >
                {/* General Inquiries */}
                <motion.div
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">For General Inquiries</h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Have a question or just want to say hello? Drop us a line at:
                  </p>
                  <a 
                    href="mailto:hello@sparkonomy.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium"
                  >
                    hello@sparkonomy.com
                  </a>
                </motion.div>

                {/* Partnership Opportunities */}
                <motion.div
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">For Partnership Opportunities</h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Interested in collaborating with Sparkonomy? We&apos;d love to hear from you:
                  </p>
                  <a 
                    href="mailto:founders@sparkonomy.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium"
                  >
                    founders@sparkonomy.com
                  </a>
                </motion.div>

                {/* Office Information */}
                <motion.div
                  className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Sparkonomy&#39;s Office</h3>
                  </div>
                  <address className="text-gray-300 not-italic leading-relaxed">
                    <strong className="text-white">Sparkonomy Pte. Ltd.</strong><br />
                    100D PASIR PANJANG<br />
                    #05-03 MEISSA<br />
                    SINGAPORE 11852<br /><br />
                    <div className="flex items-center space-x-2 text-purple-400">
                      <Phone className="w-4 h-4" />
                      <span>+65 91455382 | +91 9910772075</span>
                    </div>
                  </address>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                variants={fadeInVariants}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  <span>Send us a message</span>
                </h3>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <motion.div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <motion.input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          variants={inputVariants}
                          initial="initial"
                          whileFocus="focus"
                          className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </motion.div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <motion.div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <motion.input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          variants={inputVariants}
                          initial="initial"
                          whileFocus="focus"
                          className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </motion.div>
                    </div>

                    {/* Mobile Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Mobile Phone
                      </label>
                      <motion.div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <motion.input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          variants={inputVariants}
                          initial="initial"
                          whileFocus="focus"
                          className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                          placeholder="+1 (555) 123-4567"
                        />
                      </motion.div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <motion.div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <motion.textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          variants={inputVariants}
                          initial="initial"
                          whileFocus="focus"
                          className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 resize-none"
                          placeholder="Tell us about your inquiry..."
                        />
                      </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        boxShadow: isSubmitting 
                          ? "0 0 25px rgba(255,255,255,0.3)" 
                          : "0 0 25px rgba(108,99,255,0.3)"
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      className="flex items-center justify-center gap-3 text-purple-400 mb-4"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Sparkles className="w-6 h-6" />
                      <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <p className="text-gray-300">
                      Thank you for reaching out. We&apos;ll get back to you soon!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <motion.div
        className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full opacity-40"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-3 h-3 bg-purple-300 rounded-full opacity-30"
        animate={{
          rotate: [0, 360],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default ContactPage;