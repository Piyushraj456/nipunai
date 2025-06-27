"use client";

import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import QuestionSection from "./_components/QuestionSection";
import dynamic from "next/dynamic";

// ⛔️ SSR disabled to fix 'window is not defined' error
const RecordAnswerSection = dynamic(() => import("./_components/RecordAnswerSection"), {
  ssr: false,
});

const StartInterview = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const params = useParams();

  useEffect(() => {
    const getInterviewDetail = async () => {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
      }
    };

    getInterviewDetail();
  }, [params.interviewId]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          mockInterviewData={interviewData}
        />

        {/* ✅ No window-related crash */}
        <RecordAnswerSection 
         mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          mockInterviewData={interviewData}
        />
      </div>
    </div>
  );
};

export default StartInterview;
