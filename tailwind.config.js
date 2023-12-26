/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
