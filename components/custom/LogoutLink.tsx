import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "../ui/button";
import { savedStore } from "@/store/saved";
import axios from "@/api/axios";
import { logout } from "@/api/login";
import { authStore } from "@/store/auth";
import { Box } from "../ui/box";

export default function LogoutLink() {
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
    <Box className="p-6">
      <Button onPress={onLogout} size="xl" action="negative" className="grow">
        <ButtonText>{t("logout")}</ButtonText>
      </Button>
    </Box>
  );
}
