import { Card } from "react-bootstrap"
import { timeUntil } from "../../utils/dateFormat"
import type { Room } from "../../utils/types"

type RoomCardProps = {
  room: Room
  selectRoom?: (room: Room) => void
  useVariant: boolean
}

function RoomCard({ room, selectRoom, useVariant }: RoomCardProps) {
  const { topic, delete_date, messages, users, max_user_count } = room
  const timeUntilDelete = timeUntil(new Date(), delete_date)
  let preview = "No messages"

  if (messages.length) {
    const { content, user } = messages[messages.length - 1]
    preview = `${user}: ${content}`
  }

  const userTotal = `${users.length} / ${max_user_count}`

  return (
    <Card
      style={{ width: "18rem", height: "13rem" }}
      onClick={() => {
        if (selectRoom) {
          selectRoom(room)
        }
      }}
      border={useVariant ? "primary" : ""}
    >
      <Card.Body>
        <Card.Title className="text-capitalize fw-bold truncate-2">
          {topic}
        </Card.Title>
        <Card.Text>{timeUntilDelete}</Card.Text>
        <Card.Text className="text-muted truncate-2">{preview}</Card.Text>
        <Card.Text>{userTotal}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default RoomCard
