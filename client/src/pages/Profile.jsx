import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {userProfileData} from '../api/searchAPI.js'
import {followById, unfollowById} from '../api/followAPI.js'
import { useAuth } from'../context/authContext.jsx'
import FollowersModal from '../components/FollowersModal.jsx'
import FollowingModal from '../components/FollowingModal.jsx';
import NavBar from '../components/NavBar.jsx'
import '../styles/Profile.css'

function Profile() {
    const { username } = useParams();
    const { user, refreshUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);

    const [totalData, setTotalData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false); 

    const redirectLogin = () =>{
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
    }

    useEffect(()=>{
      setProfileData();
      },[username])

    useEffect(() => {
      if (!user || !profileUser) return;
      console.log("TRIGGERED!")
      console.log(user);
      setIsFollowing(user.following.some(f => f.followingUserId === profileUser.id));
      }, [user, profileUser]);

    async function setProfileData(){
      setShowFollowingModal(false);
      setShowFollowersModal(false);
      try {
        const data = await userProfileData(username)
        setTotalData({
          posts: 13,
          followers: data.followers.length,
          following: data.following.length
        })
        setProfileUser(data);
        console.log(data);
      } catch (error) {
        console.log("Error putting profile data", error.message)
      }
    }
    

    async function handleFollow(){
      if(!user){
        console.log('Login first');
        return redirectLogin();
      }
      try{
        await followById(profileUser.id);
        await refreshUser();
        setIsFollowing(true);
        setTotalData(prev=>{return {...prev, followers:prev.followers+1}});
      }catch(error){
        console.log("Error trying to follow user", error.message);
      }
    }

    async function handleUnfollow(){
      if(!user){
        return alert('Login first');
      }
      try{
        await unfollowById(profileUser.id);
        await refreshUser();
        setIsFollowing(false);
        setTotalData(prev=>{return {...prev, followers:prev.followers-1}});
      }catch(error){
        console.log("Error trying to unfollow user", error.message);
      }
    }
  return (
    <>
      {profileUser && 
      <>
        <FollowersModal showFollowersModal={showFollowersModal} setShowFollowersModal={setShowFollowersModal} profileId={profileUser.id}/>
        <FollowingModal showFollowersModal={showFollowingModal} setShowFollowersModal={setShowFollowingModal} profileId={profileUser.id}/>
      </>
      
      }
      <NavBar/>
      <header className='profile-header'>
        {
          profileUser && 
          <>
          <div className='profile-header__container'>
            <img className='profile-header__picture' src={profileUser.picture} alt="profile picture" referrerPolicy="no-referrer"/>
              <div className='profile-header__user-inf'>
                <h2 className='profile-header__username'>{profileUser.username}</h2>

                <div className='profile-header__followers-inf'>
                  <button className='followers-inf_block'>
                    <p className='nro'>{totalData.posts}</p>
                    <p>Posts</p>
                  </button>

                  <button className='followers-inf_block' onClick={() => user ? setShowFollowersModal(true) : redirectLogin() }> 
                    <p className='nro'>{totalData.followers}</p>
                    <p>Followers</p>
                  </button>

                  <button className='followers-inf_block' onClick={() => user ?setShowFollowingModal(true) : redirectLogin() }>
                    <p className='nro'>{totalData.following}</p>
                    <p>Following</p>
                  </button>
                </div>
                <p className='profile-header__description'>  
                  📍 NYC | Coffee & Travel Lover ☕✈️ <br />  
                  💭 Dream big, work hard, stay kind <br />  
                  📸 @myphotography  
                </p>  
                {
                  user && user.id === profileUser.id ? 
                  null :
                  !user ? <button onClick={()=>redirectLogin()}>Follow</button> :
                  isFollowing ? <button onClick={()=>handleUnfollow()}>Unfollow</button> : <button onClick={()=>handleFollow()}>Follow</button>
                }
              </div>
          </div>
          </>
        }
      </header>
    </>
  )
}

export default Profile