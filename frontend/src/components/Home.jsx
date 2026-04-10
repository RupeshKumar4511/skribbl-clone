import FacesCanvas from './FaceCanvas'
import style from './Home.component.module.css'
import image from '../assets/logo.gif'
import LobbyMenu from './LobbyMenu'

const Home = () => {
  return (
    // min-h-screen ensures it takes full height; flex-col stacks elements vertically
    <div className={`${style['background']} min-h-screen w-full flex flex-col items-center p-4`}>
      
      {/* Logo/Image Container - Scales with screen width */}
      <div className='w-full max-w-[300px] md:max-w-[450px] flex justify-center mb-4 mt-4'>
        <img 
          src={image} 
          alt="skribbl-image" 
          className="w-full h-auto object-contain"
        />
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
