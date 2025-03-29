import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { SafeAreaView, ScrollView } from "react-native";

export default function OpenSource() {
  return (
    <ScrollView>
      <SafeAreaView>
        <VStack className="gap-2 p-5">
          <Text>List of open source components used in this app coming...</Text>
        </VStack>
      </SafeAreaView>
    </ScrollView>
  );
}
