import axios from "./axios";
import { UID } from "./types";
import {
  ChatGetTypeRequest,
  ChatGetTypeResponse,
  ChatMessage,
  ChatMessageCreateRequest,
  ChatPatchTypeRequest,
  ChatChannel,
  ChatChannelEditRequest,
  ChatChannelListQuery,
  ChatChannelListResponse,
  ChatChannelMessageListQuery,
  ChatChannelMessageListResponse,
} from "./typex2";

export function chatTypeGet(chain_uid: string) {
  return axios.get<ChatGetTypeResponse>("/v2/chat/type", {
    params: {
      chain_uid,
    } satisfies ChatGetTypeRequest,
  });
}

export function chatTypePatch(body: ChatPatchTypeRequest) {
  return axios.patch<never>("/v2/chat/type", body);
}

export function chatChannelCreate(
  body: Omit<ChatChannel, "id" | "created_at">,
) {
  return axios.post<never>("/v2/chat/channel/create", body);
}

export function chatChannelList(chain_uid: UID) {
  return axios.get<ChatChannelListResponse>("/v2/chat/channels", {
    params: {
      chain_uid,
    } satisfies ChatChannelListQuery,
  });
}

export function chatChannelEdit(body: ChatChannelEditRequest) {
  return axios.patch<never>("/v2/chat/channel/edit", body);
}

export function chatChannelMessageList(params: ChatChannelMessageListQuery) {
  return axios.get<ChatChannelMessageListResponse>(
    "/v2/chat/channel/messages",
    {
      params,
    },
  );
}

export function chatChannelMessageCreate(body: ChatMessageCreateRequest) {
  return axios.post<never>("/v2/chat/channel/message/create", body);
}
