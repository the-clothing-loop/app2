import { HStack } from "@/components/ui/hstack";
import { RefObject, useMemo } from "react";
import { Dimensions, ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ChatTypeEdit from "./ChatTypeEdit";
import { useTranslation } from "react-i18next";
import { useStore } from "@tanstack/react-store";
import { authStoreAuthUserRoles } from "@/store/auth";
import { chatStore } from "@/store/chat";
import { messageAppMattermost, messagingApps } from "@/constants/MessagingApps";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ExternalPathString, Link } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import ChatTypeList from "./ChatTypeList";

const windowDimensions = Dimensions.get("window");

export default function ChatTypeSheet(props: {
  refSheet: RefObject<ActionSheetRef>;
}) {
  return (
    <ActionSheet
      snapPoints={[100]}
      gestureEnabled
      ref={props.refSheet}
      drawUnderStatusBar={false}
    >
      <ScrollView>
        <ChatTypeList hideInAppLink />
      </ScrollView>
    </ActionSheet>
  );
}
