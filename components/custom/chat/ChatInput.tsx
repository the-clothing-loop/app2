import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react-native";
import { useState } from "react";

export default function ChatInput(props: {
  isDisabled: boolean;
  onEnter: (s: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <HStack className="w-full items-center gap-2 p-2">
      <Input className="flex-grow" isDisabled={props.isDisabled}>
        <InputField
          onSubmitEditing={(e) => props.onEnter(value)}
          onChangeText={setValue}
          value={value}
        ></InputField>
      </Input>
      <Button
        className="h-14 w-14 rounded-full"
        onPress={() => props.onEnter(value)}
        isDisabled={props.isDisabled}
      >
        <ButtonIcon as={SendHorizonalIcon} />
      </Button>
    </HStack>
  );
}
