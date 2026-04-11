import { useEffect, } from "react"
import { useSocket } from "./socket/socket.js";
import './App.css'
import { Outlet } from "react-router-dom";
function App() {

  const socket = useSocket()

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Welcome to server ${socket.id}`)
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <div className="bgImage min-w-full min-h-screen">
      <Outlet />
    </div>
  )
}

export default App
