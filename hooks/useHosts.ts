import { Chain, User } from "@/api/types";
import { UserChain } from "@/api/typex2";
import { IsChainAdmin } from "@/utils/chain";
import { useMemo } from "react";

export default function useHosts(chainUsers: UserChain[]) {
  return useMemo<User[]>(
    () => chainUsers.filter((u) => IsChainAdmin(u, chain?.uid)),
    [chainUsers, chain]
  );
}
