/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary — indigo/purple (matches the "Total Students" card)
        brand: {
          50:  '#eef0ff',
          100: '#dcdfff',
          200: '#b9bfff',
          300: '#8e96ff',
          400: '#6f74f5',
          500: '#5b59e8',
          600: '#4b46d8',
          700: '#3d38b8',
          800: '#312d92',
          900: '#252171',
        },
        // Accent — amber (the orange metric card)
        amber: {
          50:  '#fff7ec',
          100: '#ffe8c8',
          200: '#ffd08a',
          300: '#ffb454',
          400: '#fba231',
          500: '#f7a23b',
          600: '#e0851b',
          700: '#b86616',
          800: '#925017',
          900: '#774116',
        },
        // Accent — teal/cyan (the "Total Course" card + chart bars)
        teal: {
          50:  '#ecfbfd',
          100: '#cef5fa',
          200: '#9eebf3',
          300: '#5ed7e6',
          400: '#29c0d0',
          500: '#1aacbf',
          600: '#1289a0',
          700: '#136e82',
          800: '#16596b',
          900: '#114a5a',
        },
        // Accent — rose (the red/pink metric card)
        rose: {
          50:  '#fff1f4',
          100: '#ffe0e7',
          200: '#ffc7d2',
          300: '#ff9aaf',
          400: '#fb6c8b',
          500: '#ed5572',
          600: '#d7385a',
          700: '#b32549',
          800: '#962041',
          900: '#7f1d3c',
        },
        // App chrome — deep navy (sidebar/dark backgrounds in the reference)
        navy: {
          50:  '#eef1fa',
          100: '#d3d9ee',
          200: '#a6b3dd',
          300: '#6c80c1',
          400: '#3d56a0',
          500: '#243a82',
          600: '#1b2d6c',
          700: '#152353',
          800: '#101b40',
          900: '#0c1532',
          950: '#070d22',
        },
      },
    },
  },
  plugins: [],
};
