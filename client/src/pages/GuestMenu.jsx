import React from 'react'
import { FaUserSecret } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdMonochromePhotos } from "react-icons/md";
import ThemeBtn from '../components/ThemeBtn';
import '../styles/GuestMenu.css'

function GuestMenu({setGuestMode}) {
  return (
    <main className='guest-content'>
      <div className='guest-theme-btn'>
        <ThemeBtn />
      </div>
      <div className='guest-logo'>
           <MdMonochromePhotos />
            <h1>InstaGo</h1>
          </div>
      <div className="guest-buttons">
      <button className='guest-buttons__google' onClick={()=>window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`}><FcGoogle />Continue with Google</button>
      <button className='guest-buttons__guest' onClick={()=>setGuestMode(true)}><FaUserSecret /> Guest mode</button>
      </div>
    </main>
  )
}

export default GuestMenu