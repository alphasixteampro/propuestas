/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        navy: '#0a2342',
        blue: '#1d70a2',
        teal: '#00bfa5',
      },
    },
  },
  plugins: [],
};
