import axios from "@/api/axios";
import { userGetByUID } from "@/api/user";
import { authStore } from "@/store/auth";
import { initSavedStore, savedStore } from "@/store/saved";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { FC, PropsWithChildren, useEffect } from "react";

export default function AuthProvider(
  props: PropsWithChildren<{
    renderLoading: FC;
    renderLoggedOut: FC;
  }>
) {
  const { userUID, token } = useStore(savedStore);
  const auth = useStore(authStore);
  const { error, isPending } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      if (!userUID && !token) throw "Not logged in";

      axios.defaults.auth = "Bearer " + token;
      return userGetByUID(undefined, userUID, {
        addApprovedTOH: true,
        addNotification: true,
      })
        .then((res) => {
          authStore.setState((s) => ({ authUser: res.data }));
        })
        .catch((res: Response) => {
          if (res.status === 401) {
            authStore.setState((s) => ({ authUser: null }));
            return null;
          }
          throw res;
        });
    },
  });
  useEffect(initSavedStore, []);

  if (auth.authUser) {
    return props.children;
  } else if (isPending) {
    return <props.renderLoading />;
  } else {
    return <props.renderLoggedOut />;
  }
}
