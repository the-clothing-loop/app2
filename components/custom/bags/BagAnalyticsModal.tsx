import { useTranslation } from "react-i18next";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { ScrollView, View } from "react-native";
import { bagHistory, BagHistoryItem } from "@/api/bag";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
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
    <ScrollView className="p-4">
      <View>
        {data?.map((item) => (
          <View key={item.id} className="mb-6 p-3">
            <View>
              <Text className="mb-1 text-lg font-bold">{item.number}</Text>
              <View className="flex flex-row justify-between">
                <View>
                  <Text size="md">{t("history")}:</Text>
                </View>
                <View>
                  <Text size="md">{t("dateReceived")}</Text>
                </View>
              </View>
              <Card className="mb-4">
                {item.history.map((histItem, i) => {
                  /** -1 if not present */
                  const routeUserIndex: number = histItem.uid
                    ? currentChainRoute!.indexOf(histItem.uid)
                    : -1;
                  const date = histItem.date ? new Date(histItem.date) : "";

                  return (
                    <View key={i}>
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
                    </View>
                  );
                })}
              </Card>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
