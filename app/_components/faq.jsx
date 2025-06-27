"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is Nipun AI?",
    answer:
      "Nipun AI is an AI-powered platform for preparing for mock interviews. It simulates real interview environments using your camera and mic, analyzes your responses, and provides detailed feedback.",
  },
  {
    question: "How do I start an interview on Nipun AI?",
    answer:
      "Login, click 'Add Interview', and fill in the form with your job title, description, experience level, difficulty, and tech stack. Click 'Start Interview' to begin your mock session.",
  },
  {
    question: "What technologies are supported?",
    answer:
      "Nipun AI supports a wide range of technologies including frontend, backend, DevOps, data science, and more. You can select multiple tech stacks while creating your mock interview.",
  },
  {
    question: "Is my data safe on Nipun AI?",
    answer:
      "Yes, your interview data is encrypted and only accessible to you. We follow best practices for security and compliance.",
  },
  {
    question: "How does AI evaluate my answers?",
    answer:
      "Nipun AI uses natural language processing and machine learning to evaluate your responses based on clarity, relevance, and technical accuracy. You’ll get scores and tips for improvement.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#0F172A] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center">Frequently Asked Questions</h2>
        <p className="text-center text-gray-400 mt-2 mb-10">
          Answers to common questions about Nipun AI
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-gray-700 pb-4">
                <button
                  onClick={() => toggleAnswer(index)}
                  className="w-full text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 mt-3 overflow-hidden"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
