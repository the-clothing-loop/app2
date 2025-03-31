import axios from "@/api/axios";
import { User } from "@/api/typex2";
import { userGetByUID } from "@/api/user";
import { authStore } from "@/store/auth";
import { initSavedStore, savedStore } from "@/store/saved";
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
  const { userUID, token, chainUID } = useStore(savedStore);
  const auth = useStore(authStore);
  const {
    error,
    data: authUser,
    isPending,
  } = useQuery({
    queryKey: ["auth", "user"],
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
    enabled: Boolean(userUID && token),
  });
  useLayoutEffect(initSavedStore, []);
  useLayoutEffect(() => {
    if (authUser !== undefined) {
      authStore.setState((s) => ({ ...s, authUser: authUser }));
    }
  }, [authUser]);

  useEffect(() => {
    if (auth.authUser) {
      if (chainUID) {
        router.replace("/(auth)/(tabs)/(rules)");
      } else {
        router.replace("/(auth)/select-chain");
      }
    } else if (!isPending) {
      router.replace("/(onboarding)/step1");
    } else {
      router.replace("/loading");
    }
  }, [auth.authUser, isPending, chainUID]);

  return props.children;
}
