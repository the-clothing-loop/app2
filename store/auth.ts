import { Chain } from "@/api/types";
import { User } from "@/api/typex2";
import { Store } from "@tanstack/react-store";

export const authStore = new Store({
  authUser: null as null | User,
  currentChain: null as null | Chain,
});
