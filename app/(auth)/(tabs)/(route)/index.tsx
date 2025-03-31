import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreCurrentBagsPerUser,
  authStoreListPausedUsers,
  authStoreListRouteUsers,
} from "@/store/auth";
import { useDebounce } from "@uidotdev/usehooks";
import { useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Map } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Text } from "@/components/ui/text";
import RouteItem from "@/components/custom/route/RouteItem";
import RefreshControl from "@/components/custom/RefreshControl";
import { useNavigation } from "expo-router";
import { SearchBar, SearchBarProps } from "react-native-screens";
import useFilteredRouteUsers, {
  FilteredRouteUsersSort,
} from "@/hooks/useFilteredRouteUsers";

export default function Route() {
  const { currentChain } = useStore(authStore);
  const routeUsers = useStore(authStoreListRouteUsers);
  const bagsPerUser = useStore(authStoreCurrentBagsPerUser);

  const [search, setSearch] = useState("");
  const pausedUserUids = useStore(authStoreListPausedUsers);
  const { t } = useTranslation();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        hideNavigationBar: false,
        hideWhenScrolling: true,
        placeholder: t("search"),
        onChangeText: (e) => setSearch(e.nativeEvent.text),
      } satisfies SearchBarProps,
    });
  }, [navigation, t]);

  const debounceSearch = useDebounce(search, 500);
  const [sort, setSort] = useState<FilteredRouteUsersSort>("isMe3rd");
  const sortedListRouteUsers = useFilteredRouteUsers(
    routeUsers,
    sort,
    debounceSearch,
  );

  const countActiveMembers = useMemo(
    () =>
      routeUsers?.filter(
        ({ user }) => !pausedUserUids?.some((up) => up === user.uid),
      ).length || 0,
    [routeUsers, pausedUserUids],
  );

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      <SearchBar></SearchBar>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingBottom: tabBarHeight }}
        refreshControl={<RefreshControl />}
      >
        {sortedListRouteUsers?.map(
          ({ user, isHost, isMe, routeIndex, isWarden, isPaused }, i) => {
            const bagsOfUser = bagsPerUser[user.uid] || [];

            return (
              <RouteItem
                key={user.uid + currentChain?.uid}
                user={user}
                index={routeIndex}
                isWarden={isWarden}
                isHost={isHost}
                isMe={isMe}
                bags={bagsOfUser}
                isPaused={isPaused}
              />
            );
          },
        )}
        <Box key="bottom" className="p-2 pb-6">
          <Text className="text-center font-bold">
            {t("activeMembers") + ": " + countActiveMembers}
          </Text>
        </Box>
      </ScrollView>
      {/* <Box className="fixed bottom-2 right-2">
        <Fab size="lg">
          <FabIcon as={Map} size="xl" />
        </Fab>
      </Box> */}
    </>
  );
}
