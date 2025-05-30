/**
 * Enhanced Trading Bot Algorithm
 * 
 * This file contains the advanced trading bot algorithms that can be used
 * to replace the existing trading logic in gameStore.ts.
 * 
 * The algorithms include:
 * 1. Advanced buy signal detection with multi-timeframe analysis
 * 2. Sophisticated sell decision making with peak detection
 * 3. Smart loss management strategies
 * 4. Intelligence-based trading frequency adjustments
 */

// Type definitions removed for JS file

/**
 * Calculates market opportunity score for determining when to trade
 * @param {Object} state - The current game state
 * @param {Array} stocks - Available stocks
 * @param {Number} botIntelligence - Intelligence level of the bot
 * @returns {Number} - Opportunity score (higher = better time to trade)
 */
export function calculateMarketOpportunityScore(state, stocks, botIntelligence) {
  let marketOpportunityScore = 1.0;
  
  if (stocks.length > 0) {
    let goodOpportunityCount = 0;
    
    stocks.forEach((stock) => {
      const history = state.stockPriceHistory[stock.id] || [];
      if (history.length >= 5) {
        const recentAverage = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
        // Price at least 3% below average is a good opportunity
        if (stock.price < recentAverage * 0.97) {
          goodOpportunityCount++;
        }
      }
    });
    
    // Increase opportunity score if there are good opportunities
    if (goodOpportunityCount > 0) {
      const opportunityRatio = goodOpportunityCount / stocks.length;
      marketOpportunityScore += opportunityRatio * 2.0;
      
      // High intelligence bots can detect these opportunities better
      if (botIntelligence >= 5) {
        marketOpportunityScore *= (1 + (botIntelligence * 0.05));
      }
    }
  }
  
  return marketOpportunityScore;
}

/**
 * Analyzes stock histories to identify buying opportunities
 * @param {Object} state - The current game state
 * @param {Array} stocks - Available stocks
 * @param {Number} botIntelligence - Intelligence level of the bot
 * @returns {Array} - Stocks with buying opportunities
 */
export function identifyBuyingOpportunities(state, stocks, botIntelligence) {
  return stocks.filter((stock) => {
    // Get price history for this stock
    const history = state.stockPriceHistory[stock.id] || [];
    
    // Skip stocks with insufficient history
    if (history.length < 3) {
      return false;
    }
    
    // Calculate multiple timeframe moving averages for better trend analysis
    const shortMA = history.slice(-3).reduce((sum, price) => sum + price, 0) / 3;
    
    // Use medium MA if we have enough history
    let mediumMA = shortMA;
    if (history.length >= 5) {
      mediumMA = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
    }
    
    // Use long MA if we have enough history
    let longMA = mediumMA;
    if (history.length >= 10) {
      longMA = history.slice(-10).reduce((sum, price) => sum + price, 0) / 10;
    }
    
    // Multi-factor opportunity scoring system
    let buySignalStrength = 0;
    
    // Factor 1: Current price relative to short-term MA
    const shortMADrop = (stock.price / shortMA) - 1;
    if (shortMADrop < -0.03) { // 3% below short MA (more selective)
      buySignalStrength += 1;
    }
    
    // Factor 2: Current price relative to medium-term MA (stronger signal)
    if (history.length >= 5) {
      const mediumMADrop = (stock.price / mediumMA) - 1;
      if (mediumMADrop < -0.05) { // 5% below medium MA (more selective)
        buySignalStrength += 2;
      }
    }
    
    // Factor 3: Current price relative to long-term MA (strongest signal)
    if (history.length >= 10) {
      const longMADrop = (stock.price / longMA) - 1;
      if (longMADrop < -0.07) { // 7% below long MA (more selective)
        buySignalStrength += 3;
      }
    }
    
    // Factor 4: Trend pattern recognition (for higher intelligence bots)
    if (botIntelligence >= 4 && history.length >= 6) {
      // Detect potential reversal patterns (price declined then stabilized)
      const recent3Avg = history.slice(-3).reduce((sum, price) => sum + price, 0) / 3;
      const previous3Avg = history.slice(-6, -3).reduce((sum, price) => sum + price, 0) / 3;
      
      // Previous decline followed by stabilization indicates potential bottom
      if (previous3Avg > recent3Avg * 1.04 && 
          Math.abs(stock.price / recent3Avg - 1) < 0.02) {
        buySignalStrength += 2;
      }
    }
    
    // Factor 5: Trend analysis for high intelligence bots
    if (botIntelligence >= 7 && stock.trendDirection !== 0) {
      // For downtrends that might be ending soon (buying opportunity)
      if (stock.trendDirection < 0) {
        const trendTimeRemaining = 1 - (stock.trendDuration / (5 * 60 * 1000));
        // Downtrend near exhaustion (less than 30% remaining)
        if (trendTimeRemaining < 0.3) {
          buySignalStrength += 3;
        }
      }
    }
    
    // Calculate required signal strength based on bot intelligence
    // Lower intelligence bots need stronger signals to buy
    // Increased required strength to make bots more selective
    const requiredSignalStrength = Math.max(2, Math.ceil(5 - (botIntelligence * 0.4)));
    
    // Return true if buy signals are strong enough
    return buySignalStrength >= requiredSignalStrength;
  });
}

