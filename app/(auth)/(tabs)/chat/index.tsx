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
import { ExternalPathString, Link } from "expo-router";
import * as Clipboard from "expo-clipboard";
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

export default function ChatChange() {
  const { t } = useTranslation();
  const currentChain = useStore(authStore, (s) => s.currentChain);
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const { appType, chatUrl } = useStore(chatStore);
  const queryClient = useQueryClient();
  const { showActionSheetWithOptions } = useActionSheet();

  const mutateChatType = useMutation({
    mutationFn(body: ChatPatchTypeRequest) {
      return chatTypePatch(body);
    },
    async onSettled() {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "chat-type", currentChain?.uid],
        exact: true,
      });
    },
  });
  const form = useForm({
    defaultValues: {
      appType: "off" as AppType,
      appUrl: "",
    },
    async onSubmit({ value }) {
      if (!currentChain) throw "loop must be selected";
      await mutateChatType.mutateAsync({
        chain_uid: currentChain.uid,
        chat_type: value.appType,
        chat_url: value.appUrl,
      });
    },
  });
  useEffect(() => {
    if (appType) {
      form.setFieldValue("appType", appType as any);
      form.setFieldValue("appUrl", chatUrl as any);
    }
  }, [chatUrl, appType]);
  async function onPressPasteChatUrl() {
    const text = (await Clipboard.getStringAsync()) || "";
    form.setFieldValue("appUrl", text);
  }

  function onPressResetChat() {
    form.setFieldValue("appType", (appType as any) || "off");
    form.setFieldValue("appUrl", chatUrl || "");
  }

  function openChatAppDialogOptions() {
    showActionSheetWithOptions(
      {
        title: t("imSelectChatApp"),
        options: [
          t("disabled"),
          "Signal",
          "WhatsApp",
          "Telegram",
          "Clothing Loop",
          t("cancel"),
        ],
        cancelButtonIndex: 5,
      },
      (selectedIndex) => {
        let value: string;
        switch (selectedIndex) {
          case 0:
            value = "off";
            break;
          case 1:
            value = "signal";
            break;
          case 2:
            value = "whatsapp";
            break;
          case 3:
            value = "telegram";
            break;
          case 4:
            value = "clothingloop";
            break;
          default:
            return;
        }
        form.setFieldValue("appType", value as any);
      },
    );
  }

  const currentChatApp = useMemo(() => {
    switch (appType) {
      case "signal":
        return messagingApps[0];
      case "whatsapp":
        return messagingApps[2];
      case "telegram":
        return messagingApps[3];
      case "clothingloop":
        return messageAppMattermost;
      default:
        return null;
    }
  }, [appType]);

  function appTypesValueToLabel(value: AppType) {
    switch (value) {
      case "signal":
        return "Signal";
      case "whatsapp":
        return "WhatsApp";
      case "telegram":
        return "Telegram";
      case "clothingloop":
        return "Clothing Loop";
      // case "off":
      default:
        return t("disabled");
    }
  }

  return (
    <Box className="flex-1 items-center justify-center bg-background-0">
      {!currentChatApp ? (
        <VStack className="items-center gap-4 py-5">
          <Icon
            as={MessageCircleQuestionIcon}
            className="h-24 w-24 text-typography-300"
          />
          <Text className="text-center text-xl">
            {authUserRoles.isHost
              ? t("imChatRoomDisabled")
              : t("imAskHostToSelectAChatApp")}
          </Text>
        </VStack>
      ) : (
        <VStack className="items-center gap-4 py-5">
          <currentChatApp.source
            width={96}
            height={96}
            color={currentChatApp.bgColor}
          />
          <Text className="text-center">
            {t("imChatMessage", { chat: currentChatApp.title })}
          </Text>
          {currentChatApp.key == "clothingloop" ? (
            <Link href="/(auth)/(tabs)/chat/clothingloop" replace asChild>
              <Button
                style={{ backgroundColor: currentChatApp.bgColor }}
                className="rounded-pill"
                size="xl"
              >
                <ButtonText style={{ color: currentChatApp.fgColor }}>
                  {t("enter")}
                </ButtonText>
              </Button>
            </Link>
          ) : (
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
          )}
        </VStack>
      )}
      {authUserRoles.isHost ? (
        <VStack className="absolute left-0 right-0 top-0 gap-3 bg-background-100 p-3">
          <form.Field name="appType">
            {(field) => (
              <>
                <FormLabel label={t("imSelectChatApp")}>
                  <Button
                    variant="outline"
                    className="justify-between"
                    onPress={openChatAppDialogOptions}
                  >
                    <ButtonText>
                      {appTypesValueToLabel(field.state.value)}
                    </ButtonText>
                    <ButtonIcon as={ChevronDownIcon}></ButtonIcon>
                  </Button>
                </FormLabel>
                {field.state.value == "clothingloop" ? null : (
                  <form.Field name="appUrl">
                    {(field) => (
                      <FormLabel label={t("imChatRoomUrl")}>
                        <HStack className="gap-3">
                          <Input className="flex-grow">
                            <InputField
                              keyboardType="url"
                              value={field.state.value}
                              onChangeText={field.setValue}
                            />
                          </Input>
                          <Button
                            size="sm"
                            className="h-auto"
                            onPress={onPressPasteChatUrl}
                          >
                            <Icon className="text-white" as={ClipboardIcon} />
                          </Button>
                        </HStack>
                      </FormLabel>
                    )}
                  </form.Field>
                )}
              </>
            )}
          </form.Field>

          <HStack className="items-stretch gap-3">
            <Button
              action="secondary"
              onPress={onPressResetChat}
              className="px-10"
            >
              <ButtonText>{t("reset")}</ButtonText>
            </Button>
            <Button onPress={form.handleSubmit} className="flex-grow">
              <ButtonText>{t("imUpdateChatRoom")}</ButtonText>
            </Button>
          </HStack>
        </VStack>
      ) : null}
    </Box>
  );
}
