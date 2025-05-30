"use client";

import UpgradesPanel from "@/components/game/UpgradesPanel";
import OpsUpgradesPanel from "@/components/game/OpsUpgradesPanel";
import CreativityUpgradesPanel from "@/components/game/CreativityUpgradesPanel";
import TrustUpgradesPanel from "@/components/game/TrustUpgradesPanel";
import StatsPanel from "@/components/game/StatsPanel";

export default function UpgradesPage() {
  return (
    <div className="min-h-screen p-4 relative">
      {/* Neon green background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(74,222,128,0.8)]">
          Upgrades
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              <UpgradesPanel />
            </div>
            <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              <TrustUpgradesPanel />
            </div>
          </div>
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              <StatsPanel />
            </div>
            <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              <OpsUpgradesPanel />
            </div>
            <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              <CreativityUpgradesPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}