module.exports = {
  content: [
    "./src/*.html",
    "./src/app/**/**/**/*.html",
    "./src/*.ts",
    "./src/app/**/**/**/*.ts"
  ],
  theme: {
    extend: {
      scale: {
        98: '.98',
      },
      keyframes: {
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-0.5rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 300ms ease-out',
        'fade-in-up': 'fade-in-up 300ms ease-out',
      },
    }
  },
  plugins: [],
}
