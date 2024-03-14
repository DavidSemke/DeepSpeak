import { fetchPost, fetchDelete, fetchError } from "./fetchAny";


type UserBody = {
    user: string
}

export async function postUser(
    roomId: string,
    body: UserBody
): Promise<string> {
    const json =  await fetchPost(
        `/rooms/${roomId}/users`,
        body
    ) as Object

    if ('token' in json) {
        return json.token as string
    }
    
    throw fetchError(json)
}

export async function deleteUser(
    roomId: string,
    user: string
): Promise<null> {
    const json =  await fetchDelete(
        `/rooms/${roomId}/users`,
        user
    )

    if (json === null) {
        return null
    }
    
    throw fetchError(json)
}