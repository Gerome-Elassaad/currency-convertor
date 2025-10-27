import type { HistoricalDataPoint } from '@/types/currency';
import { convertFromAUD, calculateStatistics } from '@/lib/calculations';

describe('convertFromAUD', () => {
  it('converts AUD to target currency correctly', () => {
    const result = convertFromAUD(100, 1.5, 0.9);
    expect(result).toBeCloseTo(60, 2);
  });

  it('handles rate of 1 correctly', () => {
    const result = convertFromAUD(100, 1, 1);
    expect(result).toBe(100);
  });

  it('handles different rates', () => {
    const result = convertFromAUD(1, 1.39, 110);
    expect(result).toBeCloseTo(79.14, 2);
  });

  it('handles zero amount', () => {
    const result = convertFromAUD(0, 1.5, 0.9);
    expect(result).toBe(0);
  });

  it('handles large amounts', () => {
    const result = convertFromAUD(1000000, 1.5, 0.9);
    expect(result).toBeCloseTo(600000, 2);
  });
});

describe('calculateStatistics', () => {
  const mockData: HistoricalDataPoint[] = [
    { date: '2024-01-01', rate: 0.72 },
    { date: '2024-01-02', rate: 0.73 },
    { date: '2024-01-03', rate: 0.71 },
    { date: '2024-01-04', rate: 0.75 },
    { date: '2024-01-05', rate: 0.74 },
  ];

  it('calculates current rate (last item)', () => {
    const stats = calculateStatistics(mockData);
    expect(stats.current).toBe(0.74);
  });

  it('calculates average correctly', () => {
    const stats = calculateStatistics(mockData);
    expect(stats.average).toBeCloseTo(0.73, 2);
  });

  it('finds highest rate and date', () => {
    const stats = calculateStatistics(mockData);
    expect(stats.highest.rate).toBe(0.75);
    expect(stats.highest.date).toBe('2024-01-04');
  });

  it('finds lowest rate and date', () => {
    const stats = calculateStatistics(mockData);
    expect(stats.lowest.rate).toBe(0.71);
    expect(stats.lowest.date).toBe('2024-01-03');
  });

  it('calculates percentage change correctly', () => {
    const stats = calculateStatistics(mockData);
    expect(stats.change).toBeCloseTo(0.0278, 4);
  });

  it('handles negative change', () => {
    const decreasingData: HistoricalDataPoint[] = [
      { date: '2024-01-01', rate: 0.75 },
      { date: '2024-01-02', rate: 0.72 },
    ];
    const stats = calculateStatistics(decreasingData);
    expect(stats.change).toBeCloseTo(-0.04, 4);
  });

  it('handles single data point', () => {
    const singleData: HistoricalDataPoint[] = [
      { date: '2024-01-01', rate: 0.72 },
    ];
    const stats = calculateStatistics(singleData);
    expect(stats.current).toBe(0.72);
    expect(stats.average).toBe(0.72);
    expect(stats.highest.rate).toBe(0.72);
    expect(stats.lowest.rate).toBe(0.72);
    expect(stats.change).toBe(0);
  });

  it('throws error with empty data', () => {
    expect(() => calculateStatistics([])).toThrow('No data to calculate statistics');
  });
});
