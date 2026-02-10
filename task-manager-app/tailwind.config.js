/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F15412',
          light: '#FF6B2C',
          dark: '#D94100',
        },
        secondary: {
          DEFAULT: '#34B3F1',
          light: '#5FC4FF',
          dark: '#1B9AD6',
        },
        neutral: {
          DEFAULT: '#EEEEEE',
          dark: '#000000',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
      },
    }
  },
  plugins: [],
};

