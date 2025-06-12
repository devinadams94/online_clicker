"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function PrestigePanel() {
  const {
    paperclips,
    lifetimePaperclips,
    aerogradePaperclips,
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
  
  // Check if player has enough aerograde paperclips for prestige
  const hasEnoughAerograde = (aerogradePaperclips || 0) >= 100000000; // 100 million
  
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
    if (!hasEnoughAerograde) {
      alert(`You need 100 million aerograde paperclips to prestige! You have: ${formatLargeNumber(aerogradePaperclips || 0)}`);
      return;
    }
    
    if (potentialPoints <= 0) {
      alert("You need at least 1 billion total paperclips value to prestige!");
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
          <div className="flex justify-between text-sm mt-2">
            <span>Aerograde Paperclips</span>
            <span className={hasEnoughAerograde ? 'text-green-400' : 'text-red-400'}>
              {formatLargeNumber(aerogradePaperclips || 0)} / 100M
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1 mb-2">
            <div 
              className="bg-yellow-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, ((aerogradePaperclips || 0) / 100000000) * 100)}%` }}
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
          Reset your progress to gain <span className="text-indigo-400 font-bold">1 trust point</span> and increase your prestige level. 
          Prestige points will reset to 0, but prestige bonuses and trust level will be preserved.
          {!hasEnoughAerograde && (
            <span className="block mt-1 text-red-400">
              You need 100 million aerograde paperclips to prestige. Current: {formatLargeNumber(aerogradePaperclips || 0)}
            </span>
          )}
          {potentialPoints <= 0 && hasEnoughAerograde && (
            <span className="block mt-1 text-red-400">
              You need at least 1 billion total paperclips value to gain prestige points.
            </span>
          )}
        </p>
        <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-400/30 shadow-[0_0_10px_rgba(99,102,241,0.3)] mb-3">
          <span className="text-sm text-indigo-300">
            <span className="font-bold">Trust Point Bonus:</span> You will receive 1 trust point when you prestige with 100M aerograde paperclips. Current prestige level: {prestigeLevel}
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
              potentialPoints > 0 && hasEnoughAerograde
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handlePrestige}
            disabled={potentialPoints <= 0 || !hasEnoughAerograde}
          >
            Prestige Reset (Requires 100M Aerograde, +1 Trust)
          </button>
        )}
        
        <div className="mt-3 text-xs text-gray-400">
          <span className="block font-medium">Prestige Reset Effects:</span>
          <ul className="list-disc list-inside mt-1">
            <li className="text-yellow-400">Prestige points reset to 0</li>
            <li className="text-green-400">Prestige bonuses preserved (based on level)</li>
            <li className="text-green-400">Trust level and abilities preserved</li>
            <li className="text-red-400">All game progress reset to beginning</li>
            {hasEnoughAerograde ? (
              <>
                <li className="text-indigo-400">+1 Trust Point gained</li>
                <li className="text-green-400">Prestige level increases by 1</li>
                <li className="text-purple-400">Consumes 100M aerograde paperclips</li>
              </>
            ) : (
              <>
                <li className="text-red-400">Cannot prestige (need 100M aerograde paperclips)</li>
                <li className="text-gray-500">Current: {formatLargeNumber(aerogradePaperclips || 0)} aerograde paperclips</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}