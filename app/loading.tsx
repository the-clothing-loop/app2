import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

export default function Loading() {
  const theme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  return (
    <Box className="flex-1 flex-col items-center justify-center gap-4 bg-background-0">
      {theme == "light" ? (
        <Image
          key="logo-light"
          source={require("@/assets/images/v2_logo_black.png")}
          alt="logo"
          resizeMode="contain"
          className="h-36 w-44"
        />
      ) : (
        <Image
          key="logo-dark"
          source={require("@/assets/images/v2_logo_white.png")}
          alt="logo"
          resizeMode="contain"
          className="h-36 w-44"
        />
      )}
      <Text className="text-xl">{t("loading")}</Text>
    </Box>
  );
}
