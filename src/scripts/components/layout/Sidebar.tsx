import {   
    Offcanvas, 
    Button 
} from 'react-bootstrap'
import RoomList from './RoomList'
import { Link } from 'react-router-dom'
import type { Room } from '../../types/api'


type SidebarProps = {
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    joinedRooms: Room[],
    joinedRoomIndex: number | null,
    setJoinedRoomIndex: React.Dispatch<React.SetStateAction<number | null>>
}

function Sidebar({
    show, 
    setShow,
    joinedRooms,
    joinedRoomIndex,
    setJoinedRoomIndex
}: SidebarProps) {
  const handleClose = () => setShow(false);

  return (
    <Offcanvas
      id='left-sidebar'
      aria-labelledby='left-sidebar__title'
      placement="start"
      show={show}
      onHide={handleClose}
    >
      <Offcanvas.Header closeButton className='pb-0'>
        <Offcanvas.Title id='left-sidebar__title'>
          My Rooms
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className='d-flex gap-3 mb-3'>
          <Link to="/">
            <Button 
              variant='primary'
              onClick={handleClose}
            >
              Join
            </Button>
          </Link>
          <Link to="/rooms/create-room">
            <Button 
              variant='primary'
              onClick={handleClose}
            >
              Create
            </Button>
          </Link>
        </div>
        {
          (() => {
            if (!joinedRooms.length) {
              return (
                <p>You have not joined a room.</p>
              )
            }
            
            return (
              <RoomList 
                rooms={joinedRooms}
                selectedIndex={joinedRoomIndex}
                setSelectedIndex={setJoinedRoomIndex}
              />
            )
          })()
        }
      </Offcanvas.Body>
    </Offcanvas>
  )
}


export default Sidebar