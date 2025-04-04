import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useStore } from "@tanstack/react-store";
import { Redirect, router, Stack } from "expo-router";
import { useLayoutEffect } from "react";

export default function OnboardingStackLayout() {
  const authUser = useStore(authStore, (s) => s.authUser);
  const currentChainUID = useStore(savedStore, (s) => s.chainUID);
  useLayoutEffect(() => {}, [authUser]);
  if (authUser) {
    if (currentChainUID) {
      console.log("back to home");
      return <Redirect href="/(auth)/(tabs)/(index)" />;
    } else {
      console.log("back to select-chain");
      return <Redirect href="/(auth)/select-chain" />;
    }
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="step1" options={{}} />
      <Stack.Screen name="step2" options={{}} />
      <Stack.Screen name="login" options={{}} />
    </Stack>
  );
}
