"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, Disc, Video, VideoOff,Save } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db"; // Drizzle instance
import { UserAnswer } from "@/utils/schema";
import { generateAnswerFeedback } from "@/utils/GeminiAIModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, mockInterviewData }) => {
  const webcamRef = useRef(null);
  const { user } = useUser();

  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [webCamError, setWebCamError] = useState(false);
  const [editableAnswer, setEditableAnswer] = useState("");
  const [recordedAnswer, setRecordedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [answerSaved, setAnswerSaved] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Load existing saved answer for current question and user
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      const currentQ = mockInterviewQuestions[activeQuestionIndex];
      if (!currentQ || !user) return;

      try {
        const existing = await db.query.UserAnswer.findFirst({
          where: (fields, { eq, and }) =>
            and(
              eq(fields.mockIdRef, mockInterviewData?.mockId),
              eq(fields.question, currentQ.question),
              eq(fields.userEmail, user.primaryEmailAddress?.emailAddress || "")
            ),
        });

        if (existing) {
          setRecordedAnswer(existing.userAns);
          setEditableAnswer(existing.userAns);
          setAnswerSaved(true);
          setHasRecorded(true);
        } else {
          // Reset when no saved answer
          setRecordedAnswer("");
          setEditableAnswer("");
          setAnswerSaved(false);
          setHasRecorded(false);
        }
      } catch (err) {
        console.error("Error fetching saved answer:", err);
      }
    };

    fetchExistingAnswer();
  }, [activeQuestionIndex, user, mockInterviewData, mockInterviewQuestions]);

  // Webcam handlers
  const handleEnableWebcam = () => {
    setWebCamError(false);
    setWebCamEnabled(true);
  };

  const handleDisableWebcam = () => {
    setWebCamEnabled(false);
    const stream = webcamRef.current?.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Speech recording handlers
  const handleStartRecording = () => {
      setRecordedAnswer("");
  setEditableAnswer("");
  setHasRecorded(false);
  startSpeechToText();
  };

 const handleStopRecording = () => {
  stopSpeechToText();

  const finalTranscript = results.length > 0 ? results[results.length - 1].transcript.trim() : "";

  setRecordedAnswer(finalTranscript);
  setEditableAnswer(finalTranscript);

  if (finalTranscript.length < 10) {
    toast.error("Your answer is too short. Please try again.",{
        style: {
      background: '#fff3cd',  // light yellow
      color: '#e69e0f'        // dark yellow text
    }
    });
    setHasRecorded(false);
  } else {
    setHasRecorded(true);
  }
};


  // Save answer to database with feedback
  const SaveUserAnswer = async () => {
    if (loading) return;

    if (answerSaved) {
     toast.error("You have already saved your answer.", {
  style: {
    backgroundColor: "#fee2e2", // light red
    color: "#991b1b",           // dark red text
  },
});
      return;
    }

    if (isRecording) stopSpeechToText();

    const userAnswer = editableAnswer.trim();
    const currentQ = mockInterviewQuestions[activeQuestionIndex];

    if (!userAnswer || userAnswer.length < 10) {
      toast.error("Your answer is too short or missing. Please try again.", {
        duration: 3000,
      });
      setHasRecorded(false);
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Generating feedback...",{
        style: {
      background: '#eacbe9',  // light yellow
      color: '#ee19e0'        // dark yellow text
    }
    });

    try {
      // Double-check no duplicate answer
      const existing = await db.query.UserAnswer.findFirst({
        where: (fields, { eq, and }) =>
          and(
            eq(fields.mockIdRef, mockInterviewData?.mockId),
            eq(fields.question, currentQ.question),
            eq(fields.userEmail, user.primaryEmailAddress?.emailAddress || "")
          ),
      });

      if (existing) {
        toast.dismiss(loadingToastId);
        toast.error("You have already saved this answer.",{
            style: {
      background: '#eeb4b4',  // light yellow
      color: '#ed604b'        // dark yellow text
    }
        });
        setAnswerSaved(true);
        return;
      }

      const { feedback, rating } = await generateAnswerFeedback(
        currentQ.question,
        userAnswer
      );

      await db.insert(UserAnswer).values({
        mockIdRef: mockInterviewData?.mockId,
        question: currentQ.question,
        correctAns: currentQ.answer,
        userAns: userAnswer,
        feedback,
        rating: rating.toString(),
        userEmail: user.primaryEmailAddress?.emailAddress || "anonymous@example.com",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      toast.dismiss(loadingToastId);
      toast.success("Answer saved with feedback successfully!",{
          style: {
      background: '#b2e2ae',
    }
      });
      setAnswerSaved(true);
    } catch (err) {
      console.error("Error saving answer:", err);
      toast.dismiss(loadingToastId);
      toast.error("Failed to save your answer. Please try again.", {
        duration: 3000,
      });
      setHasRecorded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 rounded">
      {/* Webcam display */}
      <div className="flex flex-col items-center bg-black rounded-lg pt-4 pb-4 px-5 mt-10 w-full max-w-4xl mx-auto">
        <div className="w-full h-[250px] rounded overflow-hidden border border-gray-700 flex items-center justify-center">
          {webCamEnabled ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              screenshotFormat="image/jpeg"
              videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                setWebCamError(true);
                setWebCamEnabled(false);
              }}
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          ) : (
            <img
              src="/webcam.png"
              alt="Webcam not enabled"
              className="w-[200px] h-[200px] object-cover mx-auto"
            />
          )}
        </div>
        {webCamError && (
          <p className="text-red-500 mt-3 text-center">
            Failed to access webcam. Please allow permission and try again.
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center w-full max-w-4xl mt-5 gap-3">
        <Button
          onClick={webCamEnabled ? handleDisableWebcam : handleEnableWebcam}
  className={`flex items-center gap-2 justify-center p-5 rounded-md text-white transition ${
    webCamEnabled
      ? "bg-red-600 hover:bg-red-700"
      : "bg-purple-500 hover:bg-purple-600"
  }`}
        >
          {webCamEnabled ? (
    <>
      <VideoOff className="w-5 h-5" />
      Stop Webcam
    </>
  ) : (
    <>
      <Video className="w-5 h-5" />
      Start Webcam
    </>
  )}
        </Button>

        <Button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={hasRecorded}
          variant={isRecording ? "bg-secondary" : "outline"}
          className={`flex items-center justify-center gap-2 p-5 ${
            isRecording ? "text-red-500 bg-white border" : ""
          } ${hasRecorded ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? (
            <>
              <Disc className="text-red animate-pulse" size={20} />
              Stop Recording...
            </>
          ) : (
            <>
              <Mic className="text-black" size={20} />
              Record Answer
            </>
          )}
        </Button>

            <Button
  onClick={() => setShowConfirmDialog(true)}
  disabled={!hasRecorded || loading}
  className=" flex border rounded-lg  bg-secondary text-black hover:bg-gray-200 items-center justify-center gap-2 p-5 "
>
  <Save className=" h-4 w-4" />
  Save
</Button>
      </div>

      {/* Transcript and Save */}
      <div className="max-w-4xl w-full mt-6 mx-auto bg-white border border-gray-300 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          {isRecording ? "Listening..." : "Your Answer (Edit if needed)"}
        </h2>

        {isRecording ? (
          <p className="text-gray-700 min-h-[50px]">{interimResult || "Listening..."}</p>
        ) : (
          <textarea
            className="w-full border rounded p-2 text-gray-800 min-h-[100px] resize-y"
            value={editableAnswer}
            onChange={(e) => setEditableAnswer(e.target.value)}
            placeholder="Your spoken answer will appear here. You can edit it before saving."
            disabled={loading}
          />
        )}

   


<Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <p className="text-sm text-gray-500 mt-2">
        This action cannot be undone. You can't edit or re-answer this question again!
      </p>
    </DialogHeader>

    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
        Cancel
      </Button>
      <Button
        className="bg-primary text-white hover:bg-purple-200"
        onClick={() => {
          setShowConfirmDialog(false);
          SaveUserAnswer();
        }}
      >
        Continue
      </Button>
    </div>
  </DialogContent>
</Dialog>


      </div>
    </div>
  );
};

export default RecordAnswerSection;
