import { authStore } from "@/store/auth";
import { ChevronDown, EyeOff, Globe2, Lock } from "lucide-react-native";
import { useStore } from "@tanstack/react-store";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { useRef } from "react";
import { Icon } from "@/components/ui/icon";

export default function Info() {
  const { t } = useTranslation();

  const { authUser, currentChain } = useStore(authStore);
  return (
    <ScrollView>
      <Box className="mb-3 flex-col bg-background-0">
        <Text className="m-3">{t("account")}</Text>
        <VStack className="items-start p-3">
          <Text size="sm">{t("email")}</Text>
          <Text>{authUser?.email || "me@example.com"}</Text>
        </VStack>
        <VStack className="items-start p-3">
          <Text size="sm">{t("address")}</Text>
          <Text>{authUser?.address}</Text>
        </VStack>
        <HStack className="items-start gap-3 p-3">
          <VStack className="flex-grow">
            <Text size="sm">{t("pauseTitle")}</Text>
            <Text>{t("pauseBody")}</Text>
          </VStack>
          <Switch></Switch>
        </HStack>
      </Box>

      <Box className="bg-background flex-col">
        <Link asChild href="/(auth)/select-chain">
          <Box className="flex-col gap-5 py-3 pb-4 pt-2">
            <Text size="sm">{t("selectALoop")}</Text>
            <Text>{t("selectALoop")}</Text>
            <HStack>
              <Text>{currentChain?.name}</Text>
              <Icon as={ChevronDown} size="lg" />
            </HStack>
          </Box>
        </Link>

        <Box className="bg-negative flex-row items-center p-3">
          <Icon as={Lock} className="me-2" />
          <Text className="me-3">{t("closed")}</Text>
          <Icon as={EyeOff} className="me-2" />
          <Text className="me-3">{t("locked")}</Text>
        </Box>
        <Link asChild href="https://clothingloop.org/">
          <Box className="flex-row items-center gap-3 p-3">
            <Text className="flex-grow">{t("goToAdminPortal")}</Text>
            <Icon as={Globe2} />
          </Box>
        </Link>
      </Box>
    </ScrollView>
  );
}
