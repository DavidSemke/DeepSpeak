import {
  fetchMany,
  fetchGet,
  fetchPost,
  fetchArrayValidationError,
} from "./fetchAny"
import type { Room } from "../utils/types"
import { deleteJoinedRoomKey } from "../utils/cookie"
import { resource404Error } from "../errors/errorFactory"

export async function getManyRooms(
  orderBy = "topic",
  order: "asc" | "desc" = "asc",
  limit: number | null = null,
  offset: number | null = null,
  populate: string | null = null,
  ids: string[] | null = null,
): Promise<Room[]> {
  const fetch = await fetchMany(
    "/rooms",
    orderBy,
    order,
    limit,
    offset,
    populate,
    ids,
  )

  if (fetch === null) {
    return [] as Room[]
  }

  const { json } = fetch

  if ("room_collection" in json) {
    return json.room_collection as Room[]
  }

  throw fetchArrayValidationError(json)
}

export async function getRoom(roomId: string): Promise<Room> {
  const { status, json } = await fetchGet("/rooms", roomId)

  if ("room" in json) {
    return json.room as Room
  }

  if (status === 404) {
    deleteJoinedRoomKey(roomId)
    throw resource404Error("room")
  }

  throw fetchArrayValidationError(json)
}

export async function postRoom(body: FormData): Promise<Room> {
  const { json } = await fetchPost("/rooms", body)

  if ("room" in json) {
    return json.room as Room
  }

  throw fetchArrayValidationError(json)
}
