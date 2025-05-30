"use client";

// import { useState, useEffect } from 'react';
import useGameStore from '@/lib/gameStore';
import { formatNumber, formatCurrency } from '@/utils/numberFormat';

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
    <div className="max-w-6xl mx-auto">
      <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">Production Metrics</h2>
        
        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="backdrop-blur-sm bg-gray-800/50 p-4 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
          <div className="text-sm text-green-300 mb-1">Total Paperclips</div>
          <div className="text-2xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">{formatNumber(Math.floor(totalPaperclipsMade), 0)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 p-4 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
          <div className="text-sm text-green-300 mb-1">Total Sales</div>
          <div className="text-2xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{formatCurrency(totalSales)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 p-4 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
          <div className="text-sm text-green-300 mb-1">Revenue Rate</div>
          <div className="text-2xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{formatCurrency(revenuePerSecond)}/sec</div>
        </div>
      </div>
      
      {/* Secondary Metrics */}
      <h3 className="text-xl font-bold mb-4 text-green-300">Efficiency Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="backdrop-blur-sm bg-gray-700/50 p-4 rounded-lg border border-green-400/10">
          <div className="text-sm text-green-300/80">Avg. Price Per Clip</div>
          <div className="text-xl font-bold text-green-400">{formatCurrency(averagePricePerClip)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-700/50 p-4 rounded-lg border border-green-400/10">
          <div className="text-sm text-green-300/80">Clips Per Dollar Invested</div>
          <div className="text-xl font-bold text-green-400">{formatNumber(clipsPerMoney, 2)}</div>
        </div>
      </div>
      
      {/* Stock Market Metrics (if unlocked) */}
      {stockMarketUnlocked && (
        <>
          <h3 className="text-xl font-bold mb-4 text-green-300">Stock Market</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="backdrop-blur-sm bg-purple-900/30 p-4 rounded-lg border border-purple-400/30 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              <div className="text-sm text-purple-300">Portfolio Value</div>
              <div className="text-xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(147,51,234,0.6)]">
                {formatCurrency(portfolioValue)}
              </div>
            </div>
            
            <div className="backdrop-blur-sm bg-purple-900/30 p-4 rounded-lg border border-purple-400/30 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              <div className="text-sm text-purple-300">Stock Returns</div>
              <div className="text-xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(147,51,234,0.6)]">
                {formatCurrency(stockMarketReturns)}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Time-based Metrics */}
      <h3 className="text-xl font-bold mb-4 text-green-300">Time-based Stats</h3>
      <div className="backdrop-blur-sm bg-gray-700/50 p-5 rounded-lg border border-green-400/10">
        <div className="text-sm text-green-300/80 mb-4">Paperclips Per Hour (current rate)</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">1 Hour</div>
            <div className="text-lg font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{formatNumber(Math.floor(revenuePerSecond / averagePricePerClip * 3600), 0)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">8 Hours</div>
            <div className="text-lg font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{formatNumber(Math.floor(revenuePerSecond / averagePricePerClip * 3600 * 8), 0)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">24 Hours</div>
            <div className="text-lg font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{formatNumber(Math.floor(revenuePerSecond / averagePricePerClip * 3600 * 24), 0)}</div>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
}