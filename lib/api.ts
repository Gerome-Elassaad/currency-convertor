import type { CurrencyCode, HistoricalResponse, RatesResponse } from '@/types/currency';

export async function fetchCurrentRates(): Promise<RatesResponse> {
  const response = await fetch('/api/rates');

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Failed to fetch rates');
  }

  return response.json();
}

export async function fetchHistoricalRates(currency: CurrencyCode): Promise<HistoricalResponse> {
  const response = await fetch(`/api/historical?currency=${currency}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Failed to fetch historical data');
  }

  return response.json();
}
