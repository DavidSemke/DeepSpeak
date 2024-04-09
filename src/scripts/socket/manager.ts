import { io } from "socket.io-client"
import consts from "../data/constants"
import { getJoinedRoomKeys } from "../utils/cookie"
import { Room, StateSetter } from "../utils/types"
import { unexpectedStateError } from "../errors/errorFactory"

export const SocketManager = (() => {
  const socket = io(consts.SERVER_URL)

  function socketDeploy(
    setJoinedRooms: StateSetter<Room[] | null>,
    setOpenRooms: StateSetter<Room[] | null>,
  ) {
    const joinedRoomKeys = getJoinedRoomKeys() || []

    socket.on("connect", () => {
      for (const roomId of joinedRoomKeys) {
        socket.emit("join-room", { roomId, update: false })
      }
    })

    socket.on("disconnect", () => {
      for (const roomId of joinedRoomKeys) {
        socket.emit("leave-room", { roomId, update: false })
      }
    })

    type RoomUpdateData = {
      room: Room
    }

    socket.on("room-update", ({ room }: RoomUpdateData) => {
      setJoinedRooms((joinedRooms) => {
        if (joinedRooms === null) {
          throw unexpectedStateError("joinedRooms", null)
        }

        return joinedRooms.map((joinedRoom) => {
          if (joinedRoom._id === room._id) {
            return room
          }

          return joinedRoom
        })
      })
      setOpenRooms((openRooms) => {
        if (openRooms === null) {
          throw unexpectedStateError("openRooms", null)
        }

        return openRooms.map((openRoom) => {
          if (openRoom._id === room._id) {
            return room
          }

          return openRoom
        })
      })
    })
  }

  function socketEmit(event: string, data: unknown) {
    socket.emit(event, data)
  }

  return {
    socketDeploy,
    socketEmit,
  }
})()
