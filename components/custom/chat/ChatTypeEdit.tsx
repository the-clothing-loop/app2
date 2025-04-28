import { chatTypePatch } from "@/api/chat";
import { Chain } from "@/api/types";
import { ChainResponse, ChatPatchTypeRequest } from "@/api/typex2";
import { AppType, chatStore } from "@/store/chat";
import * as Clipboard from "expo-clipboard";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import FormLabel from "../FormLabel";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
} from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { authStore } from "@/store/auth";
import { useNavigation } from "expo-router";

export default function ChatTypeEdit() {
  const currentChain = useStore(authStore, (s) => s.currentChain);
  const { appType, chatUrl, chatInAppDisabled } = useStore(chatStore);
  const queryClient = useQueryClient();

  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();
  useEffect(() => {
    if (appType) {
      form.setFieldValue("appType", appType as any);
      form.setFieldValue("appUrl", chatUrl as any);
      form.setFieldValue("appInAppDisabled", chatInAppDisabled as any);
    }
  }, [chatUrl, appType, chatInAppDisabled]);
  const mutateChatType = useMutation({
    mutationFn(body: ChatPatchTypeRequest) {
      console.log("body", body);
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
      appInAppDisabled: false,
    },
    async onSubmit({ value }) {
      if (!currentChain) throw "loop must be selected";
      await mutateChatType.mutateAsync({
        chain_uid: currentChain.uid,
        chat_type: value.appType,
        chat_url: value.appUrl,
        chat_in_app_disabled: value.appInAppDisabled,
      });
    },
  });

  async function onPressPasteChatUrl() {
    const text = (await Clipboard.getStringAsync()) || "";
    form.setFieldValue("appUrl", text);
  }

  function onPressResetChat() {
    form.setFieldValue("appType", (appType as any) || "off");
    form.setFieldValue("appUrl", chatUrl || "");
    form.setFieldValue("appInAppDisabled", false);
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
        let value: AppType;
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
          default:
            return;
        }
        form.setFieldValue("appType", value);
      },
    );
  }
  function appTypesValueToLabel(value: AppType) {
    switch (value) {
      case "signal":
        return "Signal";
      case "whatsapp":
        return "WhatsApp";
      case "telegram":
        return "Telegram";
      // case "off":
      default:
        return t("disabled");
    }
  }

  return (
    <VStack className="w-full flex-grow-0 gap-3 border-b border-background-200 bg-background-50 p-3">
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
            {field.state.value == "off" ? null : (
              <form.Field name="appUrl">
                {(field) => (
                  <FormLabel label={t("imChatChannelUrl")}>
                    <HStack className="items-center gap-3">
                      <Input className="flex-grow">
                        <InputField
                          keyboardType="url"
                          value={field.state.value}
                          onChangeText={field.setValue}
                        />
                      </Input>
                      <Button
                        className="h-14 w-14 rounded-full"
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
      <form.Field name="appInAppDisabled">
        {(field) => (
          <FormLabel label={t("In-app chat")} horizontal>
            <Switch
              value={!field.state.value}
              onToggle={() => field.setValue((s) => !s)}
            />
          </FormLabel>
        )}
      </form.Field>

      <HStack className="items-stretch gap-3">
        <Button
          action="secondary"
          size="lg"
          onPress={onPressResetChat}
          className="px-10"
        >
          <ButtonText>{t("reset")}</ButtonText>
        </Button>
        <Button
          action={form.state.errors.length ? "negative" : "primary"}
          onPress={form.handleSubmit}
          isDisabled={form.state.isSubmitting}
          className="flex-grow"
          size="lg"
        >
          <ButtonText>{t("imUpdateChatChannel")}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
