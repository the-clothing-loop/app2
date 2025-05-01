import {
  chatChannelDelete,
  chatChannelList,
  chatChannelMessageCreate,
  chatChannelMessageDelete,
  chatChannelMessagePinToggle,
} from "@/api/chat";
import { ChatChannel, ChatMessage } from "@/api/typex2";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { MessageCircleQuestionIcon } from "lucide-react-native";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AlertButton,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatTypeSheet from "@/components/custom/chat/ChatTypeSheet";
import { Redirect, useNavigation } from "expo-router";
import { useInterval } from "usehooks-ts";
import useQueryChatMessages from "@/components/custom/chat/UseQueryChatMessages";

export default function ChatClothingloop() {
  const { currentChain, authUser } = useStore(authStore);
  const { isHost } = useStore(authStoreAuthUserRoles);
  const queryClient = useQueryClient();
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const { t } = useTranslation();
  const chat = useStore(chatStore);
  const [editChannel, setEditChannel] = useState<ChatChannel | null>(null);
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

  useInterval(() => {
    if (navigation.isFocused()) queryChatHistory.addPagesTillNewest();
  }, 10000);

  useEffect(() => {
    if (authUser && queryChannelList.data?.length && !selectedChannelId) {
      setSelectedChannelId(queryChannelList.data[0].id);
    }
  }, [queryChannelList.data, authUser, selectedChannelId]);

  const queryChatHistory = useQueryChatMessages(
    currentChain?.uid,
    selectedChannelId,
  );

  function changeSelectedChannel(id: number) {
    setSelectedChannelId(id);
  }

  function alertDeleteChannel(channelID: number) {
    Alert.alert(t("deleteChannel"), undefined, [
      {
        text: t("delete"),
        style: "destructive",
        onPress() {
          chatChannelDelete({
            chain_uid: currentChain!.uid,
            chat_channel_id: channelID,
          }).finally(() => {
            queryClient.refetchQueries({
              queryKey: ["auth", "chat"],
            });
          });
        },
      },
      { text: t("cancel"), style: "cancel" },
    ]);
  }

  function openEditChannel(channel: ChatChannel) {
    setEditChannel(channel);
    setTimeout(() => {
      refSheet.current?.show();
    });
  }

  function handleLongPressChannel(channel: ChatChannel) {
    Alert.alert(
      t("editChannel"),
      undefined,
      [
        {
          text: t("edit"),
          style: "default",
          onPress() {
            openEditChannel(channel);
          },
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress() {
            alertDeleteChannel(channel.id);
          },
        },
        { text: t("cancel"), style: "cancel" },
      ],
      {},
    );
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

    await queryChatHistory.resetToNow();
  }

  function handleMessageOptions(message: ChatMessage) {
    const buttons: AlertButton[] = [];
    if (isHost) {
      buttons.push({
        text: message.is_pinned ? t("unpin") : t("pin"),
        style: "default",
        onPress() {
          handleMessagePinToggle(message);
        },
      });
    }
    buttons.push(
      {
        text: t("delete"),
        style: "destructive",
        onPress() {
          Alert.alert(t("areYouSureDeleteMessage"), message.message, [
            {
              text: t("delete"),
              style: "destructive",
              onPress() {
                handleMessageDelete(message);
              },
            },
            {
              text: t("cancel"),
              style: "cancel",
            },
          ]);
        },
      },
      {
        text: t("cancel"),
        style: "cancel",
      },
    );
    Alert.alert(t("messageOptions"), message.message, buttons);
  }

  function handleMessagePinToggle(message: ChatMessage) {
    chatChannelMessagePinToggle({
      chain_uid: currentChain!.uid,
      chat_channel_id: message.chat_channel_id,
      chat_message_id: message.id,
    }).finally(() => {
      queryChatHistory.afterMessageAltered(message.id);
    });
  }
  function handleMessageDelete(message: ChatMessage) {
    chatChannelMessageDelete({
      chain_uid: currentChain!.uid,
      chat_channel_id: message.chat_channel_id,
      chat_message_id: message.id,
    }).finally(() => {
      queryChatHistory.afterMessageAltered(message.id);
    });
  }

  function handleMessagesRefresh(
    setRefreshing: Dispatch<SetStateAction<boolean>>,
  ) {
    setRefreshing(true);
    queryChatHistory.resetToNow().finally(() => {
      setRefreshing(false);
    });
  }

  function handleCreateChannel() {
    setEditChannel(null);
    setTimeout(() => {
      refSheet.current?.show();
    });
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
            currentChatChannel={editChannel}
            fallbackChainUID={currentChain?.uid || ""}
            refSheet={refSheet}
          />
          <ChatChannels
            channels={queryChannelList.data || []}
            selectedId={selectedChannelId}
            showCreateChannel={authUserRoles.isHost}
            onPressCreateChannel={handleCreateChannel}
            onPressChannel={changeSelectedChannel}
            onLongPressChannel={handleLongPressChannel}
          />
          {selectedChannelId ? (
            <ChatMessages
              onEndReached={() => queryChatHistory.addPagePrev()}
              messages={queryChatHistory.messages}
              authUserUID={authUser?.uid || ""}
              isAuthUserAdmin={isHost}
              onMessageOptions={handleMessageOptions}
              onRefresh={handleMessagesRefresh}
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
