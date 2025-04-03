import { Store } from "@tanstack/react-store";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const storage =
  Platform.OS == "web"
    ? {
        get: (k: string) => localStorage.getItem(k) || "",
        set: (k: string, v: string) => localStorage.setItem(k, v),
      }
    : {
        get: (k: string) => SecureStore.getItem(k),
        set: (k: string, v: string) => SecureStore.setItem(k, v),
      };

export interface Saved {
  userUID: string;
  token: string;
  chainUID: string;
}

function GetSaved(): Saved {
  return {
    userUID: storage.get("user_uid") || "",
    token: storage.get("token") || "",
    chainUID: storage.get("chain_uid") || "",
  };
}

export const savedStore = new Store<Saved>(GetSaved());

savedStore.subscribe(({ currentVal: s }) => {
  storage.set("user_uid", s.userUID || "");
  storage.set("token", s.token || "");
  storage.set("chain_uid", s.chainUID || "");
});
