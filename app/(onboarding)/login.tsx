import axios from "@/api/axios";
import { loginEmail, loginValidate } from "@/api/login";
import FormLabel from "@/components/custom/FormLabel";
import OnboardingArrows from "@/components/custom/onboarding/Arrows";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { savedStore } from "@/store/saved";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking, Platform, ScrollView, useColorScheme } from "react-native";
import { Input, InputField } from "@/components/ui/input";

export default function Step2() {
  const theme = useColorScheme() ?? "light";

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutateLoginEmail = useMutation({
    async mutationFn(email: string) {
      return loginEmail(email, true).then((res) => res.data);
    },
  });
  const mutateLoginPasscode = useMutation({
    async mutationFn(d: { email: string; passcode: string }) {
      let emailBase64 = btoa(d.email);
      return loginValidate(emailBase64, d.passcode).then((res) => res.data);
    },
    onSuccess(data) {
      savedStore.setState((s) => ({
        userUID: data.user.uid,
        token: data.token,
        chainUID: "",
      }));

      axios.defaults.auth = "Bearer " + data.token;
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });

  const formPasscode = useForm({
    defaultValues: {
      email: "",
      passcode: "",
    },
    onSubmit({ value }) {
      return mutateLoginPasscode.mutateAsync({
        email: value.email,
        passcode: value.passcode,
      });
    },
  });
  const formLogin = useForm({
    defaultValues: {
      email: "",
    },
    async onSubmit({ value }) {
      await mutateLoginEmail.mutateAsync(value.email);
      formPasscode.setFieldValue("email", value.email);
    },
  });

  async function handleOpenMailApp() {
    const email = formLogin.getFieldValue("email");
    const platform = Platform.OS;
    let url = "mailto:" + email;
    if (platform == "ios") {
      if (await Linking.canOpenURL(url)) {
        url = "com.apple.mobilemail://" + email;
      }
    }

    Linking.openURL(url);
  }
  return (
    <VStack>
      <ScrollView className="flex justify-center">
        {theme == "light" ? (
          <Image
            source={require("@/assets/images/v2_logo_black.png")}
            className="object-contain"
            style={{ width: 140, height: 140 }}
          />
        ) : (
          <Image
            src={require("@/assets/images/v2_logo_white.png")}
            className="object-contain"
            style={{ width: 140, height: 140 }}
          />
        )}
        <VStack className="my-10 gap-4">
          <Text className="text-xl">{t("login")}</Text>
          <FormLabel label={t("pleaseEnterYourEmailAddress")}>
            <formLogin.Field name="email">
              {(field) => (
                <Input id="email" key="email-address">
                  <InputField
                    onSubmitEditing={formLogin.handleSubmit}
                    value={field.state.value}
                    autoCapitalize="none"
                    onChangeText={field.setValue}
                    onBlur={field.handleBlur}
                    inputMode="email"
                    keyboardType="email-address"
                    returnKeyType="send"
                    placeholder={t("yourEmailAddress")}
                    type="text"
                  ></InputField>
                </Input>
              )}
            </formLogin.Field>
          </FormLabel>
          <HStack reversed className="gap-3">
            <Button
              action={mutateLoginEmail.isError ? "negative" : "primary"}
              onPress={formLogin.handleSubmit}
            >
              <ButtonText>{t("send")}</ButtonText>
            </Button>
            {mutateLoginEmail.isSuccess ? (
              <Button variant="outline" onPress={handleOpenMailApp}>
                <ButtonText>{t("openMailApp")}</ButtonText>
              </Button>
            ) : null}
          </HStack>

          <VStack className="gap-4">
            <Text>{t("enterThePasscodeYouReceivedInYourEmail")}</Text>
            <FormLabel label={t("passcode")}>
              <formPasscode.Field name="passcode">
                {(field) => (
                  <Input>
                    <InputField
                      keyboardType="numeric"
                      placeholder="••••••"
                      value={field.state.value}
                      onChangeText={field.setValue}
                      onBlur={field.handleBlur}
                    />
                  </Input>
                )}
              </formPasscode.Field>
            </FormLabel>
            <Button onPress={formPasscode.handleSubmit} className="self-end">
              <ButtonText>{t("login")}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
      <OnboardingArrows onPressPrev={() => router.dismissTo("./step1")} />
    </VStack>
  );
}
