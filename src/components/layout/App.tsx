import { useState } from 'react'
import { useEffect } from 'react'
import { fetchData } from '../../data/fetchAppStateData'
import type { Room } from '../../types/api'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'


function App() {
  const [joinedRoomIndex, setJoinedRoomIndex] = useState<number | null>(null)
  const [joinedRooms, setJoinedRooms] = useState<Room[] | null>(null)
  const [openRooms, setOpenRooms] = useState<Room[] | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    let isMounted = true

    try {
      fetchData(setJoinedRooms, setOpenRooms)
    }
    catch(error) {
      setError(error)
    }

    return () => {
        isMounted = false
    }
  }, [])

  if (error !== null) {
    return (
      <Container>
        <p>A network error occurred.</p>
      </Container>
    )
  }

  if (joinedRooms === null || openRooms === null) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        <Col xs={12} md={3}>
          <Sidebar
            joinedRooms={joinedRooms}
            joinedRoomIndex={joinedRoomIndex}
            setJoinedRoomIndex={setJoinedRoomIndex}
          />
        </Col>
        <Col xs={12} md={9}>
          <Outlet context={{
              joinedRooms,
              openRooms,
              joinedRoomIndex,
              setJoinedRooms,
              setOpenRooms,
              setJoinedRoomIndex
            }} 
          />
        </Col>
      </Row>
    </Container>
  )
}

export default App
