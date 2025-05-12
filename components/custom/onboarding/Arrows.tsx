import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Link, router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function OnboardingArrows(props: {
  onPressPrev?: () => void;
  onPressNext?: () => void;
  showNextLoginOrSignup?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <HStack className="absolute bottom-0 left-0 right-0 items-end justify-between p-4">
      <Box>
        {props.onPressPrev ? (
          <Button
            className="h-20 w-20 rounded-full bg-background-100 data-[active=true]:bg-background-200"
            variant="outline"
            onPress={props.onPressPrev}
            size="xl"
          >
            <ButtonIcon
              //@ts-expect-error
              size="2xl"
              as={ArrowLeft}
            />
          </Button>
        ) : null}
      </Box>
      <Box className="items-end gap-4">
        {props.showNextLoginOrSignup ? (
          <>
            <Link asChild href="https://www.clothingloop.org/loops/find">
              <Button className="h-20 rounded-full" size="xl">
                <ButtonText>{t("signup")}</ButtonText>
                <ButtonIcon
                  //@ts-expect-error
                  size="2xl"
                  as={ArrowRight}
                />
              </Button>
            </Link>
            <Button
              className="h-20 rounded-full"
              onPress={() => router.push("./login")}
              size="xl"
            >
              <ButtonText>{t("login")}</ButtonText>
              <ButtonIcon
                //@ts-expect-error
                size="2xl"
                as={ArrowRight}
              />
            </Button>
          </>
        ) : props.onPressNext ? (
          <Button
            className="h-20 w-20 rounded-full"
            onPress={props.onPressNext}
            size="xl"
          >
            <ButtonIcon
              //@ts-expect-error
              size="2xl"
              as={ArrowRight}
            />
          </Button>
        ) : null}
      </Box>
    </HStack>
  );
}
