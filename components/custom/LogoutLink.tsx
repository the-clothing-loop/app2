import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "../ui/button";
import { savedStore } from "@/store/saved";
import axios from "@/api/axios";
import { logout } from "@/api/login";
import { authStore } from "@/store/auth";
import { Box } from "../ui/box";
import { Alert } from "react-native";

export default function LogoutLink() {
  const { t } = useTranslation();

  function openLogoutDialog() {
    Alert.alert(t("logout"), t("areYouSureYouWantToLogout"), [
      {
        text: t("logout"),
        style: "destructive",
        onPress() {
          onLogout();
        },
      },
      {
        text: t("cancel"),
        style: "cancel",
      },
    ]);
  }

  function onLogout() {
    logout().finally(() => {
      axios.defaults.auth = undefined;
      savedStore.setState(() => ({
        userUID: "",
        token: "",
        chainUID: "",
      }));
      authStore.setState(() => ({
        authUser: null,
        currentChain: null,
        currentChainUsers: null,
        currentBags: null,
        currentChainRoute: null,
      }));
    });
  }

  return (
    <Box className="p-6">
      <Button
        onPress={openLogoutDialog}
        size="xl"
        action="negative"
        className="grow"
      >
        <ButtonText>{t("logout")}</ButtonText>
      </Button>
    </Box>
  );
}
