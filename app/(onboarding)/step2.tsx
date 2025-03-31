import OnboardingArrows from "@/components/custom/onboarding/Arrows";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MapPin } from "lucide-react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";

export default function Step2() {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 flex-col">
      <VStack className="grow items-center justify-center">
        <VStack className="items-center justify-center gap-5">
          <VStack className="mt-5">
            <Text className="text-center text-2xl" bold>
              You'll need an account
            </Text>
            <Text className="text-center text-2xl" bold>
              to use this app
            </Text>
          </VStack>
          <Image
            resizeMode="contain"
            alt="map"
            className="h-64 w-64"
            source={{
              uri: "https://images.clothingloop.org/1024x,jpeg/map_image_5.jpg",
            }}
          />
          <VStack>
            <Text className="text-center text-2xl">
              If you haven't already,
            </Text>
            <Text className="text-center text-2xl">find a loop first!</Text>
          </VStack>
          <Link asChild href="https://www.clothingloop.org/loops/find">
            <Button>
              <ButtonIcon className="me-2" as={MapPin} />

              <ButtonText>{t("map")}</ButtonText>
            </Button>
          </Link>
        </VStack>
        <OnboardingArrows
          onPressPrev={() => router.dismissTo("./step1")}
          onPressNext={() => router.push("./login")}
        />
      </VStack>
    </SafeAreaView>
  );
}
