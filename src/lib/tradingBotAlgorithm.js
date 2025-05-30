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
  // Start with a higher base score for better performance
  let marketOpportunityScore = 1.2;
  
  if (stocks.length > 0) {
    let goodOpportunityCount = 0;
    let strongOpportunityCount = 0;
    
    stocks.forEach((stock) => {
      const history = state.stockPriceHistory[stock.id] || [];
      
      // More sophisticated opportunity detection
      if (history.length >= 5) {
        const recentAverage = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
        
        // Price at least 2% below average is a good opportunity (lowered threshold)
        if (stock.price < recentAverage * 0.98) {
          goodOpportunityCount++;
          
          // Strong opportunity if price is 4%+ below average
          if (stock.price < recentAverage * 0.96) {
            strongOpportunityCount++;
          }
        }
        
        // Advanced pattern detection for higher intelligence bots
        if (botIntelligence >= 3 && history.length >= 8) {
          // Detect rebounding patterns (downtrend followed by uptick)
          const recent3 = history.slice(-3);
          const previous3 = history.slice(-6, -3);
          
          if (recent3.length >= 3 && previous3.length >= 3) {
            const recentTrend = (recent3[2] - recent3[0]) / recent3[0];
            const previousTrend = (previous3[2] - previous3[0]) / previous3[0];
            
            // Previous downtrend followed by uptick indicates potential rebound
            if (previousTrend < -0.02 && recentTrend > 0) {
              goodOpportunityCount++;
              // Count as strong opportunity for higher intelligence bots
              if (botIntelligence >= 6) {
                strongOpportunityCount++;
              }
            }
          }
        }
      }
    });
    
    // Enhance opportunity score based on detected opportunities
    if (goodOpportunityCount > 0) {
      const opportunityRatio = goodOpportunityCount / stocks.length;
      // Increased multiplier from 2.0 to 2.5
      marketOpportunityScore += opportunityRatio * 2.5;
      
      // Add bonus for strong opportunities
      if (strongOpportunityCount > 0) {
        const strongRatio = strongOpportunityCount / stocks.length;
        marketOpportunityScore += strongRatio * 3.0;
      }
      
      // Intelligence scaling starts at level 2 instead of 5
      // Increased multiplier from 0.05 to 0.08
      marketOpportunityScore *= (1 + (botIntelligence * 0.08));
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
  
  // NEW: Completely liquidate position if profit reaches risk threshold exactly
  // This triggers a full sell when profit exactly matches the configured risk threshold
  if (inProfit && Math.abs(profitPercentage - riskThreshold) < 0.01) {
    return 1.0; // Sell 100% of holdings
  }
  
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
    // Enhanced detection scaling - maxes out at intelligence 6 instead of 8
    const detectionBonus = Math.min(1, botIntelligence / 6); 
    
    // Advanced trading logic with enhanced intelligence scaling
    
    // NEW: Increase sell percentages and lower thresholds to make bots sell more frequently
    if (isPriceAtPeak && profitPercentage >= riskThreshold * 0.8) { // Lowered threshold from 1.0 to 0.8
      // Clear peak with minimum profit - excellent time to sell
      // Base sell percentage with intelligence scaling - increased from 0.7 to 0.85
      sellPercentage = 0.85 + (detectionBonus * 0.15); // 85-100% based on intelligence
    } else if (isPriceNearPeak && profitPercentage >= riskThreshold) { // Lowered threshold from 1.2 to 1.0
      // Near peak detection with intelligence scaling
      // Lower intelligence requirement (was 0.6)
      if (detectionBonus > 0.4) {
        // Increased from 0.5 to 0.7
        sellPercentage = 0.7 + (detectionBonus * 0.3); // 70-100% based on intelligence
      } else {
        // Increased from 0.4 to 0.6
        sellPercentage = 0.6; // Minimum sell percentage for low intelligence
      }
    } else if (isUptrendExhausting && profitPercentage >= riskThreshold) { // Lowered threshold from 1.2 to 1.0
      // Uptrend exhaustion detection with intelligence scaling
      // Lower intelligence requirement (was 0.8)
      if (detectionBonus > 0.5) {
        // Increased from 0.4 to 0.6
        sellPercentage = 0.6 + (detectionBonus * 0.4); // 60-100% based on intelligence
      } else {
        // Increased from 0.3 to 0.5
        sellPercentage = 0.5; // Minimum sell percentage for low intelligence
      }
    } else if (profitPercentage >= riskThreshold * 2.0) { // Lowered threshold from 2.5 to 2.0
      // Exceptionally high profit - more aggressive selling
      // Increased from 0.9 to 1.0 (always sell all)
      sellPercentage = 1.0; // Sell 100% regardless of intelligence
    } else if (profitPercentage >= riskThreshold * 1.5) { // Lowered threshold from 2.0 to 1.5
      // Very high profit - sell a good portion with intelligence scaling
      // Increased from 0.7 to 0.85
      sellPercentage = 0.85 + (detectionBonus * 0.15); // 85-100% based on intelligence
    } else if (profitPercentage >= riskThreshold * 1.2) { // Lowered threshold from 1.5 to 1.2
      // Good profit - more aggressive selling
      sellPercentage = isPriceNearPeak ? 
                      (0.7 + (detectionBonus * 0.3)) : // 70-100% if near peak (increased from 50-80%)
                      (0.5 + (detectionBonus * 0.3));  // 50-80% otherwise (increased from 30-50%)
    } else if (profitPercentage >= riskThreshold * 0.9) { // Lowered threshold from 1.1 to 0.9
      // Small profit near threshold - conservative selling with intelligence scaling
      // Increased from 0.2 to 0.3
      sellPercentage = 0.3 + (detectionBonus * 0.3); // 30-60% based on intelligence
    } 
    // NEW: Add small probability of selling even with smaller profits
    else if (profitPercentage > 0) {
      // Random chance to sell based on intelligence (smarter bots are more patient)
      const randomSellThreshold = 0.3 - (detectionBonus * 0.2); // 10-30% chance to sell
      if (Math.random() < randomSellThreshold) {
        sellPercentage = 0.1 + (detectionBonus * 0.1); // 10-20% of position
      }
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
    
    // Enhanced loss management with improved intelligence scaling
    const lossPercentage = Math.abs(profitPercentage); // Convert negative profit to positive loss
    
    // Create intelligence factor for more gradual scaling (maxes out at intelligence 5)
    const intelligenceFactor = Math.min(1, botIntelligence / 5);
    
    // Progressive loss thresholds that decrease with higher intelligence
    // Higher intelligence bots cut losses earlier
    // NEW: Lower thresholds to cut losses faster
    const significantLossThreshold = 0.12 - (intelligenceFactor * 0.05); // 12% down to 7% (was 15% to 10%)
    const moderateLossThreshold = 0.09 - (intelligenceFactor * 0.04);    // 9% down to 5% (was 12% to 8%)
    const smallLossThreshold = 0.07 - (intelligenceFactor * 0.04);       // 7% down to 3% (was 10% to 6%)
    
    // NEW: Increase sell percentages to cut losses more aggressively
    if (stock.trendDirection < 0 && stock.trendStrength > 0.7 && lossPercentage > significantLossThreshold) {
      // Strong confirmed downtrend with significant loss - cut losses aggressively
      // More intelligent bots sell more to minimize losses
      // Increased from 0.4 to 0.6
      sellPercentage = 0.6 + (intelligenceFactor * 0.4); // 60-100% based on intelligence
    } else if (trendAccelerating && trendStrength > 0.05 && lossPercentage > moderateLossThreshold) {
      // Accelerating downtrends - cut losses earlier
      // Lower intelligence requirement (removed botIntelligence >= 6)
      // Scale selling amount with intelligence
      // Increased from 0.25 to 0.4
      sellPercentage = 0.4 + (intelligenceFactor * 0.4); // 40-80% based on intelligence
    } else if (stock.trendDirection < 0 && stock.trendStrength > 0.4 && lossPercentage > smallLossThreshold) {
      // Moderate downtrend with smaller loss - cut losses conservatively
      // Lower strength threshold (0.5 to 0.4) and loss threshold
      // Increased from 0.15 to 0.25
      sellPercentage = 0.25 + (intelligenceFactor * 0.35); // 25-60% based on intelligence
    } else if (lossPercentage > significantLossThreshold * 1.5) {
      // Significant loss regardless of trend - limit potential further losses
      // This prevents holding onto big losers even without a clear trend
      // Increased from 0.2 to 0.3
      sellPercentage = 0.3 + (intelligenceFactor * 0.4); // 30-70% based on intelligence
    } else {
      // NEW: Small chance of selling even with small losses
      const randomSellThreshold = 0.15 - (intelligenceFactor * 0.1); // 5-15% chance to sell
      if (Math.random() < randomSellThreshold) {
        sellPercentage = 0.1; // Sell 10% of position
      } else {
        // No clear negative trend or loss is still small - hold and wait for recovery
        sellPercentage = 0;
      }
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
  // Base chance is 20% per tick (doubled for better performance)
  // Lower intelligence bots trade more frequently but less effectively
  // Higher intelligence bots are more selective but make better trades
  const baseTradeProbability = 0.20 * (1 / Math.pow(botIntelligence, 0.3)); // Reduced penalty for high intelligence
  
  // Adjust probability based on market conditions and opportunity score
  // More volatile markets and better opportunities increase trading frequency
  // Enhanced opportunity score impact for higher intelligence bots
  const intelligenceBonus = Math.pow(botIntelligence, 1.5) / 10; // Gives higher intelligence bots more weight
  const calculatedProbability = baseTradeProbability * 
                               (1 + (marketVolatility * (1 + intelligenceBonus))) * 
                               (marketOpportunityScore * (1 + intelligenceBonus));
  
  // Higher minimum probability (8%) ensures more consistent trading
  return Math.max(0.08, calculatedProbability);
}

/**
 * Determines the risk threshold based on risk level
 * @param {String} riskLevel - "low", "medium", or "high"
 * @returns {Number} - Risk threshold as a decimal (0-1)
 */
export function getRiskThreshold(riskLevel) {
  switch(riskLevel.toLowerCase()) {
    case 'low':
      return 0.08; // 8% for low risk - faster profit taking for more consistent gains
    case 'medium':
      return 0.15; // 15% for medium risk - balanced approach
    case 'high':
      return 0.25; // 25% for high risk - still aggressive but more reasonable
    default:
      return 0.12; // Default - slightly lower threshold for better profit locking
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
  
  // Enhanced diversification strategy based on intelligence
  // Higher intelligence = more diversification, with better scaling
  // Intelligence 1-3: 1-2 stocks, Intelligence 4-6: 2-3 stocks, Intelligence 7+: 3-5 stocks
  const maxStocksToBuy = Math.min(
    buyingOpportunities.length,
    Math.max(1, Math.ceil(Math.pow(botIntelligence, 0.7)))
  );
  
  // More intelligent allocation of budget - retain some budget for future opportunities
  // Higher intelligence bots allocate budget more efficiently
  const allocationPercent = 0.7 + (Math.min(0.25, botIntelligence * 0.025)); // 70-95% based on intelligence
  const baseAllocation = (budget * allocationPercent) / maxStocksToBuy;
  
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