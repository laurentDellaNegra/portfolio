/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF7E32",
        "background-light": "#2A243D",
        "background-dark": "#171424",
        astro: {
          DEFAULT: "#2A243E",
          50: "#D8D4E6",
          100: "#CBC6DE",
          200: "#B1A9CD",
          300: "#978CBC",
          400: "#7C6FAB",
          500: "#655795",
          600: "#514678",
          700: "#3E355B",
          800: "#2A243E",
          900: "#1B1727",
        },
      },
    },
  },
  plugins: [],
};
