module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006B3F",
          light: "#00A34A",
          dark: "#004629"
        },
        accent: {
          yellow: "#FFDF00"
        },
        neutral: {
          bg: "#F3F4F6",
          dark: "#222222"
        }
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.10)"
      },
      borderRadius: {
        card: "1rem"
      }
    }
  },
  plugins: [],
};
