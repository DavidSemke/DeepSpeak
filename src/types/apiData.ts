type Message = {
    content: string
    create_date: Date
    user: string
}
  
type Room = {
    topic: string
    create_date: Date
    delete_date: Date
    max_user_count: number
    users: string[]
    deleted_users: string[]
    messages: Message[]
}

export {
    Message,
    Room
}