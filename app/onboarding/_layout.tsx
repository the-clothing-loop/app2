import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { router, Stack } from "expo-router";
import { useLayoutEffect } from "react";

export default function OnboardingStackLayout() {
  const authUser = useStore(authStore, (s) => s.authUser);
  useLayoutEffect(() => {
    if (authUser) {
      console.log("baack to onbording");
      router.replace("/(auth)/select-chain");
    }
  }, [authUser]);
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
