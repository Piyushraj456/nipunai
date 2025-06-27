"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateInterviewQA } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import moment from "moment";
import { useUser } from "@clerk/nextjs";
import {useRouter} from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [techInput, setTechInput] = useState("");
const [techStackList, setTechStackList] = useState([]);

  const [difficulty, setDifficulty] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState();
  const {user}=useUser();

  const router = useRouter();

  const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Call Gemini API (or your wrapper)
    const questions = await generateInterviewQA(
      jobPosition,
      jobDescription,
      yearsOfExperience,
      difficulty
    );

    const MockJsonResp = JSON.stringify(questions);

    if (MockJsonResp) {
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: yearsOfExperience,
         techStack: techStackList.join(', '),
        createdBy: user?.primaryEmailAddress?.emailAddress || "anonymous",
        createdAt: moment().format("DD-MM-YYYY"),
      }).returning({
        mockId: MockInterview.mockId,
      });
console.log(MockJsonResp);
      console.log("Inserted ID:", resp);
      if(resp){
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
      }
      setJsonResponse(questions);
    }

    setLoading(false);
  } catch (err) {
    console.error("Error:", err);
    setLoading(false);
  }
};

  return (
    <div>
      <div
        className="bg-black text-white text-sm px-4 py-1.5 rounded flex items-center space-x-1 hover:bg-primary 
        hover:cursor-pointer hover:transform hover:scale-105 transition-all "
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-semibold text-sm text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2">
              Tell us more about your job interview
            </DialogTitle>
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <div>
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div>
                  <label>Job Description</label>
                  <Textarea
                    placeholder="write Job responsibilites, skills and experience"
                    required
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label>Years of Experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    min="0"
                    max="60"
                    required
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                  />
                </div>

                <div>
                  <label>Difficulty</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="mb-4">
  <label className="block font-medium mb-1">Tech Stack</label>
  <div className="flex flex-wrap gap-2 mb-2">
    {techStackList.map((tech, index) => (
      <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
        {tech}
        <button
          type="button"
          onClick={() =>
            setTechStackList(techStackList.filter((_, i) => i !== index))
          }
          className="text-red-500"
        >
          &times;
        </button>
      </span>
    ))}
  </div>
  <Input
    type="text"
    placeholder="EX. React, Node.js, Angular, Flutter, GoLang etc."
    value={techInput}
    onChange={(e) => setTechInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && techInput.trim()) {
        e.preventDefault();
        if (!techStackList.includes(techInput.trim())) {
          setTechStackList([...techStackList, techInput.trim()]);
        }
        setTechInput("");
      }
    }}
  />
</div>


                <div className="flex gap-4 justify-end pt-4">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
