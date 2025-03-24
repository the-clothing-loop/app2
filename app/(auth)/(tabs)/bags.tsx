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

export default function TabTwoScreen() {
  const { currentBags, currentChainUsers } = useStore(authStore);

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
                  onPress={() => {}}
                  style={{ backgroundColor: bag.color }}
                >
                  <Icon as={ShoppingBag} size="3xl" color="white" />
                </Button>
                <Text numberOfLines={1} className="text-sm font-bold">
                  {bag.number}
                </Text>
              </VStack>
              <Pressable onPress={() => {}}>
                <HStack className="border-1 justify-between rounded-b-md border-background-200 bg-background-50 p-2">
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
