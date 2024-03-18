import { useState } from 'react'
import { Button, Collapse } from "react-bootstrap"
import RoomList from "../list/RoomList"
import type { Room } from "../../types/api"
import { Link } from 'react-router-dom'

type SidebarProps = {
    joinedRooms: Room[],
    joinedRoomIndex: number | null,
    setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>
}

function Sidebar(
    { 
        joinedRooms, 
        joinedRoomIndex, 
        setJoinedRoomIndex 
    }: SidebarProps
) {
    const [open, setOpen] = useState<boolean>(true)

    return (
        <Collapse in={open} dimension="width">
            <div className="d-flex flex-column justify-content-center">
                <div className='d-flex justify-content-between'>
                    <h2>My Rooms</h2>
                    <Button variant="secondary">
                        <img 
                            src="../../assets/pushLeft.png" 
                            alt="close sidebar icon"
                            className="object-fit-cover"
                            onClick={() => setOpen(!open)}
                        />
                    </Button>
                </div>
                <div className='d-flex gap-3'>
                    <Link to='/'>
                        <Button 
                            variant="primary"
                            onClick={() => setJoinedRoomIndex(null)}
                        >
                            <img 
                                src="../../assets/join.png" 
                                alt="join room icon"
                                className="object-fit-cover"
                            />
                        </Button>
                    </Link>
                    <Link to='/rooms/create-room'>
                        <Button 
                            variant="primary"
                            onClick={() => setJoinedRoomIndex(null)}
                        >
                            <img 
                                src="../../assets/create.png" 
                                alt="create room icon"
                                className="object-fit-cover"
                            />
                        </Button>
                    </Link>
                </div>
                <RoomList 
                    rooms={joinedRooms}
                    selectedIndex={joinedRoomIndex}
                    setSelectedIndex={setJoinedRoomIndex}
                />
            </div>
        </Collapse>
        
    )
}


export default Sidebar