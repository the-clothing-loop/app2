import { UID } from "@/api/types";
import { ChatMessage } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import dayjs from "@/utils/dayjs";
import { Pressable, VirtualizedList } from "react-native";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import { PinIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { useTranslation } from "react-i18next";

export default function ChatMessages(props: {
  messages: ChatMessage[];
  authUserUID: UID;
  isAuthUserAdmin: boolean;
  onMessageOptions: (m: ChatMessage) => void;
}) {
  const { t } = useTranslation();
  const { currentChainUsers } = useStore(authStore);
  function toLocalRelativeDate(created_at: number): string {
    const now = dayjs();
    const created_at_dayjs = dayjs(created_at);

    if (now.add(-3, "months").isAfter(created_at_dayjs)) {
      return created_at_dayjs.toDate().toLocaleDateString();
    }
    return now.to(created_at_dayjs);
  }

  function getUser(userUID: UID): { uid: UID; name: string } {
    return (
      currentChainUsers?.find((u) => u.uid === userUID) || {
        uid: "-",
        name: "Removed",
      }
    );
  }

  const stickyHeaderIndices = useMemo(() => {
    return props.messages.reduce((prev, message, i) => {
      if (message.is_pinned) {
        prev.push(i);
      }
      return prev;
    }, [] as number[]);
  }, [props.messages]);

  return (
    <VirtualizedList<ChatMessage>
      className="mb-2 flex-1 flex-grow bg-background-100"
      initialNumToRender={20}
      stickyHeaderIndices={stickyHeaderIndices}
      data={props.messages}
      renderItem={({ item }) => {
        const date = toLocalRelativeDate(item.created_at);
        const user = getUser(item.sent_by);
        const isMe = props.authUserUID === item.sent_by;
        function handleLongPress() {
          if (isMe || props.isAuthUserAdmin) {
            props.onMessageOptions(item);
          }
        }
        return (
          <Box key={item.id}>
            {item.is_pinned ? (
              <VStack className="relative items-stretch px-2 pt-2">
                <Pressable
                  onLongPress={handleLongPress}
                  className="flex items-start rounded-xl bg-background-0 p-3"
                >
                  <HStack className="">
                    <Text bold className="flex-grow text-xs">
                      {user.name}
                    </Text>
                    <Text className="absolute left-0 right-0 top-0 text-center text-sm text-typography-600">
                      {date}
                    </Text>
                    <Text className="text-xs">{t("pinned")}</Text>
                    <Icon as={PinIcon} className="ms-1" size="sm" />
                  </HStack>
                  <Text className="">{item.message}</Text>
                </Pressable>
              </VStack>
            ) : isMe ? (
              <VStack className="items-end px-2 pt-2">
                <Text className="text-sm text-typography-600">{date}</Text>
                <Pressable
                  onLongPress={handleLongPress}
                  className="flex items-end rounded-b-xl rounded-ss-xl bg-primary-100 p-3"
                >
                  <Text bold className="text-xs">
                    {user.name}
                  </Text>
                  <Text className="">{item.message}</Text>
                </Pressable>
              </VStack>
            ) : (
              <VStack className="items-start px-2 pt-2">
                <Text className="text-sm text-typography-600">{date}</Text>
                <Pressable
                  onLongPress={handleLongPress}
                  className="flex rounded-b-xl rounded-se-xl bg-secondary-400 py-3"
                >
                  <Text bold className="text-xs">
                    {item.sent_by}
                  </Text>
                  <Text className="">{item.message}</Text>
                </Pressable>
              </VStack>
            )}
          </Box>
        );
      }}
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
    />
  );
}
