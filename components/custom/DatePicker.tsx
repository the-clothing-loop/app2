import { useMemo, useState } from "react";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import {
  DatePickerMultipleProps,
  DatePickerRangeProps,
  DatePickerSingleProps,
} from "react-native-ui-datepicker/lib/typescript/datetime-picker";
import { VStack } from "../ui/vstack";
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "../ui/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

export default function DatePickerSingleItem({
  value,
  setValue,
  title,
  ...props
}: {
  value: Date;
  title: string;
  setValue: (v: Date) => void;
} & Omit<DatePickerSingleProps, "mode">) {
  const defaultStyles = useDefaultStyles();
  const dateText = useMemo(() => value.toLocaleDateString(), [value]);

  return (
    <Accordion
      size="md"
      type="single"
      variant="unfilled"
      className="border border-outline-200"
    >
      <AccordionItem value="a">
        <AccordionHeader>
          <AccordionTrigger>
            {({ isExpanded }) => {
              return (
                <>
                  <HStack className="flex-grow items-center justify-between">
                    <Text bold size="md">
                      {title + ":"}
                    </Text>
                    <Text className="bg-background-100 p-2 font-normal">
                      {dateText}
                    </Text>
                  </HStack>
                  {isExpanded ? (
                    <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                  ) : (
                    <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                  )}
                </>
              );
            }}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <DateTimePicker
            styles={defaultStyles}
            {...props}
            mode="single"
            date={value}
            onChange={({ date }) => setValue(date as Date)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
