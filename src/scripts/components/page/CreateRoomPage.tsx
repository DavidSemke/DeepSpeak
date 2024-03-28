import { useContext, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Button, Form } from "react-bootstrap"
import { ErrorContext } from "../../utils/reactContext"
import { addRoom } from "../../events/room"
import type { 
  Room, 
  StateSetter, 
  RoomValidationErrorObject 
} from "../../utils/types"


type CreateRoomPageProps = {
  joinedRooms: Room[],
  openRooms: Room[],
  setJoinedRooms: StateSetter<Room[] | null>,
  setOpenRooms: StateSetter<Room[] | null>
  setJoinedRoomIndex: StateSetter<number | null>,
}

function CreateRoomPage() {
  const { setError } = useContext(ErrorContext)
  const [
    validationErrors, 
    setValidationErrors
  ] = useState<RoomValidationErrorObject>({
    topic: [],
    maxUserCount: []
  })
  const navigate = useNavigate()

  const {
    joinedRooms,
    openRooms,
    setJoinedRooms,
    setOpenRooms,
    setJoinedRoomIndex,
  } = useOutletContext<CreateRoomPageProps>()

  return (
    <>
      <h1>Create Room</h1>
      <Form noValidate onSubmit={
        (event) => {
          addRoom(
            event,
            joinedRooms,
            openRooms,
            setJoinedRooms,
            setOpenRooms,
            setJoinedRoomIndex,
            setError,
            setValidationErrors,
            navigate
          )
        }
      }>
        <Form.Group 
          controlId="topic"
          className="mb-3"
        >
          <Form.Label>Topic</Form.Label>
          <Form.Control
              type="text"
              name="topic"
              required
              isInvalid={
                Boolean(validationErrors.topic.length)
              }
          />
          {
            validationErrors.topic.map((msg) => {
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
        </Form.Group>
        <Form.Group 
          controlId="max-user-count"
          className="mb-3"
        >
          <Form.Label>Maximum Number of Users</Form.Label>
          <Form.Control
              type="number"
              name="max-user-count"
              required
              min={2}
              max={10}
              isInvalid={
                Boolean(validationErrors.maxUserCount.length)
              }
          />
          {
            validationErrors.maxUserCount.map((msg) => {
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
        </Form.Group>
        <Button 
            type="submit"
            variant="primary"
        >
            Submit
        </Button>
      </Form>
    </>
  )
}
  
  
export default CreateRoomPage