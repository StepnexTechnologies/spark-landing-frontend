"use client";

import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {Home, Mail, MapPin, Sparkles, Target, Users} from "lucide-react";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const AboutPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-black text-white relative overflow-hidden"
    >
      {/* Home Icon */}
      <Link href="/">
        <motion.div
          className="fixed top-8 left-1/2 md:left-auto md:right-8 z-50 w-12 h-12"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-6 h-6 hover:text-white/40" />
        </motion.div>
      </Link>

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
            className="text-center mb-20 mt-8"
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
              About Sparkonomy
            </motion.h1>
            <motion.div
              variants={fadeInVariants}
              className="flex justify-center items-center space-x-2 text-purple-400"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-lg">Building the future of creator economy</span>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.div>

          {/* Our Story Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Sparkonomy&#39;s Story</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                In today&apos;s creator economy, greatness is everywhere. But the path to success is a maze.
                Creators, the ultimate solo-preneurs, navigate this complex digital world alone, trying to 
                turn their passion into a profession. On the other side, marketers search for authentic 
                partners in a sea of noise. The entire ecosystem runs on friction.
              </p>
              <br />
              <p className="text-gray-300 leading-relaxed text-lg">
                We believe the future of this economy will be built on intelligent connection, not friction. 
                That&apos;s why we are building Sparkonomy to be the AI-powered bridge. We&apos;re creating a world
                where the best creators and the right brands find each other, not by chance, but by design.
              </p>
            </motion.div>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:from-purple-500/15 hover:to-blue-500/15 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Sparkonomy&#39;s Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Sparkonomy&#39;s mission is to be the AI thinking partner for every creator, helping them build thriving
                livelihoods. This clarity and professionalism, in turn, will allow brands to discover and 
                collaborate with the right partners, seamlessly and with confidence.
              </p>
            </motion.div>
          </motion.section>

          {/* What We Do Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.h2
              variants={fadeInVariants}
              className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white"
            >
              What We Do
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={fadeInVariants}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-purple-400 mb-4">For Creators</h3>
                <p className="text-gray-300 leading-relaxed">
                  We are designing a suite of AI-powered tools to act as your co-pilot unifying your brand,
                  showcasing your impact, and managing your business so you can focus on your craft.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeInVariants}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-purple-400 mb-4">For Brands & Marketers</h3>
                <p className="text-gray-300 leading-relaxed">
                  We are leveraging AI to build a data-rich platform that moves beyond vanity metrics, 
                  helping you discover authentic creators that work for your unique brand style and measure 
                  the true impact of your campaigns.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Team Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Sparkonomy&#39;s Team</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                We&apos;re a team of creators, brand experts, and AI technologists who have sat on both sides
                of the table. We&apos;ve managed brand budgets, lived the creator hustle, and helped build the
                very tools that shape the creator economy at companies like Google, YouTube, and Meta. 
                This firsthand experience from every angle drives our commitment to building a platform 
                that is finally fair, transparent, and powerful for everyone.
              </p>
            </motion.div>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Get in Touch</h2>
              </div>
              
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                We&apos;re building Sparkonomy in close collaboration with the community. For any inquiries,
                please reach out to us at{" "}
                <a 
                  href="mailto:hello@sparkonomy.com"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline"
                >
                  hello@sparkonomy.com
                </a>{" "}
                or Whatsapp us at{" "}
                <a href={'https://wa.me/919910772075'} className="text-purple-400 select-text">+91 9910772075</a>
              </p>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Sparkonomy Pte. Ltd.</h3>
                  <address className="text-gray-300 not-italic leading-relaxed">
                    100D PASIR PANJANG<br />
                    #05-03 MEISSA<br />
                    SINGAPORE 118523
                  </address>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>

      {/* Floating elements for visual interest - only render on client */}
      {isClient && (
        <>
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
        </>
      )}
    </div>
  );
};

export default AboutPage;