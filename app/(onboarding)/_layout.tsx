import { Stack } from "expo-router";

export default function OnboardingStackLayout() {
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
