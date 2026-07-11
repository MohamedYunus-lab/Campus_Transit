/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sairam Transit System Design Colors
        surface: {
          DEFAULT: '#f8f9fa',
          dim: '#d9dadb',
          bright: '#f8f9fa',
          container: {
            lowest: '#ffffff',
            low: '#f3f4f5',
            DEFAULT: '#edeeef',
            high: '#e7e8e9',
            highest: '#e1e3e4',
          }
        },
        primary: {
          DEFAULT: '#004ac6',
          container: '#2563eb',
          50: '#eeefff',
          100: '#dbe1ff',
          200: '#b4c5ff',
          600: '#003ea8',
          700: '#00174b',
        },
        secondary: {
          DEFAULT: '#585f6c',
          container: '#dce2f3',
          100: '#c0c7d6',
          600: '#404754',
          700: '#151c27',
        },
        tertiary: {
          DEFAULT: '#943700',
          container: '#bc4800',
          100: '#ffb596',
          700: '#360f00',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#065f46',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fef2f2',
          dark: '#991b1b',
        },
        outline: {
          DEFAULT: '#737686',
          variant: '#c3c6d7',
        },
        'on-surface': {
          DEFAULT: '#191c1d',
          variant: '#434655',
        },
        'border-subtle': '#e5e7eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-bold': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'badge-cap': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '700' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        'gutter': '1.5rem',
        'container-max': '1280px',
      },
      boxShadow: {
        'card': '0px 1px 3px rgba(0,0,0,0.1)',
        'card-hover': '0px 4px 6px rgba(0,0,0,0.05)',
        'elevated': '0px 4px 12px rgba(37, 99, 235, 0.08)',
      },
    },
  },
  plugins: [],
}
