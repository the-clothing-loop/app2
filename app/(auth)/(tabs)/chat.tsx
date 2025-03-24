import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import colors from "tailwindcss/colors";

const imOptions = [
  {
    title: "Signal",
    bgColor: "#2c6bed",
    fgColor: colors.white,
    source: require("@/assets/images/im/icons8-signal-messenger-96.png"),
  },
  {
    title: "SMS",
    bgColor: "#89f86a",
    fgColor: colors.black,
    source: require("@/assets/images/im/icons8-imessage-150.png"),
  },
  {
    title: "WhatsApp",
    bgColor: "#25d366",
    fgColor: colors.black,
    source: require("@/assets/images/im/icons8-whatsapp-150.png"),
  },
  {
    title: "Discord",
    bgColor: "#5865f2",
    fgColor: colors.white,
    source: require("@/assets/images/im/icons8-discord-new-150.png"),
  },
];

export default function Chat() {
  const { t } = useTranslation();

  const tabBarHeight = useBottomTabBarHeight();
  const [currentChatIm] = useState(imOptions[0]);

  return (
    <Box className="flex-1 items-center justify-center">
      <VStack className="items-center gap-4 py-5">
        <Image
          width={96}
          className="aspect-square object-contain"
          alt={currentChatIm.title}
          source={currentChatIm.source}
        />
        <Text className="text-center">
          Go to your Loop {currentChatIm.title} chat group
        </Text>
        <Button
          style={{ backgroundColor: currentChatIm.bgColor }}
          className="rounded-pill"
          size="xl"
        >
          <ButtonText style={{ color: currentChatIm.fgColor }}>
            {t("join")}
          </ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
