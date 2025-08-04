/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'floral-white': {
          DEFAULT: '#fffcf2',
          100: '#634c00',
          200: '#c69800',
          300: '#ffcd2a',
          400: '#ffe48d',
          500: '#fffcf2',
          600: '#fffcf3',
          700: '#fffdf6',
          800: '#fffef9',
          900: '#fffefc'
        },
        'timberwolf': {
          DEFAULT: '#ccc5b9',
          100: '#2d2821',
          200: '#5a5141',
          300: '#877962',
          400: '#ab9f8b',
          500: '#ccc5b9',
          600: '#d6d0c6',
          700: '#e0dcd4',
          800: '#eae8e3',
          900: '#f5f3f1'
        },
        'black-olive': {
          DEFAULT: '#403d39',
          100: '#0d0c0c',
          200: '#1a1917',
          300: '#272523',
          400: '#34312e',
          500: '#403d39',
          600: '#6a655e',
          700: '#928c84',
          800: '#b6b2ad',
          900: '#dbd9d6'
        },
        'eerie-black': {
          DEFAULT: '#252422',
          100: '#070707',
          200: '#0f0e0e',
          300: '#161615',
          400: '#1e1d1b',
          500: '#252422',
          600: '#53514c',
          700: '#807d76',
          800: '#aba8a4',
          900: '#d5d4d1'
        },
        'flame': {
          DEFAULT: '#eb5e28',
          100: '#321205',
          200: '#652309',
          300: '#97350e',
          400: '#ca4713',
          500: '#eb5e28',
          600: '#ef7f53',
          700: '#f39f7e',
          800: '#f7bfa9',
          900: '#fbdfd4'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 300ms ease-out',
        'slideUp': 'slideUp 300ms ease-out',
        'slideDown': 'slideDown 300ms ease-out',
        'scaleIn': 'scaleIn 200ms ease-out',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        slideDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      },
    },
  },
  plugins: [],
}