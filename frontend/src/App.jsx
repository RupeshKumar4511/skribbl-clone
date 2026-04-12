import './App.css'
import { Outlet } from "react-router-dom";
import { SocketProvider } from './socket/SocketProvider';
function App() {

  return (
    <SocketProvider>
      <div className="bgImage min-w-full min-h-screen">
        <Outlet />
      </div>
    </SocketProvider>
  )
}

export default App
