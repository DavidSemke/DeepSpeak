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

export type JoinedRoomDictValue = {
  token: string
  user: string
}

// JWT (token) is received for each room user joins
export type JoinedRoomDict = {
  [roomId: string]: JoinedRoomDictValue
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>

export type RoomValidationErrorObject = {
  topic: string[]
  maxUserCount: string[]
}

export type MessageValidationErrorObject = {
  content: string[]
}
