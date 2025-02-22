import type { Config } from "tailwindcss";

export default {
  content: [
    "src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      height: {
        "95vh": "95vh",
        "90vh": "90vh",
        "85vh": "85vh",
        "80vh": "80vh",
        "70vh": "70vh",
      },
    },
  },
  plugins: [],
} satisfies Config;
