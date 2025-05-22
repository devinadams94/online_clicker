"use client";

import UpgradesPanel from "@/components/game/UpgradesPanel";
import OpsUpgradesPanel from "@/components/game/OpsUpgradesPanel";
import CreativityUpgradesPanel from "@/components/game/CreativityUpgradesPanel";
import TrustUpgradesPanel from "@/components/game/TrustUpgradesPanel";
import StatsPanel from "@/components/game/StatsPanel";

export default function UpgradesPage() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Upgrades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <UpgradesPanel />
          <TrustUpgradesPanel />
        </div>
        <div className="space-y-6">
          <StatsPanel />
          <OpsUpgradesPanel />
          <CreativityUpgradesPanel />
        </div>
      </div>
    </div>
  );
}