/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Ubuntu: ['Ubuntu', 'sans-serif'],
        Sinera: ['Sinera', 'sans-serif'], // Use 'sans-serif' as a fallback
      },
    },
  },
  plugins: [],
}
