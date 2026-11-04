/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Readex Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Natural palette: stone, bark and moss. No neon.
        paper: '#ECEBE6',
        card: '#F7F6F2',
        ink: '#25261F',
        moss: '#4E5D3B',
        sage: '#8A9A72',
        sand: '#CDBFA5',
        clay: '#8E6A4E',
        ok: '#526E46',
        warn: '#966A1E',
        bad: '#924438',
        info: '#4A5F71',
      },
    },
  },
  plugins: [],
};
