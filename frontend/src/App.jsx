import { useEffect, useMemo } from "react"
import { io } from "socket.io-client";
import Home from './components/Home.jsx'
function App() {

  const socket = useMemo(() => io("http://localhost:3000"), [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Welcome to server ${socket.id}`)
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <div className="min-w-full min-h-full">
      <Home />
    </div>
  )
}

export default App
