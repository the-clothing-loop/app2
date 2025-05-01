import FormLabel from "@/components/custom/FormLabel";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { messageAppMattermost, messagingApps } from "@/constants/MessagingApps";
import { authStore, authStoreAuthUserRoles } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { ExternalPathString, Link, Redirect } from "expo-router";

import {
  ChevronDownIcon,
  ClipboardIcon,
  MessageCircleQuestionIcon,
} from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChatPatchTypeRequest,
  chatTypeGet,
  chatTypePatch,
} from "@/api/chat_type";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { AppType, chatStore } from "@/store/chat";
import { Switch } from "@/components/ui/switch";
import ChatTypeEdit from "@/components/custom/chat/ChatTypeEdit";
import { Dimensions, ScrollView } from "react-native";
import ChatTypeSheet from "@/components/custom/chat/ChatTypeSheet";
import ChatTypeList from "@/components/custom/chat/ChatTypeList";

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
