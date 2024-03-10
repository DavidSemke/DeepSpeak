import { fetchPost, fetchDelete } from "./fetchAny";


type UserBody = {
    user: string
}

export async function postUser(
    roomId: string,
    body: UserBody
): Promise<Object | boolean> {
    return await fetchPost(
        `/rooms/${roomId}/users`,
        body
    )
}

export async function deleteUser(
    roomId: string,
    user: string
): Promise<Object | boolean> {
    return await fetchDelete(
        `/rooms/${roomId}/users`,
        user
    )
}