import { useTranslation } from "react-i18next";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { ActivityIndicator, View } from "react-native";
import { bagHistory } from "@/api/bag";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { FlatList } from "react-native-actions-sheet";
import { useQuery } from "@tanstack/react-query";

export default function BagAnalyticsModal() {
  const { t } = useTranslation();
  const { currentChain, currentChainRoute } = useStore(authStore);

  const { data, isLoading } = useQuery({
    queryKey: ["bagHistory", currentChain?.uid],
    queryFn: () => {
      if (!currentChain) throw "Current chain is undefined";
      return bagHistory(currentChain.uid);
    },
    enabled: !!currentChain,
    select: (res) => res.data,
  });

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerClassName="flex-grow pb-10"
      ListEmptyComponent={
        isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Text>{t("noBagHistory")}</Text>
        )
      }
      ItemSeparatorComponent={() => <View className="h-px bg-gray-300" />}
      renderItem={({ item }) => (
        <View className="p-5">
          <Text className="pb-2 text-lg font-bold">{item.number}</Text>
          <View className="mb-2 flex flex-row justify-between">
            <Text size="md">{t("history")}:</Text>
            <Text size="md">{t("dateReceived")}</Text>
          </View>
          <Card className="px-0">
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
                  <View className="flex flex-row justify-between px-4">
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
                      <Text>{date.toLocaleString().split(",")[0]}</Text>
                    ) : null}
                  </View>
                );
              }}
            />
          </Card>
        </View>
      )}
    />
  );
}
