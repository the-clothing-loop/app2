import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { authStoreListBags, ListBag } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { router } from "expo-router";
import { ShoppingBag, ArrowRight } from "lucide-react-native";
import { Pressable } from "react-native";

export default function BagsList(props: {
  listBags: ListBag[];
  showUser?: boolean;
  onPressBag: (item: ListBag) => void;
}) {
  return (
    <Box className="flex w-full flex-row flex-wrap">
      {props.listBags?.map((item) => {
        return (
          <Card
            key={item.bag.id}
            id={"bag-" + item.bag.id}
            className="w-1/2 flex-col bg-transparent p-1"
          >
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
              <Pressable
                onPress={() => {
                  router.replace(`/(auth)/(tabs)/(route)/`);
                  router.push(
                    `/(auth)/(tabs)/(route)/${item.routeUser?.user?.uid || 0}`,
                  );
                }}
              >
                <HStack className="border-1 w-full rounded-b-md border-background-200 bg-background-50 px-2 py-3">
                  {item.routeUser ? (
                    <>
                      <Text>{"#" + (item.routeUser.routeIndex + 1)}</Text>
                      <Text numberOfLines={1} className="mx-1 flex-grow" bold>
                        {item.routeUser.user.name}
                      </Text>
                      <Icon as={ArrowRight} className="text-primary-500" />
                    </>
                  ) : (
                    <Text>Bag user not found</Text>
                  )}
                </HStack>
              </Pressable>
            ) : null}
          </Card>
        );
      })}
    </Box>
  );
}
