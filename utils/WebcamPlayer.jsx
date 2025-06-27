
"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

const WebcamPlayer = () => {
  const webcamRef = useRef(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [webCamError, setWebCamError] = useState(false);

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

  return (
    <div className="flex flex-col items-center">
      {webCamEnabled ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={true}
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
        </>
      ) : (
        <>
          <div className="h-72 w-full my-7 p-20 rounded-lg bg-secondary border flex items-center justify-center text-gray-500">
            Webcam not enabled
          </div>
          <Button
            onClick={handleEnableWebcam}
            variant="ghost"
            className="w-full border"
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
  );
};

export default WebcamPlayer;
