/**
 * Number formatting utilities for condensed display of large numbers
 */

// Suffixes for large numbers
const NUMBER_SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 
  'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc', 
  'Nd', 'V', 'UV', 'DV', 'TV', 'QaV', 'QiV', 'SxV', 'SpV', 'OV', 
  'Td', 'UTd', 'DTd', 'TTd', 'QaTd', 'QiTd', 'SxTd', 'SpTd', 'OTd', 'N'
];

/**
 * Formats a number with the appropriate suffix (K, M, B, T, etc.)
 * @param num The number to format
 * @param precision Number of decimal places (default: 2)
 * @param smallNumberPrecision Precision for small numbers (default: 2)
 * @returns Formatted string with appropriate suffix
 */
export function formatNumber(num: number, precision: number = 2, smallNumberPrecision: number = 2): string {
  // Handle special cases
  if (num === 0) return '0';
  if (isNaN(num)) return 'NaN';
  if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
  
  // Handle negative numbers
  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(num);
  
  // If small number, don't use suffix notation
  if (absNum < 1000) {
    return sign + absNum.toFixed(smallNumberPrecision).replace(/\.?0+$/, '');
  }
  
  // Determine the appropriate suffix index
  // Math.floor(Math.log10(absNum) / 3) gives us the 1000's power (0 for thousands, 1 for millions, etc.)
  const suffixIndex = Math.min(
    Math.floor(Math.log10(absNum) / 3), 
    NUMBER_SUFFIXES.length - 1
  );
  
  // Calculate the scaled value (e.g., 1.23 for 1.23K)
  const scaledValue = absNum / Math.pow(10, suffixIndex * 3);
  
  // Format the number with the specified precision
  const formattedValue = scaledValue.toFixed(precision);
  
  // Remove trailing zeros after the decimal point
  const trimmedValue = formattedValue.replace(/\.?0+$/, '');
  
  // Return the formatted string with the appropriate suffix
  return sign + trimmedValue + NUMBER_SUFFIXES[suffixIndex];
}

/**
 * Format a number as currency with appropriate suffixes
 * @param num The number to format
 * @param precision Number of decimal places (default: 2)
 * @param smallNumberPrecision Precision for small numbers (default: 2)
 * @returns Formatted string with $ and appropriate suffix
 */
export function formatCurrency(num: number, precision: number = 2, smallNumberPrecision: number = 2): string {
  return '$' + formatNumber(num, precision, smallNumberPrecision);
}