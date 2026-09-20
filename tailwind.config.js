export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#165B33',
          dark: '#0e3d22',
          light: '#237a47',
          subtle: '#eaf4ee'
        },
        accent: {
          DEFAULT: '#F5A623',
          hover: '#e59616',
          bright: '#FFB703',
          light: '#fff8e6'
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f8faf9',
          muted: '#f0f3f1'
        },
        neutral: {
          dark: '#1e2621',
          muted: '#5e6d62',
          border: '#e1e7e3'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
