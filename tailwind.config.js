import customEvaTheme from "./custom-theme.json";
import { light } from "@eva-design/eva";

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        basic: {
          100: light["color-basic-100"],
          200: light["color-basic-200"],
          300: light["color-basic-300"],
          400: light["color-basic-400"],
          500: light["color-basic-500"],
          600: light["color-basic-600"],
          700: light["color-basic-700"],
          800: light["color-basic-800"],
          900: light["color-basic-900"],
        },
        primary: {
          100: customEvaTheme["color-primary-100"],
          200: customEvaTheme["color-primary-200"],
          300: customEvaTheme["color-primary-300"],
          400: customEvaTheme["color-primary-400"],
          500: customEvaTheme["color-primary-500"],
          600: customEvaTheme["color-primary-600"],
          700: customEvaTheme["color-primary-700"],
          800: customEvaTheme["color-primary-800"],
          900: customEvaTheme["color-primary-900"],
        },
        success: {
          100: customEvaTheme["color-success-100"],
          200: customEvaTheme["color-success-200"],
          300: customEvaTheme["color-success-300"],
          400: customEvaTheme["color-success-400"],
          500: customEvaTheme["color-success-500"],
          600: customEvaTheme["color-success-600"],
          700: customEvaTheme["color-success-700"],
          800: customEvaTheme["color-success-800"],
          900: customEvaTheme["color-success-900"],
        },
        info: {
          100: customEvaTheme["color-info-100"],
          200: customEvaTheme["color-info-200"],
          300: customEvaTheme["color-info-300"],
          400: customEvaTheme["color-info-400"],
          500: customEvaTheme["color-info-500"],
          600: customEvaTheme["color-info-600"],
          700: customEvaTheme["color-info-700"],
          800: customEvaTheme["color-info-800"],
          900: customEvaTheme["color-info-900"],
        },
        warning: {
          100: customEvaTheme["color-warning-100"],
          200: customEvaTheme["color-warning-200"],
          300: customEvaTheme["color-warning-300"],
          400: customEvaTheme["color-warning-400"],
          500: customEvaTheme["color-warning-500"],
          600: customEvaTheme["color-warning-600"],
          700: customEvaTheme["color-warning-700"],
          800: customEvaTheme["color-warning-800"],
          900: customEvaTheme["color-warning-900"],
        },
        danger: {
          100: customEvaTheme["color-danger-100"],
          200: customEvaTheme["color-danger-200"],
          300: customEvaTheme["color-danger-300"],
          400: customEvaTheme["color-danger-400"],
          500: customEvaTheme["color-danger-500"],
          600: customEvaTheme["color-danger-600"],
          700: customEvaTheme["color-danger-700"],
          800: customEvaTheme["color-danger-800"],
          900: customEvaTheme["color-danger-900"],
        },
      },
    },
  },
  plugins: [],
};
