import { User } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { messagingApps } from "@/constants/MessagingApps";
import IsPrivate from "@/utils/is_private";
import { Flag, Shield } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, Share } from "react-native";
import InterestedSizes, { Categories, Sizes } from "../InterestedSizes";

export default function UserCard(props: {
  user: User;
  showMessengers?: boolean;
  showEmail?: boolean;
  isUserPaused: boolean;
  isUserHost: boolean;
  isUserWarden: boolean;
}) {
  const { t } = useTranslation();
  const isAddressPrivate = IsPrivate(props.user.address);

  function handleSharePhoneNumber() {
    Share.share({
      url: "tel:" + props.user.phone_number.replaceAll(" ", ""),
    });
  }
  function handleShareEmail() {
    Linking.openURL("mailto:" + props.user.email);
  }
  function handleShareAddress() {
    Share.share({
      url:
        `https://www.google.com/maps/search/` +
        props.user.address.replaceAll(" ", "+"),
    });
  }
  return (
    <VStack className="bg-background-0">
      {props.isUserHost || props.isUserWarden ? (
        <VStack className="px-4 py-2">
          <Text bold size="sm">
            {t("loopRole")}
          </Text>
          {props.isUserHost ? (
            <HStack className="items-center">
              <Text>{t("host")}</Text>
              <Icon
                as={Shield}
                //@ts-ignore
                size="sm"
                className="ms-1 fill-blue-600 text-transparent"
              />
            </HStack>
          ) : (
            <HStack className="items-center">
              <Text>{t("assignWardenTitle")}</Text>
              <Icon
                as={Flag}
                //@ts-ignore
                size="sm"
                className="ms-1 fill-pink-400 text-transparent"
              />
            </HStack>
          )}
        </VStack>
      ) : null}
      {props.user.phone_number ? (
        <Pressable onPress={handleSharePhoneNumber} key="phone">
          <VStack className="px-4 py-2">
            <Text bold size="sm">
              {t("phone")}
            </Text>
            <Text>{props.user.phone_number}</Text>
          </VStack>
        </Pressable>
      ) : null}
      {props.user.phone_number && props.showMessengers ? (
        <HStack key="im" className="gap-4 px-3 pb-2">
          {messagingApps.map((m) => {
            const link = m.link(props.user.phone_number);
            return (
              <Pressable key={m.key} onPress={() => Linking.openURL(link)}>
                <Box
                  className="aspect-square w-14 items-center justify-center rounded-full shadow-hard-1"
                  style={{ backgroundColor: m.bgColor }}
                >
                  <m.source width={32} height={32} color="#fff" />
                </Box>
              </Pressable>
            );
          })}
        </HStack>
      ) : null}
      <Pressable onPress={handleShareEmail}>
        <VStack className="items-start px-4 py-2">
          <Text bold size="sm">
            {t("email")}
          </Text>
          <Text>{props.user.email}</Text>
        </VStack>
      </Pressable>
      <Pressable onLongPress={handleShareAddress}>
        <VStack className="items-start px-4 py-2">
          <Text bold size="sm">
            {t("address")}
          </Text>
          <Text>{props.user.address}</Text>
        </VStack>
      </Pressable>
      <InterestedSizes
        categories={[] as Categories[]}
        sizes={props.user.sizes as Sizes[]}
      />
    </VStack>
  );
}
