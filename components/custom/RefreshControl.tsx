import Sleep from "@/utils/sleep";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";

export default function CustomRefreshControl() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([queryClient.invalidateQueries(), Sleep(300)]).finally(() => {
      setRefreshing(false);
    });
  }, []);
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}
