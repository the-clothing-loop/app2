import SignalApp from "@/components/custom/im/signal.svg";
import Sms from "@/components/custom/im/sms.svg";
import Telegram from "@/components/custom/im/telegram.svg";
import Whatsapp from "@/components/custom/im/whatsapp.svg";
import ClothingLoopApp from "@/components/custom/im/clothingloop.svg";
import React from "react";
import { SvgProps } from "react-native-svg";
import colors from "tailwindcss/colors";

interface MessagingApp {
  key: string;
  title: string;
  link: (n: string) => string;
  bgColor: string;
  fgColor: string;
  source: React.FC<SvgProps>;
}

export const messagingApps: MessagingApp[] = [
  {
    key: "signal",
    title: "Signal",
    link: (p: string) => `https://signal.me/#p/${p}`,
    bgColor: "#2c6bed",
    fgColor: colors.white,
    source: SignalApp,
  },
  {
    key: "sms",
    title: "SMS",
    link: (n) => `sms:${n}`,
    bgColor: "#89f86a",
    fgColor: colors.black,
    source: Sms,
  },
  {
    key: "whatsapp",
    title: "WhatsApp",
    link: (n) => `https://wa.me/${n}`,
    bgColor: "#25d366",
    fgColor: colors.black,
    source: Whatsapp,
  },
  {
    key: "telegram",
    title: "Telegram",
    link: (n) => `https://t.me/+${n}`,
    bgColor: "#29a9eb",
    fgColor: colors.white,
    source: Telegram,
  },
];

export const messageAppMattermost: MessagingApp = {
  key: "clothingloop",
  title: "Clothing Loop",
  link: (_: string) => "",
  bgColor: "#1e325c",
  fgColor: colors.white,
  source: ClothingLoopApp,
};
