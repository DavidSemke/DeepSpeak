export type Message = {
    _id: string
    content: string
    create_date: Date
    user: string
}
  
export type Room = {
    _id: string
    topic: string
    create_date: Date
    delete_date: Date
    max_user_count: number
    users: string[]
    deleted_users: string[]
    messages: Message[]
}