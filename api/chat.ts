import axios from "./axios";
import { UID } from "./types";
import {
  ChatGetTypeRequest,
  ChatGetTypeResponse,
  ChatMessage,
  ChatMessageCreateRequest,
  ChatPatchTypeRequest,
  ChatRoom,
  ChatRoomEditRequest,
  ChatRoomListQuery,
  ChatRoomListResponse,
  ChatRoomMessageListQuery,
  ChatRoomMessageListResponse,
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

export function chatRoomCreate(body: Omit<ChatRoom, "id" | "created_at">) {
  return axios.post<never>("/v2/chat/room/create", body);
}

export function chatRoomList(chain_uid: UID) {
  return axios.get<ChatRoomListResponse>("/v2/chat/rooms", {
    params: {
      chain_uid,
    } satisfies ChatRoomListQuery,
  });
}

export function chatRoomEdit(body: ChatRoomEditRequest) {
  return axios.patch<never>("/v2/chat/room/edit", body);
}

export function chatRoomMessageList(params: ChatRoomMessageListQuery) {
  return axios.get<ChatRoomMessageListResponse>("/v2/chat/room/messages", {
    params,
  });
}

export function chatRoomMessageCreate(body: ChatMessageCreateRequest) {
  return axios.post<never>("/v2/chat/room/message/create", body);
}
