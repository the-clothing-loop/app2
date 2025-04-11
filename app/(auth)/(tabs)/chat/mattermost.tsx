import { chatPatchUser } from "@/api/chat";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { authStore } from "@/store/auth";
import { ChatConnStatus, chatStore } from "@/store/chat";
import { useStore } from "@tanstack/react-store";
import { MessageCircleMoreIcon } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const MM_BASE_URL = "mm.clothingloop.org";

export default function ChatMattermost() {
  const { currentChain, authUser } = useStore(authStore);
  const { t } = useTranslation();
  const chat = useStore(chatStore);

  useEffect(() => {
    if (!authUser) return;
    if (!currentChain?.uid) return;
    if (chat.appType !== "clothingloop") return;
    // if (!chat.state.client?.token) return;

    // chatPatchUser(currentChain.uid).then(async (res) => {
    //   await chat.init(currentChain.uid);
    // });
  }, [authUser?.uid, currentChain?.uid]);

  useMemo(() => {}, [currentChain?.chat_room_ids]);

  if (chat.state)
    return (
      <Box className="flex-1 items-center justify-center bg-blue-400">
        <Icon as={MessageCircleMoreIcon} />
        <Text>{t("loading")}</Text>
      </Box>
    );

  return (
    <VStack>
      <Text>hi</Text>
    </VStack>
  );
}
