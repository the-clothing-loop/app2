import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreCurrentBagsPerUser,
  authStoreCurrentChainAdmin,
  authStoreCurrentChainWarden,
  authStoreListPausedUsers,
} from "@/store/auth";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Flag,
  Map,
  Pause,
  Shield,
  ShoppingBag,
} from "lucide-react-native";
import { ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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
    <Box style={{ paddingBlockEnd: tabBarHeight }}>
      <ScrollView>
        {orderedChainUsers?.map((u, i) => {
          const isWarden = wardens?.some((v) => v.uid === u.uid);
          const isHost = hosts?.some((v) => v.uid === u.uid);
          const bagsOfUser = bagsPerUser[u.uid] || [];
          const isPaused = pausedUsers?.some((v) => v.uid === u.uid);
          return (
            <HStack key={u.uid} className="items-center gap-2 p-2">
              <Box className="relative">
                {isHost ? (
                  <Icon as={Shield} size="lg" />
                ) : isWarden ? (
                  <Icon as={Flag} size="lg" />
                ) : undefined}

                <Box className="top- absolute bottom-0 right-0 z-10">
                  {!isPaused ? <Icon as={Pause} size="sm" /> : null}
                </Box>
              </Box>

              <Text className="grow">{`${i + 1} ${u.name}`}</Text>

              <HStack reversed>
                <Icon as={ChevronRight} className="ms-2 opacity-0" />
                <VStack className="flex-wrap-reverse gap-0.5">
                  {bagsOfUser.map((b) => (
                    <Box key={b.id}>
                      <Icon as={ShoppingBag} color={b.color} />
                    </Box>
                  ))}
                </VStack>
              </HStack>
            </HStack>
          );
        })}
        <Box key="bottom">
          <Text className="text-center font-bold">
            {t("activeMembers") + ": " + countActiveMembers}
          </Text>
        </Box>
      </ScrollView>
      <Fab>
        <FabIcon as={Map} />
      </Fab>
    </Box>
  );
}
