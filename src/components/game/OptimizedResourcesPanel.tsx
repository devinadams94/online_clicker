"use client";

import { memo, useMemo } from "react";
import useGameStore from "@/lib/gameStore";
import { formatNumber } from "@/lib/performanceOptimizations";

// Memoize individual resource displays to prevent unnecessary re-renders
const ResourceDisplay = memo(({ 
  label, 
  value, 
  decimals = 0,
  prefix = ""
}: { 
  label: string; 
  value: number; 
  decimals?: number;
  prefix?: string;
}) => {
  // Use optimized number formatting
  const formattedValue = useMemo(() => {
    if (prefix === "$") {
      return `$${formatNumber(value, 2)}`;
    }
    return formatNumber(value, decimals);
  }, [value, decimals, prefix]);
  
  return (
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        {formattedValue}
      </span>
    </div>
  );
});

ResourceDisplay.displayName = "ResourceDisplay";

// Memoize production stats
const ProductionStats = memo(() => {
  const productionMultiplier = useGameStore(state => state.productionMultiplier);
  const opsProductionMultiplier = useGameStore(state => state.opsProductionMultiplier);
  
  const totalMultiplier = useMemo(() => 
    (productionMultiplier || 1) + (opsProductionMultiplier || 0),
    [productionMultiplier, opsProductionMultiplier]
  );
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Production Multiplier:</div>
        <div className="text-lg font-bold text-green-600">
          {totalMultiplier.toFixed(1)}x
        </div>
      </div>
      <div className="flex flex-col text-xs text-gray-500 mt-1">
        <div>Increases paperclip production rate</div>
        <div className="mt-1 flex justify-between">
          <span>Base: {(productionMultiplier || 1).toFixed(1)}x</span>
          <span>OPs Bonus: +{(opsProductionMultiplier || 0).toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
});

ProductionStats.displayName = "ProductionStats";

// Main panel with optimized re-rendering
export default memo(function OptimizedResourcesPanel() {
  // Subscribe to individual pieces of state to minimize re-renders
  const paperclips = useGameStore(state => state.paperclips);
  const money = useGameStore(state => state.money);
  const wire = useGameStore(state => state.wire);
  const yomi = useGameStore(state => state.yomi);
  const clicks_per_second = useGameStore(state => state.clicks_per_second);
  const autoclippers = useGameStore(state => state.autoclippers);
  const totalClicks = useGameStore(state => state.totalClicks);
  const totalPaperclipsMade = useGameStore(state => state.totalPaperclipsMade);
  const paperclipsSold = useGameStore(state => state.paperclipsSold);
  const totalSales = useGameStore(state => state.totalSales);
  const trust = useGameStore(state => state.trust);
  const trustLevel = useGameStore(state => state.trustLevel);
  const nextTrustAt = useGameStore(state => state.nextTrustAt);
  const ops = useGameStore(state => state.ops);
  const opsMax = useGameStore(state => state.opsMax);
  const creativity = useGameStore(state => state.creativity);
  const creativityUnlocked = useGameStore(state => state.creativityUnlocked);
  const memory = useGameStore(state => state.memory);
  const memoryMax = useGameStore(state => state.memoryMax);
  const cpuLevel = useGameStore(state => state.cpuLevel);
  const memoryRegenRate = useGameStore(state => state.memoryRegenRate);
  const spaceAgeUnlocked = useGameStore(state => state.spaceAgeUnlocked);
  
  // Memoize production rate calculation
  const productionRate = useMemo(() => 
    formatNumber(clicks_per_second / 10, 1),
    [clicks_per_second]
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Resources</h2>
      
      {/* Basic Resources */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Paperclips:</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(paperclips)}
          </span>
        </div>
        <ResourceDisplay label="Money" value={money} decimals={2} prefix="$" />
        <ResourceDisplay label="Wire" value={wire} />
        {yomi > 0 && <ResourceDisplay label="Yomi" value={yomi} />}
      </div>
      
      {/* Production Stats */}
      {autoclippers > 0 && (
        <div className="mb-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="text-xs text-gray-500 mb-2">
            Production: {productionRate} paperclips/sec
          </div>
        </div>
      )}
      
      <ProductionStats />
      
      {/* Player Stats */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
        <h3 className="text-sm font-semibold mb-2">Player Stats</h3>
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Total Clicks:</span>
            <span>{formatNumber(totalClicks)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Made:</span>
            <span>{formatNumber(totalPaperclipsMade)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Sold:</span>
            <span>{formatNumber(paperclipsSold)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Sales:</span>
            <span>${formatNumber(totalSales, 2)}</span>
          </div>
        </div>
      </div>
      
      {/* Advanced Resources */}
      {(trust > 0 || ops > 0 || creativity > 0 || memory > 0) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
          <h3 className="text-sm font-semibold mb-2">Advanced Resources</h3>
          
          {/* Trust */}
          {trust > 0 && (
            <div className="mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs">Trust:</span>
                <span className="text-sm font-bold text-purple-600">{trust}</span>
              </div>
              <div className="text-xs text-gray-500">
                Level {trustLevel} • Next at {formatNumber(nextTrustAt)} paperclips
              </div>
            </div>
          )}
          
          {/* Computational Resources */}
          {(ops > 0 || memory > 0) && (
            <div className="space-y-2">
              {/* Operations */}
              {ops > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs">Operations:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {formatNumber(ops)}/{formatNumber(opsMax)}
                  </span>
                </div>
              )}
              
              {/* Memory */}
              {memory > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Memory:</span>
                    <span className="text-sm font-bold text-green-600">
                      {memory.toFixed(1)}/{memoryMax}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    CPU Level {cpuLevel} • Regen: {memoryRegenRate.toFixed(1)}/s
                  </div>
                </div>
              )}
              
              {/* Creativity */}
              {creativityUnlocked && (
                <div className="flex justify-between items-center">
                  <span className="text-xs">Creativity:</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {creativity.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Space Age indicator */}
      {spaceAgeUnlocked && (
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
            Space Age Active
          </span>
        </div>
      )}
    </div>
  );
});