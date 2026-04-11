import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx'
import Game from './pages/Game.jsx'

const router = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      {
        index: true, element: <Home />
      },
      {
        path: '/game', element: <Game />
      },
      {
        path: '/game/:roomId', element: <Game />
      }
    ]
  },

])
createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

)
