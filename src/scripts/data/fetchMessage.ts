import Cookies from "js-cookie";
import { 
    fetchMany, 
    fetchPost, 
    fetchArrayValidationError
} from "./fetchAny";
import type { Message } from "../types/api";
import type { JwtDict } from "../types/cookie";


export async function getManyMessages(
    roomId: string,
    orderBy='topic', 
    order='asc', 
    limit=12, 
    offset=0
): Promise<Message[]> {
    const json = await fetchMany(
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
    let jwtDict: JwtDict = {}
    const jwtJSON = Cookies.get('jwts')

    if (jwtJSON !== undefined) {
        jwtDict = JSON.parse(jwtJSON)
    }

    const token = jwtDict[roomId]

    if (token === undefined) {
        throw new Error('Authorization failed - JWT missing')
    }

    const json = await fetchPost(
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