import Cookies from 'js-cookie'
import { getManyRooms, getRoom } from './fetchRoom'
import type { Room, JoinedRoomDict } from '../utils/types'
import { getMessage } from './fetchMessage'
import { ResponseError } from '../errors/responseError'


export async function fetchJoinedRooms(): Promise<Room[]> {
    let joinedRoomDict: JoinedRoomDict = {}
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson !== undefined) {
      joinedRoomDict = JSON.parse(joinedRoomsJson)
    }

    const results = await Promise.all(
      Object.keys(joinedRoomDict)
        .map(async (key) => {
          try {
            return await getRoom(key)
          }
          catch(error) {
            if (
              error instanceof ResponseError
              && error.status === 404
            ) {
              return null
            }

            throw error
          }
        })
    )
    
    const joinedRooms: Room[] = results.filter(
      (room): room is Room => room !== null
    )

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
  let openRooms: Room[]
  openRooms = await getManyRooms(
    'topic', 
    'asc', 
    limit + (joinedRooms?.length || 0)
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
  openRooms = openRooms.slice(-limit)

  // Populate latest message of each room
  for (const room of openRooms) {
    const { _id, messages } = room
    const latestMsgIndex = messages.length-1
    const latestMsgId: unknown = messages[latestMsgIndex]

    if (!latestMsgId || typeof latestMsgId !== 'string') {
      continue
    }

    const latestMsg = await getMessage(_id, latestMsgId)
    messages[latestMsgIndex] = latestMsg
  }

  return openRooms
}