/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          base: 'var(--theme-bg-base)',
          surface: 'var(--theme-bg-surface)',
          elevated: 'var(--theme-bg-surface-elevated)',
          nav: 'var(--theme-bg-nav)',
          card: 'var(--theme-bg-card)',
          'card-hover': 'var(--theme-bg-card-hover)',
          input: 'var(--theme-bg-input)',
          'border-subtle': 'var(--theme-border-subtle)',
          'border-card': 'var(--theme-border-card)',
          'border-input': 'var(--theme-border-input)',
          primary: 'var(--theme-text-primary)',
          secondary: 'var(--theme-text-secondary)',
          muted: 'var(--theme-text-muted)'
        },
        brand: {
          dark: '#070E17',
          navy: '#0B192C',
          navyLight: '#1E3E62',
          navyDark: '#070E17',
          surface: '#0F1D32',
          card: '#162740',
          ocean: '#1E3E62',
          oceanLight: '#0072CE',
          lightBlue: '#2E5A88',
          gold: '#F59E0B',
          goldLight: '#FBBF24',
          goldDark: '#D97706',
          goldHover: '#D97706',
          coral: '#FF6B6B',
          emerald: '#10B981',
          cyan: '#06B6D4',
          blue: '#0284C7'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        display: ['"Cinzel"', 'serif']
      }
    }
  }
};
