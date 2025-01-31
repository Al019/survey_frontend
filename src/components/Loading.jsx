import Logo from '../assets/images/logo.png'
import BeatLoader from "react-spinners/BeatLoader"

const WebLoading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <img src={Logo} className='w-60' />
    </div>
  )
}

const ScreenLoading = ({ loading }) => {
  return (
    <div className={`ml-[272px] z-10 fixed inset-0 flex items-center justify-center ${!loading && 'hidden'}`}>
      <BeatLoader loading={loading} size={24} color="#4caf50" />
    </div>
  )
}

export { WebLoading, ScreenLoading }