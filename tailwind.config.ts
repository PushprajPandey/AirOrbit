import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f6faff',
        surface: '#f6faff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f4fa',
        'surface-container': '#eaeef4',
        'surface-container-high': '#e4e8ee',
        'surface-container-highest': '#dee3e9',
        'on-surface': '#171c20',
        'on-surface-variant': '#3e4850',
        'on-background': '#171c20',
        primary: '#006591',
        'primary-container': '#0ea5e9',
        'on-primary': '#ffffff',
        'on-primary-container': '#003751',
        secondary: '#505f76',
        'secondary-container': '#d0e1fb',
        tertiary: '#8a5100',
        'tertiary-container': '#de8712',
        outline: '#6e7881',
        'outline-variant': '#bec8d2',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'inverse-surface': '#2c3135',
        'inverse-on-surface': '#edf1f7',
        success: '#15803d',
        'success-container': '#dcfce7',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['30px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
        'badge-sm': ['12px', { lineHeight: '12px', fontWeight: '600' }],
      },
      spacing: {
        margin: '32px',
        gutter: '24px',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
