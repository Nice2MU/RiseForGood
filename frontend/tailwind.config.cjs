const themes = require("daisyui/src/theming/themes");

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(110,231,183,0.28))"
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        riseforgood: {
          ...themes["[data-theme=light]"],
          primary: "#16a34a",
          "primary-focus": "#15803d",
          "primary-content": "#f0fdf4",
          secondary: "#22c55e",
          accent: "#bbf7d0",
          "base-100": "#ecfdf5",
          "base-200": "#dcfce7",
          "base-300": "#bbf7d0"
        }
      }
    ]
  }
};
