"use client";

import useGameStore from "@/lib/gameStore";

export default function ProductionMetricsPanel() {
  const {
    totalPaperclipsMade,
    revenuePerSecond,
    totalSales,
    totalClicks,
    clicks_per_second,
    paperclipsSold,
    autoclippers,
    productionMultiplier,
    opsProductionMultiplier,
    prestigeRewards
  } = useGameStore();

  // Format large numbers with appropriate suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };

  // Format money with currency symbol
  const formatMoney = (amount: number): string => {
    return '$' + formatNumber(amount);
  };

  // Calculate total production multiplier
  const prestigeProductionMultiplier = prestigeRewards?.productionMultiplier || 1;
  const totalMultiplier = (productionMultiplier + (opsProductionMultiplier || 0)) * prestigeProductionMultiplier;
  
  // Calculate actual production per second
  const actualProductionPerSec = autoclippers * totalMultiplier;

  return (
    <div className="card bg-white dark:bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4">Production Metrics</h2>
      
      <div className="space-y-3">
        {/* Total Production Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Production</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paperclips Made</p>
              <p className="font-medium">{formatNumber(totalPaperclipsMade)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paperclips Sold</p>
              <p className="font-medium">{formatNumber(paperclipsSold)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</p>
              <p className="font-medium">{formatNumber(totalClicks)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="font-medium">{formatMoney(totalSales)}</p>
            </div>
          </div>
        </div>
        
        {/* Rates Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Rates</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Production Rate</p>
              <p className="font-medium">{formatNumber(actualProductionPerSec)}/sec</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Rate</p>
              <p className="font-medium text-green-600">{formatMoney(revenuePerSecond)}/sec</p>
            </div>
          </div>
        </div>
        
        {/* Efficiency Metrics - could be added later */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Efficiency</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Price per Sale</p>
              <p className="font-medium">
                {paperclipsSold > 0 ? formatMoney(totalSales / paperclipsSold) : '$0.00'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sales/Production Ratio</p>
              <p className="font-medium">
                {totalPaperclipsMade > 0 ? 
                  ((paperclipsSold / totalPaperclipsMade) * 100).toFixed(1) + '%' : 
                  '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}