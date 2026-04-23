import type { Category, TimeOption, ThemePreset } from '../types';

export const themeStorageKey = 'empire-three-chords-theme';
export const poolStorageKey = 'empire-three-chords-pools';
export const timingStorageKey = 'empire-three-chords-timing';

export const initialCategories: Category[] = [
  {
    id: 'key',
    name: '调性',
    items: [
      'G大调',
      'D大调',
      'A大调',
      'E大调',
      'B大调',
      '#F大调',
      'F大调',
      'bB大调',
      'bE大调',
      'bA大调',
      'bD大调',
    ],
  },
  { id: 'degree', name: '级数', items: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'] },
  { id: 'inversion', name: '转位', items: ['1', '1/3', '1/5'] },
  { id: 'shape', name: '指型', items: ['C', 'A', 'G', 'E', 'D'] },
];

export const timeOptions: TimeOption[] = [
  { label: '5 秒', value: 5000 },
  { label: '3 秒', value: 3000 },
  { label: '1 秒', value: 1000 },
  { label: '0.6 秒', value: 600 },
  { label: '自定义', value: 'custom' },
];

export const themePresets: ThemePreset[] = [
  {
    id: 'paper',
    name: 'Paper Light',
    copy: '暖白纸面与黑墨层级',
    scheme: 'light',
    previewPage: '#f5f5f5',
    previewSurface: '#ffffff',
    previewBorder: '#cccccc',
    previewInk: '#000000',
  },
  {
    id: 'studio',
    name: 'Studio Light',
    copy: '冷白技术手册与更清晰线框',
    scheme: 'light',
    previewPage: '#efefeb',
    previewSurface: '#fcfcfa',
    previewBorder: '#b9b9b5',
    previewInk: '#000000',
  },
  {
    id: 'oled',
    name: 'OLED Dark',
    copy: '纯黑仪表盘与最强对比',
    scheme: 'dark',
    previewPage: '#000000',
    previewSurface: '#111111',
    previewBorder: '#333333',
    previewInk: '#ffffff',
  },
  {
    id: 'graphite',
    name: 'Graphite Dark',
    copy: '石墨机身与更柔和暗层级',
    scheme: 'dark',
    previewPage: '#0b0b0c',
    previewSurface: '#141415',
    previewBorder: '#37373b',
    previewInk: '#ffffff',
  },
];
