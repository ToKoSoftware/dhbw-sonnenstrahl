// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: {
    enabled: true,
    content: ['./src/**/*.html', './src/**/*.ts'],
  },
  // ...
}
