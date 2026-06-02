import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        card: "#151515",
        ink: "#F5F0E8",
        muted: "#A8A095",
        line: "#2A2A2A",
        copper: "#C17D3C",
        gold: "#D8B46A",
        "deep-purple": "#2B183F",
        "mystic-blue": "#14213D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        aura: "0 0 80px -20px rgba(216, 180, 106, 0.35)",
        card: "0 30px 80px -40px rgba(0, 0, 0, 0.9)",
      },
      backgroundImage: {
        "radial-aura":
          "radial-gradient(60% 50% at 50% 0%, rgba(193,125,60,0.18) 0%, rgba(5,5,5,0) 70%)",
        "copper-gold":
          "linear-gradient(135deg, #C17D3C 0%, #D8B46A 50%, #C17D3C 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "aura-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "aura-pulse": "aura-pulse 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
