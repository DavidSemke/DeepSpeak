import Cookies from "js-cookie";
import { 
    fetchMany, 
    fetchPost, 
    fetchArrayValidationError,
    fetchGet
} from "./fetchAny";
import type { Message } from "../types/api";
import type { JoinedRoomDict } from "../types/cookie";
import { authFailError } from "../errors/basicError";


export async function getManyMessages(
    roomId: string,
    orderBy='create_date', 
    order='asc', 
    limit=100, 
    offset=0
): Promise<Message[]> {
    const {json} = await fetchMany(
        `/rooms/${roomId}/messages`,
        orderBy, 
        order, 
        limit, 
        offset
    )

    if ('message_collection' in json) {
        return json.message_collection as Message[]
    }
    
    throw fetchArrayValidationError(json)
}

export async function postMessage(
    roomId: string,
    body: FormData
): Promise<Message> {
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson === undefined) {
        throw authFailError('cookie missing')
    }

    const joinedRoomDict: JoinedRoomDict = JSON.parse(joinedRoomsJson)
    const token = joinedRoomDict[roomId].token

    if (token === undefined) {
        throw authFailError('JWT missing')
    }

    const {json} = await fetchPost(
        `/rooms/${roomId}/messages`,
        body,
        {
            'Authorization': `Bearer ${token}`
        }
    )

    if ('message' in json) {
        return json.message as Message
    }
    
    throw fetchArrayValidationError(json)
}

export async function getMessage(
    roomId: string,
    messageId: string
): Promise<Message> {
    const {json} = await fetchGet(
        `/rooms/${roomId}/messages`, 
        messageId
    )

    if ('message' in json) {
        return json.message as Message
    }

    throw fetchArrayValidationError(json)
}