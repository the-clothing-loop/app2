import { Dayjs } from "dayjs";
import { UID } from "../api/types";
import { User, UserUpdateRequest } from "../api/typex2";
import dayjs from "./dayjs";

export default function IsPaused(
  user: User | null,
  currentChainUID: UID | undefined,
): boolean {
  if (user === null) return false;
  if (currentChainUID) {
    const uc = user.chains.find((uc) => uc.chain_uid === currentChainUID);
    if (uc && uc.is_paused) return true;
  }
  if (!user.paused_until) return false;
  const paused = dayjs(user.paused_until);

  return paused.isAfter(dayjs());
}

export interface IsPausedHowResult {
  /** is paused for user */
  user: false | Dayjs;
  /** is paused for this chain */
  chain: boolean;
  /** is paused sum */
  sum: boolean;
}

export function IsPausedHow(
  user: User | null,
  currentChainUID: UID | undefined,
): IsPausedHowResult {
  if (user === null) return { user: false, chain: false, sum: false };

  let userPaused = user.paused_until ? dayjs(user.paused_until) : false;
  if (userPaused && !userPaused.isAfter(dayjs())) userPaused = false;

  let userChainPaused = false;
  if (currentChainUID) {
    const uc = user.chains.find((uc) => uc.chain_uid === currentChainUID);
    if (uc && uc.is_paused) userChainPaused = true;
  }

  return {
    user: userPaused,
    chain: userChainPaused,
    sum: Boolean(userPaused) || userChainPaused,
  };
}

export function SetPauseRequestBody(
  authUserUID: UID,
  pause: Date | boolean,
  onlyChainUID?: UID,
): UserUpdateRequest {
  if (onlyChainUID) {
    if (typeof pause !== "boolean") {
      throw "Invalid pause value: " + pause;
    }
    if (pause) {
      return {
        user_uid: authUserUID,
        chain_uid: onlyChainUID,
        chain_paused: true,
      };
    } else {
      return {
        user_uid: authUserUID,
        chain_uid: onlyChainUID,
        chain_paused: false,
        paused_until: dayjs().add(-1, "week").format(),
      };
    }
  } else {
    let pauseUntil = dayjs();
    if (pause === true) {
      pauseUntil = pauseUntil.add(100, "years");
    } else if (pause === false || dayjs(pause).diff(dayjs(), "day") < 0) {
      pauseUntil = pauseUntil.add(-1, "week");
    } else {
      pauseUntil = dayjs(pause);
    }
    return {
      user_uid: authUserUID,
      paused_until: pauseUntil.format(),
    };
  }
}
