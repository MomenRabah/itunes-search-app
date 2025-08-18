import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex': ['IBM Plex Sans Arabic', 'sans-serif'],
        'sans': ['IBM Plex Sans Arabic', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        tab: {
            DEFAULT: "var(--color-tab-default)",
            hover: "var(--color-tab-hover)",
            active: "var(--color-tab-active)"
        },  
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
