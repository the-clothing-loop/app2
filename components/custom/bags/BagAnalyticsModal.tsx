import { useTranslation } from "react-i18next";
import { authStore } from "@/store/auth";
import { useStore } from "@tanstack/react-store";
import { ScrollView, View } from "react-native";
import { bagHistory, BagHistoryItem } from "@/api/bag";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
export default function BagAnalyticsModal() {
  const { t } = useTranslation();
  const { currentChain, currentChainRoute } = useStore(authStore);
  const [data, setData] = useState<BagHistoryItem[] | undefined>();
  console.log("currentChain outside useEffect:", currentChain);

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
          <View
            key={item.id}
            className="mb-6 rounded border border-gray-300 p-3"
          >
            <View>
              <Text className="mb-1 text-lg font-bold">{item.number}</Text>
              <Text>{t("history")}:</Text>
              <Text>{t("dateReceived")}</Text>
              {item.history.map((histItem, i) => {
                const routeUserIndex: number = histItem.uid
                  ? currentChainRoute!.indexOf(histItem.uid)
                  : -1;

                const date = histItem.date ? new Date(histItem.date) : "";

                return (
                  <View key={i}>
                    <View className="tw-flex tw-items-center tw-text-medium-shade">
                      {routeUserIndex === -1 ? null : (
                        <Text className="!tw-font-bold">{`#${routeUserIndex + 1}`}</Text>
                      )}
                    </View>
                    <View>
                      <Text>Item Name: {histItem.name}</Text>
                    </View>
                    {histItem.date ? (
                      <Text className="tw-text-medium-shade">
                        {date.toLocaleString().split(",")[0]}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
