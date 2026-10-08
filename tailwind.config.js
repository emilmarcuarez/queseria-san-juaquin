export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3C1D',
          dark: '#062612',
          light: '#8DC63F',
          subtle: '#F2F9E6'
        },
        brand: {
          lime: '#8DC63F',
          'lime-light': '#F2F9E6',
          'lime-hover': '#78AD2F',
          'lime-dark': '#629320',
          forest: '#0B3C1D',
          'forest-dark': '#062612',
          'forest-light': '#145A2E',
          cheese: '#F59E0B',
          'cheese-light': '#FEF3C7',
          'cheese-dark': '#D97706',
          wave: '#16A34A'
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          bright: '#FBBF24',
          light: '#FEF3C7'
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f8faf9',
          muted: '#f0f3f1'
        },
        neutral: {
          dark: '#142118',
          muted: '#5a6b60',
          border: '#dbe5de'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
