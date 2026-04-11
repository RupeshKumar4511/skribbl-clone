import image from '../assets/logo.gif'

const Logo = () => {
  return (
    <div>
      <img 
          src={image} 
          alt="skribbl-image" 
          className="w-full h-auto object-contain"
        />
    </div>
  )
}

export default Logo
