import { Card } from "react-bootstrap"
import type { Room } from "../../types/api"
import { timeUntil } from "../../utils/formatDate"

type RoomCardProps = {
    room: Room,
    selectRoom?: (room: Room) => void,
    useVariant: boolean
}

function RoomCard({room, selectRoom, useVariant, }: RoomCardProps) {
    const { 
        topic, 
        delete_date, 
        messages, 
        users, 
        max_user_count 
    } = room
    const timeUntilDelete = timeUntil(new Date(), delete_date)
    let preview = 'No messages'

    if (messages.length) {
        const { content, user } = messages[messages.length-1]
        preview = `${user}: ${content}`
    }

    const userTotal = `${users.length} / ${max_user_count}`
    
    return (
        <Card 
            style={{width: '18rem'}} 
            onClick={() => {
                if (selectRoom) {
                    selectRoom(room) 
                }
            }}
            border={useVariant ? 'primary' : ''}
        >
            <Card.Body>
                <Card.Title className="text-capitalize fw-bold">
                    {topic}
                </Card.Title>
                <Card.Text>
                    {timeUntilDelete}
                </Card.Text>
                <Card.Text className="text-muted">
                    {preview}
                </Card.Text>
                <Card.Text>
                    {userTotal}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default RoomCard