import { CheckIcon } from "lucide-react-native";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Button } from "../ui/button";

export default function ColorSelect(props: {
  colors: string[];
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <HStack className="flex-wrap items-center justify-center gap-4">
      {props.colors.map((c) => {
        const isSelected = c == props.value;
        return (
          <Button
            key={c}
            onPress={() => props.setValue(c)}
            className="h-20 w-20 rounded-full"
            style={{ backgroundColor: c }}
          >
            {isSelected ? (
              <Icon
                color="white"
                //@ts-expect-error
                size="2xl"
                as={CheckIcon}
              />
            ) : null}
          </Button>
        );
      })}
    </HStack>
  );
}
