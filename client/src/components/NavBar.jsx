import React from 'react'
import SearchBar from '../components/SearchBar.jsx'
import { Link } from 'react-router-dom';
import ThemeBtn from './ThemeBtn.jsx';
import { MdMonochromePhotos } from "react-icons/md";
import '../styles/Home.css'

function NavBar() {
  return (
    <nav className='nav-bar'>
          <div className='logo'>
            <Link to={'/'}><MdMonochromePhotos /></Link>
            <Link to={'/'} className='nav-bar__title'>InstaGo</Link>
          </div>
          <SearchBar/>
          <ThemeBtn/>
    </nav>
  )
}

export default NavBar