/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#020617',
        accent: '#4f46e5',
        aqua: '#22d3ee',
      },
    },
  },
  plugins: [],
};
