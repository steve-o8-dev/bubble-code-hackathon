/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'bg-good', 'bg-info', 'bg-warn', 'bg-bad',
    'text-good', 'text-info', 'text-warn', 'text-bad',
  ],
  theme: {
    extend: {
      colors: {
        pru: {
          // Brand red #ED1B2E used as a disciplined accent, plus deeper tones
          red: '#ED1B2E',
          'red-600': '#D11425',
          'red-700': '#B30F1F',
          maroon: '#7A0C16',
          'maroon-deep': '#4A0810',
          ink: '#15171C',
          'ink-soft': '#272A31',
          slate: '#5B6170',
          mist: '#F6F7F9',
          line: '#E6E8EC',
        },
        good: '#1B9E6B',
        'good-soft': '#E7F6EF',
        warn: '#C8881B',
        'warn-soft': '#FBF1DD',
        bad: '#D11425',
        'bad-soft': '#FCE8EA',
        info: '#2563EB',
        'info-soft': '#E8EFFE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21,23,28,0.04), 0 4px 16px rgba(21,23,28,0.06)',
        pop: '0 8px 30px rgba(21,23,28,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(237,27,46,0.45)' },
          '70%': { boxShadow: '0 0 0 10px rgba(237,27,46,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(237,27,46,0)' },
        },
        'bar-grow': {
          '0%': { width: '0%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pulse-ring': 'pulse-ring 1.6s infinite',
        'bar-grow': 'bar-grow 0.9s ease-out both',
      },
    },
  },
  plugins: [],
}
