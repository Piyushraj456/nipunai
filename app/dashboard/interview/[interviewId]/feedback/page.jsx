"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Info,
  Star,
  TriangleAlert,
} from "lucide-react"; // Icon library
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";

const Feedback = () => {
 const { user, isLoaded } = useUser();

  const params = useParams();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openIndices, setOpenIndices] = useState(new Set());

  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  
  useEffect(() => {
    if (params.interviewId) {
      fetchFeedback();
    }
  }, [params.interviewId]);
  

  const fetchFeedback = async () => {

   
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackData(result);

      if (result.length > 0) {
        const totalRating = result.reduce(
          (acc, item) => acc + (parseFloat(item.rating) || 0),
          0
        );
        const average = totalRating / result.length;
        setAverageRating(average.toFixed(1)); // out of 10
      } else {
        setAverageRating(null);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

 const handleExportConfirmed = async () => {
  try {
    if (!isLoaded || !user) {
      toast.error("User not loaded. Please try again.");
      return;
    }

    if (feedbackData.length < 5) {
      toast.warning("⚠️ Interview incomplete. Please complete all 5 questions.", {
        position: "top-right",
      });
      setShowModal(false);
      return;
    }

    setIsExporting(true);

    const res = await fetch("/api/export-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewId: params.interviewId,
        email: user.emailAddresses[0].emailAddress,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "PDF export failed.");
    }

    toast.success("📧 PDF sent to your email!", { position: "top-right" });
  } catch (err) {
    toast.error("❌ Failed to send PDF via email.");
    console.error(err);
  } finally {
    setIsExporting(false);
    setShowModal(false);
  }
};


  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-green-500">
            🎉 Congratulations!
          </h2>
          <h2 className="font-bold text-2xl">
            Here is your Interview Feedback
          </h2>

          {averageRating && (
            <h2 className="text-lg text-primary mt-2">
              Your Overall Interview Rating: <strong>{averageRating}/10</strong>
            </h2>
          )}
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className=" bg-black text-white hover:bg-purple-600"
        >
          Export as PDF
        </Button>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Feedback</DialogTitle>
            </DialogHeader>
            {isExporting ? (
               <p className="text-sm">📄 Generating PDF and sending email... Please wait ⏳</p>
            ) : (
              <>
                <p className="text-sm mb-4">
                  Do you want to export your interview feedback as a PDF?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-black text-white"
                    onClick={handleExportConfirmed}
                  >
                    Export
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Below are the questions along with your answers, correct answers,
        feedback, and rating.
      </p>

      {feedbackData.length > 0 ? (
        feedbackData.map((item, index) => (
          <Collapsible
            key={item.id}
            className="mb-4 border border-gray-300 rounded shadow-sm bg-white"
            open={openIndices.has(index)}
            onOpenChange={() => {
              setOpenIndices((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(index)) {
                  newSet.delete(index); // collapse
                } else {
                  newSet.add(index); // expand
                }
                return newSet;
              });
            }}
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 hover:bg-gray-100 rounded-t cursor-pointer">
              <span>
                Question {index + 1}: {item.question}
              </span>
              {openIndices === index ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 space-y-3 border-t bg-white">
              <div className="bg-yellow-100 text-yellow-600 text-sm p-3 rounded">
                <span className="flex font-bold gap-2">
                  <Star className="font-bold text-yellow-500" />
                  Rating: {item.rating} / 10
                </span>
              </div>

              <div className="bg-green-100 flex flex-col  text-sm p-3 rounded">
                <span className="flex gap-2 font-bold text-black">
                  {" "}
                  <CircleCheck className="h-5 w-5 font-bold text-green-500" />
                  Expected Answer
                </span>
                <span>{item.correctAns}</span>
              </div>

              <div className="bg-blue-100 flex flex-col  text-sm p-3 rounded">
                <span className="flex gap-2 font-bold text-black">
                  {" "}
                  <Info className="h-5 w-5 font-bold text-blue-500" />
                  Your Answer
                </span>
                <span>{item.userAns}</span>
              </div>

              <div className="bg-red-100 flex flex-col text-red-700  text-sm p-3 rounded">
                <span className="flex gap-2 font-bold text-black ">
                  {" "}
                  <TriangleAlert className="h-5 w-5 font-bold text-red-500" />
                  Feedback
                </span>
                <span className="text-black">{item.feedback}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <p className="text-gray-500 mt-4">
          No feedback found for this interview.
        </p>
      )}

      <div className="text-center mt-10">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-black hover:bg-purple-600 text-white"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
