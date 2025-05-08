import { Bag, User } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import {
  ChevronRight,
  Flag,
  Pause,
  Shield,
  ShoppingBag,
} from "lucide-react-native";

interface Props {
  user: User;
  index: number;
  isWarden: boolean;
  isHost: boolean;
  isAuthHost: boolean;
  isMe: boolean;
  isPaused: boolean;
  isPrivate: boolean;
  bags: Bag[];
}

export default function RouteItem(props: Props) {
  const hideLink =
    (props.isPaused || props.isPrivate) && !props.isAuthHost && !props.isMe;

  return (
    <Link
      key={props.user.uid}
      href={{
        pathname: "/(auth)/(tabs)/route/[user]",
        params: {
          user: props.user.uid,
        },
      }}
      disabled={hideLink}
    >
      <HStack className="items-center gap-3 border-b border-b-outline-200 bg-background-0 p-2">
        <Box className="relative h-10 w-12 items-end justify-center">
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
          <Text
            className={`font-semibold ${props.isMe ? "text-info-700" : ""}`}
          >
            {props.user.name}
          </Text>
          <Text
            size="sm"
            className="text-typography-600"
            style={{ width: 200 }}
            numberOfLines={2}
          >
            {props.isPrivate ? "" : props.user.address}
          </Text>
        </VStack>

        <HStack reversed className="items-center">
          {hideLink ? (
            <Box className="ms-2 w-4" />
          ) : (
            <Icon as={ChevronRight} className="ms-2" />
          )}
          <VStack className="max-h-12 flex-wrap-reverse gap-0.5">
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
