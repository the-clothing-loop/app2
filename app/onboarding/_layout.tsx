import { AuthStatus } from "@/providers/AuthProvider";
import { authStore } from "@/store/auth";
import { savedStore } from "@/store/saved";
import { useStore } from "@tanstack/react-store";
import { Redirect, Stack } from "expo-router";

export default function OnboardingStackLayout() {
  const authStatus = useStore(authStore, (s) => s.authStatus);
  const currentChainUID = useStore(savedStore, (s) => s.chainUID);
  if (authStatus === AuthStatus.LoggedIn) {
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
