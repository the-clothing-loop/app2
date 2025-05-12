import { ChatChannel } from "@/api/typex2";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PlusIcon } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, ScrollView } from "react-native";

export default function ChatChannels(props: {
  channels: ChatChannel[];
  selectedId: number | null;
  onPressChannel: (id: number) => void;
  onLongPressChannel: (channel: ChatChannel) => void;
  showCreateChannel: boolean;
  onPressCreateChannel?: () => void;
}) {
  const renderChannel = useCallback(
    (channel: ChatChannel) => {
      const isSelected = props.selectedId == channel.id;
      function handleLongPressChannel() {
        // do not selected do nothing
        if (props.selectedId !== channel.id) return;
        props.onLongPressChannel(channel);
      }
      function handlePressChannel() {
        // do nothing if already selected
        if (props.selectedId == channel.id) return;

        props.onPressChannel(channel.id);
      }
      return (
        <Pressable
          className={`flex h-full items-center px-2 ${isSelected ? "bg-background-0" : ""}`}
          onPress={handlePressChannel}
          onLongPress={handleLongPressChannel}
          key={channel.id}
        >
          <Box className="flex-grow justify-center">
            <Avatar style={{ backgroundColor: channel.color }}>
              <AvatarFallbackText>{channel.name}</AvatarFallbackText>
            </Avatar>
          </Box>
          <Text className="mb-3" isTruncated={true}>
            {channel.name}
          </Text>
        </Pressable>
      );
    },
    [props.selectedId, props.channels],
  );

  return (
    <ScrollView
      horizontal
      className="h-28 flex-grow-0 border-b border-b-background-200 bg-background-50"
    >
      {props.channels.map(renderChannel)}
      {props.showCreateChannel ? (
        <Pressable onPress={props.onPressCreateChannel} key="create-channel">
          <Box className="h-full w-24 items-center justify-center">
            <Avatar className="bg-background-0" size="lg">
              <Icon
                //@ts-expect-error
                size="2xl"
                as={PlusIcon}
              />
            </Avatar>
          </Box>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
