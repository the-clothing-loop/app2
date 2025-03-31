import { Pressable, ScrollView } from "react-native";

import { useStore } from "@tanstack/react-store";
import { authStoreListBags, ListBag } from "@/store/auth";
import { SheetManager } from "react-native-actions-sheet";
import RefreshControl from "@/components/custom/RefreshControl";
import BagsList from "@/components/custom/bags/BagsList";
import Donate from "@/components/custom/Donate";
import { Box } from "@/components/ui/box";
import { useLayoutEffect } from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack/src/types";
import { useTranslation } from "react-i18next";
import { Link, useNavigation } from "expo-router";
import { Text } from "@/components/ui/text";

export default function Bags() {
  const listBags = useStore(authStoreListBags);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const onPressBag = (item: ListBag) => {
    SheetManager.show("bags", {
      payload: { bagId: item.bag.id, userUid: item.bag.user_uid },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("bags"),
      headerRight: () => (
        <Link
          href={{
            pathname: "../bag",
            params: {
              bag: 0,
            },
          }}
          className="px-2"
        >
          <Text size="xl" className="text-primary-500">
            {t("create")}
          </Text>
        </Link>
      ),
    } satisfies NativeStackNavigationOptions);
  }, [navigation, t]);

  function onPressDonate() {}
  return (
    <ScrollView refreshControl={<RefreshControl />}>
      <Box className="mb-1">
        <Donate />
      </Box>
      <BagsList listBags={listBags} onPressBag={onPressBag} showUser />
    </ScrollView>
  );
}
