import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { messagingApps } from "@/constants/MessagingApps";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import colors from "tailwindcss/colors";

export default function Chat() {
  const { t } = useTranslation();

  const tabBarHeight = useBottomTabBarHeight();
  const [currentChatApp] = useState(messagingApps[0]);

  return (
    <Box className="flex-1 items-center justify-center bg-background-0">
      <VStack className="items-center gap-4 py-5">
        <currentChatApp.source
          width={96}
          height={96}
          color={currentChatApp.bgColor}
        />
        <Text className="text-center">
          Go to your Loop {currentChatApp.title} chat group
        </Text>
        <Link href="https://signal.org" asChild>
          <Button
            style={{ backgroundColor: currentChatApp.bgColor }}
            className="rounded-pill"
            size="xl"
          >
            <ButtonText style={{ color: currentChatApp.fgColor }}>
              {t("join")}
            </ButtonText>
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}
