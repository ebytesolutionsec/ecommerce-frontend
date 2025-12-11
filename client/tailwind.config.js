/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados del proyecto
      colors: {
        primary: {
          DEFAULT: '#a3195b',
          dark: '#8a1450',
        },
        secondary: {
          DEFAULT: '#662482',
          dark: '#551d6d',
        },
        accent: {
          red: '#e2312d',
          orange: '#e86031',
          'orange-light': '#f08f34',
          yellow: '#f29100',
        },
      },
    },
  },
  plugins: [],
}
