/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          850: '#154b2f',
          950: '#0b2618',
        },
        primary: '#1F5E3B',
        secondary: '#8B5E3C',
        accent: '#C9A227',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
