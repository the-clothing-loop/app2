import axios from "./axios";

export interface ChatGetTypeResponse {
  chat_type: string;
  chat_url: string;
}
export interface ChatPatchTypeRequest {
  chain_uid: string;
  chat_type: string;
  chat_url: string;
}

export function chatTypeGet(chain_uid: string) {
  return axios.get<ChatGetTypeResponse>(`/v2/chat/type`, {
    params: {
      chain_uid,
    },
  });
}

export function chatTypePatch(body: ChatPatchTypeRequest) {
  return axios.patch<never>(`/v2/chat/type`, body);
}
