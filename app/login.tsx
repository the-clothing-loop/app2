import { PropsWithChildren, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  useColorScheme,
  View,
} from "react-native";
import { Button, Input, Layout, Text, ViewPager } from "@ui-kitten/components";
import { ArrowLeftIcon, ArrowRightIcon, MapPinIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { loginEmail, loginValidate } from "@/api/login";
import { useForm } from "@tanstack/react-form";
import { savedStore } from "@/store/saved";
import { authStore } from "@/store/auth";
import axios from "@/api/axios";

export default function Login() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useColorScheme() ?? "light";
  const saved = useStore(savedStore);
  const auth = useStore(authStore);

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
    <ViewPager
      style={{ height: "100%" }}
      swipeEnabled={selectedIndex !== 2}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
    >
      <OnboardingPage>
        <View
          style={{
            flexGrow: 1,
            flexShrink: 0,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ marginVertical: 8 }}>
            {theme == "light" ? (
              <Image
                source={require("../assets/images/v2_logo_black.png")}
                resizeMode="contain"
                style={{ width: 208, height: 208 }}
              />
            ) : (
              <Image
                source={require("../assets/images/v2_logo_white.png")}
                resizeMode="contain"
                style={{ width: 208, height: 208 }}
              />
            )}
          </View>
          <View>
            <Text
              category="h1"
              status="primary"
              style={{ textAlign: "center" }}
            >
              Swap,
            </Text>
            <Text
              category="h1"
              status="primary"
              style={{ textAlign: "center" }}
            >
              don't shop!
            </Text>
          </View>
        </View>
        <Arrows onPressNext={() => setSelectedIndex(1)} />
      </OnboardingPage>
      <OnboardingPage>
        <View
          style={{
            flex: 1,
            flexGrow: 1,
            flexShrink: 0,
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <View>
            <Text category="h5" style={{ textAlign: "center" }}>
              You'll need an account
            </Text>
            <Text category="h5" style={{ textAlign: "center" }}>
              to use this app
            </Text>
          </View>
          <Image
            style={{
              width: 200,
              height: 200,
            }}
            source={{
              uri: "https://images.clothingloop.org/600x,jpeg/map_image_5.jpg",
            }}
          />
          <View>
            <Text category="h4" style={{ textAlign: "center" }}>
              If you haven't already,
            </Text>
            <Text category="h4" style={{ textAlign: "center" }}>
              find a loop first!
            </Text>
          </View>
          <Button
            onPress={() =>
              Linking.openURL("https://www.clothingloop.org/loops/find")
            }
            accessoryLeft={() => <MapPinIcon color="#fff" />}
          >
            Map
          </Button>
        </View>
        <Arrows
          onPressPrev={() => setSelectedIndex(0)}
          onPressNext={() => setSelectedIndex(2)}
        />
      </OnboardingPage>
      <OnboardingPage>
        <View style={{ flex: 1, alignItems: "center" }}>
          {theme == "light" ? (
            <Image
              source={require("../assets/images/v2_logo_black.png")}
              resizeMode="contain"
              style={{ width: 140, height: 140 }}
            />
          ) : (
            <Image
              src={require("../assets/images/v2_logo_white.png")}
              resizeMode="contain"
              style={{ width: 140, height: 140 }}
            />
          )}
          <View
            style={{
              flex: 1,
              marginHorizontal: 36,
              gap: 12,
              maxWidth: 350,
            }}
          >
            <Text category="h1">{t("login")}</Text>
            <Text category="p1">{t("pleaseEnterYourEmailAddress")}</Text>
            <formLogin.Field name="email">
              {(field) => (
                <Input
                  label={t("email")}
                  keyboardType="email-address"
                  placeholder={t("yourEmailAddress")}
                  returnKeyType="send"
                  onSubmitEditing={formLogin.handleSubmit}
                  value={field.state.value}
                  autoCapitalize="none"
                  onChangeText={field.setValue}
                  onBlur={field.handleBlur}
                />
              )}
            </formLogin.Field>
            <View style={{ flexDirection: "row-reverse", gap: 12 }}>
              <Button
                status={mutateLoginEmail.isError ? "danger" : "primary"}
                onPress={formLogin.handleSubmit}
                style={{ alignSelf: "flex-end" }}
              >
                {t("send")}
              </Button>
              {mutateLoginEmail.isSuccess ? (
                <Button appearance="outline" onPress={handleOpenMailApp}>
                  {t("openMailApp")}
                </Button>
              ) : null}
            </View>

            <View
              style={{
                flex: 1,
                gap: 12,
                display: mutateLoginEmail.isSuccess ? "flex" : "none",
              }}
            >
              <Text category="p1">
                {t("enterThePasscodeYouReceivedInYourEmail")}
              </Text>
              <formPasscode.Field name="passcode">
                {(field) => (
                  <Input
                    label={t("passcode")}
                    keyboardType="numeric"
                    placeholder="••••••"
                    value={field.state.value}
                    onChangeText={field.setValue}
                    onBlur={field.handleBlur}
                  />
                )}
              </formPasscode.Field>
              <Button
                onPress={formPasscode.handleSubmit}
                style={{ alignSelf: "flex-end" }}
              >
                {t("login")}
              </Button>
            </View>
          </View>
        </View>
        <Arrows onPressPrev={() => setSelectedIndex(1)} />
      </OnboardingPage>
    </ViewPager>
  );
}

function Arrows(props: { onPressPrev?: () => void; onPressNext?: () => void }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 24,
      }}
    >
      <View>
        {props.onPressPrev ? (
          <Button
            onPress={props.onPressPrev}
            appearance="outline"
            style={{
              borderRadius: "100%",
              width: 66,
              height: 66,
            }}
          >
            <ArrowLeftIcon />
          </Button>
        ) : null}
      </View>
      {props.onPressNext ? (
        <Button
          onPress={props.onPressNext}
          style={{
            borderRadius: "100%",
            width: 66,
            height: 66,
          }}
        >
          <ArrowRightIcon />
        </Button>
      ) : null}
    </View>
  );
}

function OnboardingPage(props: PropsWithChildren) {
  return (
    <Layout style={{ flex: 1, flexDirection: "column" }} level="2">
      <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
        {props.children}
      </SafeAreaView>
    </Layout>
  );
}
