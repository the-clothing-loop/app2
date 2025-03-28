import BagsList from "@/components/custom/bags/BagsList";
import NoteEdit from "@/components/custom/route/NoteEdit";
import UserCard from "@/components/custom/route/UserCard";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  authStore,
  authStoreAuthUserRoles,
  authStoreListBags,
  authStoreListRouteUsers,
  ListBag,
} from "@/store/auth";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStore } from "@tanstack/react-store";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

export default function RouteUser() {
  const { user: uid }: { user: string } = useLocalSearchParams();
  const { currentChain, authUser } = useStore(authStore);
  const listRouteUsers = useStore(authStoreListRouteUsers);
  const authUserRoles = useStore(authStoreAuthUserRoles);

  const { t } = useTranslation();
  const routeItem = useMemo(
    () => listRouteUsers?.find(({ user }) => user.uid == uid),
    [uid, listRouteUsers],
  );
  const myBags = useStore(authStoreListBags, (s) =>
    s.filter((v) => v.routeUser?.user.uid == uid),
  );
  const isMe = routeItem?.user.uid == authUser?.uid;
  const isNoteEditable = isMe || authUserRoles.isHost;

  const navigation = useNavigation();
  useEffect(() => {
    if (routeItem) {
      navigation.setOptions({ headerTitle: routeItem.user.name });
    }
  }, [routeItem]);

  const tabBarHeight = useBottomTabBarHeight();
  function onPressBag(item: ListBag) {
    router.push(`/(auth)/(tabs)/bags#${item.bag.id}`);
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ paddingBottom: tabBarHeight }}
    >
      {routeItem ? (
        <VStack className="bg-background-0">
          <UserCard
            user={routeItem.user}
            isUserPaused={routeItem.isPaused}
            isUserHost={routeItem.isHost}
            isUserWarden={routeItem.isWarden}
            showMessengers
          />
          <NoteEdit
            currentChainUid={currentChain?.uid}
            thisUserUid={routeItem.user?.uid}
            isNoteEditable={isNoteEditable}
          />
          {myBags.length ? (
            <VStack className="p-3">
              <Text size="sm" bold>
                {t("bags")}
              </Text>
              <BagsList listBags={myBags} onPressBag={onPressBag} />
            </VStack>
          ) : null}
        </VStack>
      ) : (
        <Box className="items-center justify-center">
          <Text size="lg">{t("loading")}</Text>
        </Box>
      )}
    </ScrollView>
  );
}
