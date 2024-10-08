import { useState } from "react"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Container, Navbar } from "react-bootstrap"
import { fetchJoinedRooms, fetchOpenRooms } from "../../data/fetchAppStateData"
import Sidebar from "./Sidebar"
import LoadingVisual from "../loading/LoadingVisual"
import { ErrorContext } from "../../utils/reactContext"
import { SocketManager } from "../../socket/manager"
import type { Room } from "../../utils/types"
import { Link } from "react-router-dom"

function App() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [joinedRoomIndex, setJoinedRoomIndex] = useState<number | null>(null)
  const [joinedRooms, setJoinedRooms] = useState<Room[] | null>(null)
  const [openRooms, setOpenRooms] = useState<Room[] | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        const joined = await fetchJoinedRooms()
        const open = await fetchOpenRooms(joined)

        if (isMounted) {
          setJoinedRooms(joined)
          setOpenRooms(open)
        }
      } catch (error) {
        setError(error)
      }
    }

    fetchData()
    SocketManager.socketDeploy(setJoinedRooms, setOpenRooms)

    return () => {
      isMounted = false
    }
  }, [])

  if (error !== null) {
    // Go to react router error element page
    throw error
  }

  if (joinedRooms === null || openRooms === null) {
    return <LoadingVisual />
  }

  return (
    <ErrorContext.Provider value={{ setError }}>
      <Navbar expand={false} sticky="top" className="bg-body-secondary">
        <Container fluid className="d-flex justify-content-around">
          <Navbar.Brand as={Link} to="/">DeepSpeak</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="left-sidebar"
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
      <Container className="p-3">
        <Outlet
          context={{
            joinedRooms,
            openRooms,
            joinedRoomIndex,
            setJoinedRooms,
            setOpenRooms,
            setJoinedRoomIndex,
          }}
        />
      </Container>
    </ErrorContext.Provider>
  )
}

export default App
