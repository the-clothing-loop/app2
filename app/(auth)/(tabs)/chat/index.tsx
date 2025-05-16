import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useStore } from "@tanstack/react-store";
import { Redirect } from "expo-router";
import { chatStore } from "@/store/chat";

export default function ChatChange() {
  const chatInAppDisabled = useStore(chatStore, (s) => s.chatInAppDisabled);
  if (chatInAppDisabled === false) {
    return <Redirect href="/(auth)/(tabs)/chat/clothingloop" />;
  } else if (chatInAppDisabled === true) {
    return <Redirect href="/(auth)/(tabs)/chat/types" />;
  }
  return (
    <Box>
      <Text>Redirecting...</Text>
    </Box>
  );
}
