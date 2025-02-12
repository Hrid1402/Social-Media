import React, { useState,useEffect } from 'react'
import {getFollowers} from '../api/followAPI.js'
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../styles/FollowersModal.css'
import { useNavigate } from 'react-router-dom';

function FollowersModal({showFollowersModal, setShowFollowersModal, profileId}) {
    const [followersData, setFollowersData] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        if(showFollowersModal==true){
          console.log("fetching");
          handleGetFollowers();
        }
    }, [showFollowersModal])
    async function handleGetFollowers(){
    const followers = await getFollowers(profileId);
      console.log(followers);
      setFollowersData(followers);
    }

  return (
    <Rodal className='rodal' enterAnimation='slideDown' leaveAnimation='slideDown' visible={showFollowersModal} onClose={()=>setShowFollowersModal(false)}>
          <div className='followersTitle'>Followers</div>
          <div className='followersContainer'>
              { followersData && followersData.map(f=>{
                const follower = f.followedUser;
                return (
                  <button onClick={()=>navigate(`/profile/${follower.username}`)} className='follower' key={follower.id}>
                    <img src={follower.picture} referrerPolicy="no-referrer"/>
                    <p>{follower.username}</p>
                  </button>
                )
              })}
          </div>
      </Rodal>
  )
}

export default FollowersModal