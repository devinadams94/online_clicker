"use client";

/**
 * Calculates the demand for paperclips based on price and market conditions
 * 
 * @param price Current paperclip price
 * @param basePrice Base (fair market) price
 * @param maxDemand Maximum possible demand at optimal price
 * @param elasticity Elasticity factor (typically 1-10)
 * @param minDemand Minimum demand floor
 * @param marketTrend Market trend factor (range: -1 to 1)
 * @param seasonalMultiplier Seasonal multiplier
 * @param volatility Volatility (typically 0.1-0.3)
 * @returns Calculated demand
 */
export function calculateDemand(
  price: number,
  basePrice: number,
  maxDemand: number,
  elasticity: number,
  minDemand: number = 0, // Changed minimum demand to 0
  marketTrend: number = 0,
  seasonalMultiplier: number = 1,
  volatility: number = 0.15,
  marketDemandLevel: number = 1 // Added market demand level parameter
): number {
  // Price ratio (current price / base price)
  const priceRatio = price / basePrice;
  
  // Calculate demand curve based on price - stronger exponential scaling
  let demandFactor;
  
  // Maximum price is $1.00 (4x the base price of $0.25)
  // For prices above $1.00, demand should be 0 unless market demand level is high enough
  if (price > 1.0) {
    return 0; // Prices above $1.00 have zero demand
  }
  
  // For prices at exactly $1.00, require market demand upgrades
  if (price >= 1.0) {
    // At $1.00 per paperclip, scale demand with market level
    // Level 5 enables limited sales (1 per sec)
    // Level 10 enables moderate sales (100 per sec)
    // Level 20 enables mass production (10,000 per sec)
    if (marketDemandLevel >= 20) {
      return 10000; // Mass production at level 20+
    } else if (marketDemandLevel >= 15) {
      return 1000; // Large scale at level 15-19
    } else if (marketDemandLevel >= 10) {
      return 100; // Medium scale at level 10-14
    } else if (marketDemandLevel >= 5) {
      return 1; // Limited sales at level 5-9
    }
    return 0; // No sales at $1.00 until market level 5
  }
  
  if (priceRatio <= 1) {
    // Price is at or below base price (bargain)
    // Much stronger exponential demand increase for lower prices
    // Lower the price by 50%, get 15-20x more demand
    const discountRatio = 1 - priceRatio; // 0 to 1, higher means bigger discount
    const exponentialFactor = 3.5; // Steeper exponential growth for more demand at lower prices
    
    // Apply exponential growth based on how much discount is offered
    demandFactor = Math.min(
      maxDemand * Math.pow(Math.E, exponentialFactor * discountRatio * elasticity),
      20 * maxDemand // Higher cap for very low prices to incentivize volume
    );
  } else if (priceRatio < 4) { // Price is between base price and $1.00 (4x base price)
    // More gradual decline in this range to make these prices viable
    const premiumRatio = priceRatio - 1; // How much above base price
    
    // Adjust demand curve based on how close to $1.00 we are
    // As we approach $1.00, demand falls more steeply
    let decayBase;
    let decayMultiplier;
    
    if (priceRatio <= 2) { // $0.25 to $0.50 - gentle decline
      decayBase = 0.75; // Higher value = gentler decline
      decayMultiplier = 1.1; // Lower multiplier = slower decay
    } else if (priceRatio <= 3) { // $0.50 to $0.75 - moderate decline
      decayBase = 0.6;
      decayMultiplier = 1.4;
    } else { // $0.75 to $1.00 - steeper decline
      decayBase = 0.4;
      decayMultiplier = 1.8;
    }
    
    // Apply exponential decay for mid-range prices
    demandFactor = maxDemand * Math.pow(
      decayBase, 
      elasticity * premiumRatio * decayMultiplier
    );
    
    // Ensure minimum demand in the mid-range is reasonable
    if (priceRatio <= 1.5 && demandFactor < 20) {
      demandFactor = Math.max(demandFactor, 20); // Minimum demand of 20 for prices up to 1.5x base
    } else if (priceRatio <= 2.5 && demandFactor < 10) {
      demandFactor = Math.max(demandFactor, 10); // Minimum demand of 10 for prices up to 2.5x base
    } else if (priceRatio <= 3.5 && demandFactor < 5) {
      demandFactor = Math.max(demandFactor, 5); // Minimum demand of 5 for prices up to 3.5x base
    } else if (demandFactor < 1) {
      // Ensure at least 1 demand as we approach $1.00
      // This creates a smoother transition to the $1.00 threshold
      demandFactor = 1;
    }
  }
  
  // Apply market demand level - each level increases demand by 10%
  const marketLevelFactor = 1 + (marketDemandLevel - 1) * 0.1;
  
  // Apply market trend factor
  const trendFactor = 1 + marketTrend * 0.2;
  
  // Calculate demand base (before randomization)
  const demandBase = (demandFactor || 1) * trendFactor * seasonalMultiplier * marketLevelFactor;
  
  // Add random fluctuation
  const randomRange = volatility * demandBase;
  const randomFactor = (Math.random() * 2 - 1) * randomRange;
  
  // Calculate final demand with randomization, ensuring it's at least minDemand
  const finalDemand = Math.max(demandBase + randomFactor, minDemand);
  
  // Round to integer for clarity
  return Math.round(finalDemand);
}

/**
 * Updates market trends over time
 * 
 * @param currentTrend Current market trend value
 * @returns New market trend value
 */
export function updateMarketTrend(currentTrend: number): number {
  // Market trends shift gradually in a random walk pattern
  // Trend is bounded between -1 and 1
  const trendChange = (Math.random() - 0.5) * 0.1;
  let newTrend = currentTrend + trendChange;
  
  // Keep trend within bounds
  newTrend = Math.max(Math.min(newTrend, 1), -1);
  
  return newTrend;
}

/**
 * Updates seasonal multiplier over time
 * 
 * @param currentSeasonal Current seasonal value
 * @param dayOfYear Day of year (1-365)
 * @returns New seasonal multiplier value
 */
export function updateSeasonalMultiplier(currentDay: number): number {
  // Simple seasonal pattern: sinusoidal wave with period of 1 year
  // Ranges from 0.8 to 1.2
  const seasonalFactor = 0.2 * Math.sin(2 * Math.PI * currentDay / 365) + 1;
  
  return seasonalFactor;
}

/**
 * Calculates the number of paperclips that can be sold
 * based on demand and available inventory
 * 
 * @param demand Current market demand
 * @param paperclips Available paperclips inventory
 * @returns Number of paperclips to sell
 */
export function calculateSales(demand: number, paperclips: number): number {
  // Can't sell more than we have in inventory or more than demand
  return Math.min(demand, paperclips);
}

/**
 * Gets the current day of year (1-365)
 * Used for seasonal calculations
 */
export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
}