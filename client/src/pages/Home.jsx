import React, {useEffect} from 'react'
import { useAuth } from'../context/authContext.jsx'
import NavBar from '../components/NavBar.jsx'
import { logout } from '../api/authAPI.js'
import '../styles/Home.css'

function Home() {
  const { user, refreshUser } = useAuth();

  useEffect(()=>{
    refreshUser();
  },[]);
  return (
    <div className='home'>
        <NavBar/>
        {user ? <h2>Welcome {user.username}</h2> : <h2>Browsing as Guest</h2>}
        <button onClick={()=>logout()}>Logout</button>
    </div>
    
  )
}

export default Home