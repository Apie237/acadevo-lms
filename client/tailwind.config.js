/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'acadevo': {
          cream: '#E6E5E1',
          teal: '#409891',
          sage: '#BAD0CC',
          cyan: '#48ADB7',
          gold: '#FF6F61'
        },
      },
      gridTemplateColumns: {
        'auto' :'repeat(auto-fit, minmax(200px, 1fr))',
      },
      spacing: {
        'section-height': '500px',
      },
    },
  },
  plugins: [],
}