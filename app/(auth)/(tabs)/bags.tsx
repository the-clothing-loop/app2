import { ScrollView } from "react-native";

import { useStore } from "@tanstack/react-store";
import { authStoreListBags, ListBag } from "@/store/auth";
import { SheetManager } from "react-native-actions-sheet";
import RefreshControl from "@/components/custom/RefreshControl";
import BagsList from "@/components/custom/bags/BagsList";

export default function Bags() {
  const listBags = useStore(authStoreListBags);
  const onPressBag = (item: ListBag) => {
    SheetManager.show("bags", {
      payload: { bagId: item.bag.id, userUid: item.bag.user_uid },
    });
  };
  return (
    <ScrollView refreshControl={<RefreshControl />}>
      <BagsList listBags={listBags} onPressBag={onPressBag} showUser />
    </ScrollView>
  );
}
