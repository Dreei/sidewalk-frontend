// MilestonesTab.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Camera, MapPin, ClipboardCheck, Trophy, Lock, Flame, Calendar } from 'lucide-react';

// Types
interface Milestone {
  title: string;
  description: string;
  points: number;
  progress: number;
  required: number;
  completed: boolean;
  icon: React.ReactNode;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastContribution: string;
  weeklyActivity: boolean[];
}

// Component
const MilestonesTab: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Static data - in a real app, this would come from props or API
  const streakData: StreakData = {
    currentStreak: 5,
    longestStreak: 12,
    lastContribution: "2024-01-17",
    weeklyActivity: [true, true, true, false, true, false, true]
  };

  const milestones: Milestone[] = [
    {
      title: "Data Reporter",
      description: "Submit your first valid report",
      points: 50,
      progress: 1,
      required: 1,
      completed: true,
      icon: <MapPin className="w-5 h-5" />
    },
    {
      title: "Data Validator",
      description: "Validate 5 reports from other users",
      points: 100,
      progress: 3,
      required: 5,
      completed: false,
      icon: <ClipboardCheck className="w-5 h-5" />
    },
    {
      title: "Field Investigator",
      description: "Visit and photograph 3 reported locations",
      points: 200,
      progress: 1,
      required: 3,
      completed: false,
      icon: <Camera className="w-5 h-5" />
    },
    {
      title: "Community Champion",
      description: "Complete all previous milestones",
      points: 500,
      progress: 0,
      required: 1,
      completed: false,
      icon: <Trophy className="w-5 h-5" />
    }
  ];

  // Sub-components
  const StreakSection: React.FC = () => (
    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-full">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="font-semibold text-gray-900">Contribution Streak</h3>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Last contribution: Today</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-orange-500">{streakData.currentStreak} days</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-gray-600">Longest Streak</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{streakData.longestStreak} days</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">This Week's Activity</span>
          <span className="text-sm text-gray-600">
            {streakData.weeklyActivity.filter(Boolean).length}/7 days
          </span>
        </div>
        <div className="flex gap-1">
          {streakData.weeklyActivity.map((active, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                active ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone }) => (
    <div 
      className={`p-4 rounded-lg border ${
        milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className={`p-2 rounded-full ${
            milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
          }`}>
            {milestone.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {milestone.title}
              {milestone.completed && <Check className="w-4 h-4 text-green-600" />}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      milestone.completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(milestone.progress / milestone.required) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {milestone.progress}/{milestone.required}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-yellow-700">
          <Trophy className="w-4 h-4" />
          <span className="text-sm font-medium">{milestone.points} pts</span>
        </div>
      </div>
    </div>
  );

  // Calculate total points
  const totalPoints = milestones
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.points, 0);

  // Find next milestone points
  const nextMilestonePoints = milestones
    .find(m => !m.completed)
    ?.points ?? 0;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      <div className="bg-white shadow-lg rounded-t-lg max-w-2xl mx-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between bg-blue-600 text-white rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Milestones & Streaks</span>
          </div>
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        {isExpanded && (
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            <StreakSection />
            
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} />
            ))}

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold">Total Points: {totalPoints}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Next milestone: {nextMilestonePoints} pts
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesTab;