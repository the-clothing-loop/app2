import { Tabs, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  BookOpenIcon,
  MessageCircleIcon,
  RouteIcon,
  ShoppingBagIcon,
  UserCircle2Icon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

// import { LogLevel, OneSignal } from "react-native-onesignal";
import { useStore } from "@tanstack/react-store";
import { authStore, authStoreCurrentChainAdmin } from "@/store/auth";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { chainGet, chainGetAll } from "@/api/chain";
import { savedStore } from "@/store/saved";
import {
  Button,
  Card,
  List,
  ListItem,
  Modal,
  Radio,
  RadioGroup,
  Text,
} from "@ui-kitten/components";
import { Chain } from "@/api/types";
import { useForm } from "@tanstack/react-form";
import { userGetAllByChain } from "@/api/user";
import { catchErrThrow401 } from "@/utils/handleRequests";
// import { OneSignal } from "react-native-onesignal";

export default function TabLayout() {
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const auth = useStore(authStore);
  const selectedChainUID = useStore(savedStore, (s) => s.chainUID);

  const { error } = useQuery({
    queryKey: ["chain", selectedChainUID],
    async queryFn() {
      if (!selectedChainUID) return null;
      const [resChain, resChainUsers] = await Promise.all([
        chainGet(selectedChainUID, {
          addHeaders: true,
          addIsAppDisabled: true,
          addRoutePrivacy: true,
          addRules: true,
          addTheme: true,
          addTotals: true,
        })
          .then((res) => res.data)
          .catch(catchErrThrow401),
        userGetAllByChain(selectedChainUID)
          .then((res) => res.data)
          .catch(catchErrThrow401),
      ]);
      if (typeof resChain === "string" || typeof resChainUsers === "string")
        return null;
      authStore.setState((s) => ({
        ...s,
        currentChain: resChain,
        currentChainUsers: resChainUsers,
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
  });

  if (auth.currentChain == null) {
    return (
      <SelectChain
        listOfChains={listOfChains || []}
        onSubmit={(uid) =>
          savedStore.setState((s) => ({ ...s, chainUID: uid }))
        }
      />
    );
  }

  // useEffect(() => {
  //   if (["ios", "android"].includes(Platform.OS)) {
  //     OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
  //     OneSignal.Notifications.requestPermission(true);
  //     OneSignal.login(auth.authUser!.uid);
  //   }
  // }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("rules"),
            tabBarIcon: ({ color }) => <BookOpenIcon size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="route"
          options={{
            title: t("route"),
            tabBarIcon: ({ color }) => <RouteIcon size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="bags"
          options={{
            title: t("bags"),
            tabBarIcon: ({ color }) => (
              <ShoppingBagIcon size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: t("chat"),
            tabBarIcon: ({ color }) => (
              <MessageCircleIcon size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: t("info"),
            tabBarIcon: ({ color }) => (
              <UserCircle2Icon size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

function SelectChain(props: {
  listOfChains: Chain[];
  onSubmit: (uid: string) => void;
}) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      selectedIndex: -1,
    },
    async onSubmit({ value }) {
      const c = props.listOfChains.at(value.selectedIndex);
      if (!c) throw "Please select a Loop";
      props.onSubmit(c.uid);
    },
  });
  return (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "center",
        inset: 0,
        height: "100%",
      }}
    >
      <Card disabled={true} style={{ width: 300 }}>
        <View style={{ flexDirection: "column", gap: 8 }}>
          <Text category="s1">{t("selectALoop")}</Text>
          <form.Field name="selectedIndex">
            {(field) => (
              <RadioGroup
                selectedIndex={field.state.value}
                onChange={field.setValue}
              >
                {props.listOfChains?.map((c) => (
                  <Radio key={c.uid}>
                    <Text>{c.name}</Text>
                  </Radio>
                ))}
              </RadioGroup>
            )}
          </form.Field>
          <Button onPress={form.handleSubmit}>
            <Text>{t("select")}</Text>
          </Button>
        </View>
      </Card>
    </SafeAreaView>
  );
}
