"use client";

import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {Home, Sparkles, Target, Users} from "lucide-react";
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
      <Link href="/?skipIntro=true" className={"flex items-center justify-center md:justify-start pt-8 px-4 sm:px-6 lg:px-8"}>
        <motion.div
          className="flex items-center justify-center z-50 w-12 h-12"
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

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20 pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-8"
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
              About Us
            </motion.h1>
          </motion.div>

          {/* Our Story Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 mt-1 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Sparkonomy exists</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Creators are the most significant founders of this generation. They are building the brands,
                communities, and cultures that the world follows. Yet, while their influence has become
                institutional, the world they navigate remains fragmented. For too long, the path to success
                has been a maze of trial, error, and invisible friction—a landscape where brilliant passion
                often co-exists with quiet exhaustion. It is a profession with massive promise, but fragile
                foundations. Sparkonomy exists to change that - by building the intelligence infrastructure
                Creators need to succeed.
              </p>
            </motion.div>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:from-purple-500/15 hover:to-blue-500/15 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 mt-1 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Unlocking economic success for Creators</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                <strong>Our vision is to elevate Creator livelihoods and success globally, transforming creative
                passion into thriving businesses.</strong>
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                As we build the foundational infrastructure for the $300B creator economy, we are also
                bringing to life the &apos;economic equality engine&apos; for the entire ecosystem. This is a system
                that ensures every creator is represented by the true substance of their craft—unlocking a
                fair and flourishing future for 250M creators and the brands that partner with them
                worldwide.
              </p>
            </motion.div>
          </motion.section>

          {/* Intelligence Infrastructure Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 mt-1 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">The intelligence infrastructure for the Creator economy</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                At Sparkonomy, we believe that being a Creator shouldn&apos;t just be a hustle - it should be a
                thriving, sustainable business. We are building the &quot;engine room&quot; for this new economy,
                replacing manual chaos with purpose-built AI that acts as a true thinking partner.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                Our proprietary <strong>Creator Genome</strong> leverages native multi-modality (powered by Google&apos;s Gemini
                Models) to analyze the &quot;Creative DNA&quot; of a creator&apos;s work across video, audio, image, and
                text—powering a personalized AI Agent Force that turns a creator&apos;s raw talent into a
                structured venture.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                We bridge the gap between being a &apos;content creator&apos; and a &apos;company founder&apos; by building the
                essential business rails - strategic, financial, and legal - that allow passion to become a
                profession and influence to become an institution.
              </p>
            </motion.div>
          </motion.section>

          {/* Team Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div
              variants={fadeInVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 mt-1 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">The team building the future of the Creator economy</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                Sparkonomy is built by creators, brand leaders, and AI technologists who have sat on every
                side of the table.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                Our team has spent decades building and scaling platforms like YouTube, Google, Meta, and
                Paypal that power the modern internet. We&apos;ve managed billion-dollar brand budgets,
                engineered global AI creative tools, and led growth for the world&apos;s largest creator
                platforms.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                But we&apos;ve also lived the Creator hustle.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                This unique vantage point - combining institutional rigor with first-hand creator empathy -
                is why Sparkonomy exists. We aren&apos;t just building another tool; we are applying the same
                zero-to-one operating discipline and technical excellence used by the world&apos;s tech giants to
                solve the most human challenges for the individual Creator-founder.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Our team has advised governments on AI adoption and helped thousands of Creators turn
                influence into enterprise. We&apos;ve seen where the systems are broken, and we have the
                blueprint to fix them.
              </p>
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div
              variants={fadeInVariants}
              className="text-center"
            >
              <Link
                href="/?skipIntro=true"
                className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-normal hover:font-semibold focus:font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Join the waitlist!
              </Link>
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