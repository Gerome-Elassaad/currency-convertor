/**
 * Supported currency codes
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NZD';

/**
 * Currency information for display
 */
export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimals: number; // 2 for most, 0 for JPY
}

/**
 * Response from /api/rates
 */
export interface RatesResponse {
  rates: Record<CurrencyCode, number>; // AUD-based rates
  timestamp: number; // Unix timestamp
}

/**
 * Single historical data point
 */
export interface HistoricalDataPoint {
  date: string; // ISO date string YYYY-MM-DD
  rate: number; // Exchange rate for that day
}

/**
 * Response from /api/historical
 */
export interface HistoricalResponse {
  currency: CurrencyCode;
  data: HistoricalDataPoint[];
}

/**
 * Calculated statistics for chart page
 */
export interface Statistics {
  current: number;
  average: number;
  highest: { rate: number; date: string };
  lowest: { rate: number; date: string };
  change: number; // Percentage change
}

/**
 * Open Exchange Rates API response structure
 */
export interface OpenExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string; // Always "USD"
  rates: Record<string, number>; // All currency rates
}
