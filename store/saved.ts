import { Store } from "@tanstack/react-store";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface Saved {
  userUID: string;
  token: string;
}

export const savedStore = new Store<Saved>({
  userUID: "",
  token: "",
});

export const initSavedStore = () => {
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
  savedStore.setState((s) => ({
    userUID: storage.get("user_uid") || "",
    token: storage.get("token") || "",
  }));
  const close = savedStore.subscribe(({ currentVal: s }) => {
    storage.set("user_uid", s.userUID || "");
    storage.set("token", s.token || "");
  });
  return () => {
    close();
  };
};
