import { PropsWithChildren } from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "lucide-react-native";

export default function FormLabel(
  props: PropsWithChildren<{
    label: string;
    error?: string | undefined;
    isDisabled?: boolean;
  }>,
) {
  return (
    <FormControl isDisabled={props.isDisabled} isInvalid={!!props.error}>
      <FormControlLabel key="form-label">
        <FormControlLabelText>{props.label}</FormControlLabelText>
      </FormControlLabel>
      {props.children}
      <FormControlError key="form-err">
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{props.error}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
