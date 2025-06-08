import { ISwitchProps } from "@gluestack-ui/switch/lib/types";
import { Box } from "../ui/box";
import { Switch } from "../ui/switch";
import { SwitchProps } from "react-native";

export default function ReadOnlySwitch(props: ISwitchProps & SwitchProps) {
  return (
    <Box className="relative">
      <Box className="absolute inset-0 z-10" />
      <Switch {...props} />
    </Box>
  );
}
