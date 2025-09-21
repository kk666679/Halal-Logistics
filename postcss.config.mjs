/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Note: autoprefixer is no longer needed in TailwindCSS v4
    // as it handles autoprefixing internally
  },
};

export default config;
