import {
  formatCurrency,
  formatDateLong,
  formatDateShort,
  formatNumber,
  formatPercentage,
  parseInputNumber,
} from '@/lib/formatters';

describe('formatNumber', () => {
  it('formats numbers with comma separators and 2 decimals by default', () => {
    expect(formatNumber(1234567.89)).toBe('1,234,567.89');
  });

  it('formats numbers with specified decimal places', () => {
    expect(formatNumber(1234.5678, 4)).toBe('1,234.5678');
  });

  it('formats numbers with 0 decimals', () => {
    expect(formatNumber(1234, 0)).toBe('1,234');
  });

  it('handles zero correctly', () => {
    expect(formatNumber(0, 2)).toBe('0.00');
  });

  it('handles negative numbers', () => {
    expect(formatNumber(-1234.56, 2)).toBe('-1,234.56');
  });
});

describe('formatCurrency', () => {
  it('formats USD with $ symbol and 2 decimals', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('formats EUR with € symbol and 2 decimals', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('formats JPY with ¥ symbol and 0 decimals', () => {
    expect(formatCurrency(1234, 'JPY')).toBe('¥1,234');
  });

  it('formats GBP with £ symbol', () => {
    expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
  });

  it('formats NZD with $ symbol', () => {
    expect(formatCurrency(1234.56, 'NZD')).toBe('$1,234.56');
  });
});

describe('formatDateShort', () => {
  it('formats date as "MMM DD"', () => {
    const date = new Date('2024-01-15');
    expect(formatDateShort(date)).toBe('Jan 15');
  });

  it('handles different months', () => {
    const date = new Date('2024-12-25');
    expect(formatDateShort(date)).toBe('Dec 25');
  });
});

describe('formatDateLong', () => {
  it('formats date as "Month DD, YYYY"', () => {
    const date = new Date('2024-01-15');
    expect(formatDateLong(date)).toBe('January 15, 2024');
  });
});

describe('parseInputNumber', () => {
  it('parses string with commas to number', () => {
    expect(parseInputNumber('1,234.56')).toBe(1234.56);
  });

  it('parses string without commas', () => {
    expect(parseInputNumber('1234.56')).toBe(1234.56);
  });

  it('returns 0 for empty string', () => {
    expect(parseInputNumber('')).toBe(0);
  });

  it('returns 0 for invalid input', () => {
    expect(parseInputNumber('abc')).toBe(0);
  });

  it('handles zero correctly', () => {
    expect(parseInputNumber('0')).toBe(0);
  });
});

describe('formatPercentage', () => {
  it('formats positive percentage with + sign', () => {
    expect(formatPercentage(0.0523)).toBe('+5.23%');
  });

  it('formats negative percentage with - sign', () => {
    expect(formatPercentage(-0.0312)).toBe('-3.12%');
  });

  it('formats zero percentage with + sign', () => {
    expect(formatPercentage(0)).toBe('+0.00%');
  });

  it('formats large percentages correctly', () => {
    expect(formatPercentage(1.5)).toBe('+150.00%');
  });
});
