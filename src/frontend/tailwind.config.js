/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'object-top',
    'object-cover',
    'object-contain',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}