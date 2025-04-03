import { Text } from "@/components/ui/text";
import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function BagsStackLayout() {
  const { t } = useTranslation();
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
          headerRight: () => (
            <Link href="./bags/create" className="px-2">
              <Text size="xl" className="text-primary-500">
                {t("create")}
              </Text>
            </Link>
          ),
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
    </Stack>
  );
}
