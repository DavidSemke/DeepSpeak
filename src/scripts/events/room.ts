import { NavigateFunction } from "react-router-dom"
import { generateUser } from "../utils/randomString"
import { postUser, deleteUser } from "../data/fetchUser"
import { postRoom } from "../data/fetchRoom"
import { ArrayValidationError } from "../errors/validationError"
import { authFailError } from "../errors/errorFactory"
import type { 
    Room, 
    StateSetter,
    RoomValidationErrorObject
} from "../utils/types"
import { getJoinedRoomValue } from "../utils/cookie"
import { ResponseError } from "../errors/responseError"
import { SocketManager } from "../socket/manager"


export async function joinRoom(
    roomToJoin: Room,
    joinedRooms: Room[],
    openRooms: Room[],
    setJoinedRooms: StateSetter<Room[] | null>,
    setOpenRooms: StateSetter<Room[] | null>,
    setJoinedRoomIndex: StateSetter<number | null>,
    setError: StateSetter<unknown | null>
) {
    // Post new user
    let user: string

    do {
      user = generateUser()
    } while (
      roomToJoin.users.includes(user)
      || roomToJoin.deleted_users.includes(user)
    )

    try {
      // Add user to room
      const formData = new FormData()
      formData.append('user', user)
      await postUser(roomToJoin._id, formData)
    }
    catch(error) {
      setError(error)
      return
    }

    setJoinedRooms([...joinedRooms, roomToJoin])
    // If room is newly created, it will not be in openRooms
    setOpenRooms(
      openRooms.filter((openRoom) => {
        return openRoom._id !== roomToJoin._id
      }
    ))
    setJoinedRoomIndex(joinedRooms.length)

    SocketManager.socketEmit(
      'join-room', 
      { roomId: roomToJoin._id, update: true }
    )
}

// Create a room and join it
export async function addRoom(
    event: React.SyntheticEvent<HTMLFormElement>,
    joinedRooms: Room[],
    openRooms: Room[],
    setJoinedRooms: StateSetter<Room[] | null>,
    setOpenRooms: StateSetter<Room[] | null>,
    setJoinedRoomIndex: StateSetter<number | null>,
    setError: StateSetter<unknown | null>,
    setValidationErrors: StateSetter<RoomValidationErrorObject>,
    navigate: NavigateFunction
) {
    event.preventDefault()
    const form = event.currentTarget
    let newRoom: Room
    
    try {
      newRoom = await postRoom(new FormData(form))
    }
    catch(err) {
      if (!(err instanceof ArrayValidationError)) {
        setError(err)
        return
      }

      const topicErrors: string[] = []
      const maxUserCountErrors: string[] = []
      
      for (const obj of err.validationObjects) {
        if (obj.path === 'topic') {
          topicErrors.push(obj.msg)
        }
        else if (obj.path === 'max-user-count') {
          maxUserCountErrors.push(obj.msg)
        }
      }

      setValidationErrors({
        topic: topicErrors,
        maxUserCount: maxUserCountErrors
      })

      return
    }

    joinRoom(
        newRoom,
        joinedRooms,
        openRooms,
        setJoinedRooms,
        setOpenRooms,
        setJoinedRoomIndex,
        setError
    )

    // redirect to new room page
    navigate(`/rooms/${newRoom._id}`)
}

export async function leaveRoom(
    roomToLeave: Room,
    joinedRooms: Room[],
    openRooms: Room[],
    setJoinedRooms: StateSetter<Room[] | null>,
    setOpenRooms: StateSetter<Room[] | null>,
    setJoinedRoomIndex: StateSetter<number | null>,
    setError: StateSetter<unknown | null>,
) {
    const value = getJoinedRoomValue(roomToLeave._id)

    if (value === null) {
      setError(authFailError('JWT missing'))
      return
    }

    try {
      await deleteUser(roomToLeave._id, value.user)
    }
    catch(error) {
      if (
        error instanceof ResponseError
        && error.status === 404
      ) {
        setJoinedRooms(
          joinedRooms.filter((joinedRoom) => {
            return joinedRoom._id !== roomToLeave._id
          })
        )
        setJoinedRoomIndex(null)

        SocketManager.socketEmit(
          'leave-room', 
          { roomId: roomToLeave._id, update: false }
        )
      }

      setError(error)
      return
    }
    
    setJoinedRooms(
      joinedRooms.filter((joinedRoom) => {
        return joinedRoom._id !== roomToLeave._id
      })
    )
    setOpenRooms([...openRooms, roomToLeave])
    setJoinedRoomIndex(null)

    SocketManager.socketEmit(
      'leave-room', 
      { roomId: roomToLeave._id, update: true }
    )
}