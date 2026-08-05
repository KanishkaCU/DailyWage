/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf6f3',
          100: '#f3e8e2',
          200: '#e5d1c5',
          300: '#d4b39f',
          400: '#bf9076',
          500: '#a87356',
          600: '#8c593e', // Rich Warm Brown
          700: '#734630',
          800: '#5e3a29',
          900: '#4e3124',
          950: '#2a1811',
        },
        brown: {
          50: '#faf6f3',
          100: '#f3e8e2',
          200: '#e5d1c5',
          300: '#d4b39f',
          400: '#bf9076',
          500: '#a87356',
          600: '#8c593e',
          700: '#734630',
          800: '#5e3a29',
          900: '#4e3124',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
