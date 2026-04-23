/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', '"Noto Sans SC"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        doto: ['"Doto"', '"Space Mono"', 'monospace']
      },
      colors: {
        ink: 'var(--text-display)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        disabled: 'var(--text-disabled)',
        surface: 'var(--surface)',
        raised: 'var(--surface-raised)',
        line: 'var(--border)',
        lineStrong: 'var(--border-visible)',
        accent: 'var(--accent)'
      }
    }
  },
  plugins: []
};
