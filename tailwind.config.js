/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral Colors
        "neutral-white": "#ffffff",
        "neutral-black": "#333538",
        "neutral-gray1": "#7D8188",
        "neutral-gray2": "#E2E3E5",
        "neutral-gray3": "#EDEFF2",
        "neutral-gray4": "#FAFAFA",

        // Primary Colors
        "primary-main": "#B0153D",
        "primary-hover": "#DC1C47",
        "primary-surface": "#FFF1F2",

        // Semantic Colors
        "semantic-red1": "#D32F2F",
        "semantic-red2": "#FDEAEA",
        "semantic-green1": "#027A48",
        "semantic-green2": "#038C56",
        "semantic-green3": "#D1FADF",
        "semantic-yellow1": "#A37B00",
        "semantic-yellow2": "#BA8B00",
        "semantic-yellow3": "#FFF8E1",
        "semantic-purple1": "#5B21B6",
        "semantic-purple2": "#EDE9FE",
        "semantic-lightGreen1": "#27C219",
        "semantic-lightGreen2": "#E9FFE7",
      },
      fontSize: {
        "2xs": "0.625rem", // 10px
        xs: "0.75rem", // 12px Text M
        sm: "0.875rem", // 14px Text L
        base: "1rem", // 16px Heading S
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px Heading M
        "2xl": "1.5rem", // 24px Heading L
        "3xl": "1.75rem", // 28px
      },
    },
  },
  plugins: [],
};
