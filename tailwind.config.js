// Add this to your existing tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  // ... other config
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      // ... other theme extensions
    },
  },
  // ... other config
}