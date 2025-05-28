// import colors from "tailwindcss/colors";

import { DefaultTheme, DarkTheme } from "@react-navigation/native";

type NativeTheme = typeof DefaultTheme;

export const Colors = {
  light: {
    ...DefaultTheme,
    colors: {
      primary: "#5f9c8a",
      background: "#f2f1f1",
      card: "#ffffff",
      text: "#404040",
      border: "#d3d3d3",
      notification: "#ef4444",
    },
  } satisfies NativeTheme,
  dark: {
    ...DarkTheme,
    colors: {
      primary: "#5f9c8a",
      background: "#272625",
      card: "#121212",
      text: "#e5e5e7",
      border: "#535252",
      notification: "#f87171",
    },
  } satisfies NativeTheme,
};

export const flagFlags = {
  ts: ["hsl(191, 73%, 54%)", "rgb(244, 136, 182)"],
  rainbow: [
    "hsl(8, 100%, 45%)",
    "hsl(33, 100%, 50%)",
    "hsl(56, 91%, 42%)",
    "hsl(133, 82%, 43%)",
    "hsl(222, 100%, 59%)",
    "hsl(292, 70%, 55%)",
  ],
};

export const basicThemeColors = {
  leafGreen: "#86a051",
  green: "#66926e",
  teal: "#48808b",
  yellow: "#d4cb00",
  orange: "#e87909",
  red: "#dd3d45",
  pinkLight: "#cb94ac",
  pink: "#dc77a3",
  lilac: "#b76dac",
  purple: "#9a69ed",
  skyBlue: "#43c6e0",
  blueLight: "#3f94e4",
  blue: "#1454b3",
};
