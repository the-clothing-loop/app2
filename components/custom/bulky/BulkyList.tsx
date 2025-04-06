import { BulkyItem } from "@/api/typex2";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import FormattedText from "../FormattedText";
import { Box } from "@/components/ui/box";
import { useMemo } from "react";
import { HStack } from "@/components/ui/hstack";

export default function BulkyList(props: { bulkyList: BulkyItem[] }) {
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
    <HStack className="pb-6 pt-1">
      {cols.map((list, i) => (
        <VStack key={i} className="w-1/2">
          {list.map((bulky) => {
            return (
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
            );
          })}
        </VStack>
      ))}
    </HStack>
  );
}
