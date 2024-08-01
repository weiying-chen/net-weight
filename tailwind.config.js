/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: '#083355',
        primary: '#ffde00',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderWidth: {
        DEFAULT: '1.5px',
      },
      boxShadow: {
        DEFAULT: '4px 4px 0px rgba(0, 0, 0, 0.1)',
        dark: '4px 4px 0px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

