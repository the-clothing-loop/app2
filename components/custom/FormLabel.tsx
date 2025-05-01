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
import { HStack } from "../ui/hstack";

export default function FormLabel(
  props: PropsWithChildren<{
    label: string;
    error?: string | undefined;
    isDisabled?: boolean;
    horizontal?: boolean;
  }>,
) {
  if (props.horizontal) {
    return (
      <FormControl isDisabled={props.isDisabled} isInvalid={!!props.error}>
        <HStack className="justify-between py-3">
          <FormControlLabel key="form-label">
            <FormControlLabelText>{props.label}</FormControlLabelText>
          </FormControlLabel>
          {props.children}
        </HStack>
        <FormControlError key="form-err">
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{props.error}</FormControlErrorText>
        </FormControlError>
      </FormControl>
    );
  }

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
