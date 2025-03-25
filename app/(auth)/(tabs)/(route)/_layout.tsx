import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function RulesStackLayout() {
  const { t } = useTranslation();
  return (
    <Stack>
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
          title: t("loading"),
        }}
      />
      {/* <Stack.Screen name="Profile" /> */}
    </Stack>
  );
}
