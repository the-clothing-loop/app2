import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

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

import { LogLevel, OneSignal } from "react-native-onesignal";
import { useStore } from "@tanstack/react-store";
import { authStore } from "@/store/auth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const auth = useStore(authStore);

  useEffect(() => {
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
    OneSignal.Notifications.requestPermission(true);
    OneSignal.login(auth.authUser!.uid);
  }, []);

  return (
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
  );
}
