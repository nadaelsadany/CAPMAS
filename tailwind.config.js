/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        capmas: {
          primary: '#1e3a8a',
          secondary: '#64748b',
          accent: '#0284c7',
          light: '#f1f5f9',
          dark: '#0f172a'
        }
      },
      borderRadius: {
        DEFAULT: '0.5rem', // 8px (was 4px)
        'md': '0.75rem',   // 12px (was 6px)
        'lg': '1rem',      // 16px (was 8px)
        'xl': '1.25rem',   // 20px (was 12px)
        '2xl': '1.5rem',   // 24px (was 16px)
        '3xl': '2rem',     // 32px (was 24px)
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
