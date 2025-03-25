import { authStore } from "@/store/auth";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStore } from "@tanstack/react-store";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";

export default function RouteUser() {
  const { user: uid } = useLocalSearchParams();
  const { currentChainUsers } = useStore(authStore);
  const user = useMemo(
    () => currentChainUsers?.find((u) => u.uid == uid),
    [uid, currentChainUsers],
  );
  const navigation = useNavigation();
  useEffect(() => {
    if (user) navigation.setOptions({ title: user.name });
  }, [user]);
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ paddingBottom: tabBarHeight }}
    ></ScrollView>
  );
}
