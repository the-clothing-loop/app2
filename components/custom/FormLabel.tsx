import { PropsWithChildren } from "react";
import { FormControl, FormControlLabel } from "../ui/form-control";

export default function FormLabel(props: PropsWithChildren<{ label: string }>) {
  return (
    <FormControl>
      <FormControlLabel>{props.label}</FormControlLabel>
      {props.children}
    </FormControl>
  );
}
