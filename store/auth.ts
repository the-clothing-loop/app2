import { Chain, UID } from "@/api/types";
import { Bag, BulkyItem, User } from "@/api/typex2";
import { AuthStatus } from "@/types/auth_status";
import { IsChainAdmin, IsChainWarden } from "@/utils/chain";
import isBagTooOld, { IsBagTooOld } from "@/utils/is_bag_too_old";
import IsPrivate from "@/utils/is_private";
import IsPaused from "@/utils/user";
import { Store, Derived } from "@tanstack/react-store";

export const authStore = new Store({
  authStatus: AuthStatus.Pending,
  authUser: null as null | User,
  currentChain: null as null | Chain,
  currentChainUsers: null as null | User[],
  currentBags: null as null | Bag[],
  currentBulky: null as null | BulkyItem[],
  currentChainRoute: null as null | UID[],
});

export const authStoreCurrentChainAdmin = new Derived({
  deps: [authStore],
  fn() {
    return (authStore.state.currentChainUsers || []).filter((c) =>
      IsChainAdmin(c, authStore.state.currentChain?.uid),
    );
  },
});
authStoreCurrentChainAdmin.mount();

export const authStoreCurrentChainWarden = new Derived({
  deps: [authStore],
  fn() {
    return (authStore.state.currentChainUsers || [])
      .filter((c) => IsChainWarden(c, authStore.state.currentChain?.uid))
      .map((u) => u.uid);
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
    return (authStore.state.currentChainUsers || [])
      .filter((u) => IsPaused(u, authUserUid))
      .map((u) => u.uid);
  },
});
authStoreListPausedUsers.mount();

export const authStoreAuthUserRoles = new Derived({
  deps: [
    authStoreCurrentChainAdmin,
    authStoreCurrentChainWarden,
    authStoreListPausedUsers,
    authStore,
  ],
  fn() {
    const authUserUid = authStore.state.authUser?.uid;
    if (!authUserUid)
      return { isHost: false, isChainWarden: false, isPaused: false };
    let isHost = Boolean(
      authStoreCurrentChainAdmin.state.find((u) => u.uid === authUserUid),
    );
    let isPaused = Boolean(
      authStoreListPausedUsers.state.find((v) => v === authUserUid),
    );
    let isChainWarden = Boolean(
      authStoreCurrentChainWarden.state.find((uid) => uid === authUserUid),
    );

    return { isHost, isPaused, isChainWarden };
  },
});
authStoreAuthUserRoles.mount();

export interface RouteUser {
  user: User;
  isMe: boolean;
  isHost: boolean;
  isWarden: boolean;
  isPaused: boolean;
  isPrivate: boolean;
  routeIndex: number;
}
export const authStoreListRouteUsers = new Derived({
  deps: [authStore],
  fn() {
    const currentChainRoute = authStore.state.currentChainRoute;
    const currentChainUsers = authStore.state.currentChainUsers;
    if (!currentChainRoute || !currentChainUsers) return [];
    return currentChainRoute
      .reduce<RouteUser[]>((acc, uid) => {
        const user = currentChainUsers.find((u) => u.uid == uid);
        if (!user) return acc;
        const chainUID = authStore.state.currentChain?.uid;

        const uc = user.chains.find((uc) => uc.chain_uid === chainUID);
        const isHost = !!uc?.is_chain_admin;
        const isWarden = !!uc?.is_chain_warden;
        const isMe = uid === authStore.state.authUser?.uid;
        const isPaused = IsPaused(user, chainUID);
        const isPrivate = IsPrivate(user?.address || "");

        acc.push({
          user: user as User,
          isMe,
          isHost,
          isWarden,
          isPaused,
          isPrivate,
          routeIndex: acc.length,
        } satisfies RouteUser);
        return acc;
      }, [])
      .filter(({ user }) => !!user) as RouteUser[];
  },
});
authStoreListRouteUsers.mount();

export type ListBag = {
  bag: Bag;
  isTooOld: IsBagTooOld;
  routeUser: RouteUser | undefined;
  localeDate: string;
};
export const authStoreListBags = new Derived({
  deps: [authStore, authStoreListRouteUsers, authStoreAuthUserRoles],
  fn() {
    const authUser = authStore.state.authUser;
    const { isHost: isAuthUserHost } = authStoreAuthUserRoles.state;
    return (
      authStore.state.currentBags?.map((bag) => {
        const routeUser = authStoreListRouteUsers.state?.find(
          (item) => item.user.uid === bag.user_uid,
        );
        const isMe =
          authUser && routeUser ? routeUser.user.uid === authUser.uid : false;

        const isTooOld = isBagTooOld(bag, isAuthUserHost, isMe);

        return {
          bag,
          isTooOld,
          routeUser,
          localeDate: isTooOld.bagUpdatedAt.toDate().toLocaleDateString(),
        } satisfies ListBag;
      }) || []
    );
  },
});
authStoreListBags.mount();
