import { getRoom } from "../data/fetchRoom"
import { postMessage } from "../data/fetchMessage"
import type { 
    Room,
    StateSetter 
} from "../utils/types"
import { ResponseError } from "../errors/responseError"


export async function addMessage(
    event: React.SyntheticEvent<HTMLFormElement>,
    roomToUpdate: Room,
    joinedRooms: Room[],
    joinedRoomIndex: number | null,
    setJoinedRooms: StateSetter<Room[] | null>,
    setJoinedRoomIndex: StateSetter<number | null>,
    setError: StateSetter<unknown | null>,
) {
    event.preventDefault()
    const form = event.currentTarget
    let updatedRoom: Room

    try {
      await postMessage(roomToUpdate._id, new FormData(form))
      updatedRoom = await getRoom(roomToUpdate._id)
    }
    catch(error) {
      if (
        error instanceof ResponseError
        && error.status === 404
      ) {
        setJoinedRooms(
          joinedRooms.filter((joinedRoom) => {
            joinedRoom._id !== roomToUpdate._id
          })
        )
        setJoinedRoomIndex(null)
      }

      setError(error)
      return
    }

    setJoinedRooms(
      joinedRooms.map((room, index) => {
        if (index === joinedRoomIndex) {
          return (updatedRoom as Room)
        }

        return room
      })
    )
  }