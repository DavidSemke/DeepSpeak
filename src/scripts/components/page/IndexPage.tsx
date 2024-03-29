import { useContext } from "react"
import { useOutletContext } from "react-router-dom"
import RoomGrid from "../layout/RoomGrid"
import { ErrorContext } from "../../utils/reactContext"
import { joinRoom } from "../../events/room"
import type { Room, StateSetter } from "../../utils/types"


type IndexPageProps = {
  joinedRooms: Room[],
  openRooms: Room[],
  setJoinedRoomIndex: StateSetter<number | null>,
  setJoinedRooms: StateSetter<Room[] | null>,
  setOpenRooms: StateSetter<Room[] | null>
}

function IndexPage() {
  const { setError } = useContext(ErrorContext)

  const {
    joinedRooms,
    openRooms,
    setJoinedRoomIndex,
    setJoinedRooms,
    setOpenRooms 
  } = useOutletContext<IndexPageProps>()
    
  return (
    <>
    <h1 className="mb-4">Join Room</h1>
    <RoomGrid 
      rooms={openRooms}
      selectRoom={
        (room) => joinRoom(
          room,
          joinedRooms,
          openRooms,
          setJoinedRooms,
          setOpenRooms,
          setJoinedRoomIndex,
          setError
        )
      }
    />
    </>
  )
}
  
  
export default IndexPage