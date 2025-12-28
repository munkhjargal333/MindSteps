/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // tailwind.config.ts
theme: {
  extend: {
    colors: {
      mindful: {
        blue: '#2563eb',
        soft: '#f8fafc',
      }
    }
  }
}
}
