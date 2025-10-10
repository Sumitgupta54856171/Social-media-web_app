// tailwind.config.js

module.exports = {
  // 🔑 Crucial step: The JIT compiler needs this to watch for dynamic changes
  content: [
    // Standard path for Vite/React setup:
    "./index.html",
    "./src/**/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};