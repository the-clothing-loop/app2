import { Store } from "@tanstack/react-store";

export const oneSignalStore = new Store({
  isInitialized: false,
  isLoggedIn: false,
});
