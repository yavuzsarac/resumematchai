import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        muted: "#667085",
        brand: {
          50: "#eef4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a4bcfd",
          400: "#8098f9",
          500: "#6172f3",
          600: "#444ce7",
          700: "#3538cd"
        },
        mint: "#12b76a",
        coral: "#f97066"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
