import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import ActionSheet, {
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
import { useMemo, useState } from "react";
import { CircleIcon } from "lucide-react-native";

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
  const { t } = useTranslation();
  const payload = useSheetPayload("bags");
  const { currentChainRoute, currentChainUsers } = useStore(authStore);
  const items = useMemo(() => {
    return (
      currentChainRoute?.map((uid) => {
        const user = currentChainUsers?.find((u) => u.uid == uid);
        return {
          id: uid,
          value: uid,
          label: user?.name || t("loading"),
        };
      }) || []
    );
  }, [currentChainRoute, currentChainUsers]);

  const [value, setValue] = useState(payload.userUid);

  return (
    <ActionSheet gestureEnabled>
      <HStack className="items-center justify-between gap-3 px-3">
        <Button action="negative" className="text-negative-5 bg-transparent">
          <ButtonText className="text-error-600">{t("close")}</ButtonText>
        </Button>
        <Text>{t("changeBagHolder")}</Text>
        <Button action="primary">
          <ButtonText>{t("change")}</ButtonText>
        </Button>
      </HStack>
      <VStack>
        <RadioGroup
          aria-labelledby="Select one item"
          value={value}
          onChange={setValue}
        >
          {items.map((item, i) => {
            return (
              <Radio
                value={item.value}
                key={item.value}
                size="md"
                className="justify-between px-5 py-2"
              >
                <RadioLabel>{item.label}</RadioLabel>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
              </Radio>
            );
          })}
        </RadioGroup>
      </VStack>
    </ActionSheet>
  );
}
