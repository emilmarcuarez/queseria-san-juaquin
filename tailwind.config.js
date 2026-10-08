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
          light: '#165B2E',
          subtle: '#F4F8F5'
        },
        brand: {
          forest: '#0B3C1D',
          'forest-dark': '#062612',
          'forest-light': '#145A2E',
          orange: '#EA580C',
          'orange-hover': '#C2410C',
          'orange-light': '#FFF7ED',
          cheese: '#F59E0B',
          'cheese-gold': '#FBBF24',
          'cheese-light': '#FEF3C7',
          'cheese-dark': '#D97706'
        },
        accent: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          bright: '#F59E0B',
          light: '#FFF7ED'
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#fdfbf7',
          muted: '#f5f5f4'
        },
        neutral: {
          dark: '#1c1917',
          muted: '#78716c',
          border: '#e7e5e4'
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
