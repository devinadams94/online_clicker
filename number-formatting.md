# Number Formatting System

This document describes the number formatting system implemented for the online clicker game. The system condenses large numbers to make them more readable.

## Features

- Formats large numbers with appropriate suffixes (K, M, B, T, etc.)
- Supports currency formatting with $ symbol
- Handles decimals with configurable precision
- Removes trailing zeros for cleaner display
- Supports numbers up to nonillion (10^30)

## Suffix Scale

| Suffix | Value       | Scientific Notation |
|--------|-------------|---------------------|
| K      | Thousand    | 10^3                |
| M      | Million     | 10^6                |
| B      | Billion     | 10^9                |
| T      | Trillion    | 10^12               |
| Qa     | Quadrillion | 10^15               |
| Qi     | Quintillion | 10^18               |
| Sx     | Sextillion  | 10^21               |
| Sp     | Septillion  | 10^24               |
| Oc     | Octillion   | 10^27               |
| No     | Nonillion   | 10^30               |

Additional suffixes for even larger numbers include: Dc, UDc, DDc, TDc, QaDc, QiDc, SxDc, SpDc, ODc, Nd, V, UV, DV, TV, QaV, QiV, SxV, SpV, OV, Td, UTd, DTd, TTd, QaTd, QiTd, SxTd, SpTd, OTd, N.

## Usage

The system provides two main formatting functions:

### formatNumber

```typescript
formatNumber(num: number, precision: number = 2, smallNumberPrecision: number = 2): string
```

- `num`: The number to format
- `precision`: Number of decimal places for large numbers (default: 2)
- `smallNumberPrecision`: Precision for small numbers under 1,000 (default: 2)

Examples:
- `formatNumber(1234)` → "1.23K"
- `formatNumber(1000000)` → "1M"
- `formatNumber(2500000000)` → "2.5B"

### formatCurrency

```typescript
formatCurrency(num: number, precision: number = 2, smallNumberPrecision: number = 2): string
```

Adds a $ symbol to the formatted number.

Examples:
- `formatCurrency(1234)` → "$1.23K"
- `formatCurrency(1000000)` → "$1M"
- `formatCurrency(2500000000)` → "$2.5B"

## Implementation

The implementation can be found in `/src/utils/numberFormat.ts`.

## Best Practices

- Use `formatNumber` for general quantities (paperclips, resources, etc.)
- Use `formatCurrency` for monetary values
- For better readability, consider using 0-1 decimal places for very large numbers
- For small values where precision matters, use 2-3 decimal places