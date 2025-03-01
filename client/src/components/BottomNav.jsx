import React from 'react'
import { useAuth } from'../context/authContext.jsx'
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { logout } from '../api/authAPI.js'
import '../styles/Home.css'


function BottomNav({fixed=false}) {
    const { user } = useAuth();
    const navigate = useNavigate();
  return (
    <nav className={`bottom-bar ${fixed ? 'fixed-bar':''}`} >
          {user ?
            <div className='nav-bar__user__btns'>
                <button className='nav-bar__user'
                    onClick={()=>navigate(`/profile/${user.username}`)}>
                    <img src={user.picture} alt="profile picture" referrerPolicy='no-referrer'/>
                    <p>{user.username}</p>
                </button>
                <button className='nav-bar__logout' onClick={()=>logout()}>
                  <CiLogout />
                </button>
            </div> : <button onClick={()=>window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`} className='start-google-btn'><FcGoogle/>Get Started</button>}
    </nav>
  )
}

export default BottomNav