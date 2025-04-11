import { Store } from "@tanstack/react-store";

// import Client4 from "@/utils/mattermost-client4-rn/client";
// import { WebSocketClient } from "@/utils/mattermost-client4-rn/websocketclient";
import { UserProfile } from "@mattermost/types/users";
import { chatJoinChannels, chatPatchUser } from "@/api/chat";
import { UID } from "@/api/types";

export enum ChatConnStatus {
  Loading,
  LoggedIn,
  Error,
}

type RequiredOrEmpty<T> = T | Partial<Record<keyof T, undefined>>;

export type AppType =
  | "off"
  | "clothingloop"
  | "signal"
  | "whatsapp"
  | "telegram";

type State = {
  chat_team: string;
  chat_user: string;
  chat_pass: string;
  // client: Client4;
  // socket: WebSocketClient;
  user_profiles: Record<string, UserProfile>;
};

const CHAT_URL = "mm.clothingloop.org";

export const chatStore = new Store({
  appType: null as AppType | null,
  chatUrl: "",
  state: {} as RequiredOrEmpty<State>,
  async init(chainUID: UID) {
    // const data = await chatPatchUser(chainUID).then((res) => res.data);
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
  },
  close() {
    // chatStore.state.state.socket?.close();
  },
});
