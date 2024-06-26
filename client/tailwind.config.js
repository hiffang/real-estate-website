/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Poppins", "sans-serif"],
      },
      animation: {
        'pulse-custom': 'pulse 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 15px 10px rgba(0, 0, 255, 0.7)',
            opacity : '1',
          },
          '50%': { 
            transform: 'scale(1.1)', 
            boxShadow: '0 0 15px 10px rgba(0, 0, 255, 0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
