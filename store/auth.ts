import { Chain } from "@/api/types";
import { User } from "@/api/typex2";
import { IsChainAdmin, IsChainWarden } from "@/utils/chain";
import { Store, Derived } from "@tanstack/react-store";

export const authStore = new Store({
  authUser: null as null | User,
  currentChain: null as null | Chain,
  currentChainUsers: null as null | User[],
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
