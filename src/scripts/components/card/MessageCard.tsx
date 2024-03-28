import { Card } from "react-bootstrap"
import { wordTimestamp } from "../../utils/dateFormat"
import type { Message } from "../../utils/types"


type MessageCardProps = {
    message: Message
}

function MessageCard({message}: MessageCardProps) {
    const { 
        content,
        create_date,
        user
    } = message
    const timestamp = wordTimestamp(new Date(create_date))
    
    return (
        <Card style={{width: '18rem'}}>
            <Card.Body>
                <Card.Text className="fw-bold">
                    {user}
                </Card.Text>
                <Card.Text>
                    {content}
                </Card.Text>
                <Card.Text className="text-muted">
                    {timestamp}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default MessageCard