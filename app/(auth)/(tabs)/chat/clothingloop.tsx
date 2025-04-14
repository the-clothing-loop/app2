import { chatRoomList, chatRoomMessageList } from "@/api/chat";
import { ChatMessage } from "@/api/typex2";
import ChatInput from "@/components/custom/chat/ChatInput";
import ChatMessages from "@/components/custom/chat/ChatMessages";
import ChatRooms from "@/components/custom/chat/ChatRooms";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { authStore, authStoreAuthUserRoles } from "@/store/auth";
import { ChatConnStatus, chatStore } from "@/store/chat";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { MessageCircleMoreIcon } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function ChatMattermost() {
  const { currentChain, authUser } = useStore(authStore);
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const { t } = useTranslation();
  const chat = useStore(chatStore);

  useEffect(() => {
    if (!authUser) return;
    if (!currentChain?.uid) return;
    if (chat.appType !== "clothingloop") return;
    chatRoomList;
  }, [authUser?.uid, currentChain?.uid]);

  useMemo(() => {}, [currentChain?.chat_room_ids]);

  const queryRoomList = useQuery({
    queryKey: ["auth", "chat", "rooms", currentChain?.uid],
    queryFn() {
      return chatRoomList(currentChain!.uid).then((res) => res.data.list);
    },
    enabled: Boolean(currentChain),
  });
  const [selectedRoomId, setSelectedRoomId] = useState<null | number>(null);
  const [startFrom, setStartFrom] = useState(() => new Date().valueOf());
  const queryRoomMessageList = useInfiniteQuery({
    queryKey: [
      "auth",
      "chat",
      "messages",
      currentChain?.uid,
      setSelectedRoomId,
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
      return chatRoomMessageList({
        chain_uid: currentChain!.uid,
        chat_room_id: selectedRoomId!,
        start_from: 0,
        page: pageParam,
      }).then((res) => res.data.messages);
    },
    enabled: Boolean(currentChain && selectedRoomId),
  });
  const queryRoomMessageListArr = useMemo(
    () =>
      queryRoomMessageList.data?.pages?.reduce(
        (
          value: ChatMessage[],
          curr: ChatMessage[],
          i: number,
          arr: ChatMessage[][],
        ) => {
          value.push(...curr);
          return value;
        },
        [] as ChatMessage[],
      ) || [],
    [queryRoomMessageList],
  );
  const changeSelectedRoom = (id: number | null) => {
    setSelectedRoomId(id);
    // queryRoomMessageList.
  };

  function handleCreateRoom() {
    console.log("create room");
  }
  return (
    <Box className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        keyboardVerticalOffset={84}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <VStack className="flex-1 pb-4">
          <ChatRooms
            rooms={queryRoomList.data || []}
            selectedId={selectedRoomId}
            showCreateRoom={authUserRoles.isHost}
            onPressCreateRoom={handleCreateRoom}
            onPressRoom={setSelectedRoomId}
          />
          <ChatMessages messages={queryRoomMessageListArr || []} />
          <ChatInput />
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}
