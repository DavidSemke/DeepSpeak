import Cookies from 'js-cookie'
import { getManyRooms, getRoom } from './fetchRoom'
import type { Room } from '../types/api'
import type { JwtDict } from '../types/cookie'


async function fetchJoinedRooms(
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
) {
    let jwtDict: JwtDict = {}
    const jwtJSON = Cookies.get('jwts')

    if (jwtJSON !== undefined) {
      jwtDict = JSON.parse(jwtJSON)
    }

    let joinedRooms: Room[]
    joinedRooms = await Promise.all(
        Object
          .keys(jwtDict)
          .map((key) => {
            return getRoom(key)
          })
    )
    setJoinedRooms(joinedRooms)

    return joinedRooms
}

async function fetchOpenRooms(
  joinedRooms: Room[], 
  setOpenRooms: React.Dispatch<React.SetStateAction<Room[] | null>>,
  limit=12
) {
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
  setOpenRooms(openRooms.slice(-limit))
}

export async function fetchData(
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>, 
  setOpenRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
) {
  const joinedRooms = await fetchJoinedRooms(setJoinedRooms)
  await fetchOpenRooms(joinedRooms, setOpenRooms)
}