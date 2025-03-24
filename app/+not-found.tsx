import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <Box className="items-center justify-center gap-2">
      <Text size="xl">This screen doesn't exist.</Text>
      <Link href="/" asChild>
        <Button>Go to home screen!</Button>
      </Link>
    </Box>
  );
}
