/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vanilla: {
          50: '#FFFCF7',
          100: '#FFF8ED',
          200: '#FDF0DC',
          300: '#F9E5C5',
          DEFAULT: '#FFF8ED',
        },
        strawberry: {
          50: '#FEF2F4',
          100: '#FDE8ED',
          200: '#FCD2DB',
          300: '#F8A8BA',
          400: '#F3848F',
          500: '#E95D6C',
          600: '#D63D4F',
          DEFAULT: '#F3848F',
        },
        babyblue: {
          50: '#F0F7FB',
          100: '#E1EFF7',
          200: '#C2DFEF',
          300: '#94C7E3',
          400: '#5BA9D3',
          500: '#3689BA',
          600: '#2A6F97',
          DEFAULT: '#3689BA',
        },
        mint: {
          100: '#EBF6EF',
          300: '#C8E6D5',
          500: '#8AC8A3',
          DEFAULT: '#C8E6D5',
        },
        butter: {
          100: '#FEF9E7',
          300: '#F8E5A6',
          500: '#F0CD5A',
          DEFAULT: '#F8E5A6',
        },
        lavender: {
          100: '#F5F1FB',
          300: '#DCD0F0',
          500: '#B69EDD',
          DEFAULT: '#DCD0F0',
        },
        peach: {
          100: '#FDF3ED',
          300: '#F5C7AD',
          500: '#E99B70',
          DEFAULT: '#F5C7AD',
        },
        cocoa: {
          100: '#F2ECE9',
          300: '#BCABA2',
          500: '#71564A',
          700: '#523C32',
          DEFAULT: '#71564A',
        },
        charcoal: {
          100: '#EAE9E8',
          300: '#A49F9D',
          700: '#393432',
          900: '#1F1B1A',
          DEFAULT: '#393432',
        },
        warmgrey: {
          100: '#F4F3F3',
          300: '#BAB5B4',
          500: '#8E8786',
          DEFAULT: '#BAB5B4',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'DM Serif Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(113, 86, 74, 0.06)',
        'card': '0 6px 24px -4px rgba(113, 86, 74, 0.08)',
        'lift': '0 12px 32px -4px rgba(113, 86, 74, 0.12)',
        'pill': '0 2px 10px rgba(243, 132, 143, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
        '4/3': '4 / 3',
        '16/10': '16 / 10',
      }
    },
  },
  plugins: [],
}
