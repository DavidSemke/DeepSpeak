import { 
    fetchMany, 
    fetchGet, 
    fetchPost, 
    fetchArrayValidationError
} from "./fetchAny";
import type { Room } from "../types/api";


export async function getManyRooms(
    orderBy='topic', 
    order='asc', 
    limit=12, 
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
    
    throw fetchArrayValidationError(json)
}

export async function getRoom(
    roomId: string
): Promise<Room> {
    const json = await fetchGet('/rooms', roomId)

    if ('room' in json) {
        return json.room as Room
    }
    
    throw fetchArrayValidationError(json)
}

export async function postRoom(
    body: FormData
): Promise<Room> {
    const json = await fetchPost(
        '/rooms',
        body
    )

    if ('room' in json) {
        return json.room as Room
    }

    throw fetchArrayValidationError(json)
}