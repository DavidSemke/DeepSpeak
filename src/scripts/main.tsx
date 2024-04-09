import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./components/layout/App.jsx"
import ErrorPage from "./components/page/ErrorPage.jsx"
import IndexPage from "./components/page/IndexPage.jsx"
import RoomPage from "./components/page/RoomPage.jsx"
import CreateRoomPage from "./components/page/CreateRoomPage.jsx"
import "../stylesheets/styles.scss"

const router = createBrowserRouter(
  [{
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: "rooms/create-room",
        element: <CreateRoomPage />,
      },
      {
        path: "rooms/:roomId",
        element: <RoomPage />,
      },
    ],
  }],
  {
    basename: '/DeepSpeak'
  }
)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
