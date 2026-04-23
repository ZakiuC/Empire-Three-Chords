import type { Category, ResultMetrics, TimingState } from '../types';
import { initialCategories, poolStorageKey, timingStorageKey } from './constants';

export function createMap<T>(list: { id: string }[], fallbackValue: T): Record<string, T> {
  return Object.fromEntries(list.map((item) => [item.id, fallbackValue]));
}

export function formatIndexToken(value: number): string {
  return String(value).padStart(2, '0');
}

export function getResultMetrics(
  category: Category | null | undefined,
  currentValue: string | undefined,
  segmentCount = 12,
): ResultMetrics {
  const total = Array.isArray(category?.items) ? category!.items.length : 0;
  const rawIndex = total > 0 && currentValue ? category!.items.indexOf(currentValue) : -1;
  const currentIndex = rawIndex >= 0 ? rawIndex + 1 : 0;
  const currentToken = currentIndex > 0 ? formatIndexToken(currentIndex) : '--';
  const totalToken = total > 0 ? formatIndexToken(total) : '--';

  return {
    total,
    currentIndex,
    filled:
      currentIndex > 0 ? Math.max(1, Math.round((currentIndex / total) * segmentCount)) : 0,
    segmentCount,
    label: `${currentToken} / ${totalToken}`,
  };
}

export function loadCategories(): Category[] {
  if (typeof window === 'undefined') return initialCategories;
  try {
    const raw = JSON.parse(window.localStorage.getItem(poolStorageKey) || 'null');
    if (!Array.isArray(raw)) return initialCategories;

    return initialCategories.map((initialCategory) => {
      const matched = raw.find(
        (entry: { id?: string }) => entry && entry.id === initialCategory.id,
      );
      if (!matched || !Array.isArray(matched.items)) {
        return initialCategory;
      }
      return {
        ...initialCategory,
        items: (matched.items as unknown[])
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean),
      };
    });
  } catch {
    return initialCategories;
  }
}

export function loadTiming(): TimingState {
  const fallback: TimingState = { intervalVal: 3000, customMs: 1800 };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = JSON.parse(window.localStorage.getItem(timingStorageKey) || 'null') as
      | Partial<TimingState>
      | null;
    if (!raw || (typeof raw.intervalVal !== 'number' && raw.intervalVal !== 'custom')) {
      return fallback;
    }
    return {
      intervalVal: raw.intervalVal,
      customMs: typeof raw.customMs === 'number' ? raw.customMs : 1800,
    };
  } catch {
    return fallback;
  }
}

export function formatDuration(durationMs: number): string {
  if (durationMs < 1000) return `${durationMs} ms`;
  if (durationMs % 1000 === 0) return `${durationMs / 1000} 秒`;
  return `${(durationMs / 1000).toFixed(1)} 秒`;
}
