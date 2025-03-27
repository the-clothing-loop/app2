import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreCurrentBagsPerUser,
  authStoreCurrentChainAdmin,
  authStoreCurrentChainWarden,
  authStoreListPausedUsers,
  authStoreListRouteUsers,
} from "@/store/auth";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Flag,
  Map,
  Pause,
  PauseCircle,
  Shield,
  ShoppingBag,
} from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { User } from "@/api/typex2";
import RouteItem from "@/components/custom/route/RouteItem";
import RefreshControl from "@/components/custom/RefreshControl";

export default function Route() {
  const routeUsers = useStore(authStoreListRouteUsers);
  const bagsPerUser = useStore(authStoreCurrentBagsPerUser);
  const hosts = useStore(authStoreCurrentChainAdmin);
  const wardenUids = useStore(authStoreCurrentChainWarden);
  const pausedUserUids = useStore(authStoreListPausedUsers);
  const { t } = useTranslation();

  const countActiveMembers = useMemo(
    () =>
      routeUsers?.filter(
        ({ user }) => !pausedUserUids?.some((up) => up === user.uid),
      ).length || 0,
    [routeUsers, pausedUserUids],
  );

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingBottom: tabBarHeight }}
        refreshControl={<RefreshControl />}
      >
        {routeUsers?.map(({ user }, i) => {
          const bagsOfUser = bagsPerUser[user.uid] || [];
          const isWarden = wardenUids.some((uid) => uid === user.uid);
          const isHost = hosts.some((u) => u.uid === u.uid);
          const isPaused = pausedUserUids.some((uid) => uid === user.uid);

          return (
            <RouteItem
              key={user.uid}
              user={user}
              index={i}
              isWarden={isWarden}
              isHost={isHost}
              bags={bagsOfUser}
              isPaused={isPaused}
            />
          );
        })}
        <Box key="bottom" className="p-2">
          <Text className="text-center font-bold">
            {t("activeMembers") + ": " + countActiveMembers}
          </Text>
        </Box>
      </ScrollView>
      <Box className="fixed bottom-2 right-2">
        <Fab size="lg">
          <FabIcon as={Map} size="xl" />
        </Fab>
      </Box>
    </>
  );
}
