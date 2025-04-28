import { ChatRoom } from "@/api/typex2";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PlusIcon } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable } from "react-native";

export default function ChatRooms(props: {
  rooms: ChatRoom[];
  selectedId: number | null;
  onPressRoom: (id: number | null) => void;
  showCreateRoom: boolean;
  onPressCreateRoom?: () => void;
}) {
  const renderRoom = useCallback(
    (room: ChatRoom) => {
      const initials = room.name
        .split(" ")
        .map((word) => word[0])
        .join("");
      return (
        <Pressable
          className="flex h-full items-center justify-center px-2"
          onPress={() =>
            props.onPressRoom(props.selectedId == room.id ? null : room.id)
          }
          key={room.id}
        >
          <Avatar style={{ backgroundColor: room.color }}>
            <AvatarFallbackText>{initials}</AvatarFallbackText>
          </Avatar>
          <Text className="w-22" isTruncated={true}>
            {room.name}
          </Text>
        </Pressable>
      );
    },
    [props.selectedId],
  );

  return (
    <HStack className="h-32 bg-background-50">
      {props.rooms.map(renderRoom)}
      {props.showCreateRoom ? (
        <Pressable onPress={props.onPressCreateRoom} key="create-room">
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
    </HStack>
  );
}
