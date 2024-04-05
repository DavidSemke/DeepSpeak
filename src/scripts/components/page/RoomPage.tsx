import { 
  Link, 
  useOutletContext, 
  useParams 
} from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import MessageCard from "../card/MessageCard"
import LoadingVisual from "../loading/LoadingVisual"
import { wordTimestamp } from "../../utils/dateFormat"
import { InputGroup, Button, Form } from "react-bootstrap"
import { ErrorContext } from "../../utils/reactContext"
import { addMessage } from "../../events/message"
import { leaveRoom } from "../../events/room"
import type { 
  Room,
  StateSetter,
  MessageValidationErrorObject 
} from "../../utils/types"


type RoomPageProps = {
  joinedRooms: Room[],
  openRooms: Room[],
  joinedRoomIndex: number | null,
  setJoinedRoomIndex: StateSetter<number | null>,
  setJoinedRooms: StateSetter<Room[] | null>,
  setOpenRooms: StateSetter<Room[] | null>
}

function RoomPage() {
  const { setError } = useContext(ErrorContext)
  const { roomId } = useParams()
  const [prevRoomId, setPrevRoomId] = useState<string | undefined>(undefined)
  const [
    validationErrors, 
    setValidationErrors
  ] = useState<MessageValidationErrorObject>({
    content: []
  })

  const {
    joinedRooms,
    openRooms,
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

  useEffect(() => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0, 
      behavior: 'smooth',
    });
  }, [
    validationErrors, 
    joinedRooms[joinedRoomIndex || 0]?.messages
  ])

  const loadingRoom = (
    joinedRoomIndex === null
    || joinedRooms[joinedRoomIndex]._id !== roomId
  )

  // Assume that joinedRoomIndex is in the process of being set
  // If this assumption is false, error is thrown after timeout
  // prevRoomId === roomId after timeout
  if (loadingRoom && prevRoomId === roomId) {
    throw new Error('Could not join room')
  }
  
  if (loadingRoom) {
    return (
      <LoadingVisual />
    )
  }

  const room = joinedRooms[joinedRoomIndex]
  const {topic, create_date, users, messages} = room

  // If messages array contains string id's:
  // 1 - Room was just joined
  // 2 - Room update is occurring, which will replace
  // the string id's with message objects
  if (messages.length && typeof messages[0] === 'string') {
    return (
      <LoadingVisual />
    )
  }

  const createDate = wordTimestamp(create_date)

  return (
      <>
        <div className="mb-4">
          <div className="d-flex justify-content-between">
            <h1 className="text-capitalize">
              {topic}
            </h1>
            <Link to="/">
              <Button 
                variant="primary"
                onClick={
                  () => leaveRoom(
                    room,
                    joinedRooms,
                    openRooms,
                    setJoinedRooms,
                    setOpenRooms,
                    setJoinedRoomIndex,
                    setError
                  )
                }
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
        <Form noValidate onSubmit={
          (event) => addMessage(
            event,
            room,
            joinedRooms,
            setJoinedRooms,
            setJoinedRoomIndex,
            setError,
            setValidationErrors
          )
        }>
          <Form.Group>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="content"
                aria-label="Message"
                required
                isInvalid={
                  Boolean(validationErrors.content.length)
                }
              />
              <Button 
                type="submit"
                variant="primary"
              >
                  Send
              </Button>
              {
                validationErrors.content.map((msg) => {
                  return (
                    <Form.Control.Feedback 
                      key={msg}
                      type='invalid'
                    >
                      {msg}
                    </Form.Control.Feedback>
                  )
                })
              }
            </InputGroup>
          </Form.Group>
        </Form>
      </>
    )
  }
  
  
  export default RoomPage