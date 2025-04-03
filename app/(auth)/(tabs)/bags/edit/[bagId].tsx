import BagPatch from "@/components/custom/bags/BagPatch";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function BagEdit() {
  const { bagId: bagIdStr }: { bagId: string } = useLocalSearchParams();
  const bags = useStore(authStore, (s) => s.currentBags);

  return useCallback(() => {
    const bagId = parseInt(bagIdStr);
    const bag = bags?.find((b) => b.id == bagId);
    return bag ? <BagPatch bag={bag} /> : null;
  }, [bags, bagIdStr])();
}
