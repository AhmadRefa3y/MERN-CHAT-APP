import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                nody: {
                    primary: "#ec4899",

                    secondary: "#fce7f3",

                    accent: "#ffe4e6",

                    neutral: "#f9a8d4",

                    "base-100": "#f9a8d4",

                    info: "#ec4899",

                    success: "#84cc16",

                    warning: "#eab308",

                    error: "#be123c",
                },
            },
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
            "dim",
            "nord",
            "sunset",
        ],
    },
};
