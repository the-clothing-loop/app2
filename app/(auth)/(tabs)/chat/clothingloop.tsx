import {
  chatChannelList,
  chatChannelMessageCreate,
  chatChannelMessageList,
} from "@/api/chat";
import { ChatMessage } from "@/api/typex2";
import ChatInput from "@/components/custom/chat/ChatInput";
import ChatMessages from "@/components/custom/chat/ChatMessages";
import ChatChannelCreateSheet from "@/components/custom/chat/ChatChannelsCreateSheet";
import ChatChannels from "@/components/custom/chat/ChatChannels";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { authStore, authStoreAuthUserRoles } from "@/store/auth";
import { chatStore } from "@/store/chat";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { MessageCircleQuestionIcon } from "lucide-react-native";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable } from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatTypeSheet from "@/components/custom/chat/ChatTypeSheet";
import { Redirect, useNavigation } from "expo-router";
import { useInterval } from "usehooks-ts";

export default function ChatClothingloop() {
  const { currentChain, authUser } = useStore(authStore);
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const { t } = useTranslation();
  const chat = useStore(chatStore);
  const refSheet = useRef<ActionSheetRef>(null);
  const refTypeSheet = useRef<ActionSheetRef>(null);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => refTypeSheet.current?.show()}>
          <Text>Options</Text>
        </Pressable>
      ),
    });
  }, []);

  useEffect(() => {
    if (!authUser) return;
    if (!currentChain?.uid) return;
    if (chat.appType !== "off") return;
    // chatChannelList;
  }, [authUser?.uid, currentChain?.uid]);

  // useMemo(() => {}, [currentChain?.chat_channel_ids]);

  const queryChannelList = useQuery({
    queryKey: ["auth", "chat", "channels", currentChain?.uid],
    queryFn() {
      console.log("get chat channel list", currentChain?.uid);
      return chatChannelList(currentChain!.uid).then((res) => res.data.list);
    },
    enabled: Boolean(currentChain),
  });
  const [selectedChannelId, setSelectedChannelId] = useState<null | number>(
    null,
  );
  const [startFrom, setStartFrom] = useState(() => new Date().valueOf());
  useInterval(() => {
    setStartFrom(new Date().valueOf());
  }, 10000);
  const queryChannelMessageList = useInfiniteQuery({
    queryKey: [
      "auth",
      "chat",
      "messages",
      currentChain?.uid,
      selectedChannelId,
      startFrom,
    ],
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: ChatMessage[],
      pages: ChatMessage[][],
      lastPageParam,
    ) =>
      // return null to tell useInfiniteQuery that last page has been reached
      lastPage.length ? lastPageParam + 1 : null,
    queryFn({ pageParam }) {
      return chatChannelMessageList({
        chain_uid: currentChain!.uid,
        chat_channel_id: selectedChannelId!,
        start_from: startFrom,
        page: pageParam,
      })
        .then((res) => res.data.messages)
        .then((res) => {
          console.log("res", res);
          return res;
        });
    },
    enabled: Boolean(currentChain && selectedChannelId),
  });
  const queryChannelMessageListArr = useMemo(() => {
    console.log("pages", queryChannelMessageList.data?.pages);
    const arrInArr = queryChannelMessageList.data?.pages || [];
    const arr: ChatMessage[] = [];
    for (const value of arrInArr) {
      arr.push(...value);
    }
    return arr.reverse();
  }, [queryChannelMessageList]);
  function changeSelectedChannel(id: number | null) {
    setSelectedChannelId(id);
    setStartFrom(new Date().valueOf());
  }

  const safeInsets = useSafeAreaInsets();

  async function handleSendMessage(text: string) {
    if (!authUser) throw "not logged in";
    if (!currentChain) throw "no loop selected";
    if (!selectedChannelId) throw "must select a chat channel";
    await chatChannelMessageCreate({
      chain_uid: currentChain?.uid,
      message: text,
      chat_channel_id: selectedChannelId,
    });
    setStartFrom(new Date().valueOf());
  }

  function handleCreateChannel() {
    refSheet.current?.show();
  }
  if (chat.chatInAppDisabled === true) {
    return <Redirect href="/(auth)/(tabs)/chat/types" withAnchor />;
  }
  return (
    <VStack className="flex-1 pb-4">
      <KeyboardAvoidingView
        keyboardVerticalOffset={64 + safeInsets.bottom}
        behavior="padding"
        className="flex-1"
      >
        <VStack className="flex-1">
          <ChatChannelCreateSheet
            currentChatChannel={undefined}
            fallbackChainUID={currentChain?.uid || ""}
            refSheet={refSheet}
          />
          <ChatChannels
            channels={queryChannelList.data || []}
            selectedId={selectedChannelId}
            showCreateChannel={authUserRoles.isHost}
            onPressCreateChannel={handleCreateChannel}
            onPressChannel={changeSelectedChannel}
          />
          {selectedChannelId ? (
            <ChatMessages
              messages={queryChannelMessageListArr}
              authUserUID={authUser?.uid || ""}
            />
          ) : (
            <Box className="flex-1 items-center justify-center gap-4">
              <Icon
                className="h-20 w-20 text-typography-600"
                as={MessageCircleQuestionIcon}
              />
              <Text className="text-typography-600" size="xl" bold>
                {t("Select a chat channel")}
              </Text>
            </Box>
          )}
          <ChatInput
            isDisabled={!selectedChannelId}
            onEnter={handleSendMessage}
          />
        </VStack>
      </KeyboardAvoidingView>
      <ChatTypeSheet refSheet={refTypeSheet} />
    </VStack>
  );
}
