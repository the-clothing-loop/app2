import colors from "tailwindcss/colors";

import { DefaultTheme, DarkTheme } from "@react-navigation/native";

type NativeTheme = typeof DefaultTheme;

export const Colors = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.blue[600],
    },
  } satisfies NativeTheme,
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.blue[400],
    },
  } satisfies NativeTheme,
};
