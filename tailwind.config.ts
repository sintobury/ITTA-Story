import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                border: "var(--border)",
                "card-bg": "var(--card-bg)",
                "card-shadow": "var(--card-shadow)",
            },
            keyframes: {
                slideUpFade: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeOut: {
                    "0%": { opacity: "1", transform: "translateY(0)" },
                    "100%": { opacity: "0", transform: "translateY(-20px)" },
                },
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                heartBounce: {
                    "0%, 100%": { transform: "scale(1)" },
                    "30%": { transform: "scale(0.9)" },
                    "50%": { transform: "scale(1.1)" },
                },
                ringExpand: {
                    "0%": { transform: "translate(-50%, -50%) scale(0.5)", opacity: "0.5", borderWidth: "3px" },
                    "100%": { transform: "translate(-50%, -50%) scale(1.5)", opacity: "0", borderWidth: "0" },
                },
                particlesExpand: {
                    "0%": { transform: "translate(-50%, -50%) scale(0.5)", opacity: "0.8" },
                    "100%": {
                        transform: "translate(-50%, -50%) scale(1.2)",
                        opacity: "0",
                        boxShadow: `0 -30px 0 #fca5a5, 25px -18px 0 #fee2e2, 30px 10px 0 #fecaca, 18px 25px 0 #fca5a5, 0 30px 0 #fee2e2, -18px 25px 0 #fecaca, -30px 10px 0 #fca5a5, -25px -18px 0 #fee2e2`,
                    },
                },
                flipInRight: {
                    "0%": { opacity: "0.5", transform: "rotateY(-90deg)" },
                    "100%": { opacity: "1", transform: "rotateY(0)" },
                },
                flipInLeft: {
                    "0%": { opacity: "0.5", transform: "rotateY(90deg)" },
                    "100%": { opacity: "1", transform: "rotateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                },
            },
            animation: {
                slideUpFade: "slideUpFade 0.3s ease-out",
                fadeOut: "fadeOut 0.5s ease-in forwards",
                fadeIn: "fadeIn 0.4s ease-out",
                scaleIn: "scaleIn 0.2s ease",
                heartBounce: "heartBounce 0.6s cubic-bezier(0.17, 0.89, 0.43, 1.49)",
                ringExpand: "ringExpand 0.6s ease-out forwards",
                particlesExpand: "particlesExpand 0.6s ease-out forwards",
                flipInRight: "flipInRight 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                flipInLeft: "flipInLeft 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                shimmer: "shimmer 1.5s infinite",
            },
        },
    },
    plugins: [
        typography,
    ],
};
export default config;
