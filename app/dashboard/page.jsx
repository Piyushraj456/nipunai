import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

const Dashboard = () => {
  return (
    <div className="px-6 py-10">
      {/* Header Section */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-3xl font-bold text-purple-600">Dashboard</h2>
          <p className="text-sm text-gray-500">Create and start your AI Mockup Interview</p>
        </div>
        <AddNewInterview />
      </div>

      {/* Interview List Section */}
      <div className="mt-6">
        <InterviewList />
      </div>
    </div>
  )
}

export default Dashboard
