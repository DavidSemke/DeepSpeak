import { useState } from 'react'
import { useEffect } from 'react'
import fetchJWTRooms from '../../data/fetchJWTRooms'
import { Room } from '../../types/apiData'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './Sidebar'


function App() {
  const [myRooms, setMyRooms] = useState<Room[] | null>(null)
  // const [openRooms, setOpenRooms] = useState<Room[] | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    let isMounted = true

    try {
      fetchJWTRooms(setMyRooms)
    }
    catch(error) {
      setError(error)
    }

    return () => {
        isMounted = false
    }
  }, [])

  if (error) {
    return (
      <Container>
        <p>A network error occurred.</p>
      </Container>
    )
  }

  if (myRooms === null) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        <Col>
          <Sidebar 
            myRooms={myRooms}
          />
        </Col>
        <Col>
          // main view
        </Col>
      </Row>
    </Container>
  )
}

export default App
