import { HeartIcon } from "lucide-react-native";

import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";
import { Box } from "../ui/box";

export default function Donate() {
  function onPressDonate() {}
  return null;
  return (
    <HStack className="w-full items-center justify-between bg-pink-100 p-3">
      <VStack className="flex-shrink flex-grow">
        <Text bold size="xl">
          Donate
        </Text>
        <Text size="sm">Hi 👋, I'm Lucian, this app's main developer</Text>
        <Text size="sm">
          With a donation you support the development of
          My&nbsp;Clothing&nbsp;Loop
        </Text>
      </VStack>
      <Box className="shrink-0">
        <Button
          action="secondary"
          className="rounded-full"
          onPress={onPressDonate}
        >
          <Icon as={HeartIcon} className="fill-pink-600" />
          <ButtonText>&euro; 5</ButtonText>
        </Button>
      </Box>
    </HStack>
  );
}
