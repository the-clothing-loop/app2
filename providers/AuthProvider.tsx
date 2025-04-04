import axios from "@/api/axios";
import { User } from "@/api/typex2";
import { userGetByUID } from "@/api/user";
import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

export enum AuthStatus {
  LoggedIn,
  LoggedOut,
  Pending,
}

export default function AuthProvider(props: PropsWithChildren) {
  const queryUser = useQuery({
    queryKey: ["auth", "user"],
    async queryFn(): Promise<User | null> {
      const { userUID, token } = savedStore.state;
      if (!userUID && !token) return null;

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
  useEffect(() => {
    if (queryUser.data !== undefined) {
      authStore.setState((s) => ({ ...s, authUser: queryUser.data }));
    }
  }, [queryUser.dataUpdatedAt]);

  return props.children;
}
