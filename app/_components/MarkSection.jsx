"use client";
import React from 'react';
import Marquee from "react-fast-marquee";
import { motion } from 'framer-motion';
import { MarqueImg } from './MarqueImg';

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.2, ease: 'easeOut' }
  }
};

const logos = [
  { src: "/img/amazon.svg", alt: "Amazon", invert: true },
  { src: "/img/google.svg", alt: "Google" },
  { src: "/img/meta.svg", alt: "Meta" },
  { src: "/img/airbnb.svg", alt: "Airbnb" },
  { src: "/img/microsoft.svg", alt: "Microsoft" },
  { src: "/img/netflix.svg", alt: "Netflix" },
  { src: "/img/uber.svg", alt: "Uber" },
  { src: "/img/gm.svg", alt: "Google Meet" },
  { src: "/img/apple1.svg", alt: "Apple" },
];

const MarkSection = () => {
  return (
    <div className="w-full py-3 my-5" style={{ backgroundColor: '#1A2433' }}>
      <Marquee pauseOnHover gradient={false} speed={50}>
        <div className="flex space-x-10 items-center">
          {[...logos, ...logos].map(({ src, alt, invert }, index) => (
            <motion.div
              key={`${alt}-${index}`}
              variants={logoVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 1.2, ease: 'easeOut' }}
              className="flex items-center"
            >
              <MarqueImg img={src} alt={alt} invert={invert} />
            </motion.div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default MarkSection;
