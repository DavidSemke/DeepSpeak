import Cookies from "js-cookie";
import type { JoinedRoomDict } from "../types/cookie";
import { 
    fetchPost, 
    fetchDelete, 
    fetchArrayValidationError 
} from "./fetchAny";
import { authFailError } from "../errors/basicError";


export async function postUser(
    roomId: string,
    body: FormData
) {
    const { json } =  await fetchPost(
        `/rooms/${roomId}/users`,
        body
    )

    if ('token' in json) {
        let joinedRoomDict: JoinedRoomDict = {}
        const joinedRoomsJson = Cookies.get('joinedRooms')

        if (joinedRoomsJson !== undefined) {
            joinedRoomDict = JSON.parse(joinedRoomsJson)
        }

        joinedRoomDict[roomId] = {
            token: json.token as string,
            user: body.get('user') as string
        }
        Cookies.set('joinedRooms', JSON.stringify(joinedRoomDict))

        return
    }
    
    throw fetchArrayValidationError(json)
}

export async function deleteUser(
    roomId: string,
    user: string
) {
    let joinedRoomDict: JoinedRoomDict = {}
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson === undefined) {
        throw authFailError('cookie missing')
    }

    joinedRoomDict = JSON.parse(joinedRoomsJson)
    const token = joinedRoomDict[roomId]?.token

    if (token === undefined) {
        throw authFailError('JWT missing')
    }
    
    const result =  await fetchDelete(
        `/rooms/${roomId}/users`,
        user,
        {
            'Authorization': `Bearer ${token}`
        }
    )

    if (result === null) {
        // Remove now useless token
        delete joinedRoomDict[roomId]
        Cookies.set('joinedRooms', JSON.stringify(joinedRoomDict))
        
        return
    }
    
    throw fetchArrayValidationError(result.json)
}