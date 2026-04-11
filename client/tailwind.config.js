/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#020617',
        editor: '#0d1117',
        sidebar: '#010409',
        activity: '#010409',
        accent: {
          DEFAULT: '#8b5cf6', // Violet
          hover: '#a78bfa',
          subtle: 'rgba(139, 92, 246, 0.1)',
        }
      },
      boxShadow: {
        'accent-glow': '0 0 20px -5px rgba(139, 92, 246, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