/**
 * Determines the sell percentage for a given stock
 * @param {Object} stock - The stock to analyze
 * @param {Number} stockPrice - Current stock price
 * @param {Number} avgPurchasePrice - Average purchase price
 * @param {Boolean} inProfit - Whether the position is in profit
 * @param {Number} profitPercentage - Profit percentage (as decimal, e.g., 0.1 = 10%)
 * @param {Number} riskThreshold - Risk threshold for selling
 * @param {Array} history - Price history array
 * @param {Number} botIntelligence - Intelligence level of the bot
 * @returns {Number} - Percentage to sell (0-1)
 */
export function calculateSellPercentage(stock, stockPrice, avgPurchasePrice, inProfit, profitPercentage, riskThreshold, history, botIntelligence) {
  // Default to not selling
  let sellPercentage = 0;
  
  if (inProfit) {
    // Only consider selling if price is above purchase price
    
    // Calculate multiple time frame moving averages for advanced trend analysis
    let shortTermMA = 0;
    let mediumTermMA = 0;
    let longTermMA = 0;
    let isPriceAtPeak = false;
    let isPriceNearPeak = false;
    let isUptrendExhausting = false;
    
    if (history.length >= 10) {
      // Calculate multiple timeframe moving averages
      shortTermMA = history.slice(-3).reduce((sum, price) => sum + price, 0) / 3;
      mediumTermMA = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
      longTermMA = history.slice(-10).reduce((sum, price) => sum + price, 0) / 10;
      
      // Advanced peak detection - current price above short MA, which is above medium MA, which is above long MA
      // This identifies a clear uptrend with potential reversal point
      isPriceAtPeak = stockPrice > shortTermMA * 1.02 && shortTermMA > mediumTermMA && mediumTermMA > longTermMA;
      
      // Near-peak detection - price starting to roll over from peak
      isPriceNearPeak = stockPrice < shortTermMA * 1.01 && stockPrice > shortTermMA * 0.99 && 
                        shortTermMA > mediumTermMA * 1.03;
      
      // Detect uptrend exhaustion - rate of price increase is slowing
      if (history.length >= 15) {
        const recentGainRate = (shortTermMA / mediumTermMA) - 1;
        const previousGainRate = (mediumTermMA / longTermMA) - 1;
        isUptrendExhausting = recentGainRate < previousGainRate * 0.7 && recentGainRate > 0;
      }
    } else if (history.length >= 5) {
      // Simpler analysis for limited history
      shortTermMA = history.slice(-3).reduce((sum, price) => sum + price, 0) / 3;
      mediumTermMA = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
      isPriceAtPeak = stockPrice > mediumTermMA * 1.02;
      isPriceNearPeak = stockPrice < shortTermMA * 1.01 && stockPrice > shortTermMA * 0.99;
    }
    
    // Intelligence-based analysis bonus - smarter bots are better at detecting peaks
    const detectionBonus = Math.min(1, botIntelligence / 8); // Max out at intelligence 8
    
    // Advanced trading logic that scales with bot intelligence
    if (isPriceAtPeak && profitPercentage >= riskThreshold * 1.2) {
      // Clear peak with good profit - excellent time to sell
      sellPercentage = 0.8;
    } else if (isPriceNearPeak && profitPercentage >= riskThreshold * 1.5 && detectionBonus > 0.6) {
      // High intelligence bots can detect we might be just past the peak
      sellPercentage = 0.6;
    } else if (isUptrendExhausting && profitPercentage >= riskThreshold * 1.3 && detectionBonus > 0.8) {
      // Very high intelligence bots can detect uptrend exhaustion
      sellPercentage = 0.5;
    } else if (profitPercentage >= riskThreshold * 2.5) {
      // Exceptionally high profit - sell most but not all
      sellPercentage = 0.9;
    } else if (profitPercentage >= riskThreshold * 2.0) {
      // Very high profit - sell a good portion
      sellPercentage = 0.7;
    } else if (profitPercentage >= riskThreshold * 1.5) {
      // Good profit - sell some if near peak
      sellPercentage = isPriceNearPeak ? 0.4 : 0.2;
    } else if (isPriceAtPeak && profitPercentage >= riskThreshold) {
      // Price is clearly peaking with decent profit
      sellPercentage = 0.3;
    }
  } else {
    // Advanced loss mitigation strategy that scales with intelligence
    
    // Calculate trend strength and acceleration for better loss management
    let trendStrength = 0;
    let trendAccelerating = false;
    
    if (history.length >= 8) {
      // Calculate recent price changes
      const recent3 = history.slice(-3);
      const previous3 = history.slice(-6, -3);
      
      if (recent3.length >= 3 && previous3.length >= 3) {
        // Calculate average price movement
        const recentAvgChange = (recent3[2] - recent3[0]) / recent3[0];
        const previousAvgChange = (previous3[2] - previous3[0]) / previous3[0];
        
        // Determine if negative trend is strengthening
        trendStrength = Math.abs(recentAvgChange);
        trendAccelerating = recentAvgChange < 0 && recentAvgChange < previousAvgChange;
      }
    }
    
    // More sophisticated loss management based on trend analysis and bot intelligence
    const lossPercentage = Math.abs(profitPercentage); // Convert negative profit to positive loss
    
    if (stock.trendDirection < 0 && stock.trendStrength > 0.8 && lossPercentage > 0.15) {
      // Strong confirmed downtrend with significant loss - cut losses
      sellPercentage = 0.3;
    } else if (trendAccelerating && trendStrength > 0.05 && botIntelligence >= 6 && lossPercentage > 0.12) {
      // High intelligence bots can detect accelerating downtrends early
      sellPercentage = 0.2;
    } else if (stock.trendDirection < 0 && stock.trendStrength > 0.5 && lossPercentage > 0.20) {
      // Moderate downtrend with large loss - cut some losses
      sellPercentage = 0.15;
    } else {
      // No clear negative trend or loss is still small - hold and wait for recovery
      sellPercentage = 0;
    }
  }
  
  return sellPercentage;
}

