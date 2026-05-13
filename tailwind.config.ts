import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        gold: {
          50: "#fff8ea",
          100: "#e7b86a",
          300: "#c98b37",
          500: "#9d6823",
          700: "#624017",
        },
        lotus: "#0891b2", // Cyan-600 for consistency with hero
        ember: "#c76236",
        river: "#27221f",
        obsidian: "#faf7f2",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        "gold-soft": "0 24px 80px rgba(200, 164, 93, 0.12)",
        "glass-inner": "inset 0 1px 1px rgba(255,255,255,0.16)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.16, 1, 0.3, 1)",
        glass: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
}

export default config
