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
          50: '#fff0f0',
          100: '#ffdbdb',
          200: '#ffbaba',
          300: '#ff8a8a',
          400: '#ff4d4d',
          500: '#ff1a1a',
          600: '#e60023',
          700: '#bd081c',
          800: '#9e0918',
          900: '#7a0713',
          950: '#4a020a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
