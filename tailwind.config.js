const fallbackFonts = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        special: ["lobular", ...fallbackFonts],
        sans: ["FUNGIS", ...fallbackFonts],
        serif: ["serif"],
        mono: ["monospace"],
      },
      colors: {
        fg: "#FF0040",
        fgDark: "#D60039",
        bg: "#FCFEFF",
        alt: "#FFEB84",
        grayDark: "#5D7280",
        grayMed: "#D0DFE7",
        grayLight: "#E1ECF2",
        grayUltraLight: "#F1FAFF",
      },
      backgroundImage: {
        "tooth-pattern": "url('/images/tooth-pattern.svg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-touch')(),
  ],
};
