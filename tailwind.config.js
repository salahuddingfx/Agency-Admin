/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#18B7F5', // Sky Blue
          secondary: '#1F8EF1', // Royal Blue
          accent: '#2563EB', // Cobalt Blue
          dark: '#0F172A', // Slate Dark
          darker: '#020617', // Slate Darker
          light: '#F8FAFC', // Slate Light (Light Mode Page Bg)
          slateAccent: '#1e293b', // Slate Border/Card Background
          
          // Light Mode Specifics
          bgLight: '#F1F5F9', // Page body bg in light mode
          cardLight: '#FFFFFF', // Card bg in light mode
          borderLight: '#E2E8F0', // Border in light mode
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'premium': '0 10px 30px -10px rgba(37, 99, 235, 0.08)',
        'light': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
