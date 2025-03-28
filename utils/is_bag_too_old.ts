import { Bag } from "@/api/typex2";
import dayjs from "dayjs";

export type IsBagTooOld = ReturnType<typeof isBagTooOld>;
export default function isBagTooOld(
  bag: Bag,
  isAuthUserHost: boolean,
  isMe: boolean,
) {
  const bagUpdatedAt = dayjs(bag.updated_at);
  const isBagTooOld = bagUpdatedAt.isBefore(dayjs().add(-7, "days"));
  const isBagTooOldMe = isMe && isBagTooOld;
  const isBagTooOldHost = isAuthUserHost && isBagTooOld;
  return { bagUpdatedAt, isBagTooOld, isBagTooOldMe, isBagTooOldHost };
}
