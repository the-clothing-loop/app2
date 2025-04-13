import { BulkyItem } from "@/api/typex2";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import FormattedText from "../FormattedText";
import { Box } from "@/components/ui/box";
import { useMemo, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import React from "react";
import { Alert, Modal, Pressable, SafeAreaView, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function BulkyList(props: { bulkyList: BulkyItem[] }) {
  const [selected, setSelected] = useState<BulkyItem | null>(null);

  const cols = useMemo(() => {
    const col1: BulkyItem[] = [];
    const col2: BulkyItem[] = [];
    props.bulkyList.forEach((bulky, i) => {
      if (i % 2 == 0) {
        col1.push(bulky);
      } else {
        col2.push(bulky);
      }
    });
    return [col1, col2];
  }, [props.bulkyList]);
  return (
    <>
      <HStack className="pb-6 pt-1">
        {cols.map((list, i) => (
          <VStack key={i} className="w-1/2">
            {list.map((bulky) => {
              return (
                <Pressable onPress={() => setSelected(bulky)}>
                  <Card
                    key={bulky.id}
                    className="bg-transparent p-1"
                    id={"bulky-" + bulky.id}
                  >
                    {bulky.image_url ? (
                      <Box className="aspect-square">
                        <Image
                          className="h-full w-full rounded-t-md"
                          source={{ uri: bulky.image_url }}
                        />
                      </Box>
                    ) : null}
                    <VStack
                      className={`bg-background-0 p-3 ${bulky.image_url ? "rounded-b-md" : "rounded-md"}`}
                    >
                      <Text className="text-3xl">{bulky.title}</Text>
                      <Text className="">{bulky.message}</Text>
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
                      Close
                    </Text>
                  </Pressable>

                  <VStack>
                    {selected.image_url && (
                      <Image
                        className="mb-2 w-full"
                        source={{ uri: selected.image_url }}
                      />
                    )}
                    <Text className="mb-2 text-2xl font-bold">
                      {selected.title}
                    </Text>
                    <Text>{selected.message}</Text>
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
