import React, { useState,useEffect } from 'react'
import {getFollowers} from '../api/followAPI.js'
import Rodal from 'rodal';
import { useAuth } from'../context/authContext.jsx'
import {followById, unfollowById} from '../api/followAPI.js'
import 'rodal/lib/rodal.css';
import '../styles/FollowersModal.css'
import ClipLoader from 'react-spinners/ClipLoader'
import BarLoader from 'react-spinners/BarLoader'
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";

function FollowersModal({showFollowersModal, setShowFollowersModal, profileId, user}) {
    const [followersData, setFollowersData] = useState(null);
    const [searchingName, setSearchingName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(showFollowersModal==true){
          console.log("fetching");
          handleGetFollowers();
        }
    }, [showFollowersModal])
    async function handleGetFollowers(){
      try {
        setLoading(true);
        const followers = await getFollowers(profileId);
        console.log(followers);
        setFollowersData(followers);
      } catch (error) {
        console.log(error.error);
      }finally{
        setLoading(false);
      }
      
    }

  return (
    <Rodal className='rodalFollower' enterAnimation='slideDown' leaveAnimation='slideDown' visible={showFollowersModal} onClose={()=>setShowFollowersModal(false)}>
          {
            loading  ? <div style={{display: 'grid', placeContent:'center', height:'65vh'}}><ClipLoader size={'70px'} color='var(--text-color)'/></div> : 
            <>
              <div className='followersTitle'>Followers</div>
              <div className='follower-search-input-container'>
                            <div className='follower-input-search'><CiSearch size={'30px'}/></div>
                            <input type="text" value={searchingName} onChange={e=>setSearchingName(e.target.value)}/>
                            {searchingName && <button onClick={()=>setSearchingName('')} className='follower-input-clear-btn'><MdClear size={'28px'}/></button>}
                          </div>
                          {searchingName && <p className='follower-searched-name'>Searching for: {searchingName}</p>}
              <div className='followersContainer'>
                  { followersData && followersData.map(f=>{
                    if(!f.followedUser.username.toUpperCase().startsWith(searchingName.toUpperCase())){
                      return
                    }
                    return <Follower key={f.followedUser.id} follower={f.followedUser} user={user}/>
                  })}
              </div>
            </>
          }
      </Rodal>
  )
}
function Follower({follower, user}){

  const {refreshUser} = useAuth();

  async function handleFollow(id){
        try{
          setLoading(true);
          await followById(id);
          await refreshUser();
          setIsFollowing(true);
        }catch(error){
          console.log("Error trying to follow user", error.message);
        }finally{
          setLoading(false);
        }
  }

    async function handleUnfollow(id){
        try{
          setLoading(true);
          await unfollowById(id);
          await refreshUser();
          setIsFollowing(false);
        }catch(error){
          console.log("Error trying to unfollow user", error.message);
        }finally{
          setLoading(false);
        }
      }

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(user.following.some(f => f.followingUserId === follower.id));
  return(
    <div role="button" tabIndex="0" onClick={()=>navigate(`/profile/${follower.username}`)} className='follower'>
      <div className='follower__user-data'>
        <img src={follower.picture} referrerPolicy="no-referrer"/>
        <p>{follower.username}</p>
      </div>
      {user.id === follower.id ? null : loading ? <button disabled className='follower-box__button' style={{padding:'15px 20px'}}><BarLoader width='40px' color='var(--text-color)'/></button> :  isFollowing ? <button className='follower-box__button' onClick={e=>{e.stopPropagation(), handleUnfollow(follower.id)}}>Unfollow</button> : <button className='follower-box__button' onClick={e=>{e.stopPropagation(), handleFollow(follower.id)}}>Follow</button>}
    </div>
  )
}

export default FollowersModal