import { 
  Link, 
  useOutletContext, 
  useParams 
} from "react-router-dom"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import MessageCard from "../card/MessageCard"
import type { Room } from "../../types/api"
import { wordTimestamp } from "../../utils/formatDate"
import { InputGroup, Button, Form } from "react-bootstrap"
import { postMessage } from "../../data/fetchMessage"
import { getRoom } from "../../data/fetchRoom"
import { unexpectedStateError } from "../../errors/basicError"
import type { JoinedRoomDict } from "../../types/cookie"
import { authFailError } from "../../errors/basicError"
import { deleteUser } from "../../data/fetchUser"


type RoomPageProps = {
  joinedRooms: Room[],
  joinedRoomIndex: number | null,
  setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>,
  setOpenRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
}


function RoomPage() {
  const { roomId } = useParams()
  const [prevRoomId, setPrevRoomId] = useState<string | undefined>(undefined)

  const {
    joinedRooms,
    joinedRoomIndex,
    setJoinedRoomIndex,
    setJoinedRooms,
    setOpenRooms
  } = useOutletContext<RoomPageProps>()
  
  useEffect(() => {
    for (let i=0; i<joinedRooms.length; i++) {
      const room = joinedRooms[i]

      if (room._id === roomId) {
        setJoinedRoomIndex(i)
        break
      }
    }

    const timeoutId = setTimeout(() => {
      setPrevRoomId(roomId)
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [roomId])

  if (
    joinedRoomIndex === null
    || joinedRooms[joinedRoomIndex]._id !== roomId
  ) {
    if (prevRoomId === roomId) {
      throw new Error('Could not join room')
    }
    // Assume that joinedRoomIndex is in the process of being set
    // If this assumption is false, error is thrown after timeout
    return (
      <p>Loading...</p>
    )
  }

  const room = joinedRooms[joinedRoomIndex]
  const {topic, create_date, users, messages} = room
  const createDate = wordTimestamp(create_date)
  
  async function leaveRoom() {
    const joinedRoomsJson = Cookies.get('joinedRooms')

    if (joinedRoomsJson === undefined) {
        throw authFailError('cookie missing')
    }

    const joinedRoomDict: JoinedRoomDict = JSON.parse(joinedRoomsJson)
    const roomData = joinedRoomDict[room._id]

    if (roomData === undefined) {
      throw authFailError('value for roomId key undefined')
    }

    await deleteUser(room._id, joinedRoomDict[room._id].user)

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

    if (updatedRoom === null) {
      leaveRoom()
      throw new Error('Room has expired')
    }

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
      <>
        <div className="mb-4">
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
        </div>
        <div className="d-flex flex-column gap-3 mb-4">
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
        </div>
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
      </>
    )
  }
  
  
  export default RoomPage