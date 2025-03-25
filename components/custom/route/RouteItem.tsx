import { Bag, User } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import IsPaused from "@/utils/user";
import { Link, router } from "expo-router";
import {
  ChevronRight,
  Flag,
  Pause,
  Shield,
  ShoppingBag,
} from "lucide-react-native";
import { Pressable } from "react-native";

interface Props {
  user: User;
  index: number;
  isWarden: boolean;
  isHost: boolean;
  isPaused: boolean;
  bags: Bag[];
  onPress: () => void;
}

export default function RouteItem(props: Props) {
  return (
    <Link
      key={props.user.uid}
      href={{
        pathname: "./[user]",
        params: {
          user: props.user.uid,
        },
      }}
    >
      <HStack className="items-center gap-3 border-b border-b-outline-200 bg-background-0 p-2">
        <Box className="relative h-10 w-10 items-end justify-center">
          {props.isPaused ? (
            <Icon
              as={Pause}
              className="fill-typography-700 text-transparent"
              size="lg"
            />
          ) : (
            <Text className="text-right font-bold text-typography-600">
              {"#" + (props.index + 1)}
            </Text>
          )}
          <Box className="absolute -left-1 -top-1">
            {props.isHost ? (
              <Icon
                as={Shield}
                size="md"
                className="fill-typography-700 text-transparent"
              />
            ) : props.isWarden ? (
              <Icon
                as={Flag}
                size="md"
                className="fill-typography-700 text-transparent"
              />
            ) : undefined}
          </Box>
        </Box>

        <VStack className="grow">
          <Text className="font-semibold">{props.user.name}</Text>
          <Text size="sm" className="text-typography-600">
            {props.user.address}
          </Text>
        </VStack>

        <HStack reversed>
          <Icon
            as={ChevronRight}
            className={"ms-2".concat(props.isPaused ? "opacity-0" : "")}
          />
          <VStack className="flex-wrap-reverse gap-0.5">
            {props.bags.map((b) => (
              <Box key={b.id}>
                <Icon as={ShoppingBag} color={b.color} />
              </Box>
            ))}
          </VStack>
        </HStack>
      </HStack>
    </Link>
  );
}
