import ChatTypeList from "../../../../../components/custom/chat/ChatTypeList";
import { router } from "expo-router";

export default function ChatTypeSheet() {
  function handlePressEnterInApp() {
    router.back();
  }
  return <ChatTypeList onPressEnterInApp={handlePressEnterInApp} />;
}
