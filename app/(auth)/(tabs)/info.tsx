import { authStore, authStoreAuthUserRoles } from "@/store/auth";
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
import UserCard from "@/components/custom/route/UserCard";
import FormattedText from "@/components/custom/FormattedText";
import InterestedSizes, {
  Categories,
  Sizes,
} from "@/components/custom/InterestedSizes";

export default function Info() {
  const { t } = useTranslation();

  const { authUser, currentChain } = useStore(authStore);
  const authUserRoles = useStore(authStoreAuthUserRoles);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="gap-3 p-3"
    >
      <Box className="mb-3 flex-col bg-background-0">
        <Text className="m-3 text-3xl text-black" bold>
          {t("account")}
        </Text>
        {authUser ? (
          <UserCard
            user={authUser}
            isUserPaused={authUserRoles.isPaused}
            isUserHost={authUserRoles.isHost}
            isUserWarden={authUserRoles.isChainWarden}
          />
        ) : null}

        <HStack className="items-start gap-3 px-4 py-2">
          <VStack className="flex-grow">
            <Text bold size="sm">
              {t("pauseTitle")}
            </Text>
            <Text>{t("pauseBody")}</Text>
          </VStack>
          <Switch></Switch>
        </HStack>
      </Box>

      <Box className="flex-col bg-background-0">
        <Link asChild href="/(auth)/select-chain">
          <Pressable>
            <Box className="flex-col px-3 pb-4 pt-2">
              <Text bold size="sm">
                {t("selectALoop")}
              </Text>
              <HStack className="items-center justify-between">
                <Text className="text-3xl text-black" bold>
                  {currentChain?.name}
                </Text>
                <Icon as={ChevronDown} size="xl" />
              </HStack>
            </Box>
          </Pressable>
        </Link>

        <Box className="flex-row items-center bg-warning-200 p-3">
          <Icon as={Lock} className="me-2" />
          <Text className="me-3">{t("closed")}</Text>
          <Icon as={EyeOff} className="me-2" />
          <Text className="me-3">{t("locked")}</Text>
        </Box>
        {currentChain ? (
          <InterestedSizes
            categories={currentChain.genders as Categories[]}
            sizes={currentChain.sizes as Sizes[]}
          />
        ) : null}
        {currentChain?.description ? (
          <Box className="p-3">
            <FormattedText content={currentChain.description} />
          </Box>
        ) : null}
        {authUserRoles.isHost ? (
          <Link asChild href="https://clothingloop.org/">
            <Pressable>
              <Box className="flex-row items-center gap-3 p-3">
                <Text className="flex-grow">{t("goToAdminPortal")}</Text>
                <Icon as={Globe2} />
              </Box>
            </Pressable>
          </Link>
        ) : null}
      </Box>
    </ScrollView>
  );
}
