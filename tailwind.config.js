/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0ecff',
          200: '#c7deff',
          300: '#a5c9ff',
          400: '#7dabff',
          500: '#667eea',
          600: '#3b82f6',
          700: '#2563eb',
          800: '#1d4ed8',
          900: '#1e40af',
        },
        merit: {
          blue: '#667eea',
          'blue-dark': '#3b82f6',
          'blue-light': '#a5c9ff',
          gray: {
            50: '#f8f9fa',
            100: '#f1f3f4',
            200: '#e8eaed',
            300: '#dadce0',
            400: '#9aa0a6',
            500: '#5f6368',
            600: '#3c4043',
            700: '#202124',
            800: '#1a1a1a',
            900: '#000000',
          }
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'omify': '0 8px 32px rgba(0,0,0,0.12)',
        'omify-hover': '0 12px 40px rgba(0,0,0,0.15)',
        'omify-soft': '0 2px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'omify': '20px',
        'omify-small': '16px',
      },
    },
  },
  plugins: [],
}

