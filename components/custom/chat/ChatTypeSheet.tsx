import { RefObject } from "react";
import { ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ChatTypeList from "./ChatTypeList";

export default function ChatTypeSheet(props: {
  refSheet: RefObject<ActionSheetRef>;
}) {
  function handlePressEnterInApp() {
    props.refSheet.current?.hide();
  }
  return (
    <ActionSheet
      snapPoints={[100]}
      gestureEnabled
      ref={props.refSheet}
      drawUnderStatusBar={false}
    >
      <ScrollView>
        <ChatTypeList onPressEnterInApp={handlePressEnterInApp} />
      </ScrollView>
    </ActionSheet>
  );
}
