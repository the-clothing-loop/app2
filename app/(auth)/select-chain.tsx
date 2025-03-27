import { chainGet } from "@/api/chain";
import { Chain } from "@/api/types";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView } from "react-native";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { CircleIcon } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "expo-router";

export default function SelectChain() {
  const { t } = useTranslation();
  const auth = useStore(authStore);
  const navigation = useNavigation();

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
    },
  });
  useEffect(() => {
    if (auth.currentChain) {
      navigation.setOptions({
        headerBackTitle: auth.currentChain.name.slice(0, 8) + "...",
      });
    }
  }, [auth]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-background-0"
    >
      <form.Field name="chainUid">
        {(field) => (
          <RadioGroup
            aria-labelledby="Select one item"
            value={field.state.value}
            onChange={field.setValue}
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
  );
}
