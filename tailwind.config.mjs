import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        phonetec: '#0e40d8',
        accent: '#F97316',
        ink: '#0F172A',
        cta: '#dee9fc',
      },
      boxShadow: {
        glow: '0 24px 60px -24px rgba(14, 64, 216, 0.35)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(14, 64, 216, 0.22), transparent 40%), linear-gradient(135deg, rgba(7, 7, 8, 0.8), rgba(14, 64, 216, 0.10))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'soft-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.92' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [forms],
};