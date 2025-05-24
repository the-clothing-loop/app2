import { useTranslation } from "react-i18next";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { ScrollView, View } from "react-native";
import { bagHistory, BagHistoryItem } from "@/api/bag";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { FlatList } from "react-native-actions-sheet";
export default function BagAnalyticsModal() {
  const { t } = useTranslation();
  const { currentChain, currentChainRoute } = useStore(authStore);
  const [data, setData] = useState<BagHistoryItem[] | undefined>();

  useEffect(() => {
    if (!currentChain) return;
    bagHistory(currentChain.uid)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch bag history", error);
      });
  }, [currentChain]);

  return (
    <View className="">
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-300" />}
        renderItem={({ item }) => (
          <View className="p-5">
            <Text className="pb-2 text-lg font-bold">{item.number}</Text>
            <View className="mb-2 flex flex-row justify-between">
              <View>
                <Text size="md">{t("history")}:</Text>
              </View>
              <View>
                <Text size="md">{t("dateReceived")}</Text>
              </View>
            </View>
            <Card className="mb-4">
              <FlatList
                data={item.history}
                keyExtractor={(item, index) =>
                  item.uid ? `${item.uid}-${index}` : `history-${index}`
                }
                ItemSeparatorComponent={() => (
                  <View className="my-3 h-px bg-gray-300" />
                )}
                renderItem={({ item: histItem }) => {
                  /** -1 if not present */
                  const routeUserIndex: number = histItem.uid
                    ? currentChainRoute!.indexOf(histItem.uid)
                    : -1;
                  const date = histItem.date ? new Date(histItem.date) : "";
                  return (
                    <View className="flex flex-row justify-between">
                      {routeUserIndex === -1 ? null : (
                        <View className="flex flex-row">
                          <Text className="mr-3 font-bold">
                            {`#${routeUserIndex + 1}`}
                          </Text>
                          <Text className="font-normal text-black">
                            {histItem.name}
                          </Text>
                        </View>
                      )}
                      {histItem.date ? (
                        <Text className="">
                          {date.toLocaleString().split(",")[0]}
                        </Text>
                      ) : null}
                    </View>
                  );
                }}
              ></FlatList>
            </Card>
          </View>
        )}
      ></FlatList>
    </View>
  );
}
