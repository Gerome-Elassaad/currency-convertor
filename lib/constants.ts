import type { CurrencyCode, CurrencyInfo } from '@/types/currency';

export const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'United States Dollar',
    symbol: '$',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    decimals: 2,
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    decimals: 0,
  },
  NZD: {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: '$',
    decimals: 2,
  },
};

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'NZD'];

export const API_CONFIG = {
  BASE_URL: 'https://openexchangerates.org/api',
  ENDPOINTS: {
    LATEST: '/latest.json',
    HISTORICAL: '/historical', // + '/YYYY-MM-DD.json'
  },
};

export const HISTORICAL_DAYS = 14;

export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  JPY: 'JP',
  NZD: 'NZ',
  AUD: 'AU',
};
