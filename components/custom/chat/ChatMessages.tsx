import { chatChannelMessageList } from "@/api/chat";
import { UID } from "@/api/types";
import { ChatMessage, User } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useQuery } from "@tanstack/react-query";
import dayjs from "@/utils/dayjs";
import { useState } from "react";
import { SectionList, VirtualizedList } from "react-native";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";

export default function ChatMessages(props: {
  messages: ChatMessage[];
  authUserUID: UID;
}) {
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

  return (
    <VirtualizedList<ChatMessage>
      className="flex-1 flex-grow bg-background-100"
      initialNumToRender={20}
      data={props.messages}
      renderItem={({ item }) => {
        const date = toLocalRelativeDate(item.created_at);
        const user = getUser(item.sent_by);
        return (
          <Box key={item.id}>
            {props.authUserUID === item.sent_by ? (
              <VStack className="items-end px-2 pt-2">
                <Text className="text-sm text-typography-600">{date}</Text>
                <Box className="items-end rounded-b-xl rounded-ss-xl bg-primary-100 p-3">
                  <Text bold className="text-xs">
                    {user.name}
                  </Text>
                  <Text className="">{item.message}</Text>
                </Box>
              </VStack>
            ) : (
              <VStack className="items-start px-2 pt-2">
                <Text className="text-sm text-typography-600">{date}</Text>
                <Box className="rounded-b-xl rounded-se-xl bg-secondary-400 p-3">
                  <Text bold className="text-xs">
                    {item.sent_by}
                  </Text>
                  <Text className="">{item.message}</Text>
                </Box>
              </VStack>
            )}
          </Box>
        );
      }}
      inverted
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
    />
  );
}
