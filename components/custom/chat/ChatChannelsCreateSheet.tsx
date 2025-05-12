import { chatChannelCreate, chatChannelEdit } from "@/api/chat";
import { UID } from "@/api/types";
import { ChatChannel } from "@/api/typex2";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useForm } from "@tanstack/react-form";
import { RefObject, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import FormLabel from "../FormLabel";
import { Input, InputField } from "@/components/ui/input";
import ColorSelect from "../ColorSelect";
import { Box } from "@/components/ui/box";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { catchErrThrow401 } from "@/utils/handleRequests";

const channelColors = [
  "#C9843E",
  "#AD8F22",
  "#79A02D",
  "#66926E",
  "#199FBA",
  "#6494C2",
  "#1467B3",
  "#A899C2",
  "#513484",
  "#B37EAD",
  "#B76DAC",
  "#F57BB0",
  "#A35C7B",
  "#E38C95",
  "#C73643",
  "#7D7D7D",
  "#3C3C3B",
];

type FormValues = Parameters<typeof chatChannelCreate>[0] &
  Partial<ChatChannel>;

export default function ChatChannelCreateSheet(props: {
  currentChatChannel: ChatChannel | null;
  fallbackChainUID: UID;
  refSheet: RefObject<ActionSheetRef>;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEdit = Boolean(props.currentChatChannel);
  const mutateChannel = useMutation({
    async mutationFn(value: FormValues) {
      if (isEdit) {
        if (!value.id) throw "Unable to edit non-existing chat channel";
        console.info("edit chat channel", value);
        await chatChannelEdit({
          chain_uid: value.chain_uid,
          id: value.id,
          name: value.name,
          color: value.color,
        }).catch(catchErrThrow401);
      } else {
        console.info("create chat channel");
        await chatChannelCreate({
          chain_uid: value.chain_uid,
          name: value.name,
          color: value.color,
        }).catch(catchErrThrow401);
      }
    },
    onSuccess(data) {
      queryClient.refetchQueries({
        predicate(query) {
          return query.queryKey.join(".").startsWith("auth.chat.channels");
        },
      });
    },
    onError(err) {
      console.error(err);
      queryClient.invalidateQueries();
    },
  });
  const form = useForm({
    defaultValues: {
      id: undefined as undefined | number,
      name: "",
      color: channelColors[15], // "#7D7D7D"
      chain_uid: "",
    } satisfies FormValues,
    async onSubmit({ value }) {
      await mutateChannel.mutateAsync(value);
      props.refSheet.current?.hide();
    },
  });
  useEffect(() => {
    if (props.currentChatChannel) {
      form.setFieldValue("id", props.currentChatChannel.id);
      form.setFieldValue("name", props.currentChatChannel.name);
      form.setFieldValue("color", props.currentChatChannel.color);
      form.setFieldValue("chain_uid", props.currentChatChannel.chain_uid);
    } else {
      form.setFieldValue("id", undefined);
      form.setFieldValue("name", "");
      form.setFieldValue("color", channelColors[3]);
      form.setFieldValue("chain_uid", props.fallbackChainUID);
    }
  }, [props.currentChatChannel]);

  function handleClose() {
    props.refSheet.current?.hide();
  }

  return (
    <ActionSheet
      snapPoints={[100]}
      gestureEnabled
      ref={props.refSheet}
      drawUnderStatusBar={false}
      closeOnTouchBackdrop={false}
    >
      <HStack className="items-center justify-between gap-3 px-3">
        <Button
          action="negative"
          onPress={handleClose}
          className="bg-transparent"
        >
          <ButtonText className="text-error-600">{t("close")}</ButtonText>
        </Button>
        <Text>{isEdit ? t("editChannel") : t("newChannel")}</Text>
        <Button
          action="primary"
          className="bg-transparent"
          onPress={form.handleSubmit}
        >
          <ButtonText className="text-primary-600">
            {isEdit ? t("change") : t("publish")}
          </ButtonText>
        </Button>
      </HStack>
      <ScrollView>
        <Box className="flex flex-col gap-4 p-4 pb-8">
          <FormLabel label={t("channelName")}>
            <form.Field name="name">
              {(field) => (
                <>
                  <Input>
                    <InputField
                      value={field.state.value}
                      onChangeText={field.setValue}
                    />
                  </Input>
                </>
              )}
            </form.Field>
          </FormLabel>
          <FormLabel label={t("channelColor")}>
            <form.Field name="color">
              {(field) => (
                <ColorSelect
                  colors={channelColors}
                  value={field.state.value}
                  setValue={field.setValue}
                />
              )}
            </form.Field>
          </FormLabel>
        </Box>
      </ScrollView>
    </ActionSheet>
  );
}
