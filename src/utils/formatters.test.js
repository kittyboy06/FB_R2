import { describe, test, expect } from 'vitest';
import { fmtCurrency, fmtPercent, fmtNumber } from './formatters.js';

describe('Formatters Utilities', () => {
  test('fmtCurrency formats numbers to USD currency format without decimal places', () => {
    expect(fmtCurrency(1234567.89)).toBe('$1,234,567');
    expect(fmtCurrency(0)).toBe('$0');
    expect(fmtCurrency(-100)).toBe('$0');
    expect(fmtCurrency(null)).toBe('$0');
    expect(fmtCurrency(undefined)).toBe('$0');
  });

  test('fmtPercent formats floats to 2 decimal places with percentage sign', () => {
    expect(fmtPercent(54.2)).toBe('54.20%');
    expect(fmtPercent(0.1234)).toBe('0.12%');
    expect(fmtPercent(-5.678)).toBe('-5.68%');
    expect(fmtPercent(null)).toBe('0.00%');
    expect(fmtPercent(undefined)).toBe('0.00%');
  });

  test('fmtNumber formats integers with comma separators', () => {
    expect(fmtNumber(1234567)).toBe('1,234,567');
    expect(fmtNumber(0)).toBe('0');
    expect(fmtNumber(-500)).toBe('0');
    expect(fmtNumber(null)).toBe('0');
    expect(fmtNumber(undefined)).toBe('0');
  });
});
