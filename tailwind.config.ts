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
        saffron: {
          50: "#fff9f0",
          100: "#ffedd1",
          200: "#ffd9a3",
          300: "#ffc166",
          400: "#F4B860", // Royal Light Saffron
          500: "#d99c43",
          600: "#b97a2e",
          700: "#965e25",
        },
        lotus: "#F4B860", // Updated to Saffron
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