/**
 * Calculates trading probability based on bot intelligence and market conditions
 * @param {Number} botIntelligence - Intelligence level of the bot
 * @param {Number} marketVolatility - Market volatility (0-1)
 * @param {Number} marketOpportunityScore - Market opportunity score
 * @returns {Number} - Probability of trading (0-1)
 */
export function calculateTradingProbability(botIntelligence, marketVolatility, marketOpportunityScore) {
  // Base chance is 10% per tick (increased from 2% for testing)
  // Lower intelligence bots trade more frequently but less effectively
  // Higher intelligence bots are more selective but make better trades
  const baseTradeProbability = 0.10 * (1 / Math.sqrt(botIntelligence));
  
  // Adjust probability based on market conditions and opportunity score
  // More volatile markets and better opportunities increase trading frequency
  // Ensure minimum probability of 5% for testing
  const calculatedProbability = baseTradeProbability * (1 + (marketVolatility * 2)) * marketOpportunityScore;
  return Math.max(0.05, calculatedProbability);
}

/**
 * Determines the risk threshold based on risk level
 * @param {String} riskLevel - "low", "medium", or "high"
 * @returns {Number} - Risk threshold as a decimal (0-1)
 */
export function getRiskThreshold(riskLevel) {
  switch(riskLevel.toLowerCase()) {
    case 'low':
      return 0.10; // 10% for low risk (more conservative)
    case 'medium':
      return 0.20; // 20% for medium risk (more conservative)
    case 'high':
      return 0.30; // 30% for high risk (more conservative)
    default:
      return 0.15; // Default (more conservative)
  }
}

