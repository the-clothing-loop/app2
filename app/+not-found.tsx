import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <Box className="flex-1 items-center justify-center gap-8">
      <VStack className="items-center gap-1">
        <Text size="3xl" bold>
          404
        </Text>
        <Text size="lg">This page doesn't exist.</Text>
      </VStack>
      <Link href="/(auth)/(tabs)/rules" asChild>
        <Button size="xl">
          <ButtonText>Go to home screen!</ButtonText>
        </Button>
      </Link>
    </Box>
  );
}
