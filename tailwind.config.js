import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./features/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                /* Semantic theme colors using CSS variables */
                background: {
                    DEFAULT: 'rgb(var(--background) / <alpha-value>)',
                    secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--background-tertiary) / <alpha-value>)',
                },
                foreground: {
                    DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
                    secondary: 'rgb(var(--foreground-secondary) / <alpha-value>)',
                    muted: 'rgb(var(--foreground-muted) / <alpha-value>)',
                    subtle: 'rgb(var(--foreground-subtle) / <alpha-value>)',
                },
                card: {
                    DEFAULT: 'rgb(var(--card) / <alpha-value>)',
                    hover: 'rgb(var(--card-hover) / <alpha-value>)',
                },
                border: {
                    DEFAULT: 'rgb(var(--border) / <alpha-value>)',
                    secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
                },
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    hover: 'rgb(var(--primary-hover) / <alpha-value>)',
                    light: 'rgb(var(--primary-light) / <alpha-value>)',
                    foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
                    hover: 'rgb(var(--secondary-hover) / <alpha-value>)',
                    light: 'rgb(var(--secondary-light) / <alpha-value>)',
                },
                success: {
                    DEFAULT: 'rgb(var(--success) / <alpha-value>)',
                    light: 'rgb(var(--success-light) / <alpha-value>)',
                },
                warning: {
                    DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
                    light: 'rgb(var(--warning-light) / <alpha-value>)',
                },
                danger: {
                    DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
                    light: 'rgb(var(--danger-light) / <alpha-value>)',
                },
                info: {
                    DEFAULT: 'rgb(var(--info) / <alpha-value>)',
                    light: 'rgb(var(--info-light) / <alpha-value>)',
                },
                input: {
                    DEFAULT: 'rgb(var(--input) / <alpha-value>)',
                    border: 'rgb(var(--input-border) / <alpha-value>)',
                    focus: 'rgb(var(--input-focus) / <alpha-value>)',
                },
                code: {
                    bg: 'rgb(var(--code-bg) / <alpha-value>)',
                    fg: 'rgb(var(--code-fg) / <alpha-value>)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderColor: {
                DEFAULT: 'rgb(var(--border) / <alpha-value>)',
            },
        },
    },
    plugins: [typography],
}
