/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316",    // Swiggy Orange
        background: "#FFF8F0", // Soft cream background
        dark: "#111827",       // Deep gray for text
        muted: "#6B7280",      // Muted text
        success: "#22C55E",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
