import { router, Stack } from "expo-router";
import React, { useEffect, useLayoutEffect } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";

// import { LogLevel, OneSignal } from "react-native-onesignal";
import { useStore } from "@tanstack/react-store";
import { authStore } from "@/store/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chainGet } from "@/api/chain";
import { savedStore } from "@/store/saved";
import { userGetAllByChain } from "@/api/user";
import { catchErrThrow401 } from "@/utils/handleRequests";
import { bagGetAllByChain } from "@/api/bag";
import { routeGetOrder } from "@/api/route";
import { registerSheet } from "react-native-actions-sheet";
import BagsSheet from "@/components/custom/BagsSheet";
// import { Platform } from "react-native";
// import { OneSignal } from "react-native-onesignal";

// const isPlatformMobile = ["ios", "android"].includes(Platform.OS);
// const oneSignalKey = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

registerSheet("bags", BagsSheet);

export default function TabLayout() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const auth = useStore(authStore);
  const selectedChainUID = useStore(savedStore, (s) => s.chainUID);

  const queryChain = useQuery({
    queryKey: ["auth", "chain", selectedChainUID],
    async queryFn() {
      if (!selectedChainUID || !auth.authUser) return null;
      // test with one request before asking for the rest
      const resChain = await chainGet(selectedChainUID, {
        addHeaders: true,
        addIsAppDisabled: true,
        addRoutePrivacy: true,
        addRules: true,
        addTheme: true,
        addTotals: true,
      })
        .then((res) => res.data)
        .catch(catchErrThrow401);
      const [resChainUsers, resChainRoute] = await Promise.all([
        userGetAllByChain(selectedChainUID)
          .then((res) => res.data)
          .catch(catchErrThrow401),
        routeGetOrder(selectedChainUID)
          .then((res) => res.data)
          .catch(catchErrThrow401),
      ]);
      if (
        typeof resChain === "string" ||
        typeof resChainUsers === "string" ||
        typeof resChainRoute === "string"
      )
        return null;
      authStore.setState((s) => ({
        ...s,
        currentChain: resChain,
        currentChainUsers: resChainUsers,
        currentChainRoute: resChainRoute,
      }));

      return { resChain, resChainUsers };
    },
  });
  useQuery({
    queryKey: ["auth", "chain-bags", selectedChainUID],
    async queryFn() {
      // test with one request before asking for the rest
      const resBags = await bagGetAllByChain(
        selectedChainUID,
        auth.authUser!.uid,
      )
        .then((res) => res.data)
        .catch(catchErrThrow401);
      if (typeof resBags === "string") return null;
      authStore.setState((s) => ({
        ...s,
        currentBags: resBags,
      }));

      return resBags;
    },
    enabled: Boolean(selectedChainUID && auth.authUser),
  });
  useLayoutEffect(() => {
    if (queryChain.error) queryClient.clear();
  }, [queryChain.error]);

  // useLayoutEffect(() => {
  //   if (oneSignalKey && isPlatformMobile) {
  //     OneSignal.initialize(oneSignalKey);
  //     OneSignal.Notifications.requestPermission(true);
  //   }
  // }, []);
  // useLayoutEffect(() => {
  //   if (oneSignalKey && auth.authUser && isPlatformMobile) {
  //     OneSignal.login(auth.authUser!.uid);
  //   }
  // }, [auth.authUser]);

  return (
    <Stack screenOptions={{}}>
      {auth.currentChain !== null ? (
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTitle: queryChain.data?.resChain?.name,
            title: queryChain.data?.resChain?.name,
          }}
        />
      ) : (
        <Stack.Screen
          name="select-chain"
          options={{
            headerTitle: t("selectALoop"),
            headerBackButtonDisplayMode: "generic",
            headerBackTitle: t("back"),
            headerShown: true,
          }}
        />
      )}
    </Stack>
  );
}
