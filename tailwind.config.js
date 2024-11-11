/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.vue",
  ],
  theme: {
    extend: {
      rotate: {
        '180': '180deg',
      }
    },
  },
  variants: {
    extend: {
      backfaceVisibility: ['hover', 'focus'],
    },
  },
  plugins: [],
}
