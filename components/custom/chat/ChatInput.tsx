import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react-native";
import { KeyboardAvoidingView } from "react-native";

export default function ChatInput() {
  return (
    <HStack className="w-full items-center gap-2 p-2">
      <Input className="flex-grow">
        <InputField></InputField>
      </Input>
      <Button className="h-14 w-14 rounded-full">
        <ButtonIcon as={SendHorizonalIcon} />
      </Button>
    </HStack>
  );
}
