/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      'primary': '#000200',
      'secondary': '#1B9C54',
      'greenlight': '#9AF19A',
    },
  },
},
plugins: [

],
}

