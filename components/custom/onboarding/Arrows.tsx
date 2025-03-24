import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

export default function OnboardingArrows(props: {
  onPressPrev?: () => void;
  onPressNext?: () => void;
}) {
  return (
    <HStack className="justify-between self-end">
      <Box>
        {props.onPressPrev ? (
          <Button
            className="rounded-full"
            variant="outline"
            onPress={props.onPressPrev}
            size="xl"
          >
            <ButtonIcon as={ArrowLeft} />
          </Button>
        ) : null}
      </Box>
      <Box>
        {props.onPressNext ? (
          <Button
            className="rounded-full"
            onPress={props.onPressNext}
            size="xl"
          >
            <ButtonIcon as={ArrowRight} />
          </Button>
        ) : null}
      </Box>
    </HStack>
  );
}
