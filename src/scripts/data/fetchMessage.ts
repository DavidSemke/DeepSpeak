import {
  fetchMany,
  fetchPost,
  fetchArrayValidationError,
  fetchGet,
} from "./fetchAny"
import type { Message } from "../utils/types"
import { authFailError, resource404Error } from "../errors/errorFactory"
import { deleteJoinedRoomKey, getJoinedRoomValue } from "../utils/cookie"

export async function getManyMessages(
  roomId: string,
  orderBy = "topic",
  order: "asc" | "desc" = "asc",
  limit: number | null = null,
  offset: number | null = null,
  ids: string[] | null = null,
): Promise<Message[]> {
  const fetch = await fetchMany(
    `/rooms/${roomId}/messages`,
    orderBy,
    order,
    limit,
    offset,
    null,
    ids,
  )

  if (fetch === null) {
    return [] as Message[]
  }

  const { status, json } = fetch

  if ("message_collection" in json) {
    return json.message_collection as Message[]
  }

  if (status === 404) {
    deleteJoinedRoomKey(roomId)
    throw resource404Error("room")
  }

  throw fetchArrayValidationError(json)
}

export async function postMessage(
  roomId: string,
  body: FormData,
): Promise<Message> {
  const value = getJoinedRoomValue(roomId)
  const token = value?.token

  if (token === undefined) {
    throw authFailError("JWT missing")
  }

  const { status, json } = await fetchPost(`/rooms/${roomId}/messages`, body, {
    Authorization: `Bearer ${token}`,
  })

  if ("message" in json) {
    return json.message as Message
  }

  if (status === 404) {
    deleteJoinedRoomKey(roomId)
    throw resource404Error("room")
  } else if (status === 401 || status === 403) {
    deleteJoinedRoomKey(roomId)
  }

  throw fetchArrayValidationError(json)
}

export async function getMessage(
  roomId: string,
  messageId: string,
): Promise<Message> {
  const { status, json } = await fetchGet(
    `/rooms/${roomId}/messages`,
    messageId,
  )

  if ("message" in json) {
    return json.message as Message
  }

  if (status === 404) {
    deleteJoinedRoomKey(roomId)
    throw resource404Error("message")
  }

  throw fetchArrayValidationError(json)
}
