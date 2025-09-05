/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fef9f5',
          100: '#fef2e8',
          200: '#fde2d0',
          300: '#fbcbad',
          400: '#f8a87d',
          500: '#f48454',
          600: '#e6653a',
          700: '#d14d2a',
          800: '#b03f26',
          900: '#8f3624',
          950: '#4e1a10',
        },
        primary: {
          50: '#fef9f5',
          100: '#fef2e8',
          200: '#fde2d0',
          300: '#fbcbad',
          400: '#f8a87d',
          500: '#f48454',
          600: '#e6653a',
          700: '#d14d2a',
          800: '#b03f26',
          900: '#8f3624',
          950: '#4e1a10',
        },
        warm: {
          50: '#fef9f5',
          100: '#fef2e8',
          200: '#fde2d0',
          300: '#fbcbad',
          400: '#f8a87d',
          500: '#f48454',
          600: '#e6653a',
          700: '#d14d2a',
          800: '#b03f26',
          900: '#8f3624',
          950: '#4e1a10',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
