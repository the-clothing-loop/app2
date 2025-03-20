import axios from "@/api/axios";
import { User } from "@/api/typex2";
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
  const {
    error,
    data: authUser,
    isPending,
  } = useQuery({
    queryKey: ["auth-user"],
    async queryFn(): Promise<User | null> {
      if (!userUID && !token) throw "Not logged in";

      axios.defaults.auth = "Bearer " + token;
      return await userGetByUID(undefined, userUID, {
        addApprovedTOH: true,
        addNotification: true,
      })
        .then((res) => res.data)
        .catch((res: Response) => {
          if (res.status === 401) {
            return null;
          }
          throw res;
        });
    },
  });
  useEffect(initSavedStore, []);
  useEffect(() => {
    if (authUser !== undefined) {
      authStore.setState((s) => ({ ...s, authUser: authUser }));
    }
  }, [authUser]);

  if (auth.authUser) {
    return props.children;
  } else if (isPending) {
    return <props.renderLoading />;
  } else {
    return <props.renderLoggedOut />;
  }
}
