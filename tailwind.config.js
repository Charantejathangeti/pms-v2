/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f7ff",
          100: "#e0effe",
          200: "#baddfd",
          300: "#7ec0fb",
          400: "#389df7",
          500: "#0e7fe1",
          600: "#0262bf",
          700: "#034e9b",
          800: "#07437f",
          900: "#0c3969",
          950: "#082446",
        },
        navy: {
          900: "#060d1f",
          800: "#0a1628",
          700: "#0f2040",
          600: "#162d56",
          500: "#1e3d6e",
        },
        surface: "#060d1f",
      },
      fontFamily: {
        sans:    ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Clash Display'", "'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-blue": "radial-gradient(at 40% 20%, #0e7fe120 0px, transparent 50%), radial-gradient(at 80% 0%, #0262bf15 0px, transparent 50%), radial-gradient(at 0% 50%, #07437f10 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-blue": "0 0 40px rgba(14,127,225,0.15)",
        "glow-sm":   "0 0 20px rgba(14,127,225,0.10)",
        "card":      "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
      },
      animation: {
        "fade-in":   "fadeIn 0.5s ease-out forwards",
        "slide-up":  "slideUp 0.5s ease-out forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "float":     "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:   { from: { opacity: "0" },                          to: { opacity: "1" } },
        slideUp:  { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseDot: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.5", transform: "scale(0.8)" } },
        float:    { "0%,100%": { transform: "translateY(0px)" },    "50%": { transform: "translateY(-12px)" } },
      },
    },
  },
  plugins: [],
};
