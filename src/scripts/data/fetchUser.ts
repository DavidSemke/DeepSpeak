import { 
    fetchPost, 
    fetchDelete, 
    fetchArrayValidationError 
} from "./fetchAny";
import { authFailError, resource404Error } from "../errors/errorFactory";
import { 
    insertJoinedRoomKey, 
    deleteJoinedRoomKey,
    getJoinedRoomValue
} from "../utils/cookie";


export async function postUser(
    roomId: string,
    body: FormData
) {
    const { status, json } =  await fetchPost(
        `/rooms/${roomId}/users`,
        body
    )

    if ('token' in json) {
        insertJoinedRoomKey(
            roomId,
            {
                token: json.token as string,
                user: body.get('user') as string
            }
        )
        return
    }

    if (status === 404) {
        deleteJoinedRoomKey(roomId)
        throw resource404Error('room')
    }
    
    throw fetchArrayValidationError(json)
}

export async function deleteUser(
    roomId: string,
    user: string
) {
    const value = getJoinedRoomValue(roomId)
    const token = value?.token

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

    deleteJoinedRoomKey(roomId)

    if (result === null) {
        return
    }
    
    const {status, json} = result

    if (status === 404) {
        throw resource404Error('room')
    }
    
    throw fetchArrayValidationError(json)
}