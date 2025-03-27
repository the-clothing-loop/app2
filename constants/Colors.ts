import colors from "tailwindcss/colors";

import { DefaultTheme, DarkTheme } from "@react-navigation/native";

type NativeTheme = typeof DefaultTheme;

export const Colors = {
  light: {
    ...DefaultTheme,
    colors: {
      primary: "rgb(95, 156, 138)",
      background: "rgb(242, 241, 241)",
      card: "rgb(255, 255, 255)",
      text: "rgb(64, 64, 64)",
      border: "rgb(211, 211, 211)",
      notification: "rgb(239, 68, 68)",
    },
  } satisfies NativeTheme,
  dark: {
    ...DarkTheme,
    colors: {
      primary: "rgb(95 156 138)",
      background: "rgb(39 ,38 ,37)",
      card: "rgb(18, 18, 18)",
      text: "rgb(229, 229, 231)",
      border: "rgb(83, 82, 82)",
      notification: "rgb(248 113 113)",
    },
  } satisfies NativeTheme,
};
