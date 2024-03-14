import { fetchMany, fetchGet, fetchPost, fetchError } from "./fetchAny";
import { Room } from "../types/apiData";


export async function getManyRooms(
    orderBy='topic', 
    order='asc', 
    limit=10, 
    offset=0
): Promise<Room[]> {
    const json = await fetchMany(
        '/rooms',
        orderBy, 
        order, 
        limit, 
        offset
    )

    if ('room_collection' in json) {
        return json.room_collection as Room[]
    }
    
    throw fetchError(json)
}

export async function getRoom(
    roomId: string
): Promise<Room> {
    const json = await fetchGet('/rooms', roomId)

    if ('room' in json) {
        return json.room as Room
    }
    
    throw fetchError(json)
}

type RoomBody = {
    topic: string,
    'max-user-count': number
}

export async function postRoom(
    body: RoomBody
): Promise<null> {
    const json = await fetchPost(
        '/rooms',
        body
    )

    if (json === null) {
        return null
    }

    throw fetchError(json)
}