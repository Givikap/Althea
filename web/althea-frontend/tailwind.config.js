
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sinera: ['Sinera', 'sans-serif'], // Use 'sans-serif' as a fallback
      },
    },
  },
  plugins: [],
}
