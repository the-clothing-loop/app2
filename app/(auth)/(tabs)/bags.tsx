import { Pressable, ScrollView } from "react-native";

import { useStore } from "@tanstack/react-store";
import { authStore } from "@/store/auth";
import { ArrowRight, ShoppingBag } from "lucide-react-native";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Link, router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";

export default function Bags() {
  const { currentBags, currentChainUsers } = useStore(authStore);
  const handleBagPress = (bagId: number, userUid: string) => {
    SheetManager.show("bags", {
      payload: { bagId, userUid },
    });
  };
  return (
    <ScrollView>
      <Box className="flex w-full flex-row flex-wrap">
        {currentBags?.map((bag) => {
          const bagUser = currentChainUsers?.find(
            (u) => u.uid === bag.user_uid,
          );
          return (
            <Card key={bag.id} className="w-1/2 flex-col bg-transparent p-1">
              <VStack className="items-center gap-1 rounded-t-md bg-background-0 p-4">
                <Button
                  className="h-20 w-20 rounded-full"
                  size="xl"
                  onPress={() => handleBagPress(bag.id, bag.user_uid)}
                  style={{ backgroundColor: bag.color }}
                >
                  <Icon
                    as={ShoppingBag}
                    //@ts-ignore
                    size="3xl"
                    color="white"
                  />
                </Button>
                <Text numberOfLines={1} className="text-sm font-bold">
                  {bag.number}
                </Text>
              </VStack>
              <Pressable
                // onPress={() => {
                //   router.replace(
                //     `/(auth)/(tabs)/(route)/${bagUser?.uid || 0}`,
                //     {},
                //   );
                // }}
                onPress={() => {
                  router.replace(`/(auth)/(tabs)/(route)/`);
                  router.push(`/(auth)/(tabs)/(route)/${bagUser?.uid || 0}`);
                }}
              >
                <HStack className="border-1 w-full justify-between rounded-b-md border-background-200 bg-background-50 p-2">
                  {bagUser ? (
                    <>
                      <Text numberOfLines={1}>{bagUser.name}</Text>
                      <ArrowRight />
                    </>
                  ) : (
                    <Text>Bag user not found</Text>
                  )}
                </HStack>
              </Pressable>
            </Card>
          );
        })}
      </Box>
    </ScrollView>
  );
}
