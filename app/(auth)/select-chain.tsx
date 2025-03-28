import { chainGet } from "@/api/chain";
import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, ScrollView } from "react-native";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { CircleIcon } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Accordion } from "@/components/ui/accordion";
import LegalAndLogout from "@/components/custom/Legal";

export default function SelectChain() {
  const { t } = useTranslation();
  const auth = useStore(authStore);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: listOfChains } = useQuery({
    queryKey: [
      "user-chains",
      auth.authUser?.uid,
      auth.authUser?.chains?.join(","),
    ],
    async queryFn() {
      if (!auth.authUser?.chains.length) {
        return [];
      }

      const promises = auth.authUser.chains
        .filter((c) => c.is_approved)
        .map((c) => chainGet(c.chain_uid).then((res) => res.data));
      return await Promise.all(promises);
    },
  });
  const form = useForm({
    defaultValues: {
      chainUid: "",
    },
    async onSubmit({ value }) {
      if (!value.chainUid) throw "Please select a Loop";
      savedStore.setState((s) => ({ ...s, chainUID: value.chainUid }));
      router.back();
    },
  });
  useLayoutEffect(() => {
    if (auth.currentChain) {
      form.setFieldValue("chainUid", auth.currentChain.uid);
      navigation.setOptions({
        headerBackTitle: auth.currentChain.name.slice(0, 8) + "...",
        title: t("selectALoop"),
      } satisfies NativeStackNavigationOptions);
    }
  }, [auth.currentChain?.uid, navigation, t]);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Accordion></Accordion>
      <LegalAndLogout />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex flex-1 flex-col-reverse"
      >
        <form.Field name="chainUid">
          {(field) => (
            <RadioGroup
              aria-labelledby="Select one item"
              value={field.state.value}
              onChange={(e) => {
                console.log("select", e);
                field.setValue(e);
              }}
            >
              {listOfChains?.map((c) => {
                return (
                  <Radio
                    value={c.uid}
                    key={c.uid}
                    size="md"
                    className="items-center justify-between px-4 py-2"
                  >
                    <RadioLabel className="text-lg">{c.name}</RadioLabel>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                  </Radio>
                );
              })}
            </RadioGroup>
          )}
        </form.Field>
      </ScrollView>
      <Button onPress={form.handleSubmit} size="xl" className="m-6">
        <ButtonText>{t("select")}</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
