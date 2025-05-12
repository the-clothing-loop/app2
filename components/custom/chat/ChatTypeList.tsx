import { HStack } from "@/components/ui/hstack";
import { useMemo } from "react";
import { Dimensions, ScrollView } from "react-native";
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
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { MessageCircleQuestionIcon } from "lucide-react-native";

const windowDimensions = Dimensions.get("window");

export default function ChatTypeList(props: { onPressEnterInApp: () => void }) {
  const { t } = useTranslation();
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const { appType, chatUrl, chatInAppDisabled } = useStore(chatStore);

  const currentChatApp = useMemo(() => {
    switch (appType) {
      case "signal":
        return messagingApps[0];
      case "whatsapp":
        return messagingApps[2];
      case "telegram":
        return messagingApps[3];
      default:
        return null;
    }
  }, [appType]);

  return (
    <Box className="flex-1">
      {authUserRoles.isHost ? <ChatTypeEdit /> : null}
      {!currentChatApp && chatInAppDisabled ? (
        <VStack className="items-center gap-4 py-5">
          <Icon
            as={MessageCircleQuestionIcon}
            className="h-24 w-24 text-typography-300"
          />
          <Text className="text-center text-xl">
            {authUserRoles.isHost
              ? t("imChatChannelDisabled")
              : t("imAskHostToSelectAChatApp")}
          </Text>
        </VStack>
      ) : (
        <ScrollView className="mb-4 flex-col-reverse">
          {currentChatApp ? (
            <HStack className="w-screen items-center gap-4 bg-background-0 px-3 py-4">
              <currentChatApp.source
                width={48}
                height={48}
                color={currentChatApp.bgColor}
              />
              <Box className="flex-grow">
                <Text
                  className="items-center"
                  style={{ width: windowDimensions.width - 200 }}
                  numberOfLines={2}
                  isTruncated
                  ellipsizeMode="tail"
                >
                  {t("imChatMessage", { chat: currentChatApp.title })}
                </Text>
              </Box>
              <Link href={chatUrl as ExternalPathString} asChild>
                <Button
                  style={{ backgroundColor: currentChatApp.bgColor }}
                  className="rounded-pill"
                  size="xl"
                >
                  <ButtonText style={{ color: currentChatApp.fgColor }}>
                    {t("join")}
                  </ButtonText>
                </Button>
              </Link>
            </HStack>
          ) : null}
          {chatInAppDisabled !== true ? (
            <HStack className="w-screen items-center gap-4 bg-background-0 px-3 py-4">
              <messageAppMattermost.source
                width={48}
                height={48}
                color={messageAppMattermost.bgColor}
              />
              <Box className="flex-grow">
                <Text
                  className="items-center"
                  style={{ width: windowDimensions.width - 200 }}
                  numberOfLines={2}
                  isTruncated
                  ellipsizeMode="tail"
                >
                  {t("imChatMessage", { chat: messageAppMattermost.title })}
                </Text>
              </Box>
              <Button
                onPress={props.onPressEnterInApp}
                style={{ backgroundColor: messageAppMattermost.bgColor }}
                className="rounded-pill"
                size="xl"
              >
                <ButtonText style={{ color: messageAppMattermost.fgColor }}>
                  {t("enter")}
                </ButtonText>
              </Button>
            </HStack>
          ) : null}
        </ScrollView>
      )}
    </Box>
  );
}
