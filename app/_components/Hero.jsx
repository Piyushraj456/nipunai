"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Text animation variants
const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Button animation variants
const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 + 0.8, duration: 0.5, ease: "easeOut" },
  }),
};

// Image animation variants
const imageVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Moving border wrapper component
const MovingBorderWrapper = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-3xl p-[3px] bg-gradient-to-r from-purple-600 via-blue-400 to-purple-800 animate-gradient-corners  overflow-hidden ${className}`}
    >
      <div className="rounded-3xl bg-gray-900 dark:bg-black overflow-hidden border-2">{children}</div>

      <style jsx>{`
        .animate-gradient-corners {
          background-size: 200% 200%;
          animation: gradient-corners 2.5s linear infinite;
        }
        @keyframes gradient-corners {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </div>
  );
};


const Hero = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <section className="relative flex w-full items-center justify-center bg-gray-900 dark:bg-black overflow-hidden lg:h-screen">
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#52525b_1px,transparent_1px),linear-gradient(to_bottom,#52525b_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gray-900 dark:bg-black"
        style={{
          maskImage: "radial-gradient(circle at center, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, black 40%, transparent 100%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32">
        {/* Text Section */}
        <motion.div
          className="max-w-prose text-left"
          initial="hidden"
          animate="visible"
          variants={textVariant}
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Ace the Interview{" "}
            preparations with
            <span
              style={{
                background: "linear-gradient(to right, #4A00E0, #8E2DE2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="font-extrabold mr-2"
            >
              NipunAI
            </span>
          </h1>

          <p className="mt-4 text-base text-gray-300 sm:text-lg/relaxed">
            Prepare for your dream job with AI-driven mock interviews tailored to your role. Get
            instant, personalized feedback and actionable insights to improve your interview skills
            and boost your confidence. NipunAI helps you practice smarter, track your progress, and
            excel in every interview.
          </p>

          <div className="mt-4 flex gap-4 sm:mt-6">
            <motion.button
              className="inline-block rounded border border-purple-600 bg-purple-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
              variants={buttonVariant}
              custom={0}
              initial="hidden"
              animate="visible"
              onClick={handleGetStarted}
              type="button"
            >
              Get Started
            </motion.button>

            <motion.a
              href="#how-it-works"
              className="inline-block rounded border border-gray-700 px-5 py-3 font-medium text-gray-300 shadow-sm transition-colors hover:bg-gray-800 hover:text-white"
              variants={buttonVariant}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="mt-10 md:mt-0 flex justify-center"
          initial="hidden"
          animate="visible"
          variants={imageVariant}
        >
          <MovingBorderWrapper>
            <div className="relative rounded-3xl overflow-hidden max-w-[600px] w-full bg-gradient-to-tr from-gray-800 via-gray-900 to-black">
              <Image
                src="/hero-banner.png"
                alt="Illustration"
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-3xl"
                priority
              />
            </div>
          </MovingBorderWrapper>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
