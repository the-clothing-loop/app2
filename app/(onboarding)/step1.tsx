import OnboardingArrows from "@/components/custom/onboarding/Arrows";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { SafeAreaView, useColorScheme } from "react-native";

export default function Step1() {
  const theme = useColorScheme() ?? "light";
  return (
    <SafeAreaView className="flex-1 flex-col">
      <VStack className="flex-grow items-center justify-center">
        <VStack className="items-center justify-center gap-6">
          {theme == "light" ? (
            <Image
              key="logo-light"
              source={require("@/assets/images/v2_logo_black.png")}
              alt="logo"
              className="h-36 w-36 object-cover"
            />
          ) : (
            <Image
              key="logo-dark"
              source={require("@/assets/images/v2_logo_white.png")}
              alt="logo"
              className="h-36 w-36 object-contain"
            />
          )}

          <VStack>
            <Text bold className="text-center text-3xl">
              Swap,
            </Text>
            <Text bold className="text-center text-3xl">
              don't shop!
            </Text>
          </VStack>
        </VStack>
      </VStack>
      <OnboardingArrows onPressNext={() => router.push("./step2")} />
    </SafeAreaView>
  );
}
