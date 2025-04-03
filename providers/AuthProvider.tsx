import axios from "@/api/axios";
import { User } from "@/api/typex2";
import { userGetByUID } from "@/api/user";
import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { router } from "expo-router";
import { PropsWithChildren, useEffect, useLayoutEffect } from "react";

export enum AuthStatus {
  LoggedIn,
  LoggedOut,
  Pending,
}

export default function AuthProvider(props: PropsWithChildren) {
  const { chainUID } = useStore(savedStore);
  const auth = useStore(authStore);
  const queryUser = useQuery({
    queryKey: ["auth", "user"],
    async queryFn(): Promise<User | null> {
      const { userUID, token } = savedStore.state;
      console.log("query user", { userUID, token });
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

  useEffect(() => {
    if (auth.authUser) {
      if (chainUID) {
        router.replace("/(auth)/(tabs)/route");
      } else {
        router.replace("/(auth)/select-chain");
      }
    } else if (!queryUser.isPending) {
      router.replace("/onboarding/step1");
    } else {
      router.replace("/loading");
    }
  }, [auth.authUser, queryUser.isPending, chainUID]);

  return props.children;
}
