import { authStore, authStoreListRouteUsers } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import ActionSheet, {
  ActionSheetRef,
  SheetDefinition,
  useSheetPayload,
} from "react-native-actions-sheet";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "../ui/radio";
import { useEffect, useMemo, useRef, useState } from "react";
import { CircleIcon, Flag, Pause, Shield } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagPut } from "@/api/bag";
import { UID } from "@/api/types";
import { useForm } from "@tanstack/react-form";
import { catchErrThrow401 } from "@/utils/handleRequests";
import { Icon } from "../ui/icon";
import { Box } from "../ui/box";

declare module "react-native-actions-sheet" {
  export interface Sheets {
    bags: SheetDefinition<{
      payload: {
        bagId: number;
        userUid: string;
      };
    }>;
  }
}

export default function BagsSheet() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentChain, authUser } = useStore(authStore);
  const listRouteUsers = useStore(authStoreListRouteUsers);
  const payload = useSheetPayload("bags");
  const mutateBags = useMutation({
    async mutationFn(holder_uid: UID) {
      console.log("this is run", holder_uid);
      return bagPut({
        chain_uid: currentChain!.uid,
        user_uid: authUser!.uid,
        bag_id: payload.bagId,
        holder_uid,
      })
        .then((res) => res.data)
        .catch(catchErrThrow401);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["chain-bags", currentChain!.uid],
        refetchType: "active",
      });
    },
    onError(error) {
      queryClient.invalidateQueries();
    },
  });
  const form = useForm({
    defaultValues: { userUid: payload.userUid },
    async onSubmit({ value }) {
      actionSheetRef.current?.hide();
      await mutateBags.mutateAsync(value.userUid);
    },
  });
  useEffect(() => {
    form.setFieldValue("userUid", payload.userUid);
  }, [payload]);

  function handleClose() {
    actionSheetRef.current?.hide();
  }

  return (
    <ActionSheet gestureEnabled ref={actionSheetRef}>
      <HStack className="items-center justify-between gap-3 px-3">
        <Button
          action="negative"
          onPress={handleClose}
          className="bg-transparent"
        >
          <ButtonText className="text-error-600">{t("close")}</ButtonText>
        </Button>
        <Text>{t("changeBagHolder")}</Text>
        <Button
          action="primary"
          className="bg-transparent"
          onPress={form.handleSubmit}
        >
          <ButtonText className="text-primary-600">{t("change")}</ButtonText>
        </Button>
      </HStack>
      <VStack className="py-2">
        <form.Field name="userUid">
          {(field) => (
            <RadioGroup
              aria-labelledby="Select one item"
              value={field.state.value}
              onChange={field.setValue}
            >
              {listRouteUsers.map(
                ({ user, isPaused, isHost, isWarden, routeIndex }) => {
                  return (
                    <Radio
                      value={user.uid}
                      key={user.uid}
                      isInvalid={Boolean(field.state.meta.errors.length)}
                      size="md"
                      className="justify-between px-5 py-2"
                    >
                      <HStack className="justify-center gap-3">
                        <Box className="relative h-10 w-10 items-end justify-center">
                          {isPaused ? (
                            <Icon
                              as={Pause}
                              className="fill-typography-700 text-transparent"
                              size="lg"
                            />
                          ) : (
                            <Text className="text-right font-bold text-typography-600">
                              {"#" + (routeIndex + 1)}
                            </Text>
                          )}
                          <Box className="absolute -left-1 -top-1">
                            {isHost ? (
                              <Icon
                                as={Shield}
                                size="md"
                                className="fill-typography-700 text-transparent"
                              />
                            ) : isWarden ? (
                              <Icon
                                as={Flag}
                                size="md"
                                className="fill-typography-700 text-transparent"
                              />
                            ) : undefined}
                          </Box>
                        </Box>
                        <VStack>
                          <RadioLabel className="font-bold">
                            {user.name}
                          </RadioLabel>
                          <Text size="xs">{user.address}</Text>
                        </VStack>
                      </HStack>
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                    </Radio>
                  );
                },
              )}
            </RadioGroup>
          )}
        </form.Field>
      </VStack>
    </ActionSheet>
  );
}
