import Cookies from "js-cookie";
import type { 
    JoinedRoomDict, 
    JoinedRoomDictValue 
} from "./types";


export function insertJoinedRoomKey(
    roomId: string, 
    data: JoinedRoomDictValue
) {
    let joinedRoomDict: JoinedRoomDict = {}
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson !== undefined) {
        joinedRoomDict = JSON.parse(joinedRoomsJson)
    }

    joinedRoomDict[roomId] = data
    Cookies.set('joinedRooms', JSON.stringify(joinedRoomDict))
}

export function deleteJoinedRoomKey(roomId: string) {
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson === undefined) {
        return
    }

    const joinedRoomDict: JoinedRoomDict = JSON.parse(joinedRoomsJson)

    if (joinedRoomDict[roomId] === undefined) {
        return
    }

    delete joinedRoomDict[roomId]
    Cookies.set('joinedRooms', JSON.stringify(joinedRoomDict))
}

export function getJoinedRoomValue(
    roomId: string
): JoinedRoomDictValue | null {
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson === undefined) {
        return null
    }

    const joinedRoomDict = JSON.parse(joinedRoomsJson)
    const value = joinedRoomDict[roomId]
    
    if (value === undefined) {
        return null
    }

    return value
}