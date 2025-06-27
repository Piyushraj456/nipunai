"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

const stats = [
  { value: 50, suffix: '+', label: 'Industries Covered' },
  { value: 1000, suffix: '+', label: 'Interview Questions' },
  { value: 95, suffix: '%', label: 'Success Rate' },
  { value: 24, suffix: '/7', label: 'AI Support' },
];

const StatCard = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-50px' }); // trigger a bit earlier
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (isInView) {
      setStartCount(true);
    } else {
      setStartCount(false);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-white"
    >
      <h2 className="text-5xl font-bold">
        {startCount ? <CountUp start={0} end={value} duration={2} suffix={suffix} /> : `0${suffix}`}
      </h2>
      <p className="mt-2 text-sm text-blue-400">{label}</p>
    </motion.div>
  );
};

const Stats = () => (
  <div className=" py-10  my-5 px-4 grid grid-cols-2 md:grid-cols-4 gap-6  justify-items-center">
    {stats.map((stat, i) => (
      <StatCard key={i} {...stat} />
    ))}
  </div>
);

export default Stats;
