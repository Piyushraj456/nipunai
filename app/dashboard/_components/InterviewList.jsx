"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { eq, desc } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COLORS = [
  "bg-purple-100 text-purple-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-pink-100 text-pink-800",
  "bg-yellow-100 text-yellow-800",
  "bg-red-100 text-red-800",
];

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const router = useRouter();

  const getInterviewList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching mock interviews:", error);
    }
  };

  useEffect(() => {
    getInterviewList();
  }, [user]);

  const openDeleteDialog = (id) => {
    setToDeleteId(id);
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setToDeleteId(null);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;

    try {
      await db.delete(MockInterview).where(eq(MockInterview.mockId, toDeleteId));
      await getInterviewList();
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting mock interview:", error);
    }
  };

  const getInitials = (title) => {
    const words = title.trim().split(" ");
    return words[0]?.[0]?.toUpperCase() + (words[1]?.[0]?.toUpperCase() || "");
  };

  const formatDate = (dateStr) => {

  const [day, month, year] = dateStr.split("-").map(Number);

  // Create a Date object: months are 0-indexed in JS Date (0 = January)
  const date = new Date(year, month - 1, day);

  if (isNaN(date)) return "Invalid Date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};




  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Previous Mock Interview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewList.map((item, index) => {
          const color = COLORS[index % COLORS.length];

          return (
            <div
              key={item.id}
              className="group border border-gray-200 rounded-xl p-2 shadow-sm bg-white overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Colored Header Box with Delete Icon */}
              <div className={`relative p-4 rounded-lg flex items-start gap-4 ${color}`}>
                <div className="w-10 h-10 rounded-md text-lg bg-white text-gray-800 font-bold flex items-center justify-center  shadow">
                  {getInitials(item.jobPosition)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.jobPosition}</h3>
                  <p className="text-sm mt-1 text-black">{item.techStack}</p>
                </div>
                <Trash2
                  className="absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 cursor-pointer transition"
                  size={18}
                  onClick={() => openDeleteDialog(item.mockId)}
                />
              </div>

              {/* Details Section */}
              <div className="mt-2 p-2 flex flex-col justify-between flex-1">
                <div className="flex flex-wrap gap-2 text-sm mb-4">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs hover:bg-gray-200">
                    Experience: {item.jobExperience} Years
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs hover:bg-gray-200">
                    {item.qaCount || 5} Q&A
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs hover:bg-gray-200">
                    Last Updated: {formatDate(item.createdAt)}
                  </span>
                </div>

               <div>
                  <p className="text-sm mt-1 my-2 text-gray-400">{item.jobDesc}</p>
               </div>
                <div className="flex justify-between mt-auto">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/interview/${item.mockId}/feedback`)
                    }
                    className="px-3 py-1 border rounded text-sm font-medium hover:bg-gray-100"
                  >
                    Feedback
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/interview/${item.mockId}`)
                    }
                    className="px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded hover:bg-purple-600"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this mock interview?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={closeDeleteDialog}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewList;
