import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { useStore } from "@tanstack/react-store";
import { savedStore } from "@/store/saved";
import axios from "@/api/axios";
import { logout } from "@/api/login";
import { router } from "expo-router";
import { authStore } from "@/store/auth";

export default function LegalAndLogout() {
  const { t } = useTranslation();
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
    <HStack className="p-6">
      <Button onPress={onLogout} size="xl" action="negative" className="grow">
        <ButtonText>{t("logout")}</ButtonText>
      </Button>
    </HStack>
  );
}
