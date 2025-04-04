import FormLabel from "@/components/custom/FormLabel";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import { NativeStackNavigationOptions } from "@react-navigation/native-stack/src/types";
import { Pressable, ScrollView } from "react-native";
import { useForm, useStore } from "@tanstack/react-form";
import { authStore, authStoreListBags } from "@/store/auth";
import { Input, InputField } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CheckIcon } from "lucide-react-native";
import { bagPut } from "@/api/bag";
import { savedStore } from "@/store/saved";
import { useQueryClient } from "@tanstack/react-query";
import { Bag } from "@/api/typex2";

const bagColors = [
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

export default function BagPatch(props: { bag: Bag | null }) {
  const { t } = useTranslation();
  const authUser = useStore(authStore, (s) => s.authUser);
  const chainUid = useStore(savedStore, (s) => s.chainUID);
  const queryClient = useQueryClient();
  //   const listBags = useStore(authStoreListBags);
  const navigation = useNavigation();
  const form = useForm({
    defaultValues: {
      number: props.bag?.number || "",
      color: props.bag?.color || bagColors[9],
    },
    async onSubmit({ value }) {
      await bagPut({
        chain_uid: chainUid,
        user_uid: authUser!.uid,
        bag_id: props.bag?.id,
        number: value.number,
        holder_uid: authUser!.uid,
        color: value.color,
      });
      queryClient.invalidateQueries({
        queryKey: ["auth", "chain-bags", chainUid],
        exact: true,
      });
      navigation.goBack();
    },
  });

  useEffect(() => {
    if (props.bag) {
      form.setFieldValue("number", props.bag.number);
      form.setFieldValue("color", props.bag.color);
    } else {
      form.setFieldValue("number", "");
      form.setFieldValue("color", bagColors[9]);
    }
  }, [props.bag]);

  useEffect(() => {
    navigation.setOptions({
      title: t("bags"),
      headerRight: () => (
        <Pressable onPress={form.handleSubmit} className="px-2">
          <Text size="xl" className="text-primary-500">
            {props.bag ? t("save") : t("create")}
          </Text>
        </Pressable>
      ),
    } satisfies NativeStackNavigationOptions);
  }, [navigation, t, props.bag]);
  return (
    <ScrollView className="bg-background-0">
      <VStack className="gap-3 p-3">
        <form.Field name="number">
          {(field) => (
            <FormLabel label={t("bagName")}>
              <>
                <Input>
                  <InputField
                    value={field.state.value}
                    onChangeText={field.setValue}
                  />
                </Input>
              </>
            </FormLabel>
          )}
        </form.Field>
        <FormLabel label={t("bagColor")}>
          <form.Field name="color">
            {(field) => (
              <HStack className="flex-wrap items-center justify-center gap-4">
                {bagColors.map((c) => {
                  const isSelected = c == field.state.value;
                  return (
                    <Button
                      key={c}
                      onPress={() => field.setValue(c)}
                      className="h-20 w-20 rounded-full"
                      style={{ backgroundColor: c }}
                    >
                      {isSelected ? (
                        <Icon
                          color="white"
                          //@ts-expect-error
                          size="2xl"
                          as={CheckIcon}
                        />
                      ) : null}
                    </Button>
                  );
                })}
              </HStack>
            )}
          </form.Field>
        </FormLabel>
        <FormLabel label={t("bagHolder")}>
          <Text size="xl">{authUser?.name || ""}</Text>
        </FormLabel>
      </VStack>
    </ScrollView>
  );
}
