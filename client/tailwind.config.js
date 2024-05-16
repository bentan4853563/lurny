/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      montserrat: ["Montserrat"],
      raleway: ["Raleway"],
      sans: ["Arial"],
    },
    fontWeight: {
      bold: 700,
    },
  },
  plugins: [],
};
