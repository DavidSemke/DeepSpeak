import Cookies from 'js-cookie'
import { 
    fetchMany, 
    fetchGet, 
    fetchPost, 
    fetchArrayValidationError
} from "./fetchAny";
import type { Room } from "../types/api";
import type { JoinedRoomDict } from '../types/cookie';


export async function getManyRooms(
    orderBy='topic', 
    order='asc', 
    limit=12, 
    offset=0
): Promise<Room[]> {
    const { json } = await fetchMany(
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

/*
    Returns null if failed fetch is due to outdated jwt
*/
export async function getRoom(
    roomId: string
): Promise<Room | null> {
    const { status, json } = await fetchGet('/rooms', roomId)

    if (status === 404) {
        // Remove useless cookie data if present
        const joinedRoomsJson = Cookies.get('joinedRooms')

        if (joinedRoomsJson !== undefined) {
            const joinedRoomDict: JoinedRoomDict = JSON.parse(joinedRoomsJson)

            if (joinedRoomDict[roomId]) {
                delete joinedRoomDict[roomId]
                Cookies.set('joinedRooms', JSON.stringify(joinedRoomDict))

                return null
            }
        }
    }

    if ('room' in json) {
        return json.room as Room
    }

    throw fetchArrayValidationError(json)
}

export async function postRoom(
    body: FormData
): Promise<Room> {
    const {json} = await fetchPost(
        '/rooms',
        body
    )

    if ('room' in json) {
        return json.room as Room
    }

    throw fetchArrayValidationError(json)
}