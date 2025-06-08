import { PropsWithChildren } from "react";
import { Box } from "../ui/box";
import { useCallback } from "react";
import { ViewProps } from "react-native";
import { basicThemeColors, flagFlags } from "@/constants/Colors";

interface Props {
  theme: string;
}

export default function ThemeBackground({
  theme,
  children,
  className,
  ...props
}: PropsWithChildren<Props & ViewProps>) {
  const renderFlag = useCallback(() => {
    const colors: string[] | string =
      //@ts-ignore
      flagFlags[theme] ||
      //@ts-ignore
      basicThemeColors[theme] ||
      "#5f9c8a";

    if (typeof colors === "string") {
      return (
        <Box
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: colors }}
        ></Box>
      );
    }

    return (
      <Box
        className={`absolute inset-0 -z-10 ${theme === "ts" ? "flex-col" : "flex-row"}`}
      >
        {colors.map((c) => (
          <Box
            className="flex-grow"
            key={c}
            style={{ backgroundColor: c }}
          ></Box>
        ))}
      </Box>
    );
  }, [theme]);

  return (
    <Box className={`relative ${className || ""}`} {...props}>
      {children}
      {renderFlag()}
    </Box>
  );
}
