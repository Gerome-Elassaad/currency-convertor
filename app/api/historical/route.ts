import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { API_CONFIG, HISTORICAL_DAYS, SUPPORTED_CURRENCIES } from '@/lib/constants';
import type { CurrencyCode, HistoricalDataPoint, OpenExchangeRatesResponse } from '@/types/currency';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');

    if (!currency) {
      return NextResponse.json(
        { message: 'Currency parameter required' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_CURRENCIES.includes(currency as CurrencyCode)) {
      return NextResponse.json(
        { message: 'Invalid currency code' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY;

    if (!apiKey) {
      console.error('API key not configured');
      return NextResponse.json(
        { message: 'Configuration error' },
        { status: 500 }
      );
    }

    const dates: string[] = [];
    const today = new Date();

    for (let i = HISTORICAL_DAYS - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
    }

    const historicalData: HistoricalDataPoint[] = [];
    let successfulFetches = 0;

    for (const date of dates) {
      try {
        const symbols = ['AUD', currency].join(',');
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HISTORICAL}/${date}.json?app_id=${apiKey}&symbols=${symbols}`;
        const response = await fetch(url);

        if (response.ok) {
          const data: OpenExchangeRatesResponse = await response.json();

          if (data.rates?.AUD && data.rates?.[currency]) {
            const audRate = data.rates.AUD;
            const targetRate = data.rates[currency];

            const audBasedRate = targetRate / audRate;

            historicalData.push({
              date,
              rate: audBasedRate,
            });

            successfulFetches++;
          }
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${date}:`, error);
      }
    }

    if (successfulFetches === 0) {
      console.error('All historical data fetches failed');
      return NextResponse.json(
        { message: 'Unable to fetch historical data' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      currency,
      data: historicalData,
    });
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
