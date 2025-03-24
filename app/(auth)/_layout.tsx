import { router, Stack } from "expo-router";
import React, { useEffect } from "react";

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
// import { OneSignal } from "react-native-onesignal";

export default function TabLayout() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const auth = useStore(authStore);
  const selectedChainUID = useStore(savedStore, (s) => s.chainUID);

  const { error } = useQuery({
    queryKey: ["chain", selectedChainUID],
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
      const [resChainUsers, resBags, resChainRoute] = await Promise.all([
        userGetAllByChain(selectedChainUID)
          .then((res) => res.data)
          .catch(catchErrThrow401),
        bagGetAllByChain(selectedChainUID, auth.authUser.uid)
          .then((res) => res.data)
          .catch(catchErrThrow401),
        routeGetOrder(selectedChainUID)
          .then((res) => res.data)
          .catch(catchErrThrow401),
      ]);
      if (
        typeof resChain === "string" ||
        typeof resChainUsers === "string" ||
        typeof resBags === "string" ||
        typeof resChainRoute === "string"
      )
        return null;
      authStore.setState((s) => ({
        ...s,
        currentChain: resChain,
        currentChainUsers: resChainUsers,
        currentBags: resBags,
        currentChainRoute: resChainRoute,
      }));

      return [resChain, resChainUsers];
    },
  });
  useEffect(() => {
    if (error) queryClient.clear();
  }, [error]);

  // useEffect(() => {
  //   if (["ios", "android"].includes(Platform.OS)) {
  //     OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
  //     OneSignal.Notifications.requestPermission(true);
  //     OneSignal.login(auth.authUser!.uid);
  //   }
  // }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {auth.currentChain ? (
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="select-chain"
          options={{ title: t("selectALoop") }}
        />
      )}
    </Stack>
  );
}
