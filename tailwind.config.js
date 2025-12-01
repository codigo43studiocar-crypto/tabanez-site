/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a662f",         // Verde forte do tema
        "primary-dark": "#064d23",  // Verde escuro
        "accent-yellow": "#ffd400", // Amarelo destaque
        "neutral-dark": "#1a1a1a",
      },
      borderRadius: {
        card: "18px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
