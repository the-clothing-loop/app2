import { useStore } from "@tanstack/react-store";
import {
  authStore,
  authStoreAuthUserRoles,
  authStoreCurrentBagsPerUser,
  authStoreListPausedUsers,
  authStoreListRouteUsers,
} from "@/store/auth";
import { useDebounce } from "@uidotdev/usehooks";
import { useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// import { Map } from "lucide-react-native";
import { Platform, Pressable, ScrollView } from "react-native";
import {
  BottomTabNavigationOptions,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { Box } from "@/components/ui/box";
// import { Fab, FabIcon } from "@/components/ui/fab";
import { Text } from "@/components/ui/text";
import RouteItem from "@/components/custom/route/RouteItem";
import RefreshControl from "@/components/custom/RefreshControl";
import { useNavigation } from "expo-router";
import { SearchBar, SearchBarProps } from "react-native-screens";
import useFilteredRouteUsers, {
  FilteredRouteUsersSort,
} from "@/hooks/useFilteredRouteUsers";
import RouteOrderDialog from "@/components/custom/route/RouteOrderDialog";
import { Icon } from "@/components/ui/icon";
import { SortDescIcon } from "lucide-react-native";

export default function Route() {
  const { currentChain } = useStore(authStore);
  const authUserRoles = useStore(authStoreAuthUserRoles);
  const routeUsers = useStore(authStoreListRouteUsers);
  const bagsPerUser = useStore(authStoreCurrentBagsPerUser);

  const [openRouteOrderDialog, setOpenRouteOrderDialog] = useState(false);
  const [search, setSearch] = useState("");
  const pausedUserUids = useStore(authStoreListPausedUsers);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const btnRouteOrder = () => (
    <Pressable onPress={handleHeaderLeft}>
      {Platform.OS == "android" ? (
        <Icon as={SortDescIcon} aria-label={t("order")} />
      ) : (
        <Text className="text-lg">{t("order")}</Text>
      )}
    </Pressable>
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        hideNavigationBar: false,
        hideWhenScrolling: true,
        placeholder: t("search"),
        onChangeText: (e) => setSearch(e.nativeEvent.text),
      } as SearchBarProps,
      headerLeft: Platform.OS != "android" ? btnRouteOrder : undefined,
      headerRight: Platform.OS == "android" ? btnRouteOrder : undefined,
    } as BottomTabNavigationOptions);
  }, [navigation, t, routeUsers]);

  const debounceSearch = useDebounce(search, 500);
  const [sort, setSort] = useState<FilteredRouteUsersSort>("routeForMe");
  const sortedListRouteUsers = useFilteredRouteUsers(
    routeUsers,
    bagsPerUser,
    sort,
    debounceSearch,
  );

  const { countActiveMembers, countAllMembers } = useMemo(() => {
    const countActiveMembers =
      routeUsers?.filter(
        ({ user }) => !pausedUserUids?.some((up) => up === user.uid),
      ).length || 0;
    const countAllMembers = routeUsers.length;
    return { countActiveMembers, countAllMembers };
  }, [routeUsers, pausedUserUids]);

  const tabBarHeight = useBottomTabBarHeight();

  function handleHeaderLeft() {
    setOpenRouteOrderDialog(true);
  }

  return (
    <>
      <SearchBar></SearchBar>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingBottom: tabBarHeight }}
        refreshControl={RefreshControl()}
      >
        {sortedListRouteUsers?.map((item, i) => {
          return (
            <RouteItem
              key={item.routeUser.user.uid + currentChain?.uid}
              user={item.routeUser.user}
              index={item.routeUser.routeIndex}
              isWarden={item.routeUser.isWarden}
              isHost={item.routeUser.isHost}
              isAuthHost={authUserRoles.isHost}
              isMe={item.routeUser.isMe}
              bags={item.bags}
              isPaused={item.routeUser.isPaused}
              isPrivate={item.routeUser.isPrivate}
            />
          );
        })}
        <Box key="bottom" className="p-2 pb-6">
          <Text className="text-center font-bold">
            {t("activeMembers") + ": " + countActiveMembers}
          </Text>
        </Box>
      </ScrollView>
      <RouteOrderDialog
        open={openRouteOrderDialog}
        setOpen={setOpenRouteOrderDialog}
        selected={sort}
        isHost={authUserRoles.isHost}
        onSubmit={(v) => {
          setSort(v);
        }}
        routeUsersLen={countAllMembers}
      />
      {/* <Box className="fixed bottom-2 right-2">
        <Fab size="lg">
          <FabIcon as={Map} size="xl" />
        </Fab>
      </Box> */}
    </>
  );
}
