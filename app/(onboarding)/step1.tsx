import OnboardingArrows from "@/components/custom/onboarding/Arrows";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { useColorScheme } from "react-native";

export default function Step1() {
  const theme = useColorScheme() ?? "light";
  return (
    <VStack className="grow items-center justify-center">
      <VStack className="items-center justify-center gap-3">
        {theme == "light" ? (
          <Image
            source={require("@/assets/images/v2_logo_black.png")}
            style={{ width: 208, height: 208 }}
          />
        ) : (
          <Image
            source={require("@/assets/images/v2_logo_white.png")}
            style={{ width: 208, height: 208 }}
          />
        )}

        <VStack>
          <Text className="text-center text-lg">Swap,</Text>
          <Text className="text-center text-lg">don't shop!</Text>
        </VStack>
      </VStack>
      <OnboardingArrows onPressNext={() => router.push("./step2")} />
    </VStack>
  );
}
