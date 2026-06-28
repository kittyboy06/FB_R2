import { describe, test, expect, beforeEach } from 'vitest';
import multiSortState from './multiSortState.js';

describe('multiSortState Engine', () => {
  beforeEach(() => {
    multiSortState.keys = [];
  });

  test('addOrToggle adds single sort key and toggles direction', () => {
    multiSortState.addOrToggle('budget_usd', false);
    expect(multiSortState.keys.length).toBe(1);
    expect(multiSortState.keys[0]).toEqual({ column: 'budget_usd', dir: 'asc' });

    multiSortState.addOrToggle('budget_usd', false);
    expect(multiSortState.keys[0].dir).toBe('desc');
  });

  test('addOrToggle adds secondary sort keys on Shift+click', () => {
    multiSortState.addOrToggle('industry', false);
    multiSortState.addOrToggle('roi_percent', true);
    expect(multiSortState.keys.length).toBe(2);
    expect(multiSortState.keys[0]).toEqual({ column: 'industry', dir: 'asc' });
    expect(multiSortState.keys[1]).toEqual({ column: 'roi_percent', dir: 'asc' });
  });

  test('apply sorts pool by multiple keys', () => {
    const mockPool = [
      { industry: 'Finance', roi_percent: 50 },
      { industry: 'Healthcare', roi_percent: 10 },
      { industry: 'Finance', roi_percent: 80 }
    ];

    multiSortState.keys = [
      { column: 'industry', dir: 'asc' },
      { column: 'roi_percent', dir: 'desc' }
    ];

    const sorted = multiSortState.apply(mockPool);
    expect(sorted[0].industry).toBe('Finance');
    expect(sorted[0].roi_percent).toBe(80);
    expect(sorted[1].industry).toBe('Finance');
    expect(sorted[1].roi_percent).toBe(50);
    expect(sorted[2].industry).toBe('Healthcare');
  });
});
