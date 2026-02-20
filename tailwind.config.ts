import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0b0d",
        bg2: "#0f1114",
        bg3: "#14171c",
        border: "#1e2330",
        orange: "#f5700a",
        "orange-dim": "#b84e00",
        gold: "#c9a84c",
        "text-muted": "#5a6475",
        "text-dim": "#8a95a3",
      },
      fontFamily: {
        rajdhani: ["Rajdhani", "sans-serif"],
        barlow: ["Barlow Condensed", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ticker: "ticker 25s linear infinite",
        fadeUp: "fadeUp 0.4s ease forwards",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
