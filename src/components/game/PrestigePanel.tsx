"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function PrestigePanel() {
  const {
    paperclips,
    lifetimePaperclips,
    prestigeLevel,
    prestigePoints,
    prestigeRewards,
    calculatePrestigePoints,
    prestigeReset
  } = useGameStore();
  
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Calculate potential prestige points
  const potentialPoints = calculatePrestigePoints();
  const totalPaperclips = (lifetimePaperclips || 0) + paperclips;
  const progressToNextPoint = potentialPoints > 0 
    ? 100 
    : Math.min(100, Math.floor((totalPaperclips / 1000000000) * 100));
  
  // Format large numbers
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };
  
  // Format percentages
  const formatPercentage = (multiplier: number) => {
    return `${((multiplier - 1) * 100).toFixed(0)}%`;
  };
  
  // Handle prestige reset
  const handlePrestige = () => {
    if (potentialPoints <= 0) {
      alert("You need at least 1 billion paperclips to prestige!");
      return;
    }
    
    if (showConfirm) {
      prestigeReset();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };
  
  return (
    <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">⭐</span> Prestige System
      </h2>
      
      {/* Prestige status */}
      <div className="bg-gray-700 p-3 rounded mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Current Level</div>
            <div className="text-2xl font-bold">{prestigeLevel || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Prestige Points</div>
            <div className="text-2xl font-bold">{prestigePoints || 0}</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-sm">
            <span>Lifetime Paperclips</span>
            <span>{formatLargeNumber(totalPaperclips)}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1 mb-2">
            <div 
              className="bg-yellow-500 h-1.5 rounded-full" 
              style={{ width: `${progressToNextPoint}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Current bonuses */}
      <div className="bg-gray-700 p-3 rounded mb-4">
        <h3 className="font-medium mb-2">Current Bonuses</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Production Rate</span>
            <span className="text-green-400">+{formatPercentage(prestigeRewards?.productionMultiplier || 1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Research Rate</span>
            <span className="text-green-400">+{formatPercentage(prestigeRewards?.researchMultiplier || 1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Wire Efficiency</span>
            <span className="text-green-400">+{formatPercentage(prestigeRewards?.wireEfficiency || 1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Click Power</span>
            <span className="text-green-400">+{formatPercentage(prestigeRewards?.clickMultiplier || 1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Starting Money</span>
            <span className="text-green-400">${formatLargeNumber(prestigeRewards?.startingMoney || 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Prestige reset */}
      <div className="bg-gray-700 p-3 rounded">
        <h3 className="font-medium mb-2">Reset Progress</h3>
        <p className="text-sm text-gray-400 mb-3">
          Reset your progress to gain <span className="text-yellow-400 font-bold">{potentialPoints}</span> prestige points and <span className="text-indigo-400 font-bold">1 trust point</span>.
          {potentialPoints <= 0 && (
            <span className="block mt-1 text-red-400">
              You need at least 1 billion paperclips to gain prestige points.
            </span>
          )}
        </p>
        <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-400/30 shadow-[0_0_10px_rgba(99,102,241,0.3)] mb-3">
          <span className="text-sm text-indigo-300">
            <span className="font-bold">Trust Point Bonus:</span> You will receive 1 trust point per prestige level. Current prestige level: {prestigeLevel}
          </span>
        </div>
        
        {showConfirm ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400 font-bold">
              Are you sure? This will reset ALL progress except prestige bonuses!
            </p>
            <div className="flex space-x-2">
              <button 
                className="flex-1 py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handlePrestige}
              >
                Yes, Reset Everything
              </button>
              <button 
                className="flex-1 py-2 px-3 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            className={`w-full py-2 px-3 rounded ${
              potentialPoints > 0 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handlePrestige}
            disabled={potentialPoints <= 0}
          >
            Prestige Reset (+{potentialPoints} Points, +1 Trust)
          </button>
        )}
        
        <div className="mt-3 text-xs text-gray-400">
          <span className="block font-medium">Prestige Rewards:</span>
          <ul className="list-disc list-inside mt-1">
            <li>+{formatPercentage({1: 0.2, 2: 0.3, 3: 0.4}[potentialPoints] || (0.2 * potentialPoints))} Production Rate</li>
            <li>+{formatPercentage({1: 0.1, 2: 0.15, 3: 0.2}[potentialPoints] || (0.1 * potentialPoints))} Research Rate</li>
            <li>+{formatPercentage({1: 0.05, 2: 0.1, 3: 0.15}[potentialPoints] || (0.05 * potentialPoints))} Wire Efficiency</li>
            <li>+{formatPercentage({1: 0.1, 2: 0.15, 3: 0.2}[potentialPoints] || (0.1 * potentialPoints))} Click Power</li>
            <li>${potentialPoints * 50} Starting Money</li>
            <li className="text-indigo-400">+1 Trust Point (for purchasing Trust Upgrades)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}