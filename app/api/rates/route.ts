import { NextResponse } from 'next/server';
import { API_CONFIG, SUPPORTED_CURRENCIES } from '@/lib/constants';
import type { CurrencyCode, OpenExchangeRatesResponse } from '@/types/currency';

export async function GET() {
  try {
    const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY;

    if (!apiKey) {
      console.error('API key not configured');
      return NextResponse.json(
        { message: 'Configuration error' },
        { status: 500 }
      );
    }

    const symbols = ['AUD', ...SUPPORTED_CURRENCIES].join(',');
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LATEST}?app_id=${apiKey}&symbols=${symbols}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error('Invalid API key');
        return NextResponse.json(
          { message: 'Configuration error' },
          { status: 500 }
        );
      }

      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return NextResponse.json(
          { message: 'Too many requests, please try again later' },
          { status: 429 }
        );
      }

      console.error('Failed to fetch from Open Exchange Rates API');
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const data: OpenExchangeRatesResponse = await response.json();

    if (!data.rates || !data.rates.AUD) {
      console.error('Invalid response from API - missing AUD rate');
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const audRate = data.rates.AUD;
    const audBasedRates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>;

    for (const currency of SUPPORTED_CURRENCIES) {
      const targetRate = data.rates[currency];
      if (!targetRate) {
        console.error(`Missing rate for ${currency}`);
        return NextResponse.json(
          { message: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      audBasedRates[currency] = targetRate / audRate;
    }

    return NextResponse.json({
      rates: audBasedRates,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
