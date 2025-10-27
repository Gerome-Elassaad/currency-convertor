export type CurrencyCode = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NZD';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimals: number;
}

export interface RatesResponse {
  rates: Record<CurrencyCode, number>;
  timestamp: number;
}

export interface HistoricalDataPoint {
  date: string;
  rate: number;
}

export interface HistoricalResponse {
  currency: CurrencyCode;
  data: HistoricalDataPoint[];
}

export interface Statistics {
  current: number;
  average: number;
  highest: { rate: number; date: string };
  lowest: { rate: number; date: string };
  change: number;
}

export interface OpenExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}
