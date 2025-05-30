"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";
import { formatNumber, formatCurrency } from "@/utils/numberFormat";

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
  
  // Use the formatCurrency utility function instead
  const formatMoney = (value: number) => {
    return formatCurrency(value);
  };
  
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 border border-green-400/20">
      <h2 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">Paperclip Market</h2>
      
      <div className="space-y-3">
        {/* Inventory and Money + Price Control - Side by side on medium screens and up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Inventory and Money */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="backdrop-blur-sm bg-gray-800/50 p-2 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="text-xs text-green-300/70">Inventory</div>
                <div className="font-semibold text-green-400">{formatNumber(paperclips, 0)} paperclips</div>
              </div>
              <div className="backdrop-blur-sm bg-gray-800/50 p-2 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="text-xs text-green-300/70">Money</div>
                <div className="font-semibold text-yellow-500">{formatMoney(money)}</div>
              </div>
            </div>
            
            <div className="backdrop-blur-sm bg-gray-800/50 p-2 rounded-lg text-xs border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
              <div className="flex justify-between mb-1 text-green-300">
                <span>Total Clips Sold:</span>
                <span className="font-medium text-green-400">{formatNumber(paperclipsSold, 0)}</span>
              </div>
              <div className="flex justify-between text-green-300">
                <span>Total Revenue:</span>
                <span className="font-medium text-yellow-500">{formatMoney(totalSales)}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Price Control */}
          <form onSubmit={handlePriceSubmit}>
            <label className="block text-sm font-medium mb-1 text-green-300">
              Paperclip Price
            </label>
            <div className="flex">
              <div className="flex-none flex items-center px-2 bg-gray-800/50 rounded-l-md border border-green-400/30 text-green-400">
                $
              </div>
              <input
                type="number"
                value={priceInput}
                onChange={handlePriceChange}
                step="0.01"
                min="0.01"
                max="1"
                className="flex-grow text-green-400 bg-gray-800/50 border border-l-0 border-green-400/30 focus:ring-green-500 focus:border-green-500 rounded-r-md pl-2 py-1 focus:outline-none"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
            <button type="submit" className="w-full mt-2 py-1 text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg shadow-[0_0_10px_rgba(74,222,128,0.4)] hover:shadow-[0_0_15px_rgba(74,222,128,0.6)] transition-all duration-300">
              Set Price
            </button>
          </form>
        </div>
        
        {/* Market Stats - Condensed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left column - Basic stats */}
          <div>
            <h3 className="font-semibold text-sm mb-1 text-green-400">Market Stats</h3>
            <div className="space-y-1 text-xs text-green-300">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="font-medium text-green-400">{formatMoney(paperclipPrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span className="font-medium text-green-400">
                  {formatMoney(basePaperclipPrice)}
                  <span className="text-xs ml-1 text-green-300/60">
                    ({paperclipPrice > basePaperclipPrice 
                      ? `+${((paperclipPrice / basePaperclipPrice - 1) * 100).toFixed(0)}% markup` 
                      : `${((paperclipPrice / basePaperclipPrice - 1) * 100).toFixed(0)}% discount`})
                  </span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Current Demand:</span>
                <div className="flex items-center">
                  <span className={`font-medium ${marketDemand === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatNumber(Math.round(marketDemand), 0)} clips/sec
                  </span>
                  {paperclipPrice >= 1 && marketDemand > 0 ? (
                    <span className="ml-1 text-xs text-emerald-400">
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
            <div className="backdrop-blur-sm bg-blue-900/20 p-2 rounded-lg text-xs border border-blue-400/30">
              {paperclipPrice < basePaperclipPrice * 0.5 ? (
                <span className="text-blue-300">
                  <strong>High Volume:</strong> Max demand, lower profit per clip.
                </span>
              ) : paperclipPrice < basePaperclipPrice ? (
                <span className="text-blue-300">
                  <strong>Discount:</strong> High demand with reasonable profit.
                </span>
              ) : paperclipPrice <= basePaperclipPrice * 1.5 ? (
                <span className="text-green-400">
                  <strong>Optimal:</strong> Good price/demand balance. Max profit.
                </span>
              ) : paperclipPrice < 0.75 ? (
                <span className="text-teal-300">
                  <strong>Premium:</strong> Lower volume, higher profit per unit.
                </span>
              ) : paperclipPrice < 1.0 ? (
                <span className="text-yellow-300">
                  <strong>Luxury:</strong> Very low demand, maximum profit per clip.
                </span>
              ) : paperclipPrice === 1.0 ? (
                <span className="text-red-400">
                  <strong>Maximum Price:</strong> {
                    marketDemandLevel >= 20 ? "Mass production unlocked!" : 
                    marketDemandLevel >= 15 ? "Large-scale sales (1000/sec)" :
                    marketDemandLevel >= 10 ? "Medium-scale sales (100/sec)" :
                    marketDemandLevel >= 5 ? "Limited sales (1/sec)" :
                    "Need market level 5+ to enable sales."
                  }
                </span>
              ) : (
                <span className="text-gray-400">
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