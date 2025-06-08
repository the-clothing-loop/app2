import { Store } from "@tanstack/react-store";
import { ListBag } from "./auth";

export const selectedBagStore = new Store({
  selectedBag: null as null | ListBag,
});
