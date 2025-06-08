import Sleep from "@/utils/sleep";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";

export default function CustomRefreshControl(props?: { queryKey?: any[] }) {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // const fn = props.queryKey
    //   ? queryClient.refetchQueries({
    //       queryKey: [],
    //       exact: true,
    //     })
    //   : queryClient.refetchQueries({
    //       predicate: (q) => q.queryKey.join(".").startsWith("auth"),
    //     });
    const fn = queryClient.refetchQueries();
    Promise.all([fn, Sleep(300)]).finally(() => {
      setRefreshing(false);
    });
  }, []);
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}
