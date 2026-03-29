/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent-color)',
        'accent-light': 'var(--accent-light)',
        'accent-dark': 'var(--accent-dark)',
      },
    },
  },
  plugins: [],
}
