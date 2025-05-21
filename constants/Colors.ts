// import colors from "tailwindcss/colors";

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
