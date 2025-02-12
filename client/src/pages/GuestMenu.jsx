import React from 'react'
import { FaUserSecret } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function GuestMenu({setGuestMode}) {
  return (
    <div>
      <h1>Social media</h1>
      <button onClick={()=>window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`}><FcGoogle />Continue with Google</button>
      <button onClick={()=>setGuestMode(true)}><FaUserSecret /> Guest mode</button>
    </div>
  )
}

export default GuestMenu