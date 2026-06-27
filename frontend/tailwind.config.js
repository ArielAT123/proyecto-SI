/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We will define custom premium dark theme colors
        dark: {
          50: '#f6f6f9',
          100: '#ececf3',
          200: '#d5d5e5',
          300: '#b1b1ce',
          400: '#8787b0',
          500: '#676797',
          600: '#525280',
          700: '#43436a',
          800: '#272744',
          900: '#1b1b32',
          950: '#0f0f1d',
        }
      }
    },
  },
  plugins: [],
}
