import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

export default function OnboardingArrows(props: {
  onPressPrev?: () => void;
  onPressNext?: () => void;
}) {
  return (
    <HStack className="absolute bottom-0 left-0 right-0 justify-between p-4">
      <Box>
        {props.onPressPrev ? (
          <Button
            className="h-20 w-20 rounded-full bg-background-100 data-[active=true]:bg-background-200"
            variant="outline"
            onPress={props.onPressPrev}
            size="xl"
          >
            <ButtonIcon
              //@ts-expect-error
              size="2xl"
              as={ArrowLeft}
            />
          </Button>
        ) : null}
      </Box>
      <Box>
        {props.onPressNext ? (
          <Button
            className="h-20 w-20 rounded-full"
            onPress={props.onPressNext}
            size="xl"
          >
            <ButtonIcon
              //@ts-expect-error
              size="2xl"
              as={ArrowRight}
            />
          </Button>
        ) : null}
      </Box>
    </HStack>
  );
}
