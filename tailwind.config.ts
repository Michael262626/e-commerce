// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B35", // Replace with the color v0 used
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2C5F7C",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFB800",
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        // Any other tokens v0 used (border, input, ring, etc.)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
