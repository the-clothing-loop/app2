import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreCurrentBagsPerUser,
  authStoreCurrentChainAdmin,
  authStoreCurrentChainWarden,
  authStoreListPausedUsers,
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

export default function Route() {
  const { currentChainUsers, currentChainRoute } = useStore(authStore);
  const bagsPerUser = useStore(authStoreCurrentBagsPerUser);
  const hosts = useStore(authStoreCurrentChainAdmin);
  const wardens = useStore(authStoreCurrentChainWarden);
  const pausedUsers = useStore(authStoreListPausedUsers);
  const { t } = useTranslation();

  const orderedChainUsers = useMemo(() => {
    return currentChainRoute
      ?.map((uid) => currentChainUsers?.find((u) => u.uid == uid))
      .filter((u) => !!u);
  }, [currentChainUsers, currentChainRoute]);

  const countActiveMembers = useMemo(
    () =>
      currentChainUsers?.filter(
        (u) => !pausedUsers?.some((up) => up.uid === u.uid),
      ).length || 0,
    [currentChainUsers, pausedUsers],
  );

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingBottom: tabBarHeight }}
      >
        {orderedChainUsers?.map((u, i) => {
          const bagsOfUser = bagsPerUser[u.uid] || [];
          const isWarden = wardens?.some((v) => v.uid === u.uid) || false;
          const isHost = hosts?.some((v) => v.uid === u.uid) || false;
          const isPaused = pausedUsers?.some((v) => v.uid === u.uid) || false;

          return (
            <RouteItem
              key={u.uid}
              user={u}
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
