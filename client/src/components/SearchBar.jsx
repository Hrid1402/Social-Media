import React, {useState, useRef} from 'react'
import { CiSearch } from "react-icons/ci";
import {searchUser} from '../api/searchAPI.js'
import useOutsideClick from '../hooks/useOutsideClick.jsx';
import { useNavigate } from 'react-router-dom';

function SearchBar(){
    const [toSearch, setToSearch] = useState('');
    const [foundUsers, setFoundUsers] = useState(null);
    const [hideResults, setHideResults] = useState(true);
    const navigate = useNavigate();
    const searchBarRef = useRef(null);  
  
    useOutsideClick(searchBarRef, ()=>setHideResults(true));
  
    async function handleSearch(){
      const searchedUsers = await searchUser(toSearch);
      setFoundUsers(searchedUsers);
      setHideResults(false);
      console.log(searchedUsers);
    }
    return(
      <div ref={searchBarRef} className='search-bar'>
        <input value={toSearch} type="text" onChange={e=>setToSearch(e.target.value)}/>
        <button className='search-bar__search-btn' onClick={()=>handleSearch()}><CiSearch color='black'/></button>
        <div className={`search-bar__results ${hideResults ? 'hide' : ''}`}>
          {
            foundUsers && 
            <>
              <p className='search-bar__results__text'>Results for {toSearch}:</p>
              <div className='search-bar__results__user-list'>
              {
                foundUsers.map(u=>{
                  return(
                    <button onClick={()=>navigate(`/profile/${u.username}`)} className='search-bar__results__user-btn' key={u.id}>
                      <img src={u.picture} alt="picture" referrerPolicy="no-referrer" />
                      <p>{u.username}</p>
                    </button>
                  )
                })
              }
              </div>
            </>
            
          }
        </div>
      </div>
    )
  }

export default SearchBar