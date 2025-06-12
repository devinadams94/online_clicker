"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";
import { formatNumber } from "@/utils/numberFormat";

export default function SpaceMarketPanel() {
  const {
    spacePaperclipPrice,
    spaceAerogradePrice,
    spaceOrePrice,
    spaceWirePrice,
    spaceMarketDemand,
    spaceMarketMaxDemand,
    spaceMarketMinDemand,
    spacePaperclipsSold,
    spaceAerogradeSold,
    spaceOreSold,
    spaceWireSold,
    spaceTotalSales,
    spaceMarketTrend,
    spaceMarketVolatility,
    paperclips,
    aerogradePaperclips,
    spaceOre,
    spaceWire,
    money,
    sellSpacePaperclips,
    sellSpaceAerograde,
    sellSpaceOre,
    sellSpaceWire,
    spaceAutoSellEnabled,
    spaceAutoSellUnlocked,
    spaceSmartPricingEnabled,
    spaceSmartPricingUnlocked,
    unlockSpaceAutoSell,
    toggleSpaceAutoSell,
    unlockSpaceSmartPricing,
    toggleSpaceSmartPricing,
    yomi
  } = useGameStore();

  const [sellAmounts, setSellAmounts] = useState({
    paperclips: 1,
    aerograde: 1,
    ore: 1,
    wire: 1
  });

  // Update input constraints when resources change
  useEffect(() => {
    setSellAmounts(prev => ({
      paperclips: Math.min(prev.paperclips, Math.floor(paperclips)),
      aerograde: Math.min(prev.aerograde, Math.floor(aerogradePaperclips || 0)),
      ore: Math.min(prev.ore, Math.floor(spaceOre || 0)),
      wire: Math.min(prev.wire, Math.floor(spaceWire || 0))
    }));
  }, [paperclips, aerogradePaperclips, spaceOre, spaceWire]);

  const handleSellPaperclips = () => {
    if (sellAmounts.paperclips > 0 && paperclips >= sellAmounts.paperclips) {
      sellSpacePaperclips(sellAmounts.paperclips);
    }
  };

  const handleSellAerograde = () => {
    if (sellAmounts.aerograde > 0 && (aerogradePaperclips || 0) >= sellAmounts.aerograde) {
      sellSpaceAerograde(sellAmounts.aerograde);
    }
  };

  const handleSellOre = () => {
    if (sellAmounts.ore > 0 && (spaceOre || 0) >= sellAmounts.ore) {
      sellSpaceOre(sellAmounts.ore);
    }
  };

  const handleSellWire = () => {
    if (sellAmounts.wire > 0 && (spaceWire || 0) >= sellAmounts.wire) {
      sellSpaceWire(sellAmounts.wire);
    }
  };

  const handleInputChange = (resource: string, value: string) => {
    const numValue = parseInt(value) || 0;
    let maxValue = 0;
    
    switch (resource) {
      case 'paperclips':
        maxValue = Math.floor(paperclips);
        break;
      case 'aerograde':
        maxValue = Math.floor(aerogradePaperclips || 0);
        break;
      case 'ore':
        maxValue = Math.floor(spaceOre || 0);
        break;
      case 'wire':
        maxValue = Math.floor(spaceWire || 0);
        break;
    }
    
    setSellAmounts(prev => ({
      ...prev,
      [resource]: Math.max(0, Math.min(numValue, maxValue))
    }));
  };

  const demandPercentage = ((spaceMarketDemand - spaceMarketMinDemand) / (spaceMarketMaxDemand - spaceMarketMinDemand)) * 100;
  const trendDirection = spaceMarketTrend > 0 ? '↑' : spaceMarketTrend < 0 ? '↓' : '→';
  const trendColor = spaceMarketTrend > 0 ? 'text-green-400' : spaceMarketTrend < 0 ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">🛸</span> Space Market
      </h2>
      
      {/* Market Overview */}
      <div className="bg-gray-700 p-3 rounded mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Market Demand</div>
            <div className="text-xl font-bold">{Math.floor(spaceMarketDemand)}</div>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${demandPercentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Market Trend</div>
            <div className={`text-xl font-bold ${trendColor}`}>
              {trendDirection} {Math.abs(spaceMarketTrend * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">
              Volatility: {(spaceMarketVolatility * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm">
            <span>Total Revenue</span>
            <span className="text-green-400">${formatNumber(spaceTotalSales, 2)}</span>
          </div>
        </div>
      </div>

      {/* Resource Trading */}
      <div className="space-y-3">
        {/* Paperclips */}
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">📎 Paperclips</span>
            <span className="text-green-400">${spacePaperclipPrice.toFixed(2)}/unit</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={sellAmounts.paperclips}
              onChange={(e) => handleInputChange('paperclips', e.target.value)}
              className="w-24 px-2 py-1 bg-gray-600 text-white rounded"
              min="1"
              max={Math.floor(paperclips)}
            />
            <button
              onClick={handleSellPaperclips}
              disabled={paperclips < sellAmounts.paperclips || sellAmounts.paperclips <= 0}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
            >
              Sell
            </button>
            <span className="text-sm text-gray-400">
              Available: {formatNumber(Math.floor(paperclips))}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total sold: {formatNumber(spacePaperclipsSold)}
          </div>
        </div>

        {/* Aerograde Paperclips */}
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">✈️ Aerograde Paperclips</span>
            <span className="text-green-400">${spaceAerogradePrice.toFixed(2)}/unit</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={sellAmounts.aerograde}
              onChange={(e) => handleInputChange('aerograde', e.target.value)}
              className="w-24 px-2 py-1 bg-gray-600 text-white rounded"
              min="1"
              max={Math.floor(aerogradePaperclips || 0)}
            />
            <button
              onClick={handleSellAerograde}
              disabled={(aerogradePaperclips || 0) < sellAmounts.aerograde || sellAmounts.aerograde <= 0}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
            >
              Sell
            </button>
            <span className="text-sm text-gray-400">
              Available: {formatNumber(Math.floor(aerogradePaperclips || 0))}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total sold: {formatNumber(spaceAerogradeSold)}
          </div>
        </div>

        {/* Ore */}
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">⛏️ Ore</span>
            <span className="text-green-400">${spaceOrePrice.toFixed(2)}/unit</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={sellAmounts.ore}
              onChange={(e) => handleInputChange('ore', e.target.value)}
              className="w-24 px-2 py-1 bg-gray-600 text-white rounded"
              min="1"
              max={Math.floor(spaceOre || 0)}
            />
            <button
              onClick={handleSellOre}
              disabled={(spaceOre || 0) < sellAmounts.ore || sellAmounts.ore <= 0}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
            >
              Sell
            </button>
            <span className="text-sm text-gray-400">
              Available: {formatNumber(Math.floor(spaceOre || 0))}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total sold: {formatNumber(spaceOreSold)}
          </div>
        </div>

        {/* Wire */}
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">🧵 Wire</span>
            <span className="text-green-400">${spaceWirePrice.toFixed(2)}/unit</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={sellAmounts.wire}
              onChange={(e) => handleInputChange('wire', e.target.value)}
              className="w-24 px-2 py-1 bg-gray-600 text-white rounded"
              min="1"
              max={Math.floor(spaceWire || 0)}
            />
            <button
              onClick={handleSellWire}
              disabled={(spaceWire || 0) < sellAmounts.wire || sellAmounts.wire <= 0}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
            >
              Sell
            </button>
            <span className="text-sm text-gray-400">
              Available: {formatNumber(Math.floor(spaceWire || 0))}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total sold: {formatNumber(spaceWireSold)}
          </div>
        </div>
      </div>

      {/* Auto-Sell Controls */}
      <div className="mt-4 bg-gray-700 p-3 rounded">
        <h3 className="font-semibold mb-2">🤖 Auto-Sell System</h3>
        
        {!spaceAutoSellUnlocked ? (
          <button
            onClick={unlockSpaceAutoSell}
            disabled={(aerogradePaperclips || 0) < 100000}
            className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
          >
            Unlock Auto-Sell - 100K Aerograde
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-Sell Resources</span>
              <button
                onClick={toggleSpaceAutoSell}
                className={`px-3 py-1 rounded text-sm ${
                  spaceAutoSellEnabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {spaceAutoSellEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            
            {!spaceSmartPricingUnlocked ? (
              <button
                onClick={unlockSpaceSmartPricing}
                disabled={(yomi || 0) < 10000}
                className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
              >
                Unlock Smart Pricing - 10K Yomi
              </button>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm">Smart Pricing (Sell at Best Prices)</span>
                <button
                  onClick={toggleSpaceSmartPricing}
                  className={`px-3 py-1 rounded text-sm ${
                    spaceSmartPricingEnabled
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {spaceSmartPricingEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            )}
            
            {spaceAutoSellEnabled && (
              <div className="text-xs text-gray-400 mt-2">
                {spaceSmartPricingEnabled 
                  ? "Auto-selling when prices are 10%+ above average"
                  : "Auto-selling 10% of resources per tick"}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}