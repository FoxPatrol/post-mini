/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}", "./src/app/components/**/*.{html,ts}"],
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],

  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: { preflight: false },
};
