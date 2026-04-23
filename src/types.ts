export interface Category {
  id: string;
  name: string;
  items: string[];
}

export interface TimeOption {
  label: string;
  value: number | 'custom';
}

export interface ThemePreset {
  id: string;
  name: string;
  copy: string;
  scheme: 'light' | 'dark';
  previewPage: string;
  previewSurface: string;
  previewBorder: string;
  previewInk: string;
}

export interface ResultMetrics {
  total: number;
  currentIndex: number;
  filled: number;
  segmentCount: number;
  label: string;
}

export interface TimingState {
  intervalVal: number | 'custom';
  customMs: number;
}
