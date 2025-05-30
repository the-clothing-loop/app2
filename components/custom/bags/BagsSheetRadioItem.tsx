import { User } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import {
  Radio,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  CircleIcon,
  FlagIcon,
  PauseIcon,
  ShieldIcon,
} from "lucide-react-native";

export default function BagsSheetRadioItem(props: {
  user: User;
  isPaused: boolean;
  isHost: boolean;
  isMe: boolean;
  isWarden: boolean;
  routeIndex: number;
  isPrivate: boolean;
}) {
  return (
    <Radio
      value={props.user.uid}
      key={props.user.uid}
      //   isInvalid={Boolean(field.state.meta.errors.length)}
      size="md"
      className="justify-between px-5 py-2"
    >
      <HStack className="justify-center gap-3">
        <Box className="relative h-10 w-10 items-end justify-center">
          {props.isPaused ? (
            <Icon
              as={PauseIcon}
              className="fill-typography-700 text-transparent"
              size="lg"
            />
          ) : (
            <Text className="text-right font-bold text-typography-600">
              {"#" + (props.routeIndex + 1)}
            </Text>
          )}
          <Box className="absolute -left-1 -top-1">
            {props.isHost ? (
              <Icon
                as={ShieldIcon}
                size="md"
                className="fill-typography-700 text-transparent"
              />
            ) : props.isWarden ? (
              <Icon
                as={FlagIcon}
                size="md"
                className="fill-typography-700 text-transparent"
              />
            ) : undefined}
          </Box>
        </Box>
        <VStack>
          <RadioLabel
            className={`font-bold ${props.isMe ? "!text-primary-500" : ""}`}
          >
            {props.user.name}
          </RadioLabel>
          <Text
            size="xs"
            className="break-words"
            style={{ width: 300 }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {props.isPrivate ? "" : props.user.address}
          </Text>
        </VStack>
      </HStack>
      <RadioIndicator>
        <RadioIcon as={CircleIcon} />
      </RadioIndicator>
    </Radio>
  );
}
