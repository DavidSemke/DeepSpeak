import { postMessage } from "../data/fetchMessage"
import type { 
  MessageValidationErrorObject,
    Room,
    StateSetter 
} from "../utils/types"
import { ResponseError } from "../errors/responseError"
import { ArrayValidationError } from "../errors/validationError"
import { SocketManager } from "../socket/manager"


export async function addMessage(
    event: React.SyntheticEvent<HTMLFormElement>,
    roomToMessage: Room,
    joinedRooms: Room[],
    setJoinedRooms: StateSetter<Room[] | null>,
    setJoinedRoomIndex: StateSetter<number | null>,
    setError: StateSetter<unknown | null>,
    setValidationErrors: StateSetter<MessageValidationErrorObject>
) {
    event.preventDefault()
    const form = event.currentTarget

    try {
      await postMessage(roomToMessage._id, new FormData(form))
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
            joinedRoom._id !== roomToMessage._id
          })
        )
        setJoinedRoomIndex(null)

        SocketManager.socketEmit(
          'leave-room', 
          { roomId: roomToMessage._id, update: false }
        )
      }
      
      setError(error)
      return
    }

    SocketManager.socketEmit(
      'post-message', 
      { roomId: roomToMessage._id }
    )
  }