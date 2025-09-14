/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'cheltenham': ['ITC Cheltenham Std', 'serif'],
        'zeyada': ['Zeyada', 'cursive'],
      },
      colors: {
        brand: '#F3DAC3',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
};