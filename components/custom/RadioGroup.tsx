import { useMemo } from "react";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "../ui/radio";
import { CircleIcon } from "../ui/icon";

export default function RadioGroupItems<
  T extends { id: string; value: string; label: string }
>(props: {
  selectedIndex: number;
  defaultValue?: string;
  setSelectedIndex: (n: number) => void;
  items: T[];
}) {
  function handleValueChange(v: string) {
    const index = props.items.findIndex((item) => item.value == v);
    props.setSelectedIndex(index);
  }
  const selectedValue = useMemo(() => {
    return props.items.at(props.selectedIndex)?.value;
  }, [props.selectedIndex]);
  return (
    <RadioGroup
      aria-labelledby="Select one item"
      value={selectedValue}
      onChange={handleValueChange}
    >
        {props.items.map((item, i) => {
          return (
            <Radio value={item.value} key={item.value} size="md">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>
          {item.label}</RadioLabel></Radio>
          
          );
        })}
      </RadioGroup>
  );
}
