"use client";

import useGameStore from "@/lib/gameStore";

export default function MetricsUpgradePanel() {
  const { 
    money, 
    metricsUnlocked, 
    unlockMetrics,
    totalPaperclipsMade,
    paperclipsSold,
    revenuePerSecond
  } = useGameStore();

  const canUnlockMetrics = money >= 500 && !metricsUnlocked;

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

  return (
    <div className="min-h-screen p-4">
      <div className="card bg-white dark:bg-gray-800 p-6 max-w-lg mx-auto">
        {!metricsUnlocked ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Production Metrics System</h2>
            <div className="mb-4">
              <img 
                src="/assets/graph-placeholder.svg" 
                alt="Metrics Dashboard" 
                className="w-full h-48 object-cover rounded-lg mb-4 bg-gray-100 dark:bg-gray-700" 
              />
            </div>
            <p className="mb-6">
              Unlock advanced production metrics to track your paperclip empire's growth and efficiency. 
              Monitor total paperclips produced, revenue rates, and other key performance indicators.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Features:</h3>
              <ul className="list-disc pl-5 text-blue-600 dark:text-blue-300 space-y-1">
                <li>Lifetime production statistics</li>
                <li>Revenue and sales tracking</li>
                <li>Performance metrics and efficiency ratios</li>
                <li>Real-time production monitoring</li>
              </ul>
            </div>
            
            <button
              className={`btn w-full ${canUnlockMetrics ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={unlockMetrics}
              disabled={!canUnlockMetrics}
            >
              Unlock Metrics Dashboard ($500.00)
            </button>
            
            {!canUnlockMetrics && money < 500 && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Not enough money. You need ${(500 - money).toFixed(2)} more.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Metrics Unlocked!</h2>
              <p className="text-green-600 dark:text-green-400">
                Your production metrics dashboard is now available in the navigation menu.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">Quick Stats:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Produced</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatNumber(totalPaperclipsMade)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Rate</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatMoney(revenuePerSecond)}/sec
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}