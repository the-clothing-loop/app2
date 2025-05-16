import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function InfoStackLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerBackVisible: true,
        headerBackTitle: t("info"),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("info"),
        }}
      />
    </Stack>
  );
}
