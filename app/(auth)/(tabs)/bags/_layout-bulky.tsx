import { Text } from "@/components/ui/text";
import { authStoreAuthUserRoles } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function BulkyStackLayout() {
  const { t } = useTranslation();
  const authUserRoles = useStore(authStoreAuthUserRoles);
  return (
    <Stack
      screenOptions={{
        headerBackVisible: true,
        headerBackTitle: t("bulkyItems"),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("bulkyItems"),
          headerRight: () => (
            <Link href="./bags/createBulky" className="px-2">
              <Text size="xl" className="text-primary-500">
                {t("createBulky")}
              </Text>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="createBulky"
        options={{
          title: t("createBulky"),
        }}
      />
    </Stack>
  );
}
