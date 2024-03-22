import { useOutletContext } from "react-router-dom"
import RoomGrid from "../layout/RoomGrid"
import type { Room } from "../../types/api"
import { unexpectedStateError } from "../../errors/basicError"

type IndexPageProps = {
  joinedRooms: Room[],
  openRooms: Room[],
  setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>,
  setOpenRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
}

function IndexPage() {
  const {
    joinedRooms,
    openRooms,
    setJoinedRoomIndex,
    setJoinedRooms,
    setOpenRooms 
} = useOutletContext<IndexPageProps>()
  
  function selectOpenRoom(room: Room) {
    setJoinedRooms((joinedRooms) => {
        if (joinedRooms === null) {
          throw unexpectedStateError('joinedRooms', null)
        }

        return [...joinedRooms, room]
    })
    setOpenRooms((openRooms) => {
        if (openRooms === null) {
          throw unexpectedStateError('openRooms', null)
        }

        return openRooms.filter(
            (openRoom) => openRoom._id !== room._id
        )
    })
    // Newly selected joined room will be last in array
    // Length will have increased by 1 for next render
    setJoinedRoomIndex(joinedRooms.length)
  }
    
    return (
      <RoomGrid 
        rooms={openRooms}
        selectRoom={selectOpenRoom}
      />
    )
  }
  
  
  export default IndexPage