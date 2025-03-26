import { Tabs } from "expo-router";
import React, { useEffect } from "react";
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
import {
  BookOpen,
  MessageCircle,
  Route,
  ShoppingBag,
  UserCircle2,
} from "lucide-react-native";
import { useColorScheme } from "react-native";
// import { OneSignal } from "react-native-onesignal";

export default function TabLayout() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const auth = useStore(authStore);
  const selectedChainUID = useStore(savedStore, (s) => s.chainUID);
  const colorScheme = useColorScheme() ?? "light";

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
  const { data: listOfChains } = useQuery({
    queryKey: [
      "user-chains",
      auth.authUser?.uid,
      auth.authUser?.chains?.join(","),
    ],
    async queryFn() {
      if (!auth.authUser?.chains.length) {
        return [];
      }

      const promises = auth.authUser.chains
        .filter((c) => c.is_approved)
        .map((c) => chainGet(c.chain_uid).then((res) => res.data));
      return await Promise.all(promises);
    },
    networkMode: "offlineFirst",
  });

  // useEffect(() => {
  //   if (["ios", "android"].includes(Platform.OS)) {
  //     OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
  //     OneSignal.Notifications.requestPermission(true);
  //     OneSignal.login(auth.authUser!.uid);
  //   }
  // }, []);

  return (
    <Tabs
      screenOptions={
        {
          // tabBarActiveTintColor: ,
          // tabBarStyle: Platform.select({
          //   ios: {
          //     // Use a transparent background on iOS to show the blur effect
          //     position: "absolute",
          //   },
          //   default: {},
          // }),
        }
      }
    >
      <Tabs.Screen
        name="(rules)"
        options={{
          headerShown: false,
          title: t("rules"),
          tabBarIcon: ({ color }) => (
            <BookOpen size={28} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="(route)"
        options={{
          lazy: false,
          headerShown: false,
          title: t("route"),
          tabBarIcon: ({ color }) => <Route size={28} color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="bags"
        options={{
          title: t("bags"),
          tabBarIcon: ({ color }) => (
            <ShoppingBag size={28} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t("chat"),
          tabBarIcon: ({ color }) => (
            <MessageCircle size={28} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: t("info"),

          tabBarIcon: ({ color }) => (
            <UserCircle2 size={28} color={color as any} />
          ),
        }}
      />
    </Tabs>
  );
}
