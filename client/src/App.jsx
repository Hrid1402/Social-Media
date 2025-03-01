if (import.meta.env.VITE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
}
import React, {useEffect} from 'react';
import {useState } from 'react'
import { useAuth } from'./context/authContext.jsx'
import Home from './pages/Home.jsx'
import GuestMenu from './pages/GuestMenu.jsx'
import './styles/App.css'

import RotateLoader from 'react-spinners/RotateLoader'
function App() {
  const { user, loading } = useAuth();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [guestMode, setGuestMode] = useState(false);
  
  return (
    <>

      {loading && !(user || guestMode)? 
      <div className='main-loader'>
        <RotateLoader color='var(--text-color)'/>
      </div> :  user || guestMode ? <Home/> : <GuestMenu setGuestMode={setGuestMode}/>}
    </>
  )
}

export default App
