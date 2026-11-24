/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blh: {
          pink: {
            50: '#fff5f7',
            100: '#ffe4ea',
            200: '#fecdd8',
            300: '#fda4ba',
            400: '#fb7194',
            500: '#f43f6e',
          },
          sky: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0284c7',
          },
          mint: {
            50: '#f0fdf7',
            100: '#dcfaee',
            200: '#bbf3dd',
            300: '#86e7c4',
            400: '#34d399',
            500: '#10b981',
          },
          lavender: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#9333ea',
          },
          cream: {
            50: '#fffdf8',
            100: '#fefce8',
            200: '#fef08a',
          },
          hudn: {
            blue: '#02457A',
            teal: '#00917C',
            accent: '#F38181',
          },
          pastel: {
            lila: '#B79CE8',
            lilaDark: '#6B4FA8',
            rosa: '#F6A6C9',
            rosaDark: '#D9609A',
            menta: '#BFEBDD',
            amarillo: '#FFE69A',
            celeste: '#CFE8FF',
            crema: '#FFF8F3',
            text: '#3B2A5C',
            textMuted: '#6E5C8A',
          },
        },
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fredoka"', '"Quicksand"', '"Nunito"', 'sans-serif'],
        fredoka: ['"Fredoka"', '"Nunito"', 'sans-serif'],
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float-slow': 'floatSlow 3.5s infinite ease-in-out',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
      },
      boxShadow: {
        cloud: '0 10px 25px -5px rgba(186, 230, 253, 0.5), 0 8px 10px -6px rgba(186, 230, 253, 0.4)',
        bubble: '0 12px 30px -4px rgba(253, 164, 186, 0.4), 0 4px 6px -2px rgba(253, 164, 186, 0.2)',
        cardGlow: '0 16px 40px -10px rgba(147, 51, 234, 0.2)',
      },
    },
  },
  plugins: [],
};

