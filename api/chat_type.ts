import axios from "./axios";
import { ChatGetTypeRequest, ChatGetTypeResponse } from "./typex2";

export interface ChatPatchTypeRequest {
  chain_uid: string;
  chat_type: string;
  chat_url: string;
}

export function chatTypeGet(chain_uid: string) {
  return axios.get<ChatGetTypeResponse>(`/v2/chat/type`, {
    params: {
      chain_uid,
    } satisfies ChatGetTypeRequest,
  });
}

export function chatTypePatch(body: ChatPatchTypeRequest) {
  return axios.patch<never>(`/v2/chat/type`, body);
}
