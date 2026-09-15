/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#FFFFFF',
          sub: '#F7F6F2',
          warm: '#F2F0EA',
          primary: '#151515',
          dark: '#242424',
          secondary: '#66635F',
          muted: '#99958F',
          border: '#DEDCD6',
          borderLight: '#ECEAE5',
          accent: '#635BFF',
        },
        brand: {
          500: '#635BFF',
          600: '#5248E2',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        widest: '0.16em',
        editorial: '0.14em',
      },
    },
  },
  plugins: [],
}
