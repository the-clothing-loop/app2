import { authStoreAuthUserRoles } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "react-native";

export default function RulesStackLayout() {
  // const isHost = useStore(authStoreAuthUserRoles, (s) => s.isHost);
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          title: t("howDoesItWork"),
          // headerRight: isHost
          //   ? () => (
          //       <Link asChild href="./change">
          //         <Button title={t("change")}></Button>
          //       </Link>
          //     )
          //   : undefined,
        }}
      />
    </Stack>
  );
}
