import { ScrollView } from "react-native";

import { useStore } from "@tanstack/react-store";
import {
  authStoreAuthUserRoles,
  authStoreListBags,
  ListBag,
} from "@/store/auth";
import { SheetManager } from "react-native-actions-sheet";
import RefreshControl from "@/components/custom/RefreshControl";
import BagsList from "@/components/custom/bags/BagsList";
import Donate from "@/components/custom/Donate";
import { Box } from "@/components/ui/box";

export default function Bags() {
  const listBags = useStore(authStoreListBags);
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const onPressBag = (item: ListBag) => {
    SheetManager.show("bags", {
      payload: { bagId: item.bag.id, userUid: item.bag.user_uid },
    });
  };

  return (
    <ScrollView refreshControl={RefreshControl()}>
      <Box className="mb-1">
        <Donate />
      </Box>
      <BagsList
        listBags={listBags}
        onPressBag={onPressBag}
        showUser
        showBagOptions={authUserRoles.isHost}
      />
    </ScrollView>
  );
}
