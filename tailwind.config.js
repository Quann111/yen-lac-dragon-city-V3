/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#C2D6FF',
          300: '#94B8FF',
          400: '#5C91FF',
          500: '#2E66FF',
          600: '#003D8D', // The requested Royal Blue
          700: '#002E6A',
          800: '#002350',
          900: '#001530',
        },
        gold: {
          50: '#FCF9F0',
          100: '#F9F1D8',
          200: '#F2E2B5',
          300: '#EBD292',
          400: '#E4C26F',
          500: '#D4AF37', // Classic Gold
          600: '#B5922B',
          700: '#947620',
          800: '#755C18',
          900: '#5A4611',
        },
        navy: {
          800: '#1a202c', // Fallback for dark backgrounds
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        plus: ['"Plus Jakarta Sans"', 'sans-serif'],
        qbone: ['Chakra Petch', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 255, 0.5)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
      }
    }
  },
  plugins: [],
}
