import { Link, useOutletContext } from "react-router-dom"
import type { Room } from "../../types/api"
import { Button, Form } from "react-bootstrap"
import { postRoom } from "../../data/fetchRoom"
import { unexpectedStateError } from "../../utils/customError"


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
    const newRoom = await postRoom(new FormData(form))

    setJoinedRooms((joinedRooms) => {
        if (joinedRooms === null) {
            throw unexpectedStateError('joinedRooms', null)
        }

        return [...joinedRooms, newRoom]
    })
    setJoinedRoomIndex(joinedRooms.length)
  }

  return (
      <div>
        <h1>Create Room</h1>
        <Form onSubmit={addRoom}>
            <Form.Group controlId="topic">
                <Form.Label>Topic</Form.Label>
                <Form.Control
                    type="text"
                    name="topic"
                    required
                />
            </Form.Group>
            <Form.Group controlId="max-user-count">
                <Form.Label>Maximum Number of Users</Form.Label>
                <Form.Control
                    type="number"
                    name="max-user-count"
                    required
                />
            </Form.Group>
            <Link to={`/rooms/new-room`}>
                <Button 
                    type="submit"
                    variant="primary"
                >
                    Create
                </Button>
            </Link>
        </Form>
      </div>
    )
  }
  
  
  export default CreateRoomPage