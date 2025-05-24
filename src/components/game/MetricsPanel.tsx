"use client";

// import { useState, useEffect } from 'react';
import useGameStore from '@/lib/gameStore';

export default function MetricsPanel() {
  const { 
    // paperclips, 
    // money, 
    totalPaperclipsMade,
    revenuePerSecond,
    paperclipsSold,
    totalSales,
    // stockMarketInvestment,
    stockMarketReturns,
    portfolioValue,
    stockMarketUnlocked
  } = useGameStore();
  
  // Calculate derived metrics
  const averagePricePerClip = paperclipsSold > 0 ? totalSales / paperclipsSold : 0;
  const clipsPerMoney = totalSales > 0 ? totalPaperclipsMade / totalSales : 0;
  
  return (
    <div className="card h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Production Metrics</h2>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Paperclips</div>
          <div className="text-xl font-bold">{Math.floor(totalPaperclipsMade).toLocaleString()}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Sales</div>
          <div className="text-xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Revenue Rate</div>
          <div className="text-xl font-bold text-green-600">${revenuePerSecond.toFixed(2)}/sec</div>
        </div>
      </div>
      
      {/* Secondary Metrics */}
      <h3 className="text-lg font-semibold mb-3">Efficiency Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Price Per Clip</div>
          <div className="text-lg font-semibold">${averagePricePerClip.toFixed(4)}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Clips Per Dollar Invested</div>
          <div className="text-lg font-semibold">{clipsPerMoney.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Stock Market Metrics (if unlocked) */}
      {stockMarketUnlocked && (
        <>
          <h3 className="text-lg font-semibold mb-3">Stock Market</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-sm text-purple-500 dark:text-purple-400">Portfolio Value</div>
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                ${portfolioValue.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-sm text-purple-500 dark:text-purple-400">Stock Returns</div>
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                ${stockMarketReturns.toFixed(2)}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Time-based Metrics */}
      <h3 className="text-lg font-semibold mb-3">Time-based Stats</h3>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Paperclips Per Hour (current rate)</div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">1 Hour</div>
            <div className="font-semibold">{Math.floor(revenuePerSecond / averagePricePerClip * 3600).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">8 Hours</div>
            <div className="font-semibold">{Math.floor(revenuePerSecond / averagePricePerClip * 3600 * 8).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">24 Hours</div>
            <div className="font-semibold">{Math.floor(revenuePerSecond / averagePricePerClip * 3600 * 24).toLocaleString()}</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}