import { useState } from 'react'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { 
  Container, 
  Navbar,  
} from 'react-bootstrap'
import { 
  fetchJoinedRooms, 
  fetchOpenRooms 
} from '../../data/fetchAppStateData'
import Sidebar from './Sidebar'
import type { Room } from '../../types/api'


function App() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [joinedRoomIndex, setJoinedRoomIndex] = useState<number | null>(null)
  const [joinedRooms, setJoinedRooms] = useState<Room[] | null>(null)
  const [openRooms, setOpenRooms] = useState<Room[] | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      const joined = await fetchJoinedRooms()
      const open = await fetchOpenRooms(joined)

      if (isMounted) {
        setJoinedRooms(joined)
        setOpenRooms(open)
      }
    }

    try {
      fetchData()
    }
    catch(error) {
      setError(error)
    }

    return () => {
        isMounted = false
    }
  }, [])

  if (error !== null) {
    // Go to react router error element page
    throw error
  }

  if (joinedRooms === null || openRooms === null) {
    return (
      <p>Loading...</p>
    )
  }
  
  return (
    <>
    <Navbar
      expand={false}
      className='bg-body-tertiary'
    >
      <Container fluid>
        <Navbar.Brand href="/">DeepSpeak</Navbar.Brand>
        <Navbar.Toggle 
          aria-controls='left-sidebar' 
          onClick={() => setShowSidebar(true)} 
        />
        <Sidebar
          show={showSidebar}
          setShow={setShowSidebar}
          joinedRooms={joinedRooms}
          joinedRoomIndex={joinedRoomIndex}
          setJoinedRoomIndex={setJoinedRoomIndex}
        />
      </Container>
    </Navbar>
    <Container className='p-3'>
      <Outlet context={{
          joinedRooms,
          openRooms,
          joinedRoomIndex,
          setJoinedRooms,
          setOpenRooms,
          setJoinedRoomIndex
        }}
      />
    </Container>
    
    </>
  )
}


export default App