import ChatTypeList from "@/components/custom/chat/ChatTypeList";
import { router } from "expo-router";

export default function ChatTypes() {
  function handlePressEnterInApp() {
    router.replace("/(auth)/(tabs)/chat/clothingloop");
  }
  return <ChatTypeList onPressEnterInApp={handlePressEnterInApp} />;
}
