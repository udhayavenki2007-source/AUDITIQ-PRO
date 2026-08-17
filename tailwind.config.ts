import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { navy: "#102A43", mint: "#2CB67D" } } }, plugins: [] };
export default config;
