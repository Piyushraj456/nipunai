"use client";
import { Briefcase, FileText, Video, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: <Briefcase size={32} />,
    title: "Login to Nipun AI",
    description: "Create your account or sign in to start preparing for your AI-powered mock interviews."
  },
  {
    icon: <FileText size={32} />,
    title: "Set Up Your Interview",
    description: "Click 'Add Interview' and fill out job title, description, difficulty, experience, and tech stack."
  },
  {
    icon: <Video size={32} />,
    title: "Start Your Interview",
    description: "Nipun AI generates questions. With camera and mic enabled, simulate a real interview environment."
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Get Feedback",
    description: "AI evaluates your responses and provides a detailed rating with suggestions to improve."
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works"  className=" text-white py-16 px-6 my-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-neutral-400 mb-12">
          Four simple steps to level up your interview performance with Nipun AI
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-neutral-800 p-4 rounded-full mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-[16px] text-neutral-400 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
