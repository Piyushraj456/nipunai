"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Interview = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [interviewData, setInterviewData] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [webCamError, setWebCamError] = useState(false);
  const webcamRef = useRef(null);
  const params = useParams();

  // Prevent hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && params.interviewId) {
      getInterviewDetail();
    }
  }, [params.interviewId, hasMounted]);

  const getInterviewDetail = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
  };

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

  // Prevent rendering on server
  if (!hasMounted) return null;

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold">Let's get started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

             <div className="gap-5 flex flex-col my-5  ">
                <div className="flex mt-12 flex-col p-5 rounded-lg border gap-5 bg-purple-100">
                   <h2><strong>Job Role/Job Position: </strong>{interviewData?.jobPosition} </h2>
                   <h2><strong>Job Description: </strong>{interviewData?.jobDesc} </h2>
                   <h2><strong>Year of Experience: </strong>{interviewData?.jobExperience}</h2>
                <h2><strong>TechStack: </strong>{interviewData?.techStack}</h2>

                </div>
                <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
                     <h2 className="flex gap-2 items-center text-yellow-600"> <Lightbulb/><strong>Information</strong></h2>  
                      <h2 className="mt-2 text-yellow-700">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                </div>
            </div>


              <div className="my-6">
        {webCamEnabled ? (
          <div className="flex flex-col items-center">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
              onUserMedia={() => console.log("Webcam access granted")}
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                setWebCamError(true);
                setWebCamEnabled(false);
              }}
              style={{
                height: 300,
                width: 300,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <Button
              onClick={handleDisableWebcam}
              className="mt-4 bg-red-500 hover:bg-red-600"
            >
              Stop Webcam
            </Button>
          </div>
        ) : (
          <>
            <WebcamIcon className="h-72 w-full my-7 p-20 rounded-lg bg-secondary border" />
            <Button
              onClick={handleEnableWebcam}
              variant="ghost"
              className="flex items-center justify-center w-full border rounded"
            >
              Enable Web Cam and Microphone
            </Button>
            {webCamError && (
              <p className="text-red-500 mt-2">
                Failed to access webcam. Please allow permission and try again.
              </p>
            )}
          </>
        )}
           </div>
      
           
      </div>
     
         <div className="flex justify-end items-end">
            <Link href={`/dashboard/interview/${params.interviewId}/start`}> <Button>Start</Button></Link> 
        </div>
      
     
    </div>
  );
};

export default Interview;
