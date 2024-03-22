import { Link, useOutletContext } from "react-router-dom"
import type { Room } from "../../types/api"
import { Button, Container, Form } from "react-bootstrap"
import { postRoom } from "../../data/fetchRoom"
import { unexpectedStateError } from "../../errors/basicError"


type CreateRoomPageProps = {
  joinedRooms: Room[],
  setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setJoinedRooms: React.Dispatch<React.SetStateAction<Room[] | null>>
}

function CreateRoomPage() {
  const {
    joinedRooms,
    setJoinedRoomIndex,
    setJoinedRooms
  } = useOutletContext<CreateRoomPageProps>()

  async function addRoom(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const res = await postRoom(new FormData(form))
    const json = await res.json()
    

    setJoinedRooms((joinedRooms) => {
        if (joinedRooms === null) {
            throw unexpectedStateError('joinedRooms', null)
        }

        return [...joinedRooms, newRoom]
    })
    setJoinedRoomIndex(joinedRooms.length)
  }

  return (
      <Container>
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

            </Form.Control.Feedback>
          </Form.Group>
          <Button 
              type="submit"
              variant="primary"
          >
              Submit
          </Button>
        </Form>
      </Container>
    )
  }
  
  
  export default CreateRoomPage