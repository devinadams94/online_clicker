"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";
import { Stock } from "@/types/game";

// Simple inline chart component for stock price history
const StockPriceChart = ({ stockId, stockPriceHistory, height = 10 }: { stockId: string, stockPriceHistory: Record<string, number[]>, height?: number }) => {
  let history = stockPriceHistory[stockId] || [];
  
  // Ensure there's enough data to draw a meaningful chart
  if (history.length < 2 || history.some(price => isNaN(price))) {
    // Filter out any NaN values that might cause rendering issues
    history = history.filter(price => !isNaN(price));
    
    if (history.length < 2) {
      // If no history, fake a simple chart with two points for visual appearance
      const fakeHistory = [10, 10.1]; // Slightly up trend for empty charts
      const maxPrice = 11;
      const minPrice = 9;
      const range = maxPrice - minPrice;
      
      return (
        <div className="w-full relative" style={{ height: `${height}px` }}>
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 z-10">
            Insufficient data
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={fakeHistory.map((price, index) => {
                const x = index * 50; // Space these points across the chart (0, 50)
                const normalizedPrice = 100 - ((price - minPrice) / range * 80 + 10);
                return `${x},${normalizedPrice}`;
              }).join(' ')}
              fill="none"
              stroke="#888888"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </svg>
        </div>
      );
    }
  }
  
  // Ensure we have valid min/max values
  const maxPrice = Math.max(...history);
  const minPrice = Math.min(...history);
  // Add padding to min/max values to ensure line doesn't touch edges
  const paddedMax = maxPrice * 1.05; // Add 5% padding above max
  const paddedMin = Math.max(0, minPrice * 0.95); // Add 5% padding below min, but not below zero
  // Ensure we have a range (add padding if min==max)
  const range = paddedMax === paddedMin ? paddedMax * 0.1 : paddedMax - paddedMin;
  
  return (
    <div className="w-full relative" style={{ height: `${height}px` }}>
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded"></div>
      <svg className="w-full h-full" viewBox={`0 0 100 100`} preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#444" strokeWidth="0.2" strokeDasharray="1,1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#444" strokeWidth="0.2" strokeDasharray="1,1" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#444" strokeWidth="0.2" strokeDasharray="1,1" />
        
        {/* Price line */}
        <polyline
          points={history.map((price, index) => {
            // Map x-coordinates to fill the entire width (0-100)
            const x = index * (100 / (history.length - 1));
            // Normalize price to 0-100 range with padding
            const normalizedPrice = 100 - ((price - paddedMin) / range * 80 + 10);
            return `${x},${normalizedPrice}`;
          }).join(' ')}
          fill="none"
          stroke={history[history.length - 1] >= history[0] ? "#10b981" : "#ef4444"}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

// Detailed chart modal
const StockDetailModal = ({ 
  stock: initialStock, // Renamed to initialStock as we'll track current stock internally 
  stockPriceHistory, 
  stocks,
  onClose, 
  onBuy, 
  onSell, 
  quantity, 
  money
}: { 
  stock: Stock, 
  stockPriceHistory: Record<string, number[]>, 
  stocks: Stock[], // Pass all stocks to get live updates
  onClose: () => void, 
  onBuy: () => void, 
  onSell: () => void, 
  quantity: number,
  money: number // Pass money to calculate if can afford
}) => {
  // Use state to keep track of the current stock to enable dynamic updates
  const [currentStock, setCurrentStock] = useState<Stock>(initialStock);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const stockId = initialStock.id;
  
  // Update stock data when it changes in the main list
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const updatedStock = stocks.find(s => s.id === stockId);
      if (updatedStock) {
        setCurrentStock(updatedStock);
        setLastUpdated(Date.now());
      }
    }, 500); // Update every 500ms
    
    return () => clearInterval(updateInterval);
  }, [stocks, stockId]);
  
  // Current stock portfolio (need to extract from the modal's parent props)
  const portfolio = useGameStore(state => state.stockPortfolio);
  const sellStock = useGameStore(state => state.sellStock);
  
  // Find the current holding for this stock
  const currentHolding = portfolio.find(h => h.stockId === stockId);
  const sharesOwned = currentHolding?.quantity || 0;
  
  const canBuy = money >= currentStock.price * quantity;
  const canSell = portfolio.some(h => h.stockId === stockId && h.quantity >= quantity);
  const canSellAll = sharesOwned > 0;
  
  const history = stockPriceHistory[stockId] || [];
  const priceChange = history.length > 1 
    ? ((history[history.length - 1] - history[0]) / history[0]) * 100 
    : 0;
  const priceColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500';
  
  // Calculate price statistics
  const maxPrice = history.length ? Math.max(...history) : currentStock.price;
  const minPrice = history.length ? Math.min(...history) : currentStock.price * 0.9;
  const avgPrice = history.length 
    ? history.reduce((sum, price) => sum + price, 0) / history.length 
    : currentStock.price;
  
  // Calculate profit/loss if shares are owned
  let profitLoss = 0;
  let profitLossPercent = 0;
  
  if (currentHolding) {
    const currentValue = currentStock.price * currentHolding.quantity;
    const costBasis = currentHolding.averagePurchasePrice * currentHolding.quantity;
    profitLoss = currentValue - costBasis;
    // Avoid division by zero
    profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
  }
  
  // Handle selling all shares
  const handleSellAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (sharesOwned > 0) {
      if (window.confirm(`Sell all ${sharesOwned} shares of ${currentStock.symbol}?`)) {
        sellStock(stockId, sharesOwned);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {currentStock.symbol}
                {sharesOwned > 0 && (
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-sm font-medium">
                    {sharesOwned} shares owned
                  </span>
                )}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{currentStock.name}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center mb-2">
              <span className="text-3xl font-bold flex items-center">
                ${currentStock.price.toFixed(2)}
                {/* Subtle animation when price updates */}
                <span 
                  key={lastUpdated}
                  className="ml-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 animate-ping-once"
                ></span>
              </span>
              <span className={`text-lg font-semibold ${priceColor}`}>
                {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
            
            {/* Show position information if shares are owned */}
            {sharesOwned > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm font-medium mb-1">Your Position</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Shares</div>
                    <div className="font-bold">{sharesOwned}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Avg Cost</div>
                    <div className="font-bold">${currentHolding?.averagePurchasePrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Value</div>
                    <div className="font-bold">${(currentStock.price * sharesOwned).toFixed(2)}</div>
                  </div>
                  <div className={`col-span-3 ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div>Profit/Loss</div>
                    <div className="font-bold">${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-64 mb-4">
              <StockPriceChart stockId={stockId} stockPriceHistory={stockPriceHistory} height={250} />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
                <div className="font-bold">${maxPrice.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">Low</div>
                <div className="font-bold">${minPrice.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg</div>
                <div className="font-bold">${avgPrice.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
                <div className="font-bold">{currentStock.volume.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">Volatility</div>
                <div className="font-bold">{(currentStock.volatility * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded ${canBuy ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={onBuy}
              disabled={!canBuy}
            >
              Buy {quantity} @ ${(currentStock.price * quantity).toFixed(2)}
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded ${canSell ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={onSell}
              disabled={!canSell}
            >
              Sell {quantity} @ ${(currentStock.price * quantity).toFixed(2)}
            </button>
          </div>
          
          {/* Add Sell All button if shares are owned */}
          {canSellAll && (
            <div className="mb-4">
              <button
                className="w-full py-2 px-4 rounded bg-red-800 text-white hover:bg-red-900"
                onClick={handleSellAll}
              >
                Sell All {sharesOwned} Shares @ ${(currentStock.price * sharesOwned).toFixed(2)}
              </button>
            </div>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Past performance is not indicative of future results. Trading involves risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StockMarketPanel() {
  const {
    money,
    stockMarketUnlocked,
    tradingBots,
    tradingBotCost,
    botIntelligence: rawBotIntelligence,
    botIntelligenceCost,
    botTradingBudget,
    botTradingProfit,
    botTradingLosses,
    botRiskThreshold,
    buyTradingBot,
    upgradeBotIntelligence,
    setBotTradingBudget,
    withdrawBotTradingBudget,
    setBotRiskThreshold,
    getStocks,
    buyStock,
    sellStock,
    stockPortfolio,
    stockPriceHistory,
    portfolioValue,
    calculatePortfolioValue,
    updateStockPrices,
    transactionHistory
  } = useGameStore();
  
  // Ensure botIntelligence is never undefined or zero
  const botIntelligence = rawBotIntelligence || 1;
  
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [activeTab, setActiveTab] = useState<'stocks' | 'portfolio' | 'history'>('stocks');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [detailView, setDetailView] = useState<Stock | null>(null);
  const [botBudgetInput, setBotBudgetInput] = useState<string>('100');
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('');
  
  // Track performance metrics
  const [lastPortfolioValue, setLastPortfolioValue] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);
  
  // Verify portfolio data on mount
  useEffect(() => {
    if (stockPortfolio.length > 0) {
      // Calculate initial portfolio value
      const initialValue = calculatePortfolioValue();
      
      // Set the initial value as both current and last value
      // This prevents performance metrics from showing large changes
      // the first time they're calculated
      setLastPortfolioValue(initialValue);
    }
  }, [stockPortfolio, calculatePortfolioValue]);
  
  // Refresh stock data more frequently
  useEffect(() => {
    const fetchStocks = () => {
      const currentStocks = getStocks();
      setStocks(currentStocks);
    };
    
    // Force an initial price update and fetch
    updateStockPrices();
    fetchStocks();
    
    // Refresh stocks display every 500ms
    const displayInterval = setInterval(fetchStocks, 500);
    
    // Force price updates every 8 seconds (increased from 3 seconds for more gradual changes)
    const priceUpdateInterval = setInterval(() => {
      updateStockPrices();
    }, 8000);
    
    return () => {
      clearInterval(displayInterval);
      clearInterval(priceUpdateInterval);
    };
  }, [getStocks, updateStockPrices]);
  
  // Update portfolio performance
  useEffect(() => {
    // When component mounts, set initial portfolio value
    if (lastPortfolioValue === 0 && portfolioValue > 0) {
      setLastPortfolioValue(portfolioValue);
      return;
    }
    
    // Update metrics if we have previous data
    if (lastPortfolioValue > 0 && portfolioValue > 0) {
      const change = ((portfolioValue - lastPortfolioValue) / lastPortfolioValue) * 100;
      setPercentChange(change);
      // Save current value for next comparison after calculating change
      setLastPortfolioValue(portfolioValue);
    }
  }, [portfolioValue, lastPortfolioValue]);
  
  // Force recalculation of portfolio value at regular intervals
  useEffect(() => {
    // Update portfolio value every 3 seconds
    const portfolioUpdateInterval = setInterval(() => {
      // Force portfolio value recalculation
      calculatePortfolioValue();
      
      // We don't need to set state here as the portfolioValue will update
      // and trigger the effect above
    }, 3000);
    
    return () => clearInterval(portfolioUpdateInterval);
  }, [calculatePortfolioValue, portfolioValue]);
  
  // Format price with color based on change
  const formatPrice = (price: number, previousPrice: number) => {
    const isPositive = price >= previousPrice;
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    return (
      <span className={colorClass}>
        ${price.toFixed(2)}
        <span className="ml-1 text-xs">
          {isPositive ? '▲' : '▼'} 
          {Math.abs(((price - previousPrice) / previousPrice) * 100).toFixed(1)}%
        </span>
      </span>
    );
  };
  
  // Handle buy/sell actions
  const handleBuy = (stockId: string) => {
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;
    
    const totalCost = stock.price * quantity;
    if (money < totalCost) {
      alert(`Not enough money to buy ${quantity} shares of ${stock.symbol}.`);
      return;
    }
    
    buyStock(stockId, quantity);
  };
  
  const handleSell = (stockId: string) => {
    const holding = stockPortfolio.find(h => h.stockId === stockId);
    if (!holding || holding.quantity < quantity) {
      alert(`You don't have enough shares to sell.`);
      return;
    }
    
    sellStock(stockId, quantity);
  };
  
  // Format portfolio performance text/color
  const getPerformanceColor = () => {
    if (percentChange > 0) return 'text-green-500';
    if (percentChange < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  const formatPerformance = () => {
    const sign = percentChange >= 0 ? '+' : '';
    const arrow = percentChange >= 0 ? '▲' : '▼';
    return `${arrow} ${sign}${Math.abs(percentChange).toFixed(2)}%`;
  };
  
  // Direct database update for bot intelligence
  const forceUpdateBotIntelligence = async (intelligence: number, cost: number) => {
    try {
      const response = await fetch('/api/game/force-update-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          botIntelligence: intelligence,
          botIntelligenceCost: cost
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update bot intelligence: ${response.status}`);
      }
      
      await response.json();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle bot intelligence upgrade
  const handleUpgradeBotIntelligence = async () => {
    // Force immediate save before upgrading
    if (window.saveGameNow) {
      await window.saveGameNow();
    }
    
    // Perform the upgrade
    upgradeBotIntelligence();
    
    // Verify the upgrade worked
    setTimeout(async () => {
      const gameState = useGameStore.getState();
      const currentIntelligence = gameState.botIntelligence;
      const currentCost = gameState.botIntelligenceCost;
      
      // Force save after upgrade
      if (window.saveGameNow) {
        await window.saveGameNow();
      }
      
      // Direct database update as a fallback
      await forceUpdateBotIntelligence(currentIntelligence, currentCost);
    }, 200);
  };
  
  // Handle setting bot trading budget
  const handleSetBotBudget = () => {
    const budgetAmount = Math.max(0, parseInt(botBudgetInput) || 0);
    if (budgetAmount <= 0 || budgetAmount > money) return;
    
    setBotTradingBudget(budgetAmount);
    setBotBudgetInput(''); // Clear input after setting budget
  };
  
  // Handle withdrawing from bot trading budget
  const handleWithdrawBudget = () => {
    const withdrawAmount = Math.max(0, parseInt(withdrawAmountInput) || 0);
    if (withdrawAmount <= 0 || withdrawAmount > botTradingBudget) return;
    
    withdrawBotTradingBudget(withdrawAmount);
    setWithdrawAmountInput(''); // Clear input after withdrawal
  };
  
  // Check if player can afford upgrades
  const canBuyTradingBot = money >= tradingBotCost;
  const canUpgradeBotIntelligence = money >= botIntelligenceCost;
  
  if (!stockMarketUnlocked) {
    return (
      <div className="min-h-screen p-4 relative">
        {/* Neon green background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/20" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto mt-20">
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)] flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">Stock Market</h2>
            <p className="text-center mb-4 text-green-300">The stock market is locked. Unlock it in the Upgrades panel.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="min-h-screen p-4 relative">
        {/* Neon green background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)] overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">Stock Market</h2>
              <div className="backdrop-blur-md bg-gray-800/50 px-4 py-2 rounded-lg flex items-center border border-green-400/30">
                <span className="text-sm font-medium mr-2 text-green-300">Available:</span>
                <span className="text-lg font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">${money.toFixed(2)}</span>
              </div>
            </div>
        
        {/* Portfolio Summary */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-lg p-4 mb-6 border border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-sm font-medium text-green-300">Portfolio Value</div>
              <div className="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">${portfolioValue.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-green-300">Total Profit</div>
              <div className="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">${botTradingProfit.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-red-300">Total Losses</div>
              <div className="text-xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">${botTradingLosses.toFixed(2)}</div>
            </div>
            <div className="col-span-3 mt-2 flex items-center justify-between">
              <div className="text-sm font-medium text-green-300">Performance</div>
              <div className={`text-xl font-bold flex items-center ${
                percentChange > 0 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]' : 
                percentChange < 0 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 
                'text-gray-400'
              }`}>
                {formatPerformance()}
                {/* Subtle animation when portfolio value updates */}
                <span 
                  key={portfolioValue}
                  className="ml-2 w-2 h-2 bg-green-400 rounded-full opacity-0 animate-ping-once shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                ></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trading Bots Section */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-lg p-4 mb-6 border border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <h3 className="text-lg font-bold mb-3 text-green-300">Trading Bots</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10">
              <div className="text-sm font-medium text-green-300">Bots</div>
              <div className="text-lg font-bold text-green-400">{tradingBots} Active</div>
              <div className="text-xs text-gray-400">
                <span className="text-green-400">+{tradingBots}%</span> trend accuracy<br />
                <span className="text-green-400">-{tradingBots}%</span> volatility
              </div>
              <button
                className={`mt-2 w-full py-2 text-sm font-bold rounded-lg transition-all ${canBuyTradingBot 
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(74,222,128,0.6)] hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                onClick={buyTradingBot}
                disabled={!canBuyTradingBot}
              >
                Buy Bot (${tradingBotCost.toFixed(2)})
              </button>
            </div>
            
            <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10">
              <div className="text-sm font-medium text-green-300">Intelligence</div>
              <div className="text-lg font-bold text-green-400">Level {botIntelligence}</div>
              <div className="text-xs text-gray-400">
                <span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">+{(botIntelligence * 10).toFixed(1)}%</span> trade success<br />
                <span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">+{Math.floor(Math.pow(botIntelligence, 1.5) * 10)}%</span> profit factor<br />
                <span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">+{Math.floor(Math.pow(botIntelligence, 2) * 5)}%</span> trend detection
              </div>
              <button
                className={`mt-2 w-full py-2 text-sm font-bold rounded-lg transition-all ${canUpgradeBotIntelligence 
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-[0_0_15px_rgba(250,204,21,0.6)] hover:shadow-[0_0_20px_rgba(250,204,21,0.8)]' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                onClick={handleUpgradeBotIntelligence}
                disabled={!canUpgradeBotIntelligence}
              >
                Upgrade (${botIntelligenceCost.toFixed(2)})
              </button>
            </div>
          </div>
          
          {/* Bot Trading Budget */}
          <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10 mb-2">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm font-medium text-green-300">Trading Budget</div>
                <div className="text-lg font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">${botTradingBudget.toFixed(2)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={money}
                  className="w-20 px-2 py-1 text-sm bg-gray-800 border border-green-400/30 rounded focus:border-green-400 focus:outline-none text-green-300"
                  value={botBudgetInput}
                  onChange={(e) => setBotBudgetInput(e.target.value)}
                />
                <button
                  className="px-3 py-1 text-sm font-bold bg-green-600 text-white hover:bg-green-500 rounded shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)] transition-all"
                  onClick={handleSetBotBudget}
                  disabled={parseInt(botBudgetInput) <= 0 || parseInt(botBudgetInput) > money}
                >
                  Add
                </button>
                <button
                  className="px-3 py-1 text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] transition-all"
                  onClick={() => {
                    if (money > 0) {
                      setBotTradingBudget(money);
                      setBotBudgetInput('');
                    }
                  }}
                  disabled={money <= 0}
                >
                  Invest All
                </button>
              </div>
            </div>
            
            {/* Withdraw Budget Section */}
            <div className="flex justify-between items-center mb-2 border-t pt-2 border-green-400/20">
              <div>
                <div className="text-sm font-medium text-green-300">Available Funds</div>
                <div className="text-xs text-gray-400">
                  You can withdraw up to <span className="text-yellow-400">${botTradingBudget.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={botTradingBudget}
                  className="w-20 px-2 py-1 text-sm bg-gray-800 border border-green-400/30 rounded focus:border-green-400 focus:outline-none text-green-300"
                  value={withdrawAmountInput}
                  onChange={(e) => setWithdrawAmountInput(e.target.value)}
                  placeholder="Amount"
                />
                <button
                  className="px-3 py-1 text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] transition-all"
                  onClick={handleWithdrawBudget}
                  disabled={!withdrawAmountInput || parseInt(withdrawAmountInput) <= 0 || parseInt(withdrawAmountInput) > botTradingBudget}
                >
                  Withdraw
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-400">
                Bots will automatically trade with this budget
              </div>
            </div>
          </div>
          
          {/* Trading Activity Log */}
          <div className="text-xs backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10">
            {tradingBots > 0 && botTradingBudget > 0 ? (
              <div>
                <div className="font-medium text-green-300">Bot Trading Status: <span className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">Active</span></div>
                <div className="text-gray-400">Trading {tradingBots * 600} times per minute</div>
                <div className="text-gray-400">Success rate: <span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">{Math.min(99, 80 + botIntelligence * 2).toFixed(1)}%</span></div>
                <div className="text-gray-400">Profit multiplier: <span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">{(1 + (botIntelligence * 0.5)).toFixed(1)}x</span></div>
                
                {/* Test Bot Trade Button */}
                <div className="mt-2 border-t pt-2 border-green-400/20">
                  <button
                    className="w-full px-3 py-1 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded mb-2 shadow-[0_0_10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_15px_rgba(147,51,234,0.7)] transition-all"
                    onClick={() => {
                      console.log('Button clicked!');
                      const store = useGameStore.getState();
                      console.log('Store:', store);
                      console.log('Forcing bot trade - bots:', store.tradingBots, 'budget:', store.botTradingBudget);
                      if (store.botAutoTrade) {
                        store.botAutoTrade();
                        console.log('botAutoTrade called');
                      } else {
                        console.error('botAutoTrade function not found!');
                      }
                      alert(`Bot Trade Debug:\nBots: ${store.tradingBots}\nBudget: $${store.botTradingBudget}\nTransactions: ${store.transactionHistory?.length || 0}`);
                    }}
                  >
                    Force Bot Trade (Debug)
                  </button>
                </div>
                
                {/* Risk Threshold Controls */}
                <div className="mt-2 border-t pt-2 border-green-400/20">
                  <div className="font-medium mb-1 text-green-300">Risk Threshold: <span className="text-yellow-400">{(botRiskThreshold * 100).toFixed(0)}%</span></div>
                  <div className="text-xs mb-1 text-gray-400">Higher threshold = higher profits but longer hold times</div>
                  <div className="flex space-x-2 mt-1">
                    <button 
                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${botRiskThreshold === 0.15 ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-gray-700 text-gray-400 hover:text-green-300 hover:border hover:border-green-400/30'}`}
                      onClick={() => setBotRiskThreshold(0.15)}
                    >
                      Low (15%)
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${botRiskThreshold === 0.3 ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-gray-700 text-gray-400 hover:text-green-300 hover:border hover:border-green-400/30'}`}
                      onClick={() => setBotRiskThreshold(0.3)}
                    >
                      Medium (30%)
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${botRiskThreshold === 0.5 ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-gray-700 text-gray-400 hover:text-green-300 hover:border hover:border-green-400/30'}`}
                      onClick={() => setBotRiskThreshold(0.5)}
                    >
                      High (50%)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-medium text-green-300">Bot Trading Status: <span className="text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]">Inactive</span></div>
                <div className="text-gray-400">{tradingBots === 0 ? "No trading bots available" : "No trading budget allocated"}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-green-400/30 mb-6">
          <button 
            className={`px-6 py-3 font-bold transition-all ${activeTab === 'stocks' 
              ? 'border-b-2 border-green-400 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
              : 'text-gray-400 hover:text-green-300'}`}
            onClick={() => setActiveTab('stocks')}
          >
            Stocks
          </button>
          <button 
            className={`px-6 py-3 font-bold transition-all ${activeTab === 'portfolio' 
              ? 'border-b-2 border-green-400 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
              : 'text-gray-400 hover:text-green-300'}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button 
            className={`px-6 py-3 font-bold transition-all ${activeTab === 'history' 
              ? 'border-b-2 border-green-400 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
              : 'text-gray-400 hover:text-green-300'}`}
            onClick={() => setActiveTab('history')}
          >
            History ({transactionHistory?.length || 0})
          </button>
        </div>
        
        {/* Quantity Selector */}
        <div className="mb-6 flex items-center">
          <span className="mr-3 text-sm font-medium text-green-300">Quantity:</span>
          <div className="flex">
            <button 
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-green-300 rounded-l border border-green-400/30 transition-all"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input 
              type="number" 
              className="w-16 text-center bg-gray-800 border-y border-green-400/30 text-green-300 focus:outline-none" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button 
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-green-300 rounded-r border border-green-400/30 transition-all"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        {/* Stocks Tab */}
        {activeTab === 'stocks' && (
          <div className="space-y-4">
            {stocks.map(stock => (
              <div 
                key={stock.id} 
                className={`p-4 backdrop-blur-sm bg-gray-800/50 rounded-lg cursor-pointer border transition-all ${selectedStock === stock.id 
                  ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                  : 'border-green-400/20 hover:border-green-400/40'}`}
                onClick={() => {
                  setSelectedStock(stock.id); 
                  setDetailView(stock);
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="font-bold text-green-300">{stock.symbol}</span>
                    <span className="text-sm text-gray-400 ml-2">{stock.name}</span>
                  </div>
                  <div className="font-semibold">
                    {formatPrice(stock.price, stock.previousPrice)}
                  </div>
                </div>
                
                <StockPriceChart stockId={stock.id} stockPriceHistory={stockPriceHistory} />
                
                {selectedStock === stock.id && (
                  <div className="mt-3 flex space-x-2 pt-3 border-t border-green-400/20">
                    <button 
                      className="flex-1 py-2 px-3 rounded-lg bg-green-600 text-white hover:bg-green-500 text-sm font-bold shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)] transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuy(stock.id);
                      }}
                    >
                      Buy {quantity} @ ${(stock.price * quantity).toFixed(2)}
                    </button>
                    
                    {stockPortfolio.some(h => h.stockId === stock.id) && (
                      <button 
                        className="flex-1 py-2 px-3 rounded-lg bg-red-600 text-white hover:bg-red-500 text-sm font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSell(stock.id);
                        }}
                      >
                        Sell {quantity}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <>
            {/* Add "Sell All Stocks" button at the top of portfolio view */}
            {stockPortfolio.length > 0 && (
              <div className="mb-6">
                <button 
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-500 font-bold flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.6)] hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all"
                  onClick={() => {
                    // Confirm before selling all stocks
                    if (window.confirm(`Sell ALL stocks in your portfolio? This will sell ${stockPortfolio.length} different stocks.`)) {
                      // Sell all stocks one by one
                      stockPortfolio.forEach(holding => {
                        const stock = stocks.find(s => s.id === holding.stockId);
                        if (stock) {
                          sellStock(holding.stockId, holding.quantity);
                        }
                      });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                  Sell All Stocks (${portfolioValue.toFixed(2)})
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              {stockPortfolio.length === 0 ? (
                <div className="p-8 text-center text-gray-400 backdrop-blur-sm bg-gray-800/30 rounded-lg border border-green-400/10">
                  Your portfolio is empty. Buy some stocks to get started!
                </div>
              ) : (
                stockPortfolio.map(holding => {
                const stock = stocks.find(s => s.id === holding.stockId);
                if (!stock) return null;
                
                const currentValue = stock.price * holding.quantity;
                const costBasis = holding.averagePurchasePrice * holding.quantity;
                const profit = currentValue - costBasis;
                // Avoid division by zero
                const profitPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0;
                const profitColor = profit >= 0 ? 'text-green-500' : 'text-red-500';
                
                return (
                  <div 
                    key={holding.stockId} 
                    className={`p-4 backdrop-blur-sm bg-gray-800/50 rounded-lg cursor-pointer border transition-all ${selectedStock === holding.stockId 
                      ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                      : 'border-green-400/20 hover:border-green-400/40'}`}
                    onClick={() => {
                      setSelectedStock(holding.stockId);
                      setDetailView(stock);
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="font-bold text-green-300">{stock.symbol}</span>
                        {/* Show quantity badge prominently */}
                        <span className="ml-2 bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-400/30">
                          {holding.quantity} shares
                        </span>
                        <span className="text-sm text-gray-400 ml-2">{stock.name}</span>
                      </div>
                      <div className="font-semibold">
                        {formatPrice(stock.price, stock.previousPrice)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-400">Total Value: </span>
                        <span className="font-semibold text-green-300">${currentValue.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Cost: </span>
                        <span className="font-semibold text-gray-300">${holding.averagePurchasePrice.toFixed(2)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Profit/Loss: </span>
                        <span className={`font-semibold ${
                          profit >= 0 
                            ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]' 
                            : 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                        }`}>
                          ${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    
                    <StockPriceChart stockId={holding.stockId} stockPriceHistory={stockPriceHistory} />
                    
                    <div className="mt-3 flex space-x-2 pt-3 border-t border-green-400/20">
                      <button 
                        className="flex-1 py-2 px-2 rounded-lg bg-green-600 text-white hover:bg-green-500 text-sm font-bold shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)] transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuy(holding.stockId);
                        }}
                      >
                        Buy More
                      </button>
                      <button 
                        className="flex-1 py-2 px-2 rounded-lg bg-red-600 text-white hover:bg-red-500 text-sm font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSell(holding.stockId);
                        }}
                      >
                        Sell {quantity}
                      </button>
                      <button 
                        className="flex-1 py-2 px-2 rounded-lg bg-red-800 text-white hover:bg-red-700 text-sm font-bold shadow-[0_0_10px_rgba(127,29,29,0.5)] hover:shadow-[0_0_15px_rgba(127,29,29,0.7)] transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Sell all shares of this particular stock
                          sellStock(holding.stockId, holding.quantity);
                        }}
                      >
                        Sell All ({holding.quantity})
                      </button>
                    </div>
                  </div>
                );
                })
              )}
            </div>
          </>
        )}
        
        {/* Transaction History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400 mb-4">Transaction History</h3>
            {transactionHistory && transactionHistory.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactionHistory.slice().reverse().map((transaction: any, index: number) => (
                  <div key={transaction.id || index} className="p-3 bg-gray-800/50 rounded-lg border border-green-400/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`font-bold ${transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'buy' ? 'BUY' : 'SELL'}
                        </span>
                        <span className="ml-2 text-gray-300">{transaction.stockName}</span>
                        <span className="ml-2 text-gray-400">x{transaction.quantity}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400">${transaction.total.toFixed(2)}</div>
                        {transaction.profit !== 0 && (
                          <div className={`text-sm ${transaction.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.profit > 0 ? '+' : ''}{transaction.profit.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No transactions yet. Buy or sell stocks to see history.
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
      
      {/* Detail Modal */}
      {detailView && (
        <StockDetailModal 
          stock={detailView}
          stockPriceHistory={stockPriceHistory}
          stocks={stocks}
          onClose={() => setDetailView(null)}
          onBuy={() => {
            handleBuy(detailView.id);
            // Don't close the modal after buying
          }}
          onSell={() => {
            handleSell(detailView.id);
            // Don't close the modal after selling
          }}
          quantity={quantity}
          money={money}
        />
      )}
    </>
  );
}