import { useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

export default function ChatRoomCreateSheet() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  return (
    <ActionSheet
      snapPoints={[50, 100]}
      gestureEnabled
      ref={actionSheetRef}
      drawUnderStatusBar={false}
    ></ActionSheet>
  );
}
