import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import RoomCard from "../card/RoomCard"
import type { Room } from "../../utils/types"

type RoomGridProps = {
  rooms: Room[]
  selectRoom: (room: Room) => void
}

function RoomGrid({ rooms, selectRoom }: RoomGridProps) {
  if (!rooms.length) {
    return (
      <Container>
        <p>There are currently no open rooms.</p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="room-card-grid">
        {rooms.map((room) => {
          return (
            <div key={room._id} className="room-card-grid__cell">
              <Link to={`/rooms/${room._id}`}>
                <RoomCard
                  room={room}
                  selectRoom={selectRoom}
                  useVariant={false}
                />
              </Link>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export default RoomGrid
