import { Button, ButtonGroup, ListGroup, ListGroupItem } from "react-bootstrap"
import RoomList from "../list/RoomList"
import { Room } from "../../types/apiData"

type SidebarProps = {
    myRooms: Room[]
}

function Sidebar({ myRooms }: SidebarProps) {
    return (
        <div className="d-flex flex-column justify-content-center">
            <div className='d-flex justify-content-between'>
                <h2>My Rooms</h2>
                <ButtonGroup>
                    <Button variant="primary">
                        <img 
                            src="../../assets/join.png" 
                            alt="join room icon"
                            className="object-fit-cover"
                        />
                    </Button>
                    <Button variant="primary">
                        <img 
                            src="../../assets/create.png" 
                            alt="create room icon"
                            className="object-fit-cover"
                        />
                    </Button>
                </ButtonGroup>
            </div>
            <RoomList 
                rooms={myRooms} 
            />
        </div>
    )
}


export default Sidebar