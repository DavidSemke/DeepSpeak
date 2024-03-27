import { ListGroup, ListGroupItem } from "react-bootstrap"
import RoomCard from "../card/RoomCard"
import type { Room } from "../../types/api"
import { Link } from "react-router-dom"

type RoomListProps = {
    rooms: Room[],
    selectedIndex: number | null,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>
}

function RoomList({ 
    rooms, 
    selectedIndex,
    setSelectedIndex
}: RoomListProps) {
    return (
        <ListGroup as="ul" variant="flush">
            { rooms.map((room, index) => {
                const isSelected = (
                    selectedIndex !== null 
                    && selectedIndex === index
                )

                return (
                    <ListGroupItem
                        key={room._id}
                        as="li"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <Link to={`/rooms/${room._id}`}>
                            <RoomCard 
                                room={room}
                                useVariant={isSelected}
                            />
                        </Link>
                    </ListGroupItem>
                )
            })}
        </ListGroup>
    )
}


export default RoomList
