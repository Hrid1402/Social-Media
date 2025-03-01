import React, {useState, useRef} from 'react'
import { CiSearch } from "react-icons/ci";
import {searchUser} from '../api/searchAPI.js'
import useOutsideClick from '../hooks/useOutsideClick.jsx';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';

function SearchBar(){
    const [toSearch, setToSearch] = useState('');
    const [searchedTxt, setSearchedTxt] = useState('');
    const [foundUsers, setFoundUsers] = useState(null);
    const [hideResults, setHideResults] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchBarRef = useRef(null);  
  
    useOutsideClick(searchBarRef, ()=>setHideResults(true));
  
    async function handleSearch(){
      setLoading(true);
      setHideResults(false);
      setSearchedTxt(toSearch);
      const searchedUsers = await searchUser(toSearch);
      setFoundUsers(searchedUsers);
      setHideResults(false);
      setLoading(false);
      console.log(searchedUsers);
    }
    return(
      <div ref={searchBarRef} className='search-bar'>
        <input placeholder='Search' value={toSearch} type="text" onChange={e=>setToSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}/>
        <button className='search-bar__search-btn' onClick={()=>handleSearch()}><CiSearch color='black'/></button>
        <div className={`search-bar__results ${hideResults ? 'hide' : ''}`}>
          {
            loading?
            <div className='search-bar__loader'>
              <ClipLoader size={'15px'}/>
              <p>Searching '{searchedTxt}'</p>
            </div>
            :
            <>
            {
              foundUsers && 
              <>
                <p className='search-bar__results__text'>Results for {searchedTxt}:</p>
                <div className='search-bar__results__user-list'>
                {
                  foundUsers.map(u=>{
                    return(
                      <button onClick={()=>{setHideResults(true), navigate(`/profile/${u.username}`)}} className='search-bar__results__user-btn' key={u.id}>
                        <img src={u.picture} alt="picture" referrerPolicy="no-referrer" />
                        <p>{u.username}</p>
                      </button>
                    )
                  })
                }
                </div>
              </>
            }
            </>
          }
        </div>
      </div>
    )
  }

export default SearchBar