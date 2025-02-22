"use client";
import { useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Home, Sparkles } from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const number = searchParams.get("waitlist_id");
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (number == null) {
      router.push("/");
      return;
    }

    // const message = localStorage.getItem("waitlistResponse");
    // setResponseMessage(message);

    const simulationInstance = (
      window as unknown as Window & { fluidSimulation: any }
    ).fluidSimulation;
    if (simulationInstance) {
      simulationInstance.multipleSplats(7);
    }

    controls.start({ opacity: 1, y: 0 });
  }, [controls, number, router]);

  if (number == null) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={
        "absolute text-white w-full h-screen flex items-center justify-center z-50 pointer-events-none"
      }
    >
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.8, duration: 0.8, ease: "easeOut"}}
        className="mt-6 md:mt-8 absolute top-0 left-0 z-50 pointer-events-auto"
      >
        <Link
          href="/"
          className="text-white hover:text-white transition-all duration-300 inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full group text-sm md:text-base"
        >
          <motion.span
            animate={{x: [-2, 0, -2]}}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
            }}
            className="group-hover:translate-x-[-4px] transition-transform duration-300 inline-flex"
          >
            <Home size={22} className="text-white group-hover:scale-[1.10]"/>
          </motion.span>
        </Link>
      </motion.div>
      <motion.div
        className="flex flex-col items-center justify-center space-y-8 md:space-y-12"
        initial={{opacity: 0, y: 50}}
        animate={controls}
        transition={{duration: 0.8, ease: "easeOut"}}
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] pt-4"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2, duration: 0.8, ease: "easeInOut"}}
        >
          Thank You!
        </motion.h1>

        <motion.div
          className="text-xl md:text-3xl lg:text-4xl text-center bg-black/50 px-6 py-3 md:px-8 md:py-4 rounded-full backdrop-blur-sm text-white flex items-center justify-center"
          initial={{scale: 0.8, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{delay: 0.4, duration: 0.6, ease: "easeInOut"}}
        >
          <span className="inline-flex items-center">
            You&apos;re Spark #{number}
            <motion.span
              className="ml-2 inline-block"
              initial={{opacity: 0, rotate: -45}}
              animate={{opacity: 1, rotate: 0}}
              transition={{delay: 0.8, duration: 0.5, ease: "easeOut"}}
            >
              <Sparkles className="text-purple-500 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"/>
            </motion.span>
          </span>
        </motion.div>

        <motion.p
          className="text-base md:text-lg lg:text-xl text-center text-gray-300 max-w-4xl px-4 mx-auto whitespace-normal"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.6, duration: 0.8, ease: "easeOut"}}
        >
          {/*{responseMessage === "You have been added to the waitlist!"*/}
          {/*  ? "We're excited to have you join our journey to ignite AI innovation."*/}
          {/*  : responseMessage === "Already in the waitlist"*/}
          {/*    ? "We love your enthusiasm and you're already in the queue..."*/}
          {/*    : "Oops an unexpected error occurred, we'll fix it right away!"}*/}
          We&#39;ll be in touch
        </motion.p>
      </motion.div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}

export default function ThankYou() {
  return (
    <Suspense fallback={<LoadingState/>}>
      <ThankYouContent/>
    </Suspense>
  );
}
