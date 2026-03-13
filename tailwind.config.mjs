import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        phonetec: '#2563EB',
        accent: '#F97316',
        ink: '#0F172A',
      },
      boxShadow: {
        glow: '0 24px 60px -24px rgba(37, 99, 235, 0.35)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(37, 99, 235, 0.18), transparent 40%), linear-gradient(135deg, rgba(15, 23, 42, 0.03), rgba(37, 99, 235, 0.08))',
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