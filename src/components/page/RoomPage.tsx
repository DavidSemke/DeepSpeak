import { Link, useOutletContext } from "react-router-dom"
import MessageCard from "../card/MessageCard"
import type { Room } from "../../types/api"
import { wordTimestamp } from "../../utils/formatDate"
import { InputGroup, Button, Form } from "react-bootstrap"
import { postMessage } from "../../data/fetchMessage"
import { getRoom } from "../../data/fetchRoom"
import { unexpectedStateError } from "../../utils/customError"


type RoomPageProps = {
  joinedRooms: Room[],
  joinedRoomIndex: number | null,
  setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>,
  setOpenRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
}

/* 
  Params are available here, but not used due to necessity of 
  joinedRoomIndex state
*/
function RoomPage() {
  const {
    joinedRooms,
    joinedRoomIndex,
    setJoinedRoomIndex,
    setJoinedRooms,
    setOpenRooms
  } = useOutletContext<RoomPageProps>()

  if (joinedRoomIndex === null) {
    throw unexpectedStateError('joinedRoomIndex', null)
  }

  const room = joinedRooms[joinedRoomIndex]
  const {topic, create_date, users, messages} = room
  const createDate = wordTimestamp(create_date)
  
  function leaveRoom() {
    setJoinedRooms((joinedRooms) => {
        if (joinedRooms === null) {
            throw unexpectedStateError('joinedRooms', null)
        }
  
        return joinedRooms.filter(
          joinedRoom => joinedRoom._id !== room._id
        )
    })
    setOpenRooms((openRooms) => {
        if (openRooms === null) {
            throw unexpectedStateError('openRooms', null)
        }
  
        return [...openRooms, room]
    })
    setJoinedRoomIndex(null)
  }

  async function addMessage(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    await postMessage(room._id, new FormData(form))
    const updatedRoom = await getRoom(room._id)

    setJoinedRooms((joinedRooms) => {
      if (joinedRooms === null) {
        throw unexpectedStateError('joinedRooms', null)
      }
      if (joinedRoomIndex === null) {
        throw unexpectedStateError('joinedRoomIndex', null)
      }

      const newJoinedRooms = [...joinedRooms]
      newJoinedRooms.splice(joinedRoomIndex, 1, updatedRoom)
      
      return newJoinedRooms
    })
  }

  return (
      <div>
        <div className="d-flex justify-content-between">
          <h1 className="text-capitalize text-truncate">{topic}</h1>
          <Link to="/">
            <Button 
              variant="primary"
              onClick={leaveRoom}
            >
              Leave Room
            </Button>
          </Link>
        </div>
        <div className="text-muted">Created on {createDate}</div>
        <div className="text-muted">Users: {users.join(', ')}</div>
        {
          messages.map((msg) => {
            return (
              <MessageCard
                key={msg._id}
                message={msg}
              />
            )
          })
        }
        <Form onSubmit={addMessage}>
          <Form.Group>
            <InputGroup>
              <Form.Control
                type="text"
                name="content"
                aria-label="Message"
                required
              />
              <Button 
                type="submit"
                variant="primary"
              >
                  Send
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    )
  }
  
  
  export default RoomPage