/**
 * Selects multiple stocks to buy based on buying opportunities
 * @param {Array} stocks - Available stocks
 * @param {Array} buyingOpportunities - Stocks identified as buying opportunities
 * @param {Number} budget - Available budget
 * @param {Number} botIntelligence - Intelligence level of the bot
 * @returns {Array} - Array of stock objects to buy with quantities
 */
export function selectStocksToBuy(stocks, buyingOpportunities, budget, botIntelligence) {
  if (buyingOpportunities.length === 0 || budget <= 0) {
    return [];
  }
  
  // Determine how many different stocks to buy based on intelligence
  // Higher intelligence = more diversification
  const maxStocksToBuy = Math.min(
    buyingOpportunities.length,
    Math.max(1, Math.ceil(botIntelligence / 2))
  );
  
  // Allocate budget across stocks
  const baseAllocation = budget / maxStocksToBuy;
  
  // Select stocks and determine quantities
  const selectedStocks = [];
  let remainingBudget = budget;
  
  // Sort opportunities by quality (better buying opportunities first)
  const sortedOpportunities = [...buyingOpportunities].sort((a, b) => {
    // Calculate opportunity quality based on price drop from average
    const aHistory = a.priceHistory || [];
    const bHistory = b.priceHistory || [];
    
    let aQuality = 0;
    let bQuality = 0;
    
    if (aHistory.length >= 5) {
      const aAvg = aHistory.slice(-5).reduce((sum, p) => sum + p, 0) / 5;
      aQuality = (aAvg / a.price) - 1; // Higher value = better opportunity
    }
    
    if (bHistory.length >= 5) {
      const bAvg = bHistory.slice(-5).reduce((sum, p) => sum + p, 0) / 5;
      bQuality = (bAvg / b.price) - 1; // Higher value = better opportunity
    }
    
    return bQuality - aQuality; // Sort by quality (higher first)
  });
  
  // Pick top N stocks based on intelligence
  for (let i = 0; i < maxStocksToBuy && remainingBudget > 0; i++) {
    const stock = sortedOpportunities[i];
    
    // Skip if stock is too expensive
    if (stock.price > remainingBudget) {
      continue;
    }
    
    // Calculate allocation for this stock (weighted by position in the list)
    // First stocks get more budget
    const allocationWeight = 1 - (i / (2 * maxStocksToBuy));
    const allocation = baseAllocation * allocationWeight;
    
    // Calculate quantity to buy
    const quantity = Math.max(1, Math.floor(Math.min(
      allocation / stock.price,
      remainingBudget / stock.price
    )));
    
    // Skip if we can't afford at least one share
    if (quantity < 1) {
      continue;
    }
    
    // Calculate actual cost
    const cost = quantity * stock.price;
    
    // Add to selected stocks
    selectedStocks.push({
      stock: stock,
      quantity: quantity,
      cost: cost
    });
    
    // Update remaining budget
    remainingBudget -= cost;
  }
  
  return selectedStocks;
}