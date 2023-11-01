import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        black: "#1D1D1D",
      },
    },
  },
  plugins: [],
}
export default config
