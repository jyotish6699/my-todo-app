/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e', // Green brand color
          600: '#16a34a',
          900: '#14532d',
        },
        dark: {
          900: '#111827', // Very dark blue/gray
          800: '#1f2937', // Panel bg
          700: '#374151', // Border/Hover
          600: '#4b5563', // Text
        },
        sidebar: '#fbfdfc', // Very light background for sidebar
      }
    },
  },
  plugins: [],
}
