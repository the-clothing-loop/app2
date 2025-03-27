import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import { ScrollView } from "react-native";

export default function Change() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Accordion type="multiple" isCollapsible>
        {/* {rules.map((r) => (
          <AccordionItem key={r.key} value={r.key}>
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>{r.title}</AccordionTitleText>
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
              {r.content.map((p, ii) => (
                <AccordionContentText key={r.key + ii}>
                  {p}
                </AccordionContentText>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))} */}
      </Accordion>
    </ScrollView>
  );
}
