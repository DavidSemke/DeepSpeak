import Cookies from 'js-cookie'
import { getManyRooms } from './fetchRoom'
import type { Room, JoinedRoomDict } from '../utils/types'
import { deleteJoinedRoomKey } from '../utils/cookie'


export async function fetchJoinedRooms(): Promise<Room[]> {
    let joinedRoomDict: JoinedRoomDict = {}
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson !== undefined) {
      joinedRoomDict = JSON.parse(joinedRoomsJson)
    }

    const roomIds = Object.keys(joinedRoomDict)
    const joinedRooms: Room[] = await getManyRooms(
      'topic', 
      'asc',
      null,
      null, 
      'messages', 
      roomIds
    )
    const joinedRoomIds = joinedRooms.map(room => room._id)

    for (const id of roomIds) {
      if (!joinedRoomIds.includes(id)) {
        deleteJoinedRoomKey(id)
      }
    }

    return joinedRooms
}

export async function fetchOpenRooms(
  joinedRooms: Room[],
  limit=12
): Promise<Room[]> {
  const filters = []

   // Filter to prevent overlap between joinedRooms and openRooms 
  if (joinedRooms !== null) {
    const joinedRoomIds = joinedRooms.map((room) => room._id)
    const isNotJoined = (openRoom: Room) => {
      if (joinedRoomIds.includes(openRoom._id)) {
        return false
      }

      return true
    }
    filters.push(isNotJoined)
  }

  // Filter to remove rooms that are full
  const isNotFull = (openRoom: Room) => {
    if (openRoom.users.length === openRoom.max_user_count) {
      return false
    }

    return true
  }
  filters.push(isNotFull)

  // Fetch rooms
  const openRooms: Room[] = await getManyRooms(
    'topic', 
    'asc', 
    limit + joinedRooms.length,
    null,
    'messages'
  )

  // Apply filters
  for (let i=0; i<openRooms.length; ) {
    const openRoom = openRooms[i]
    let filtered = false

    for (const filter of filters) {
      if (!filter(openRoom)) {
        openRooms.splice(i, 1)
        filtered = true
        break
      }
    }

    if (!filtered) {
      i++
    }
  }

  // Slice to get <= limit open rooms
  return openRooms.slice(-limit)
}