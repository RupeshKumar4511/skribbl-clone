import FacesCanvas from './FaceCanvas'
import LobbyMenu from './LobbyMenu'
import Logo from './Logo'

const Home = () => {
  return (
    // min-h-screen ensures it takes full height; flex-col stacks elements vertically
    <div className='min-h-screen w-full flex flex-col items-center p-4'>
      
      {/* Logo/Image Container - Scales with screen width */}
      <div className='w-full max-w-75 md:max-w-112.5 flex justify-center mb-4 mt-4'>
        <Logo/>
      </div>

      {/* Canvas/Face Area */}
      <div className='flex justify-center items-center mb-4'>
        <FacesCanvas />
      </div>

      {/* Lobby Menu - Will be centered by the parent flex container */}
      <div className='w-full flex justify-center items-center'>
        <LobbyMenu />
      </div>
      
    </div>
  )
}


export default Home
