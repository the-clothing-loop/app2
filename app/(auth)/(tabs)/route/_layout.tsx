import { Button } from "@/components/ui/button";
import { Stack } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text } from "react-native";

export default function RulesStackLayout() {
  const { t } = useTranslation();
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  return (
    <Stack
      screenOptions={{
        headerBackVisible: true,
        headerBackTitle: t("addresses"),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          title: t("addresses"),
        }}
      />
      <Stack.Screen
        name="[user]"
        options={{
          headerLargeTitle: true,
          title: t("loading"),
        }}
      />
      {/* <Stack.Screen name="Profile" /> */}
    </Stack>
  );
}
