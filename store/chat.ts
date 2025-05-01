import { Store } from "@tanstack/react-store";

export enum ChatConnStatus {
  Loading,
  LoggedIn,
  Error,
}

export type AppType = "off" | "signal" | "whatsapp" | "telegram";

export type MmState = "loading" | "error" | "success";

export const chatStore = new Store({
  appType: null as AppType | null,
  chatUrl: "",
  chatInAppDisabled: null as boolean | null,
});
