import { getRoom } from "../data/fetchRoom"
import { postMessage } from "../data/fetchMessage"
import type { 
  MessageValidationErrorObject,
    Room,
    StateSetter 
} from "../utils/types"
import { ResponseError } from "../errors/responseError"
import { ArrayValidationError } from "../errors/validationError"


export async function addMessage(
    event: React.SyntheticEvent<HTMLFormElement>,
    roomToUpdate: Room,
    joinedRooms: Room[],
    joinedRoomIndex: number | null,
    setJoinedRooms: StateSetter<Room[] | null>,
    setJoinedRoomIndex: StateSetter<number | null>,
    setError: StateSetter<unknown | null>,
    setValidationErrors: StateSetter<MessageValidationErrorObject>
) {
    event.preventDefault()
    const form = event.currentTarget
    let updatedRoom: Room

    try {
      await postMessage(roomToUpdate._id, new FormData(form))
      updatedRoom = await getRoom(roomToUpdate._id)
    }
    catch(error) {
      if (error instanceof ArrayValidationError) {
        const contentErrors: string[] = []
        
        for (const obj of error.validationObjects) {
          if (obj.path === 'content') {
            contentErrors.push(obj.msg)
          }
        }

        setValidationErrors({
          content: contentErrors,
        })

        return
      }

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