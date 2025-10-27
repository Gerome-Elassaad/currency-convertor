import type { CurrencyCode } from '@/types/currency';
import { CURRENCY_INFO } from './constants';

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number, currency: CurrencyCode): string {
  const info = CURRENCY_INFO[currency];
  const formatted = formatNumber(value, info.decimals);
  return `${info.symbol}${formatted}`;
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function parseInputNumber(input: string): number {
  const cleaned = input.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatPercentage(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${(change * 100).toFixed(2)}%`;
}

export function formatExchangeRate(rate: number, currency: CurrencyCode): string {
  const formattedRate = rate.toFixed(4);
  return `1 AUD = ${formattedRate} ${currency}`;
}
