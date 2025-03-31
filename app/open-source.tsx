import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  AccordionContentText,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { FlatList, SafeAreaView, ScrollView } from "react-native";
import OpenSourceLicenses from "@/assets/open_source_licenses.json";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";

export default function OpenSource() {
  return (
    <SafeAreaView>
      <Accordion>
        <FlatList
          data={OpenSourceLicenses}
          renderItem={({ item }) => {
            return (
              <AccordionItem value={item.name}>
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }) => {
                      return (
                        <>
                          <AccordionTitleText>{item.name}</AccordionTitleText>
                          {isExpanded ? (
                            <AccordionIcon
                              as={ChevronUpIcon}
                              className="ml-3"
                            />
                          ) : (
                            <AccordionIcon
                              as={ChevronDownIcon}
                              className="ml-3"
                            />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  {item.modules.map((module, i) => (
                    <AccordionContentText key={item.name + i} className="py-1">
                      {module}
                    </AccordionContentText>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          }}
          keyExtractor={(item) => item.name}
        />
      </Accordion>
    </SafeAreaView>
  );
}
