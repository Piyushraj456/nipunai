"use client";

import { Lightbulb, Volume2, VolumeX, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const QuestionSection = ({
  mockInterviewQuestions,
  activeQuestionIndex,
  mockInterviewData,
  setActiveQuestionIndex,
  onEndInterview,  // New prop for end interview callback
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const indianVoice =
        voices.find(
          (v) => v.lang === "hi-IN" && v.name.toLowerCase().includes("female")
        ) || voices.find((v) => v.lang === "hi-IN");

      setVoice(indianVoice || voices[0]);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakText = (text) => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    utteranceRef.current = utterance;
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    const question = mockInterviewQuestions[activeQuestionIndex]?.question;
    isSpeaking ? stopSpeaking() : speakText(question);
  };

  if (!isClient || !mockInterviewQuestions?.length) return null;

  const isFirstQuestion = activeQuestionIndex === 0;
  const isLastQuestion = activeQuestionIndex === mockInterviewQuestions.length - 1;

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestions.map((_, index) => {
          const isActive = activeQuestionIndex === index;
          return (
            <div key={index}>
              <h2
                onClick={() => setActiveQuestionIndex(index)}
                className={`p-2 font-semibold rounded-3xl text-xs md:text-sm text-center cursor-pointer ${
                  isActive
                    ? "bg-purple-500 text-white"
                    : "bg-secondary hover:bg-purple-300"
                }`}
              >
                Question #{index + 1}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="my-5 gap-3">
        <h2 className="text-sm md:text-lg font-semibold">
          {mockInterviewQuestions[activeQuestionIndex]?.question}
        </h2>

        <button
          onClick={toggleSpeech}
          className={`p-2 mt-3 rounded-full transition ${
            isSpeaking ? "animate-pulse bg-red-100" : "bg-purple-100"
          }`}
          title={isSpeaking ? "Stop Speaking" : "Speak Question"}
        >
          {isSpeaking ? (
            <VolumeX className="text-red-600" />
          ) : (
            <Volume2 className="text-purple-600" />
          )}
        </button>
      </div>

      <div className="border rounded-lg p-5 bg-purple-100 border-purple-500 shadow mt-10">
        <h2 className="flex gap-2 items-center text-purple-700">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="mt-2 text-sm text-purple-500 my-2">
          {process.env.NEXT_PUBLIC_INFORMATION}
        </h2>
      </div>

      {/* Navigation Buttons */}
     <div className="flex justify-between mt-6 max-w-4xl mx-auto">
  <button
    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
    disabled={isFirstQuestion}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
      isFirstQuestion
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700"
    }`}
  >
    <ChevronLeft size={20} /> Previous
  </button>

  {isLastQuestion ? (
    <Link href={`/dashboard/interview/${mockInterviewData.mockId}/feedback`}>
    <button
      onClick={onEndInterview}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
    >
       End Interview
    </button> 
    </Link>
  ) : (
    <button
      onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
      disabled={isLastQuestion}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
        isLastQuestion
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700"
      }`}
    >
      Next <ChevronRight size={20} />
    </button>
  )}
</div>
    </div>
  );
};

export default QuestionSection;
