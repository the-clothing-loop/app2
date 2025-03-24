import { chainGet } from "@/api/chain";
import { Chain } from "@/api/types";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import RadioGroupItems from "@/components/custom/RadioGroup";
import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView } from "react-native";

export default function SelectChain() {
  const { t } = useTranslation();
  const auth = useStore(authStore);
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
      selectedIndex: -1,
    },
    async onSubmit({ value }) {
      const c = listOfChains?.at(value.selectedIndex);
      if (!c) throw "Please select a Loop";
      savedStore.setState((s) => ({ ...s, chainUID: c.uid }));
    },
  });

  const radioListOfChains = useMemo(() => {
    return (
      listOfChains?.map((c) => ({ id: c.uid, value: c.uid, label: c.name })) ||
      []
    );
  }, [listOfChains]);

  return (
    <SafeAreaView>
      <Box className="gap-3 bg-background-0">
        <ScrollView className="grow">
          <form.Field name="selectedIndex">
            {(field) => (
              <RadioGroupItems
                items={radioListOfChains}
                selectedIndex={field.state.value}
                setSelectedIndex={field.setValue}
              ></RadioGroupItems>
            )}
          </form.Field>
        </ScrollView>
        <Button onPress={form.handleSubmit}>{t("select")}</Button>
      </Box>
    </SafeAreaView>
  );
}
