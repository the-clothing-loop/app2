import { authStore, RouteUser } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import ActionSheet, {
  ActionSheetRef,
  SheetDefinition,
  useSheetPayload,
} from "react-native-actions-sheet";
import { HStack } from "../../ui/hstack";
import { Button, ButtonText } from "../../ui/button";
import { useTranslation } from "react-i18next";
import { Text } from "../../ui/text";
import { RadioGroup } from "../../ui/radio";
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagPut } from "@/api/bag";
import { UID } from "@/api/types";
import { useForm } from "@tanstack/react-form";
import { catchErrThrow401 } from "@/utils/handleRequests";
import DatePickerSingleItem from "../DatePicker";
import { ScrollView } from "react-native";
import useFilteredRouteUsers from "@/hooks/useFilteredRouteUsers";
import BagsSheetRadioItem from "./BagsSheetRadioItem";

declare module "react-native-actions-sheet" {
  export interface Sheets {
    bags: SheetDefinition<{
      payload: {
        bagId: number;
        userUid: string;
        listRouteUsers: RouteUser[];
      };
    }>;
  }
}

export default function BagsSheet() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentChain, authUser } = useStore(authStore);
  const payload = useSheetPayload("bags");
  const mutateBags = useMutation({
    async mutationFn(value: { userUid: UID; date: Date }) {
      return bagPut({
        chain_uid: currentChain!.uid,
        user_uid: authUser!.uid,
        bag_id: payload.bagId,
        holder_uid: value.userUid,
        updated_at: value.date.toISOString(),
      })
        .then((res) => res.data)
        .catch(catchErrThrow401);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["auth", "chain-bags", currentChain!.uid],
        exact: true,
        refetchType: "all",
      });
    },
    onError(error) {
      queryClient.invalidateQueries();
    },
  });
  const form = useForm({
    defaultValues: { userUid: payload.userUid, date: new Date() },
    async onSubmit({ value }) {
      actionSheetRef.current?.hide();
      await mutateBags.mutateAsync(value);
    },
  });
  useEffect(() => {
    form.setFieldValue("userUid", payload.userUid);
  }, [payload]);

  const sortedListRouteUsers = useFilteredRouteUsers(
    payload.listRouteUsers,
    {},
    "routeForMe",
    "",
  );

  function handleClose() {
    actionSheetRef.current?.hide();
  }

  return (
    <ActionSheet
      snapPoints={[50, 100]}
      gestureEnabled
      ref={actionSheetRef}
      drawUnderStatusBar={false}
    >
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
      <ScrollView className="py-2" style={{ minHeight: "80%" }}>
        <form.Field name="date">
          {(field) => (
            <DatePickerSingleItem
              title={t("dateOfDelivery")}
              value={field.state.value}
              setValue={field.setValue}
            />
          )}
        </form.Field>
        <form.Field name="userUid">
          {(field) => (
            <RadioGroup
              aria-labelledby="Select one item"
              value={field.state.value}
              onChange={field.setValue}
            >
              {sortedListRouteUsers.map((item) => (
                <BagsSheetRadioItem
                  key={item.routeUser.routeIndex}
                  user={item.routeUser.user}
                  isPaused={item.routeUser.isPaused}
                  isHost={item.routeUser.isHost}
                  isMe={item.routeUser.isMe}
                  isWarden={item.routeUser.isWarden}
                  routeIndex={item.routeUser.routeIndex}
                  isPrivate={item.routeUser.isPrivate}
                />
              ))}
            </RadioGroup>
          )}
        </form.Field>
      </ScrollView>
    </ActionSheet>
  );
}
