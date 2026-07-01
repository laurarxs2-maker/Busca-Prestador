/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Acento azul (botões, links, badges)
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Superfícies (soft dark blue) do tema escuro
        navy: {
          950: '#0a1020',
          900: '#0f1a2e',
          800: '#16243f',
          700: '#1e3050',
          600: '#294066',
          500: '#365285',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.1)',
        'card-hover': '0 12px 24px -8px rgba(16, 24, 40, 0.12)',
      },
    },
  },
  plugins: [],
};
