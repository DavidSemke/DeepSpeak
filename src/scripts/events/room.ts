import { NavigateFunction } from "react-router-dom"
import { generateUser } from "../utils/randomString"
import { postUser, deleteUser } from "../data/fetchUser"
import { getRoom, postRoom } from "../data/fetchRoom"
import { ArrayValidationError } from "../errors/validationError"
import { authFailError } from "../errors/errorFactory"
import type { 
    Room, 
    StateSetter,
    RoomValidationErrorObject
} from "../utils/types"
import { getJoinedRoomValue } from "../utils/cookie"
import { ResponseError } from "../errors/responseError"


export async function joinRoom(
    roomToSelect: Room,
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
      roomToSelect.users.includes(user)
      || roomToSelect.deleted_users.includes(user)
    )

    let updatedRoom: Room

    try {
      // Add user to room
      const formData = new FormData()
      formData.append('user', user)
      await postUser(roomToSelect._id, formData)
      updatedRoom = await getRoom(roomToSelect._id)
    }
    catch(error) {
      setError(error)
      return
    }

    setJoinedRooms([...joinedRooms, updatedRoom])
    // If room is newly created, it will not be in openRooms
    setOpenRooms(
      openRooms.filter((openRoom) => {
        return openRoom._id !== (updatedRoom as Room)._id
      }
    ))
    setJoinedRoomIndex(joinedRooms.length)
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

    let updatedRoom: Room

    try {
      await deleteUser(roomToLeave._id, value.user)
      updatedRoom = await getRoom(roomToLeave._id)
    }
    catch(error) {
      if (
        error instanceof ResponseError
        && error.status === 404
      ) {
        setJoinedRooms(
          joinedRooms.filter((joinedRoom) => {
            joinedRoom._id !== roomToLeave._id
          })
        )
        setJoinedRoomIndex(null)
      }

      setError(error)
      return
    }
    
    setJoinedRooms(
      joinedRooms.filter((joinedRoom) => {
        joinedRoom._id !== updatedRoom._id
      })
    )
    setOpenRooms([...openRooms, updatedRoom])
    setJoinedRoomIndex(null)
}