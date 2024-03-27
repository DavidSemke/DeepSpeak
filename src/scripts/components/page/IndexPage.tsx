import { useOutletContext } from "react-router-dom"
import RoomGrid from "../layout/RoomGrid"
import type { Room } from "../../types/api"
import { unexpectedStateError } from "../../errors/basicError"
import { generateUser } from "../../utils/generateUser"
import { postUser } from "../../data/fetchUser"
import { getManyMessages } from "../../data/fetchMessage"
import { getRoom } from "../../data/fetchRoom"

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
  
  async function selectOpenRoom(room: Room) {
    // Post new user
    let user: string

    do {
      user = generateUser()
    } while (
      room.users.includes(user)
      || room.deleted_users.includes(user)
    )
    
    // Add user to room
    const formData = new FormData()
    formData.append('user', user)
    await postUser(room._id, formData)



    // Get updated room
    // room = await getRoom(room._id)

    // if (room === null) {
      
    // }

    const firstMsg: unknown = room.messages[0]

    // Check if messages prop is unpopulated (consists of ObjectIds)
    if (firstMsg && typeof firstMsg === 'string') {
      const fullMessages = await getManyMessages(room._id)
      room = {...room, messages: fullMessages}
    }

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