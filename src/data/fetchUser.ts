import Cookies from "js-cookie";
import { JwtDict } from "../types/cookie";
import { fetchPost, fetchDelete, fetchError } from "./fetchAny";


export async function postUser(
    roomId: string,
    body: FormData
): Promise<void> {
    const json =  await fetchPost(
        `/rooms/${roomId}/users`,
        body
    )

    if ('token' in json) {
        let jwtDict: JwtDict = {}
        const jwtJSON = Cookies.get('jwts')

        if (jwtJSON !== undefined) {
            jwtDict = JSON.parse(jwtJSON)
        }

        jwtDict[roomId] = json.token as string
        Cookies.set('jwts', JSON.stringify(jwtDict))
    }
    
    throw fetchError(json)
}

export async function deleteUser(
    roomId: string,
    user: string
): Promise<null> {
    let jwtDict: JwtDict = {}
    const jwtJSON = Cookies.get('jwts')

    if (jwtJSON !== undefined) {
        jwtDict = JSON.parse(jwtJSON)
    }

    const token = jwtDict[roomId]

    if (token === undefined) {
        throw new Error('Authorization failed - JWT missing')
    }
    
    const json =  await fetchDelete(
        `/rooms/${roomId}/users`,
        user,
        {
            'Authorization': `Bearer ${token}`
        }
    )

    // remove now useless token
    delete jwtDict[roomId]
    Cookies.set('jwts', JSON.stringify(jwtDict))

    if (json === null) {
        return null
    }
    
    throw fetchError(json)
}