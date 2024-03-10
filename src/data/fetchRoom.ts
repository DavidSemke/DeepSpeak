import { fetchMany, fetchPost } from "./fetchAny";


export async function getManyRooms(
    orderBy='topic', 
    order='asc', 
    limit=10, 
    offset=0
): Promise<Object | boolean> {
    return await fetchMany(
        '/rooms',
        orderBy, 
        order, 
        limit, 
        offset
    )
}

type RoomBody = {
    topic: string,
    'max-user-count': number
}

export async function postRoom(
    body: RoomBody
): Promise<Object | boolean> {
    return await fetchPost(
        '/rooms',
        body
    )
}