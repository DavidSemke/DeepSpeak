import Cookies from 'js-cookie'
import { getRoom } from '../data/fetchRoom'
import { Room } from '../types/apiData'

// JWT is received for each room user joins
type JwtDictType = {
    [roomId: string]: string
}

export default async function fetchJWTRooms(
  setRooms: React.Dispatch<React.SetStateAction<Room[] | null>>): Promise<Room[]> {
    let jwtDict: JwtDictType = {}
    const jwtJSON = Cookies.get('jwts')

    if (jwtJSON !== undefined) {
      jwtDict = JSON.parse(jwtJSON)
    }

    let rooms: Room[]
    rooms = await Promise.all(
        Object
          .keys(jwtDict)
          .map((key) => {
            return getRoom(key)
          })
    )
    setRooms(rooms)

    return rooms
}