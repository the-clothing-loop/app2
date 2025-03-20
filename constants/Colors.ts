/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import customEvaTheme from "@/custom-theme.json";
import * as eva from "@eva-design/eva";

const tintColorLight = customEvaTheme["color-primary-500"];
const tintColorDark = customEvaTheme["color-primary-500"];

export const Colors = {
  light: {
    text: eva.light["color-basic-800"],
    background: eva.light["color-basic-100"],
    tint: tintColorLight,
    icon: eva.light["color-basic-600"],
    tabIconDefault: eva.light["color-basic-600"],
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: eva.dark["color-basic-200"],
    background: eva.dark["color-basic-1100"],
    tint: tintColorDark,
    icon: eva.dark["color-basic-300"],
    tabIconDefault: eva.dark["color-basic-300"],
    tabIconSelected: tintColorDark,
  },
};
