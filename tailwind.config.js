/** @type {import('tailwindcss').Config} */
export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        foreground: '#083355',
        background: '#ffffff',
        primary: '#ff7a00',
        secondary: '#ffffff',
        subtle: '#eeeeee',
        muted: '#999999',
        success: '#00b300',
        danger: '#b30000',
        border: '#083355',
      },
      // fontSize: {
      //   sm: ['0.75rem', { lineHeight: '1rem' }],
      //   base: ['0.875rem', { lineHeight: '1.25rem' }],
      //   lg: ['1rem', { lineHeight: '1.5rem' }],
      //   xl: ['1.125rem', { lineHeight: '1.75rem' }],
      //   '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
      // },
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
};
