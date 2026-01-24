/**
 * Tailwind configuration for QRCreator
 *
 * Uses custom color palette defined in @frontend/src/assets/landing.css
 * Allows dark mode via class strategy
 */
module.exports = {
  content: ["./index.css", "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
    require("tailwindcss-view-transitions"),
    require('@tailwindcss/aspect-ratio'),
  ],
};
