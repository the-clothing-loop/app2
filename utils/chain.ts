import { UID } from "@/api/types";
import { User } from "@/api/typex2";

export function IsChainAdmin(
  user: User | null,
  chainUID: UID | null | undefined
): boolean {
  const userChain = chainUID
    ? user?.chains.find((uc) => uc.chain_uid === chainUID)
    : undefined;
  return userChain?.is_chain_admin || false;
}

export function IsChainWarden(
  user: User | null,
  chainUID: string | null | undefined
): boolean {
  if (!chainUID || !user) return false;
  return (
    user.chains.find((uc) => uc.chain_uid === chainUID)?.is_chain_warden ||
    false
  );
}
