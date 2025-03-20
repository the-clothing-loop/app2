import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { routeGetOrder } from "@/api/route";
import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreCurrentBagsPerUser,
  authStoreCurrentChainAdmin,
  authStoreCurrentChainWarden,
  authStoreListPausedUsers,
} from "@/store/auth";
import { useMemo } from "react";
import { Button, MenuItem, Text } from "@ui-kitten/components";
import {
  ChevronRightIcon,
  FlagIcon,
  MapIcon,
  PauseIcon,
  ShieldIcon,
  ShoppingBagIcon,
} from "lucide-react-native";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function Route() {
  const { currentChain, currentChainUsers } = useStore(authStore);
  const bagsPerUser = useStore(authStoreCurrentBagsPerUser);
  const hosts = useStore(authStoreCurrentChainAdmin);
  const wardens = useStore(authStoreCurrentChainWarden);
  const theme = useTheme();
  const pausedUsers = useStore(authStoreListPausedUsers);
  const { t } = useTranslation();
  const { data: routeOrder } = useQuery({
    queryKey: ["route-order", currentChain?.uid],
    async queryFn() {
      if (!currentChain) return null;

      const res = await routeGetOrder(currentChain.uid).then((res) => res.data);
      if (!res) return null;

      return res;
    },
  });

  const orderedChainUsers = useMemo(() => {
    return routeOrder
      ?.map((uid) => currentChainUsers?.find((u) => u.uid == uid))
      .filter((u) => !!u);
  }, [currentChainUsers, routeOrder]);

  const countActiveMembers = useMemo(
    () =>
      currentChainUsers?.filter(
        (u) => !pausedUsers?.some((up) => up.uid === u.uid)
      ).length || 0,
    [currentChainUsers, pausedUsers]
  );

  return (
    <View className="inset-0">
      <ScrollView className="h-full">
        {orderedChainUsers?.map((u, i) => {
          const isWarden = wardens?.some((v) => v.uid === u.uid);
          const isHost = hosts?.some((v) => v.uid === u.uid);
          const bagsOfUser = bagsPerUser[u.uid] || [];
          const isPaused = pausedUsers?.some((uid) => u.uid);
          return (
            <MenuItem
              key={u.uid}
              title={`${i + 1} ${u.name}`}
              accessoryLeft={
                <View className="relative">
                  {isHost ? (
                    <ShieldIcon />
                  ) : isWarden ? (
                    <FlagIcon />
                  ) : undefined}
                  {isPaused ? (
                    <PauseIcon size={16} color={theme["color-info-500"]} />
                  ) : null}
                </View>
              }
              accessoryRight={
                <View className="flex-row-reverse">
                  <ChevronRightIcon />
                  <View className="grid-rows-2 grid-flow-row gap-1">
                    {bagsOfUser.map((b) => (
                      <ShoppingBagIcon key={b.id} color={b.color} size={12} />
                    ))}
                  </View>
                </View>
              }
            ></MenuItem>
          );
        })}
        <View key="bottom" className="h-20 justify-center items-center">
          <Text category="s2">
            {t("activeMembers") + ": " + countActiveMembers}
          </Text>
        </View>
      </ScrollView>
      <View className="absolute bottom-safe-offset-16 right-2">
        <Button style={{ borderRadius: "100%" }} className="h-12 w-12">
          <MapIcon />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
