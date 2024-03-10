import { fetchMany, fetchPost } from "./fetchAny";


export async function getManyMessages(
    roomId: string,
    orderBy='topic', 
    order='asc', 
    limit=10, 
    offset=0
): Promise<Object | boolean> {
    return await fetchMany(
        `/rooms/${roomId}/messages`,
        orderBy, 
        order, 
        limit, 
        offset
    )
}

type MessageBody = {
    content: string,
    user: string
}

export async function postMessage(
    roomId: string,
    body: MessageBody
): Promise<Object | boolean> {
    return await fetchPost(
        `/rooms/${roomId}/messages`,
        body
    )
}