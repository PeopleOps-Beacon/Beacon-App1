/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        beacon: {
          black: "#030405",
          gold: "#f5b72f",
          amber: "#ffcf66",
          graphite: "#11151c"
        }
      }
    }
  },
  plugins: []
};
