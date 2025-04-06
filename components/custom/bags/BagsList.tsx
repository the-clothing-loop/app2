import { bagRemove } from "@/api/bag";
import { Bag } from "@/api/typex2";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { authStore, ListBag } from "@/store/auth";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ShoppingBag, ArrowRight, EllipsisIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable } from "react-native";

export default function BagsList(props: {
  listBags: ListBag[];
  showUser?: boolean;
  showBagOptions?: boolean;
  onPressBag: (item: ListBag) => void;
}) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const queryClient = useQueryClient();
  const mutateBagDelete = useMutation({
    async mutationFn(bagId: number) {
      const { authUser, currentChain } = authStore.state;
      return bagRemove(currentChain!.uid, authUser!.uid, bagId).finally(() => {
        queryClient.invalidateQueries({
          queryKey: ["auth", "chain-bags", currentChain!.uid],
          exact: true,
          refetchType: "all",
        });
      });
    },
  });

  function openBagDeleteDialog(bag: Bag) {
    Alert.alert(
      t("deleteBag"),
      t("areYouSureYouWantToDeleteBag", {
        name: bag.number,
      }),
      [
        {
          text: t("delete"),
          style: "destructive",
          onPress() {
            if (mutateBagDelete.isPending) return;
            mutateBagDelete.mutateAsync(bag.id);
          },
        },
        {
          text: t("cancel"),
          style: "cancel",
        },
      ],
    );
  }

  function openBagOptionsActionsheet(bag: Bag) {
    showActionSheetWithOptions(
      {
        title: bag.number,
        options: [t("edit"), t("delete"), t("cancel")],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // Edit
            router.push(`/(auth)/(tabs)/bags/edit/${bag.id}/`);
            break;
          case 1:
            // Delete

            openBagDeleteDialog(bag);
            break;
        }
      },
    );
  }

  return (
    <>
      <Box className="mb-1 flex w-full flex-row flex-wrap">
        {props.listBags?.map((item) => {
          return (
            <Card
              key={item.bag.id}
              id={"bag-" + item.bag.id}
              className="relative w-1/2 flex-col bg-transparent p-1"
            >
              {props.showBagOptions ? (
                <Pressable
                  className="m absolute right-0 top-0 z-10 px-2 pt-2"
                  onPress={() => openBagOptionsActionsheet(item.bag)}
                >
                  <Box className="h-10 w-10 items-center justify-center">
                    <Icon as={EllipsisIcon} color="#fff" size="xl"></Icon>
                  </Box>
                </Pressable>
              ) : null}
              <Box className="relative">
                <Pressable
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-t-md p-4"
                  onPress={() => props.onPressBag(item)}
                  style={{ backgroundColor: item.bag.color }}
                >
                  <HStack className="absolute left-1 top-1 items-center gap-1.5">
                    <Text className="text-white" size="lg">
                      {item.localeDate}
                    </Text>
                    {item.isTooOld.isBagTooOldMe ? (
                      <Box
                        className="h-3 w-3 rounded-full bg-error-600"
                        key="late-me"
                      />
                    ) : item.isTooOld.isBagTooOldHost ? (
                      <Box
                        className="h-3 w-3 rounded-full bg-warning-400"
                        key="late-other"
                      />
                    ) : null}
                  </HStack>
                  <Icon
                    as={ShoppingBag}
                    //@ts-ignore
                    size="5xl"
                    width={60}
                    height={60}
                    color="white"
                    className="mt-4"
                  />

                  <Text
                    numberOfLines={1}
                    className="text-lg font-bold text-white"
                  >
                    {item.bag.number}
                  </Text>
                </Pressable>
              </Box>
              {props.showUser ? (
                item.routeUser?.isPrivate ? (
                  <HStack className="border-1 w-full rounded-b-md border-background-200 bg-background-0 px-2 py-3">
                    {item.routeUser ? (
                      <>
                        <Text>{"#" + (item.routeUser.routeIndex + 1)}</Text>
                        <Text numberOfLines={1} className="mx-1 flex-grow" bold>
                          {item.routeUser.user.name}
                        </Text>
                      </>
                    ) : (
                      <Text>Bag user not found</Text>
                    )}
                  </HStack>
                ) : (
                  <Pressable
                    onPress={() => {
                      router.replace(`/(auth)/(tabs)/route/`);
                      router.push(
                        `/(auth)/(tabs)/route/${item.routeUser?.user?.uid || 0}`,
                      );
                    }}
                  >
                    <HStack className="border-1 w-full rounded-b-md border-background-200 bg-background-0 px-2 py-3">
                      {item.routeUser ? (
                        <>
                          <Text>{"#" + (item.routeUser.routeIndex + 1)}</Text>
                          <Text
                            numberOfLines={1}
                            className="mx-1 flex-grow"
                            bold
                          >
                            {item.routeUser.user.name}
                          </Text>
                          <Icon as={ArrowRight} className="text-primary-500" />
                        </>
                      ) : (
                        <Text>Bag user not found</Text>
                      )}
                    </HStack>
                  </Pressable>
                )
              ) : null}
            </Card>
          );
        })}
      </Box>
    </>
  );
}
