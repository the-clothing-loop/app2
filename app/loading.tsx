import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export default function Loading() {
  return (
    <Box className="flex-col items-center justify-center gap-4 bg-background-0">
      <Avatar>
        <AvatarImage src={require("../assets/images/logo512.png")} />
      </Avatar>

      <Text>The Clothing Loop</Text>
    </Box>
  );
}
