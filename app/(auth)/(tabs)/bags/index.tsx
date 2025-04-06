import { Pressable, ScrollView } from "react-native";

import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreAuthUserRoles,
  authStoreListBags,
  ListBag,
} from "@/store/auth";
import { SheetManager } from "react-native-actions-sheet";
import RefreshControl from "@/components/custom/RefreshControl";
import BagsList from "@/components/custom/bags/BagsList";
import Donate from "@/components/custom/Donate";
import { Box } from "@/components/ui/box";
import BulkyList from "@/components/custom/bulky/BulkyList";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function Bags() {
  const { t } = useTranslation();
  const listBags = useStore(authStoreListBags);
  const { currentBulky } = useStore(authStore);
  const tabBarHeight = useBottomTabBarHeight();
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const onPressBag = (item: ListBag) => {
    SheetManager.show("bags", {
      payload: { bagId: item.bag.id, userUid: item.bag.user_uid },
    });
  };

  return (
    <ScrollView
      refreshControl={RefreshControl()}
      style={{ paddingBottom: tabBarHeight }}
      stickyHeaderIndices={[2]}
    >
      <Box className="mb-1">
        <Donate />
      </Box>
      <BagsList
        listBags={listBags}
        onPressBag={onPressBag}
        showUser
        showBagOptions={authUserRoles.isHost}
      />
      <HStack className="relative justify-center bg-background-0 p-3">
        <Text className="text-lg font-semibold text-typography-800">
          {t("bulkyItems")}
        </Text>
        <Box className="absolute bottom-0 right-0 top-0 me-6 justify-center">
          <Pressable>
            <Text className="text-xl text-primary-500">{t("create")}</Text>
          </Pressable>
        </Box>
      </HStack>
      <BulkyList bulkyList={currentBulky || []} />
    </ScrollView>
  );
}
