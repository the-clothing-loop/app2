import { Image, StyleSheet, Platform, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Button,
  Card,
  Layout,
  ListItem,
  Menu,
  MenuGroup,
  Text,
  ThemeType,
  useTheme,
} from "@ui-kitten/components";
import { useStore } from "@tanstack/react-store";
import { authStore, authStoreCurrentChainAdmin } from "@/store/auth";
import { TFunction, TOptionsBase } from "i18next";
import { PropsWithChildren, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowDownIcon,
  ArrowUpIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  LucideIcon,
  MailIcon,
} from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ExternalPathString, Link } from "expo-router";

interface MediaIcon {
  icon: LucideIcon;
  label: string;
  url: string;
  color: string;
}
const mediaIcons: MediaIcon[] = [
  {
    icon: InstagramIcon,
    label: "Instagram",
    url: "https://www.instagram.com/theclothingloop/",
    color: "#EB4141",
  },
  {
    icon: MailIcon,
    label: "Email",
    url: "mailto:hello@clothingloop.org",
    color: "#b464a8",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/the-clothing-loop/",
    color: "#0a66c2",
  },
  {
    icon: FacebookIcon,
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
  const rulesDefault = useFaqDefault(tFaq);
  const hosts = useStore(authStoreCurrentChainAdmin);
  const theme = useTheme();
  const { t } = useTranslation();
  const rulesCustom = useFaqCustom();
  const rules = rulesCustom || rulesDefault;
  const [indexOpenRuleList, setIndexOpenRuleList] = useState<number>();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: theme["color-basic-400"],
        dark: theme["color-basic-400"],
      }}
      headerImage={
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Image
            source={
              isDarkTheme
                ? require("@/assets/images/v2_logo_white.png")
                : require("@/assets/images/v2_logo_black.png")
            }
            style={[styles.reactLogo, { resizeMode: "contain" }]}
          />
        </View>
      }
    >
      <Layout style={{ gap: 14, paddingBottom: 28 }}>
        <View style={{ gap: 8 }}>
          <Text category="h3" style={{ marginBottom: 4 }}>
            {t("howDoesItWork")}
          </Text>
          <View>
            {rules.map((r, i) => (
              <ListItemDetails
                theme={theme}
                title={r.title}
                keyPrefix={i + r.title.slice(4)}
                isOpen={indexOpenRuleList == i}
                setOpen={() =>
                  setIndexOpenRuleList((s) => (s === i ? undefined : i))
                }
              >
                <View>
                  {r.content.split("\n").map((p, ii) => (
                    <Text category="p1" key={ii + p.slice(4)}>
                      {p}
                    </Text>
                  ))}
                </View>
              </ListItemDetails>
            ))}
          </View>
        </View>

        <Card
          appearance="outline"
          className="border-blue-400"
          // style={{ borderColor: theme["color-basic-500"] }}
        >
          <Text style={{ textAlign: "center", marginBottom: 14 }} category="s2">
            {t("loopHost", { count: hosts?.length || 0 })}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {hosts?.map((u) => (
              <Button key={u.uid} status="basic">
                {u.name}
              </Button>
            ))}
          </View>
        </Card>

        <Card
          appearance="outline"
          style={{ borderColor: theme["color-basic-500"] }}
        >
          <Text style={{ textAlign: "center", marginBottom: 14 }} category="s2">
            {t("organization")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {mediaIcons.map((m) => (
              <View
                style={{
                  flexDirection: "column",
                  width: 70,
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <Link href={m.url as ExternalPathString} asChild>
                  <Button
                    style={{
                      borderRadius: "100%",
                      width: 36,
                      height: 36,
                    }}
                    status="basic"
                  >
                    <m.icon size={26} color={m.color} />
                  </Button>
                </Link>
                <Text category="p2">{m.label}</Text>
              </View>
            ))}
          </View>
          <Link href="https://www.clothingloop.org/" asChild>
            <Button appearance="ghost" size="small">
              www.clothingloop.org
            </Button>
          </Link>
        </Card>
      </Layout>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 110,
    width: 170,
    bottom: 0,

    position: "absolute",
  },
});

function ListItemDetails(
  props: PropsWithChildren<{
    keyPrefix: string;
    isOpen: boolean;
    setOpen: () => void;
    title: string;
    theme: ThemeType;
  }>
) {
  return (
    <>
      <ListItem
        key={props.keyPrefix + "subject"}
        title={<Text category="s1">{props.title}</Text>}
        style={{
          backgroundColor: props.isOpen
            ? props.theme["background-basic-color-3"]
            : undefined,
        }}
        onPress={props.setOpen}
        accessoryRight={props.isOpen ? <ArrowDownIcon /> : <ArrowUpIcon />}
      />
      <View
        style={{
          display: props.isOpen ? undefined : "none",
          padding: 8,
        }}
        key={props.keyPrefix + "details"}
      >
        {props.children}
      </View>
    </>
  );
}
