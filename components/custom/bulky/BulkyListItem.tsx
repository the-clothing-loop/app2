import { BulkyItem } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import dayjs from "dayjs";
import { EllipsisIcon } from "lucide-react-native";
import { useMemo } from "react";
import { Image, Pressable } from "react-native";

export default function BulkyListItem(props: {
  bulky: BulkyItem;
  setSelected: () => void;
  isEditable: boolean;
  onOpenOptions: () => void;
}) {
  const date = useMemo(() => {
    return dayjs(props.bulky.created_at).toDate();
  }, [props.bulky.created_at]);
  const message = useMemo(() => {
    return props.bulky.message.length > 100
      ? props.bulky.message.slice(0, 100) + "..."
      : props.bulky.message;
  }, [props.bulky.message]);

  return (
    <Pressable
      onPress={() => props.setSelected()}
      onLongPress={props.isEditable ? () => props.onOpenOptions() : undefined}
    >
      <Card
        className="relative bg-transparent p-1"
        id={"bulky-" + props.bulky.id}
      >
        {props.isEditable ? (
          <Pressable
            className="absolute right-2 top-2 z-10 flex rounded-full bg-black/30 p-1"
            onPress={props.onOpenOptions}
          >
            <EllipsisIcon color="#fff" className=""></EllipsisIcon>
          </Pressable>
        ) : null}
        {props.bulky.image_url ? (
          <Box className="aspect-square">
            <Image
              className="h-full w-full rounded-t-md"
              alt=""
              source={{
                uri: props.bulky.image_url,
              }}
            />
          </Box>
        ) : null}
        <VStack
          className={`bg-background-0 p-3 ${props.bulky.image_url ? "rounded-b-md" : "rounded-md"}`}
        >
          <Text className="text-typography-500" size="sm" bold>
            {date.toLocaleDateString()}
          </Text>
          <Text className="text-3xl">{props.bulky.title}</Text>
          <Text>{message}</Text>
        </VStack>
      </Card>
    </Pressable>
  );
}
