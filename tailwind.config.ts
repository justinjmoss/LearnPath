import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#ffffff',
          text: '#000000',
          primary: '#3b82f6', // This is the blue-500 color
          secondary: '#f3f4f6',
          input: {
            bg: '#f3f4f6',
            text: '#1f2937',
            border: '#d1d5db',
          },
        },
        dark: {
          bg: '#111827',
          text: '#ffffff',
          primary: '#3b82f6', // This is the blue-500 color
          secondary: '#374151',
          input: {
            bg: '#1f2937',
            text: '#e5e7eb',
            border: '#4b5563',
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
