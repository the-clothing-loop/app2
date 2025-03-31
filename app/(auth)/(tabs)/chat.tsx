import FormLabel from "@/components/custom/FormLabel";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { messagingApps } from "@/constants/MessagingApps";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChatPatchTypeRequest,
  chatTypeGet,
  chatTypePatch,
} from "@/api/chat_type";

type AppType =
  | "off"
  | "clothingloop"
  | "signal"
  | "whatsapp"
  | "whatsapp"
  | "discord"
  | "telegram";

export default function Chat() {
  const { t } = useTranslation();
  const currentChain = useStore(authStore, (s) => s.currentChain);
  const authUserRoles = useStore(authStoreAuthUserRoles);

  const queryChatType = useQuery({
    queryKey: ["auth", "chat-type", currentChain?.uid],
    queryFn() {
      return chatTypeGet(currentChain!.uid).then((res) => res.data);
    },
    enabled: Boolean(currentChain),
  });
  const mutateChatType = useMutation({
    mutationFn(body: ChatPatchTypeRequest) {
      return chatTypePatch(body);
    },
    async onSettled() {
      await queryChatType.refetch();
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
    if (queryChatType.data) {
      form.setFieldValue("appType", queryChatType.data.chat_type as any);
      form.setFieldValue("appUrl", queryChatType.data.chat_url as any);
    }
  }, [queryChatType.data]);
  async function onPressPasteChatUrl() {
    const text = (await Clipboard.getStringAsync()) || "";
    form.setFieldValue("appUrl", text);
  }

  function onPressResetChat() {
    form.setFieldValue(
      "appType",
      (queryChatType.data?.chat_type as any) || "off",
    );
    form.setFieldValue("appUrl", queryChatType.data?.chat_url || "");
  }

  const currentChatApp = useMemo(() => {
    if (!queryChatType.data?.chat_url) return null;
    switch (queryChatType.data?.chat_type) {
      case "signal":
        return messagingApps[0];
      case "whatsapp":
        return messagingApps[2];
      case "telegram":
        return messagingApps[3];
      default:
        return null;
    }
  }, [queryChatType]);
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
              ? "Select a different chat app"
              : "Ask your host to select a chat app"}
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
            Go to your Loop {currentChatApp.title} chat group
          </Text>
          <Link
            href={queryChatType.data!.chat_url as ExternalPathString}
            asChild
          >
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
        </VStack>
      )}
      {authUserRoles.isHost ? (
        <VStack className="absolute left-0 right-0 top-0 gap-3 bg-background-100 p-3">
          <form.Field name="appType">
            {(field) => (
              <Select
                onValueChange={field.setValue as any}
                selectedValue={field.state.value}
              >
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select option" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label={t("disabled")} value="off" />
                    <SelectItem label="Signal" value="signal" />
                    <SelectItem label="WhatsApp" value="whatsapp" />
                    <SelectItem label="Discord" isDisabled value="discord" />
                    <SelectItem label="Telegram" value="telegram" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          </form.Field>
          <form.Field name="appUrl">
            {(field) => (
              <FormLabel label={t("chatPasteInRoomUrl")}>
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

          <HStack className="items-stretch gap-3">
            <Button
              action="secondary"
              onPress={onPressResetChat}
              className="px-10"
            >
              <ButtonText>{t("reset")}</ButtonText>
            </Button>
            <Button onPress={form.handleSubmit} className="flex-grow">
              <ButtonText>{t("updateChatRoom")}</ButtonText>
            </Button>
          </HStack>
        </VStack>
      ) : null}
    </Box>
  );
}
