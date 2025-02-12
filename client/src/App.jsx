if (import.meta.env.VITE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
}
import {useState } from 'react'
import { useAuth } from'./context/authContext.jsx'
import Home from './pages/Home.jsx'
import GuestMenu from './pages/GuestMenu.jsx'
import './styles/App.css'

function App() {
  const { user } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  return (
    <>
      { user || guestMode ? <Home/> : <GuestMenu setGuestMode={setGuestMode}/>}
    </>
  )
}

export default App
