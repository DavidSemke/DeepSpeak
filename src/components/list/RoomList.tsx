import { ListGroup, ListGroupItem } from "react-bootstrap"
import { Room } from "../../types/apiData"
import { timeUntil } from "../../utils/formatDate"

type RoomListProps = {
    rooms: Room[]
}

function RoomList({ rooms }: RoomListProps) {
    return (
        <ListGroup as="ul" variant="flush">
            { rooms.map((room) => {
                const { 
                    topic, 
                    delete_date, 
                    messages, 
                    users, 
                    max_user_count 
                } = room
                const timeUntilDelete = timeUntil(new Date(), delete_date)
                const { content, user } = messages[messages.length-1]
                const preview = `${user}: ${content}`
                const userTotal = `${users.length} / ${max_user_count}`

                return (
                    <ListGroupItem as="li">
                        <div className="d-flex justify-content-between">
                            <h3>{topic}</h3>
                            <div>{timeUntilDelete}</div>
                        </div>
                        <p>{preview}</p>
                        <div>{userTotal}</div>

                    </ListGroupItem>
                )
            })}
        </ListGroup>
    )
}


export default RoomList
