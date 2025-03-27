import UserCard from "@/components/custom/route/UserCard";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  authStore,
  authStoreAuthUserRoles,
  authStoreCurrentChainAdmin,
  authStoreCurrentChainWarden,
  authStoreListPausedUsers,
  authStoreListRouteUsers,
} from "@/store/auth";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStore } from "@tanstack/react-store";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

export default function RouteUser() {
  const { user: uid }: { user: string } = useLocalSearchParams();
  const listRouteUsers = useStore(authStoreListRouteUsers);

  const { t } = useTranslation();
  const routeItem = useMemo(
    () => listRouteUsers?.find(({ user }) => user.uid == uid),
    [uid, listRouteUsers],
  );
  const navigation = useNavigation();
  useEffect(() => {
    if (routeItem) {
      navigation.setOptions({ headerTitle: routeItem.user.name });
    }
  }, [routeItem]);

  const tabBarHeight = useBottomTabBarHeight();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ paddingBottom: tabBarHeight }}
    >
      {routeItem ? (
        <VStack className="bg-background-0">
          <UserCard
            user={routeItem.user}
            isUserPaused={routeItem.isPaused}
            isUserHost={routeItem.isHost}
            isUserWarden={routeItem.isWarden}
            showMessengers
          />
        </VStack>
      ) : (
        <Box className="items-center justify-center">
          <Text size="lg">{t("loading")}</Text>
        </Box>
      )}
    </ScrollView>
  );
}
