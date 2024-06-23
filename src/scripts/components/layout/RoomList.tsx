import { ListGroup, ListGroupItem } from "react-bootstrap"
import RoomCard from "../card/RoomCard"
import { Link } from "react-router-dom"
import type { Room, StateSetter } from "../../utils/types"

type RoomListProps = {
  rooms: Room[]
  selectedIndex: number | null
  setSelectedIndex: StateSetter<number | null>
}

function RoomList({ rooms, selectedIndex, setSelectedIndex }: RoomListProps) {
  return (
    <ul className="d-flex flex-column gap-3">
      {rooms.map((room, index) => {
        const isSelected = selectedIndex !== null && selectedIndex === index

        return (
          <li
            key={room._id}
            onClick={() => setSelectedIndex(index)}
          >
            <Link to={`/rooms/${room._id}`}>
              <RoomCard room={room} useVariant={isSelected} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default RoomList
