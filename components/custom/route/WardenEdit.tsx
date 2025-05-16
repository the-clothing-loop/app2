import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useEffect, useState } from "react";
import { UID } from "@/api/types";
import { chainChangeUserWarden } from "@/api/chain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useDebounceCallback } from "usehooks-ts";
import { useForm } from "@tanstack/react-form";
import { ActivityIndicator } from "react-native";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/components/ui/icon";
import { FlagIcon } from "lucide-react-native";

export default function WardenEdit(props: {
  currentChainUid: undefined | UID;
  thisUserUid: undefined | UID;
  thisUserWarden: boolean;
  isWardenEditable: boolean;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutateWarden = useMutation({
    async mutationFn(checked: boolean) {
      if (!props.thisUserUid) throw "not logged in";
      if (!props.currentChainUid) throw "select a loop first";
      return await chainChangeUserWarden(
        props.currentChainUid,
        props.thisUserUid,
        checked,
      ).finally(async () => {
        queryClient.refetchQueries({
          queryKey: ["auth", "chain", props.currentChainUid],
          exact: true,
        });
      });
    },
  });
  const form = useForm({
    defaultValues: {
      checked: false,
    },
    onSubmit({ value }) {
      return mutateWarden.mutateAsync(value.checked);
    },
  });
  useEffect(() => {
    form.setFieldValue("checked", props.thisUserWarden);
  }, [props.thisUserWarden]);
  const [delayedFormSubmitLoading, setDelayedFormSubmitLoading] =
    useState(false);
  const delayedFormSubmit = useDebounceCallback(() => {
    form.handleSubmit().finally(() => setDelayedFormSubmitLoading(false));
  }, 2000);
  async function handleToggle(value: boolean) {
    form.setFieldValue("checked", value);
    setDelayedFormSubmitLoading(true);
    delayedFormSubmit();
  }

  if (!props.isWardenEditable) {
    if (!props.thisUserWarden) return null;
    return (
      <HStack className="items-center gap-3 px-4 py-2">
        <VStack className="shrink flex-grow items-start">
          <Text bold size="sm">
            {t("assignWardenTitle")}
          </Text>
          <Text size="sm">{t("assignWardenBody")}</Text>
        </VStack>
        <Icon as={FlagIcon} />
      </HStack>
    );
  }
  return (
    <HStack className="items-center gap-3 px-4 py-2">
      <VStack className="shrink flex-grow items-start">
        <Text bold size="sm">
          {t("assignWardenTitle")}
        </Text>
        <Text size="sm">{t("assignWardenBody")}</Text>
      </VStack>
      {delayedFormSubmitLoading ? <ActivityIndicator /> : null}
      <form.Field name="checked">
        {(field) => (
          <Switch
            value={field.state.value}
            onValueChange={handleToggle}
          ></Switch>
        )}
      </form.Field>
    </HStack>
  );
}
