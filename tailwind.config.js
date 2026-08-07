/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0075de", active: "#005bab" },
        secondary: "#213183",
        canvas: { DEFAULT: "#ffffff", soft: "#f6f5f4" },
        surface: "#ffffff",
        ink: {
          DEFAULT: "#000000",
          secondary: "#31302e",
          muted: "#615d59",
          faint: "#a39e98",
        },
        hairline: "#e6e6e6",
        accent: {
          sky: "#62aef0",
          purple: "#d6b6f6",
          "purple-deep": "#391c57",
          pink: "#ff64c8",
          orange: "#dd5b00",
          "orange-deep": "#793400",
          teal: "#2a9d99",
          green: "#1aae39",
          brown: "#523410",
        },
      },
      fontFamily: {
        sans: [
          "'SF Pro Display'",
          "'SF Pro Text'",
          "'PretendardLocal'",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-1": ["64px", { lineHeight: "1", letterSpacing: "-2.125px", fontWeight: "700" }],
        "display-2": ["54px", { lineHeight: "1.04", letterSpacing: "-1.875px", fontWeight: "700" }],
        "heading-1": ["40px", { lineHeight: "1.1", letterSpacing: "-1px", fontWeight: "700" }],
        "heading-2": ["26px", { lineHeight: "1.23", letterSpacing: "-0.625px", fontWeight: "700" }],
        "heading-3": ["22px", { lineHeight: "1.27", letterSpacing: "-0.25px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "1.4", letterSpacing: "-0.125px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", letterSpacing: "0" }],
        "body-sm": ["15px", { lineHeight: "1.33", letterSpacing: "0" }],
        button: ["16px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "500" }],
        caption: ["14px", { lineHeight: "1.43", letterSpacing: "0" }],
        eyebrow: ["12px", { lineHeight: "1.33", letterSpacing: "0.125px", fontWeight: "600" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "5px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        soft: "0 0.175px 1.041px rgba(0,0,0,0.01), 0 0.8px 2.925px rgba(0,0,0,0.02), 0 2.025px 7.847px rgba(0,0,0,0.027), 0 4px 18px rgba(0,0,0,0.04)",
        elevated:
          "0 0.175px 1.041px rgba(0,0,0,0.01), 0 0.8px 2.925px rgba(0,0,0,0.02), 0 2.025px 7.847px rgba(0,0,0,0.027), 0 4px 18px rgba(0,0,0,0.04), 0 23px 52px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
