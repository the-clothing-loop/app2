import { BulkyItem } from "@/api/typex2";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { useMemo, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useStore } from "@tanstack/react-store";
import { authStore, authStoreAuthUserRoles } from "@/store/auth";
import { router } from "expo-router";
import { bulkyItemRemove } from "@/api/bulky";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { EllipsisIcon } from "lucide-react-native";
import dayjs from "@/utils/dayjs";
export default function BulkyList(props: { bulkyList: BulkyItem[] }) {
  const [selected, setSelected] = useState<BulkyItem | null>(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const authUser = useStore(authStore, (s) => s.authUser);
  const queryClient = useQueryClient();
  const isHost = useStore(authStoreAuthUserRoles, (s) => s.isHost);
  const cols = useMemo(() => {
    const col1: BulkyItem[] = [];
    const col2: BulkyItem[] = [];
    props.bulkyList
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .forEach((bulky, i) => {
        if (i % 2 == 0) {
          col1.push(bulky);
        } else {
          col2.push(bulky);
        }
      });
    return [col1, col2];
  }, [props.bulkyList]);

  function bulkyOptionsHandler(bulky: BulkyItem) {
    if (!(bulky?.user_uid === authUser?.uid || isHost)) return;

    const options = ["Cancel", "Edit", "Delete"];

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          // edit
          router.push(`/(auth)/(tabs)/bags/bulky/edit/${bulky.id}/`);
        } else if (buttonIndex === 2) {
          // delete
          Alert.alert(
            t("deleteBulkyItem"),
            t("areYouSureYouWantToDeleteThisBulkyItem"),
            [
              {
                text: t("delete"),
                style: "destructive",
                onPress() {
                  bulkyItemRemove(bulky.chain_uid, bulky.user_uid, bulky.id);
                  queryClient.invalidateQueries({
                    queryKey: ["auth", "chain-bags", bulky.chain_uid],
                    exact: true,
                  });
                },
              },
              {
                text: t("cancel"),
                style: "cancel",
              },
            ],
          );
        }
      },
    );
  }
  return (
    <>
      <HStack className="pb-6 pt-1">
        {cols.map((list, i) => (
          <VStack key={i} className="w-1/2">
            {list.map((bulky) => {
              return (
                <Pressable
                  onPress={() => setSelected(bulky)}
                  onLongPress={
                    bulky.user_uid === authUser?.uid || isHost
                      ? () => bulkyOptionsHandler(bulky)
                      : undefined
                  }
                  key={bulky.id}
                >
                  <Card
                    className="relative bg-transparent p-1"
                    id={"bulky-" + bulky.id}
                  >
                    {bulky.user_uid === authUser?.uid || isHost ? (
                      <Pressable
                        className="absolute right-2 top-2 z-10 flex rounded-full bg-black/30 p-1"
                        onPress={() => bulkyOptionsHandler(bulky)}
                      >
                        <EllipsisIcon color="#fff" className=""></EllipsisIcon>
                      </Pressable>
                    ) : null}
                    {bulky.image_url ? (
                      <Box className="aspect-square">
                        <Image
                          className="h-full w-full rounded-t-md"
                          source={{
                            uri: bulky.image_url,
                          }}
                        />
                      </Box>
                    ) : null}
                    <VStack
                      className={`bg-background-0 p-3 ${bulky.image_url ? "rounded-b-md" : "rounded-md"}`}
                    >
                      <Text className="text-typography-500" size="sm" bold>
                        {dayjs(bulky.created_at).toDate().toLocaleDateString()}
                      </Text>
                      <Text className="text-3xl">{bulky.title}</Text>
                      <Text>
                        {bulky.message.length > 100
                          ? bulky.message.slice(0, 100) + "..."
                          : bulky.message}
                      </Text>
                    </VStack>
                  </Card>
                </Pressable>
              );
            })}
          </VStack>
        ))}
      </HStack>
      {selected && (
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 justify-center align-middle">
            <Modal
              animationType="fade"
              transparent={true}
              visible={!!selected}
              onRequestClose={(open) => !open && setSelected(null)}
            >
              <Pressable
                onPress={() => setSelected(null)}
                className="flex-1 items-center justify-center bg-white/70"
              >
                <Pressable
                  onPress={() => {}} // prevent closing when tapping inside the modal
                  className="m-5 w-[90%] max-w-xl rounded-2xl bg-white p-8 shadow-lg"
                >
                  <Pressable
                    onPress={() => setSelected(null)}
                    className="mb-2 self-end"
                  >
                    <Text className="text-md mb-2 text-right text-primary-500">
                      {t("close")}
                    </Text>
                  </Pressable>

                  <VStack>
                    {selected.image_url && (
                      <Image
                        className="mb-2 h-96 w-full"
                        source={{
                          uri: selected.image_url,
                        }}
                      />
                    )}
                    <Text className="mb-2 text-2xl font-bold">
                      {selected.title}
                    </Text>
                    <View className="grow-1 max-h-80">
                      <ScrollView>
                        <Pressable>
                          <Text>{selected.message}</Text>
                        </Pressable>
                      </ScrollView>
                    </View>
                  </VStack>
                </Pressable>
              </Pressable>
            </Modal>
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </>
  );
}
