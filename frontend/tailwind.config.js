/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    300: 'rgb(168, 204, 176)', // #A8CCB0
                    500: 'rgb(96, 158, 136)',  // #609E88 - Primary
                    700: 'rgb(42, 86, 77)',     // #2A564D
                },
                navy: {
                    300: 'rgb(160, 177, 198)', // #A0B1C6
                    500: 'rgb(59, 92, 121)',    // #3B5C79 - Dark Accent
                    700: 'rgb(48, 63, 80)',     // #303F50
                },
                skyblue: {
                    600: 'rgb(87, 136, 183)',   // #5788B7 - Secondary
                },
                brown: 'rgb(116, 92, 68)',    // Brown accent
            },
        },
    },
    plugins: [],
}
