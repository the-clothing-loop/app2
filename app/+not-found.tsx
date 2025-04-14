import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, useNavigation } from "expo-router";
import { useMemo } from "react";

export default function NotFoundScreen() {
  const navigation = useNavigation();

  const currentPage = useMemo(() => navigation.getState(), [navigation]);
  return (
    <Box className="flex-1 items-center justify-center gap-8">
      <VStack className="items-center gap-1">
        <Text size="3xl" bold>
          404
        </Text>
        <Text size="lg">This page doesn't exist.</Text>
        <Text size="md">
          {currentPage?.index} {currentPage?.type}
        </Text>
      </VStack>
      <Link href="/(auth)/(tabs)/(index)" asChild>
        <Button size="xl">
          <ButtonText>Go to home screen!</ButtonText>
        </Button>
      </Link>
    </Box>
  );
}
