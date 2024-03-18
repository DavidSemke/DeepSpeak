import { Container, Row, Col } from "react-bootstrap"
import RoomCard from "../card/RoomCard"
import type { Room } from "../../types/api"
import { Link } from "react-router-dom"

type RoomGridProps = {
    rooms: Room[],
    selectRoom: (room: Room) => void
}

function RoomGrid(
    { rooms, selectRoom }: RoomGridProps
) {
    if (!rooms.length) {
        return (
            <Container>
                <p>There are currently no open rooms.</p>
            </Container>
        )
    }

    // max of 4 cards per row
    const maxRowLength = 4
    const groupedRooms: Room[][] = [[]]
    let groupIndex = 0

    for (const room of rooms) {
        if (groupedRooms[groupIndex].length === maxRowLength) {
            groupedRooms.push([])
            groupIndex++
        }

        groupedRooms[groupIndex].push(room)
    }

    return (
        <Container>
            {
                groupedRooms.map((group) => {
                    return (
                        <Row key={group[0]._id}>
                            {
                                group.map((room) => {
                                    return (
                                        <Col sm={12} md={6} lg={3} className="mb-3">
                                            <Link to={`/rooms/${room._id}`}>
                                                <RoomCard 
                                                    room={room}
                                                    selectRoom={selectRoom}
                                                    useVariant={false}
                                                />
                                            </Link>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    )
                })
            }
        </Container>
    )
}

export default RoomGrid