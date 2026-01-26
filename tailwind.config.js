/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f4a261',
          hover: '#e89451',
        },
        secondary: '#2d4356',
        muted: '#b8c5d6',
        background: '#f5f5f5',
        visited: '#6ecf8e',
        'want-to-visit': '#5fa8d3',
      },
    },
  },
  plugins: [],
}
