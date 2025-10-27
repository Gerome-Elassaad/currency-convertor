import type { HistoricalDataPoint, Statistics } from '@/types/currency';

export function convertFromAUD(
  audAmount: number,
  audRate: number,
  targetRate: number
): number {
  return audAmount * (targetRate / audRate);
}

export function calculateStatistics(data: HistoricalDataPoint[]): Statistics {
  if (data.length === 0) {
    throw new Error('No data to calculate statistics');
  }

  const rates = data.map(d => d.rate);
  const current = rates[rates.length - 1];
  const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;

  const highest = data.reduce((max, point) =>
    point.rate > max.rate ? point : max
  );

  const lowest = data.reduce((min, point) =>
    point.rate < min.rate ? point : min
  );

  const firstRate = rates[0];
  const lastRate = rates[rates.length - 1];
  const change = (lastRate - firstRate) / firstRate;

  return {
    current,
    average,
    highest: { rate: highest.rate, date: highest.date },
    lowest: { rate: lowest.rate, date: lowest.date },
    change,
  };
}
