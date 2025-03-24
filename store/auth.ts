import { Chain, UID } from "@/api/types";
import { Bag, User } from "@/api/typex2";
import { IsChainAdmin, IsChainWarden } from "@/utils/chain";
import IsPaused from "@/utils/user";
import { Store, Derived } from "@tanstack/react-store";

export const authStore = new Store({
  authUser: null as null | User,
  currentChain: null as null | Chain,
  currentChainUsers: null as null | User[],
  currentBags: null as null | Bag[],
  currentChainRoute: null as null | UID[],
});

export const authStoreCurrentChainAdmin = new Derived({
  deps: [authStore],
  fn() {
    return authStore.state.currentChainUsers?.filter((c) =>
      IsChainAdmin(c, authStore.state.currentChain?.uid)
    );
  },
});
authStoreCurrentChainAdmin.mount();

export const authStoreCurrentChainWarden = new Derived({
  deps: [authStore],
  fn() {
    return authStore.state.currentChainUsers?.filter((c) =>
      IsChainWarden(c, authStore.state.currentChain?.uid)
    );
  },
});
authStoreCurrentChainWarden.mount();

export const authStoreCurrentBagsPerUser = new Derived({
  deps: [authStore],
  fn() {
    const result: Record<UID, Bag[]> = {};
    authStore.state.currentChainUsers?.forEach((u) => {
      const arr: Bag[] =
        authStore.state.currentBags?.filter((b) => b.user_uid === u.uid) || [];
      result[u.uid] = arr;
    });
    return result;
  },
});
authStoreCurrentBagsPerUser.mount();

export const authStoreListPausedUsers = new Derived({
  deps: [authStore],
  fn() {
    const authUserUid = authStore.state.authUser?.uid;
    if (!authUserUid) return [];
    return authStore.state.currentChainUsers?.filter((u) =>
      IsPaused(u, authUserUid)
    );
  },
});
authStoreListPausedUsers.mount();
