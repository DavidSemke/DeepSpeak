// JWT (token) is received for each room user joins
export type JoinedRoomDict = {
    [roomId: string]: {
        token: string,
        user: string
    }
}