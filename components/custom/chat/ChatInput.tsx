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
  const isDisabled = props.isDisabled || value == "";
  function handleSend() {
    if (!value) return;
    props.onEnter(value);
    setValue("");
  }
  return (
    <HStack className="w-full items-center gap-2 p-2">
      <Input className="flex-grow" isDisabled={props.isDisabled}>
        <InputField
          onSubmitEditing={handleSend}
          onChangeText={setValue}
          value={value}
          numberOfLines={3}
        ></InputField>
      </Input>
      <Button
        className="h-14 w-14 rounded-full"
        onPress={handleSend}
        isDisabled={isDisabled}
      >
        <ButtonIcon as={SendHorizonalIcon} />
      </Button>
    </HStack>
  );
}
