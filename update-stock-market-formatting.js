// This script contains the replacements to update StockMarketPanel.tsx to use the new formatting system

const replacements = [
  // StockDetailModal
  { from: '${currentStock.price.toFixed(2)}', to: '{formatCurrency(currentStock.price)}' },
  { from: '{priceChange >= 0 ? \'▲\' : \'▼\'} {Math.abs(priceChange).toFixed(2)}%', to: '{priceChange >= 0 ? \'▲\' : \'▼\'} {formatNumber(Math.abs(priceChange), 2)}%' },
  { from: '<div className="font-bold">${currentHolding?.averagePurchasePrice.toFixed(2)}</div>', to: '<div className="font-bold">{formatCurrency(currentHolding?.averagePurchasePrice)}</div>' },
  { from: '<div className="font-bold">${(currentStock.price * sharesOwned).toFixed(2)}</div>', to: '<div className="font-bold">{formatCurrency(currentStock.price * sharesOwned)}</div>' },
  { from: '<div className="font-bold">${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)</div>', to: '<div className="font-bold">{formatCurrency(profitLoss)} ({formatNumber(profitLossPercent, 2)}%)</div>' },
  { from: '<div className="font-bold">${maxPrice.toFixed(2)}</div>', to: '<div className="font-bold">{formatCurrency(maxPrice)}</div>' },
  { from: '<div className="font-bold">${minPrice.toFixed(2)}</div>', to: '<div className="font-bold">{formatCurrency(minPrice)}</div>' },
  { from: '<div className="font-bold">${avgPrice.toFixed(2)}</div>', to: '<div className="font-bold">{formatCurrency(avgPrice)}</div>' },
  { from: '<div className="font-bold">{(currentStock.volatility * 100).toFixed(1)}%</div>', to: '<div className="font-bold">{formatNumber(currentStock.volatility * 100, 1)}%</div>' },
  { from: 'Buy {quantity} @ ${(currentStock.price * quantity).toFixed(2)}', to: 'Buy {quantity} @ {formatCurrency(currentStock.price * quantity)}' },
  { from: 'Sell {quantity} @ ${(currentStock.price * quantity).toFixed(2)}', to: 'Sell {quantity} @ {formatCurrency(currentStock.price * quantity)}' },
  { from: 'Sell All {sharesOwned} Shares @ ${(currentStock.price * sharesOwned).toFixed(2)}', to: 'Sell All {formatNumber(sharesOwned, 0)} Shares @ {formatCurrency(currentStock.price * sharesOwned)}' },

  // StockMarketPanel
  { from: '${price.toFixed(2)}', to: '{formatCurrency(price)}' },
  { from: '{Math.abs(((price - previousPrice) / previousPrice) * 100).toFixed(1)}%', to: '{formatNumber(Math.abs(((price - previousPrice) / previousPrice) * 100), 1)}%' },
  { from: '${sign}${Math.abs(percentChange).toFixed(2)}%', to: '{sign}{formatNumber(Math.abs(percentChange), 2)}%' },
  { from: '<span className="text-lg font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">${money.toFixed(2)}</span>', to: '<span className="text-lg font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{formatCurrency(money)}</span>' },
  { from: '<div className="text-xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">${portfolioValue.toFixed(2)}</div>', to: '<div className="text-xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{formatCurrency(portfolioValue)}</div>' },
  { from: '<div className="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">${botTradingProfit.toFixed(2)}</div>', to: '<div className="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">{formatCurrency(botTradingProfit)}</div>' },
  { from: '<div className="text-xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">${botTradingLosses.toFixed(2)}</div>', to: '<div className="text-xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">{formatCurrency(botTradingLosses)}</div>' },
  { from: 'Buy Bot (${tradingBotCost.toFixed(2)})', to: 'Buy Bot ({formatCurrency(tradingBotCost)})' },
  { from: '<span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">+{(botIntelligence * 15).toFixed(1)}%</span>', to: '<span className="text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">+{formatNumber(botIntelligence * 15, 1)}%</span>' },
  { from: 'Upgrade (${botIntelligenceCost.toFixed(2)})', to: 'Upgrade ({formatCurrency(botIntelligenceCost)})' },
  { from: '<div className="text-lg font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">${botTradingBudget.toFixed(2)}</div>', to: '<div className="text-lg font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{formatCurrency(botTradingBudget)}</div>' },
  { from: 'You can withdraw up to <span className="text-yellow-400">${botTradingBudget.toFixed(2)}</span>', to: 'You can withdraw up to <span className="text-yellow-400">{formatCurrency(botTradingBudget)}</span>' },
  { from: '((botTradingProfit / (botTradingBudget + botTradingProfit)) * 100).toFixed(1) + \'%\'', to: 'formatNumber((botTradingProfit / (botTradingBudget + botTradingProfit)) * 100, 1) + \'%\'' },
  { from: '{Math.min(99, 85 + botIntelligence * 2).toFixed(1)}%', to: '{formatNumber(Math.min(99, 85 + botIntelligence * 2), 1)}%' },
  { from: '{(1.5 + (botIntelligence * 0.6)).toFixed(1)}x', to: '{formatNumber(1.5 + (botIntelligence * 0.6), 1)}x' },
  { from: '{(botRiskThreshold * 100).toFixed(0)}%', to: '{formatNumber(botRiskThreshold * 100, 0)}%' },
  { from: 'Buy {quantity} @ ${(stock.price * quantity).toFixed(2)}', to: 'Buy {quantity} @ {formatCurrency(stock.price * quantity)}' },
  { from: 'Sell All Stocks (${portfolioValue.toFixed(2)})', to: 'Sell All Stocks ({formatCurrency(portfolioValue)})' },
  { from: '<span className="font-semibold text-green-300">${currentValue.toFixed(2)}</span>', to: '<span className="font-semibold text-green-300">{formatCurrency(currentValue)}</span>' },
  { from: '<span className="font-semibold text-gray-300">${holding.averagePurchasePrice.toFixed(2)}</span>', to: '<span className="font-semibold text-gray-300">{formatCurrency(holding.averagePurchasePrice)}</span>' },
  { from: '${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)', to: '{formatCurrency(profit)} ({formatNumber(profitPercent, 2)}%)' },
  { from: '<div className="text-yellow-400">${transaction.total.toFixed(2)}</div>', to: '<div className="text-yellow-400">{formatCurrency(transaction.total)}</div>' },
  { from: '{transaction.profit > 0 ? \'+\' : \'\'}{transaction.profit.toFixed(2)}', to: '{transaction.profit > 0 ? \'+\' : \'\'}{formatNumber(transaction.profit, 2)}' }
];

/*
To apply these changes:
1. Read StockMarketPanel.tsx
2. For each replacement in the array above, replace the 'from' string with the 'to' string
3. Write the updated content back to StockMarketPanel.tsx
*/