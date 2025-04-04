import { ScrollView } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";
import { useStore } from "@tanstack/react-store";
import { authStore, authStoreCurrentChainAdmin } from "@/store/auth";
import { TFunction, TOptionsBase } from "i18next";
import { useMemo } from "react";
import { ExternalPathString, Link } from "expo-router";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  type LucideIcon,
} from "lucide-react-native";
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
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import RefreshControl from "@/components/custom/RefreshControl";
import Donate from "@/components/custom/Donate";

interface MediaIcon {
  icon: LucideIcon;
  label: string;
  url: string;
  color: string;
}
const mediaIcons: MediaIcon[] = [
  {
    icon: Instagram,
    label: "Instagram",
    url: "https://www.instagram.com/theclothingloop/",
    color: "#EB4141",
  },
  {
    icon: Mail,
    label: "Email",
    url: "mailto:hello@clothingloop.org",
    color: "#b464a8",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/the-clothing-loop/",
    color: "#0a66c2",
  },
  {
    icon: Facebook,
    label: "Facebook",
    url: "https://www.facebook.com/clothingloop/",
    color: "#1b74e4",
  },
];

export const faqListKeys = [
  "howDoesItWork",
  "whereAreTheBags",
  "whoDoIGiveTheBagTo",
  "whatCanYouTakeFromTheBag",
  "whatCantYouTakeFromTheBag",
  "whatToDoWithBulkyItems",
  "awayOrBusy",
  "foundSomethingYouLike",
  "newMembers",
  "privacy",
  "feedback",
];

export interface FaqListItem {
  title: string;
  content: string;
}

const faqI18nOptions: TOptionsBase = {
  ns: "faq",
  returnObjects: true,
  defaultValue: {
    title: "🔴 Error",
    content: "Translation not found",
  },
};
function useFaqDefault(t: TFunction<"faq">) {
  return useMemo(() => {
    return faqListKeys.map((k) => {
      return t(k, faqI18nOptions as string) as any as FaqListItem;
    });
  }, [t]);
}

function useFaqCustom(): undefined | FaqListItem[] {
  const currentChain = useStore(authStore, (s) => s.currentChain);
  return useMemo(() => {
    if (!currentChain?.rules_override) return undefined;
    const json = JSON.parse(currentChain.rules_override);
    if (Array.isArray(json)) {
      return json as FaqListItem[];
    }
    return undefined;
  }, [currentChain]);
}

export default function HomeScreen(props: {}) {
  const isDarkTheme = useColorScheme() == "dark";
  const { t: tFaq } = useTranslation("faq");
  const hosts = useStore(authStoreCurrentChainAdmin);
  const { t } = useTranslation();
  const rulesDefault = useFaqDefault(tFaq);
  const rulesCustom = useFaqCustom();
  const rules = useMemo(() => {
    return (rulesCustom || rulesDefault).map((r, i) => ({
      ...r,
      key: r.title + i,
      content: r.content.split("\n"),
    }));
  }, [rulesCustom, rulesDefault]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl />}
    >
      <Accordion type="multiple" isCollapsible>
        {rules.map((r) => (
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
        ))}
      </Accordion>
      <Box className="flex-col gap-4 bg-background-0 py-4">
        <VStack className="gap-3">
          <Text className="text-center">
            {t("loopHost", { count: hosts?.length || 0 })}
          </Text>

          <HStack className="mx-2 flex-wrap justify-center gap-2">
            {!hosts ? (
              <Text key="loading">{t("loading")}</Text>
            ) : hosts.length == 0 ? (
              <Text key="empty">{t("empty")}</Text>
            ) : (
              hosts.map((u) => (
                <Link key={u.uid} href={`../route/${u.uid}`} asChild>
                  <Button key={u.uid} action="secondary">
                    <ButtonText>{u.name}</ButtonText>
                  </Button>
                </Link>
              ))
            )}
          </HStack>
        </VStack>
        <VStack className="gap-3">
          <Text className="text-center">{t("organization")}</Text>

          <HStack className="justify-center gap-4">
            {mediaIcons.map((m) => (
              <VStack className="items-center gap-2" key={m.label}>
                <Link href={m.url as ExternalPathString} asChild>
                  <Button
                    className="aspect-square rounded-full"
                    variant="outline"
                  >
                    <ButtonIcon as={m.icon} color={m.color}></ButtonIcon>
                  </Button>
                </Link>
                <Text className="text-sm">{m.label}</Text>
              </VStack>
            ))}
          </HStack>

          <Link href="https://www.clothingloop.org/" asChild>
            <Button variant="link">
              <ButtonText>www.clothingloop.org</ButtonText>
            </Button>
          </Link>
        </VStack>
      </Box>
      <Donate />
    </ScrollView>
  );
}
