import React from 'react'
import SearchBar from '../components/SearchBar.jsx'
import { useAuth } from'../context/authContext.jsx'
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authAPI.js'
import '../styles/Home.css'

function NavBar() {
    const { user } = useAuth();
    const navigate = useNavigate();
  return (
    <nav className='nav-bar'>
          <Link to={'/'} className='nav-bar__title'>Social Media Clone</Link>
          <SearchBar/>
          {user ?
            <div className='nav-bar__user__btns'>
                <button className='nav-bar__user'
                    onClick={()=>navigate(`/profile/${user.username}`)}>
                    <img src={user.picture} alt="profile picture" />
                    <p>{user.username}</p>
                </button>
                <button onClick={()=>logout()}>
                    <p>Logout</p>
                </button>
            </div> : <button onClick={()=>window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`}>Get Started</button>}
    </nav>
  )
}

export default NavBar