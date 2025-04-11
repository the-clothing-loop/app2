import { chatTypeGet } from "@/api/chat_type";
import { authStore } from "@/store/auth";
import { AppType, chatStore } from "@/store/chat";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ChatStackLayout() {
  const { t } = useTranslation();
  const { currentChain } = useStore(authStore);
  const appType = useStore(chatStore, (s) => s.appType);

  useQuery({
    queryKey: ["auth", "chat-type", currentChain?.uid],
    queryFn() {
      return chatTypeGet(currentChain!.uid).then((res) => {
        chatStore.setState((s) => ({
          ...s,
          appType: res.data.chat_type as AppType,
          chatUrl: res.data.chat_url,
        }));
        return null;
      });
    },
    enabled: Boolean(currentChain),
  });

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: t("chat"),
        }}
      />
      <Stack.Screen
        name="mattermost"
        options={{
          title: t("chat"),
        }}
      />
    </Stack>
  );
}
