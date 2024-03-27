import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import type { Room } from "../../types/api"
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap"
import { postRoom } from "../../data/fetchRoom"
import { unexpectedStateError } from "../../errors/basicError"
import { ArrayValidationError } from "../../errors/validationError"


type CreateRoomPageProps = {
  joinedRooms: Room[],
  setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
}

type ValidationErrors = {
  topic: string[]
  maxUserCount: string[]
}

function CreateRoomPage() {
  const navigate = useNavigate()
  const [
    validationErrors, 
    setValidationErrors
  ] = useState<ValidationErrors>({
    topic: [],
    maxUserCount: []
  })

  const {
    joinedRooms,
    setJoinedRoomIndex,
    setJoinedRooms
  } = useOutletContext<CreateRoomPageProps>()

  async function addRoom(
    event: React.SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    const form = event.currentTarget
    
    let newRoom: Room
    let topicErrors: string[] = []
    let maxUserCountErrors: string[] = []
    
    try {
      newRoom = await postRoom(new FormData(form))
    }
    catch(err) {
      if (!(err instanceof ArrayValidationError)) {
        throw err
      }
      
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

    setJoinedRooms((joinedRooms) => {
        if (joinedRooms === null) {
            throw unexpectedStateError('joinedRooms', null)
        }

        return [...joinedRooms, newRoom]
    })
    setJoinedRoomIndex(joinedRooms.length)

    // redirect to new room page
    navigate(`/rooms/${newRoom._id}`)
  }

  return (
    <>
      <h1>Create Room</h1>
      <Form onSubmit={addRoom}>
        <Form.Group 
          controlId="topic"
          className="mb-3"
        >
          <Form.Label>Topic</Form.Label>
          <Form.Control
              type="text"
              name="topic"
              required
          />
          <Form.Control.Feedback type='invalid'>
            <ListGroup>
              {
                validationErrors.topic.map((msg) => {
                  return (
                    <ListGroupItem key={msg}>
                      {msg}
                    </ListGroupItem>
                  )
                })
              }
            </ListGroup>
          </Form.Control.Feedback>
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
              min={0}
          />
          <Form.Control.Feedback type='invalid'>
            <ListGroup>
              {
                validationErrors.maxUserCount.map((msg) => {
                  return (
                    <ListGroupItem key={msg}>
                      {msg}
                    </ListGroupItem>
                  )
                })
              }
            </ListGroup>
          </Form.Control.Feedback>
        </Form.Group>
        <Button 
            type="submit"
            variant="primary"
            onClick={() => console.log('yes')}
        >
            Submit
        </Button>
      </Form>
    </>
  )
}
  
  
export default CreateRoomPage