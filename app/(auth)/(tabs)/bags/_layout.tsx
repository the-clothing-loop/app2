import { Text } from "@/components/ui/text";
import { authStoreAuthUserRoles } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function BagsStackLayout() {
  const { t } = useTranslation();
  const authUserRoles = useStore(authStoreAuthUserRoles);
  return (
    <Stack
      screenOptions={{
        headerBackVisible: true,
        headerBackTitle: t("bags"),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("bags"),
          headerRight: () =>
            authUserRoles.isHost ? (
              <Link href="./bags/create" className="px-2">
                <Text size="xl" className="text-primary-500">
                  {t("create")}
                </Text>
              </Link>
            ) : undefined,
          headerLeft: () =>
            authUserRoles.isHost ? (
              <Link
                href="../../../../(modals)/bag-analytics"
                className="px-2"
                asChild
              >
                <Text size="xl" className="text-primary-500">
                  {t("bagAnalytics")}
                </Text>
              </Link>
            ) : undefined,
        }}
      />
      <Stack.Screen
        name="edit/[bagId]"
        options={{
          title: t("edit"),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: t("createBag"),
        }}
      />

      <Stack.Screen
        name="select"
        options={{
          title: t("changeBagHolder"),
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
