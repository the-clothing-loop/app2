import { Store } from "@tanstack/react-store";

// import Client4 from "@/utils/mattermost-client4-rn/client";
// import { WebSocketClient } from "@/utils/mattermost-client4-rn/websocketclient";
import { UserProfile } from "@mattermost/types/users";
import { chatJoinChannels, chatPatchUser } from "@/api/chat";
import { Chain, UID } from "@/api/types";
import { chainUpdate } from "@/api/chain";
import {
  createChatInstance,
  utils,
  setConfig,
  IChatE2EE,
} from "@chat-e2ee/service";

export enum ChatConnStatus {
  Loading,
  LoggedIn,
  Error,
}

export type AppType =
  | "off"
  | "clothingloop"
  | "signal"
  | "whatsapp"
  | "telegram";

export type MmState = "loading" | "error" | "success";

const CHAT_URL = "mm.clothingloop.org";

// prettier-ignore
//@ts-expect-error
export const globalChatState:{ _chat?: IChatE2EE } = (globalThis["mattermost"] ? globalThis["mattermost"] : ((globalThis["mattermost"] = {})) as { _chat?: IChatE2EE });
const setGlobalChatState = (s: IChatE2EE | undefined) => {
  //@ts-expect-error
  globalThis["mattermost"]._chat = s;
};

export const chatStore = new Store({
  appType: null as AppType | null,
  chatUrl: "",
  mmState: "loading" as MmState,
  // state: {} as RequiredOrEmpty<State>,
  // async init(chainUID: UID) {
  //   const data = await chatPatchUser(chainUID).then((res) => res.data);
  //   console.log("chat patch user", data);
  // await chatJoinChannels(chainUID);
  // const client = await Client4.initialize(CHAT_URL);
  // await client.login(data.chat_user_name + "@example.com", data.chat_pass);
  // const socket = await WebSocketClient.initialize(CHAT_URL, client.token);
  // chatStore.setState((s) => ({
  //   ...s,
  //   state: {
  //     chat_team: data.chat_team,
  //     chat_user: data.chat_user_id,
  //     chat_pass: data.chat_pass,
  //     client,
  //     socket,
  //     user_profiles: {},
  //   },
  // }));
  // },
});


export async function chatStoreInit(userID: UID, chain: Chain) {
  const chat_room_ids = [];
  try {
    if (!globalChatState._chat) {
      globalChatState._chat = createChatInstance();
      await globalChatState._chat.init();
    }
    // globalChatState._chat.

    let hash:string
    if (chain.chat_room_ids?.length)       hash = chain.chat_room_ids[0];
    else hash = await globalChatState._chat.getLink().then(res=>res.hash);

    await globalChatState._chat.setChannel(hash, userID);
    globalChatState._chat.
    if (expired || deleted) {
    }

    if (!chain.chat_room_ids) {
    }
    console.log("chatPatchUser", data);
    // await chatJoinChannels(chainUID);
    const client = await Client4.initialize(CHAT_URL);
    console.log("Client4.initialize", client);
    await client.login(data.chat_user_name + "@example.com", data.chat_pass);
    // const socket = await WebSocketClient.initialize(CHAT_URL, client.token);
    setGlobalChatState({
      chat_team: data.chat_team,
      chat_user: data.chat_user_id,
      chat_pass: data.chat_pass,
      client,
      // socket,
      // user_profiles: {},
    });
    chatStore.setState((s) => ({
      ...s,
      mmState: "success",
    }));
    // chatStore.setState((s) => ({
    //   ...s,
    //   state: {
    //
    //   },
    // }));
  } catch (err) {
    console.error("error on chatStoreInit", err);
    chatStore.setState((s) => ({
      ...s,
      mmState: "error",
    }));
  }
}

export function chatStoreClose() {
  // chatStore.state.state.socket?.close();
}
