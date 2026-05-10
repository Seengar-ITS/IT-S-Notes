/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: { extend: { colors: { its: { 400:'#a89fff', 500:'#8b83ff', 600:'#6C63FF', 700:'#5a52e0' } } } },
  plugins: []
}