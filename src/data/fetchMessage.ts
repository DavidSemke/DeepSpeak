import { fetchError, fetchMany, fetchPost } from "./fetchAny";
import { Message } from "../types/apiData";


export async function getManyMessages(
    roomId: string,
    orderBy='topic', 
    order='asc', 
    limit=10, 
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
    
    throw fetchError(json)
}

type MessageBody = {
    content: string
}

export async function postMessage(
    roomId: string,
    body: MessageBody
): Promise<null> {
    const json = await fetchPost(
        `/rooms/${roomId}/messages`,
        body
    )

    if (json === null) {
        return null
    }
    
    throw fetchError(json)
}