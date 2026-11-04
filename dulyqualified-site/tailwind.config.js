/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Readex Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        ember: '#FA8453',
        blush: '#F8C9B2',
        navy: '#1e3a8a',
        ink: '#0F1626',
      },
    },
  },
  plugins: [],
};
