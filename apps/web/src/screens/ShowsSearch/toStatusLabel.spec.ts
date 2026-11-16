import { isStatusVisible, toStatusLabel } from './toStatusLabel';

describe('isStatusVisible', () => {
  it.each([
    ['success', false, 0, false],
    ['success', true, 0, true],
    ['success', false, 7, true],
    ['loading', false, 0, true],
    ['idle', false, 0, true],
  ] as const)(
    'is %s (refreshing: %s, %i results) → %s',
    (status, isRefreshing, resultCount, visible) => {
      expect(
        isStatusVisible({
          status,
          isRefreshing,
          filteredCount: 0,
          resultCount,
        }),
      ).toBe(visible);
    },
  );
});

describe('toStatusLabel', () => {
  it.each([
    ['idle', false, 0, 0, ''],
    ['error', false, 0, 0, ''],
    ['loading', false, 0, 0, 'Loading shows…'],
    ['success', true, 3, 7, 'Loading shows…'],
    ['success', false, 0, 0, 'No shows found'],
    ['success', false, 3, 7, '3 of 7 shows'],
  ] as const)(
    'labels %s (refreshing: %s, %i of %i)',
    (status, isRefreshing, filteredCount, resultCount, label) => {
      expect(
        toStatusLabel({ status, isRefreshing, filteredCount, resultCount }),
      ).toBe(label);
    },
  );
});
