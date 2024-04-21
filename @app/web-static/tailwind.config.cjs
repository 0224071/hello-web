/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@hello-web/tailwind-config/tailwind.config')],

  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        custom: {
          100: '#123156',
        },
      },
    },
  },
  plugins: [],
}
