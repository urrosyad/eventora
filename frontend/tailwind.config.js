/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FA",
        surface: "#FFFFFF",
        "surface-soft": "#F3F5F7",
        ink: "#0B0F19",
        "muted-ink": "#5B6573",
        border: "#E3E7ED",
        "border-strong": "#CBD5E1",
        "primary-blue": "#1E3A5F",
        "accent-blue": "#2E86AB",
        silver: "#A7B4C2",
        "soft-blue": "#EAF4FF",
        success: "#1F9D55",
        warning: "#B7791F",
        danger: "#D92D20",
        "orange-soft": "#FFF3E6",
      },
      fontFamily: {
        sans: ["Geist Sans", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      animation: {
        "infinite-scroll": "infinite-scroll 40s linear infinite",
        "marquee-vertical": "marquee-vertical 30s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-vertical": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
    },
  },
  plugins: [],
}
