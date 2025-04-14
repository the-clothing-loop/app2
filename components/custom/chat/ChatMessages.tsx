import { chatRoomMessageList } from "@/api/chat";
import { UID } from "@/api/types";
import { ChatMessage } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SectionList, VirtualizedList } from "react-native";

export default function ChatMessages(props: { messages: ChatMessage[] }) {
  return (
    <VirtualizedList<ChatMessage>
      className="flex-1 flex-grow bg-background-100"
      initialNumToRender={0}
      data={props.messages}
      renderItem={({ item }) => (
        <Box>
          <Text>test</Text>
        </Box>
      )}
      inverted
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
    />
  );
}
