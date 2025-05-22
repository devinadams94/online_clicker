"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";

export default function MarketPanel() {
  const { 
    paperclips,
    money,
    paperclipPrice,
    marketDemand,
    paperclipsSold,
    totalSales,
    setClipPrice,
    basePaperclipPrice,
    marketDemandLevel
  } = useGameStore();
  
  const [priceInput, setPriceInput] = useState(paperclipPrice.toString());
  const [errorMessage, setErrorMessage] = useState("");
  
  // Update price input when store price changes
  useEffect(() => {
    setPriceInput(paperclipPrice.toFixed(2));
  }, [paperclipPrice]);
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInput(e.target.value);
  };
  
  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newPrice = parseFloat(priceInput);
      
      if (isNaN(newPrice)) {
        setErrorMessage("Please enter a valid number");
        return;
      }
      
      if (newPrice <= 0) {
        setErrorMessage("Price must be greater than 0");
        return;
      }
      
      if (newPrice > 1) {
        setErrorMessage("Price cannot exceed $1");
        return;
      }
      
      setClipPrice(newPrice);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Invalid price");
    }
  };
  
  // Format money with 2 decimal places
  const formatMoney = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3">Paperclip Market</h2>
      
      <div className="space-y-3">
        {/* Inventory and Money + Price Control - Side by side on medium screens and up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Inventory and Money */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-600 dark:text-gray-400">Inventory</div>
                <div className="font-semibold">{Math.floor(paperclips)} paperclips</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-600 dark:text-gray-400">Money</div>
                <div className="font-semibold">{formatMoney(money)}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between mb-1">
                <span>Total Clips Sold:</span>
                <span className="font-medium">{Math.floor(paperclipsSold)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-medium">{formatMoney(totalSales)}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Price Control */}
          <form onSubmit={handlePriceSubmit}>
            <label className="block text-sm font-medium mb-1">
              Paperclip Price
            </label>
            <div className="flex">
              <div className="flex-none flex items-center px-2 bg-gray-200 dark:bg-gray-700 rounded-l-md border border-r-0 border-gray-300">
                $
              </div>
              <input
                type="number"
                value={priceInput}
                onChange={handlePriceChange}
                step="0.01"
                min="0.01"
                max="1"
                className="flex-grow text-green-600 dark:text-green-400 border border-gray-300 focus:ring-primary-500 focus:border-primary-500 rounded-r-md pl-2 py-1"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
            <button type="submit" className="btn-primary w-full mt-2 py-1 text-sm">
              Set Price
            </button>
          </form>
        </div>
        
        {/* Market Stats - Condensed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left column - Basic stats */}
          <div>
            <h3 className="font-semibold text-sm mb-1">Market Stats</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="font-medium">{formatMoney(paperclipPrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span className="font-medium">
                  {formatMoney(basePaperclipPrice)}
                  <span className="text-xs ml-1 text-gray-500">
                    ({paperclipPrice > basePaperclipPrice 
                      ? `+${((paperclipPrice / basePaperclipPrice - 1) * 100).toFixed(0)}% markup` 
                      : `${((paperclipPrice / basePaperclipPrice - 1) * 100).toFixed(0)}% discount`})
                  </span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Current Demand:</span>
                <div className="flex items-center">
                  <span className={`font-medium ${marketDemand === 0 ? 'text-red-500' : ''}`}>
                    {Math.round(marketDemand)} clips/sec
                  </span>
                  {paperclipPrice >= 1 && marketDemand > 0 ? (
                    <span className="ml-1 text-xs text-green-500">
                      (Lvl {marketDemandLevel})
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Pricing strategy */}
          <div>
            {/* Price-demand relationship hint */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
              {paperclipPrice < basePaperclipPrice * 0.5 ? (
                <span className="text-blue-700 dark:text-blue-300">
                  <strong>High Volume:</strong> Max demand, lower profit per clip.
                </span>
              ) : paperclipPrice < basePaperclipPrice ? (
                <span className="text-blue-700 dark:text-blue-300">
                  <strong>Discount:</strong> High demand with reasonable profit.
                </span>
              ) : paperclipPrice <= basePaperclipPrice * 1.5 ? (
                <span className="text-green-700 dark:text-green-300">
                  <strong>Optimal:</strong> Good price/demand balance. Max profit.
                </span>
              ) : paperclipPrice < 0.75 ? (
                <span className="text-teal-700 dark:text-teal-300">
                  <strong>Premium:</strong> Lower volume, higher profit per unit.
                </span>
              ) : paperclipPrice < 1.0 ? (
                <span className="text-yellow-700 dark:text-yellow-300">
                  <strong>Luxury:</strong> Very low demand, maximum profit per clip.
                </span>
              ) : paperclipPrice === 1.0 ? (
                <span className="text-red-700 dark:text-red-300">
                  <strong>Maximum Price:</strong> {
                    marketDemandLevel >= 20 ? "Mass production unlocked!" : 
                    marketDemandLevel >= 15 ? "Large-scale sales (1000/sec)" :
                    marketDemandLevel >= 10 ? "Medium-scale sales (100/sec)" :
                    marketDemandLevel >= 5 ? "Limited sales (1/sec)" :
                    "Need market level 5+ to enable sales."
                  }
                </span>
              ) : (
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Invalid:</strong> No demand at prices above $1.00.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}