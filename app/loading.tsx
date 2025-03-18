import { Avatar, Layout, Spinner, Text } from "@ui-kitten/components";
import { View } from "react-native";

export default function Loading() {
  return (
    <Layout
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      level="3"
    >
      <Avatar size="giant" source={require("../assets/images/logo512.png")} />
      <Text style={{ marginTop: 20 }} category="s1">
        The Clothing Loop
      </Text>
    </Layout>
  );
}
