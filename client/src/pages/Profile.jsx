import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {userProfileData} from '../api/searchAPI.js'
import { getPostsProfile } from '../api/postAPI.js'
import {followById, unfollowById} from '../api/followAPI.js'
import { useAuth } from'../context/authContext.jsx'
import PostModal from './PostModal.jsx'
import FollowersModal from '../components/FollowersModal.jsx'
import FollowingModal from '../components/FollowingModal.jsx'
import CreatePostModal from '../components/CreatePostModal.jsx'
import EditPostModal from '../components/EditPostModal.jsx'
import NavBar from '../components/NavBar.jsx'
import { PiImagesFill } from "react-icons/pi";
import { FaRegEdit } from "react-icons/fa";
import ClipLoader from 'react-spinners/ClipLoader'
import { RiUserSettingsFill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import BottomNav from '../components/BottomNav.jsx'
import BarLoader from 'react-spinners/BarLoader'
import '../styles/Profile.css'

function Profile() {
    const { username } = useParams();
    const { user, refreshUser, loading } = useAuth();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);

    const [totalData, setTotalData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const [showCreatePostModal, setShowCreatePostModal] = useState(false);

    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);

    const [posts, setPosts] = useState([]);

    const [postModalOpen, setPostModalOpen] = useState(false);
    const [postId, setPostId] = useState(null);

    const postContainerRef = useRef(null)

    const [loadingFollow, setLoadingFollow]  = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    const redirectLogin = () =>{
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
    }

    useEffect(()=>{
      setProfileData();
      },[username])

    useEffect(() => {
      if (!user || !profileUser) return;
      setIsFollowing(user.following.some(f => f.followingUserId === profileUser.id));
      }, [user, profileUser]);

    async function setProfileData(){
      setShowCreatePostModal(false);
      setShowFollowingModal(false);
      setShowFollowersModal(false);
      //ProfileData
      setIsLoading(true);
      userProfileData(username).then(data => {
        setTotalData({
          posts: 0,
          followers: data.followers.length,
          following: data.following.length
        });
        setProfileUser(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log("Error putting profile data", error.message);
      });
      getPostsProfile(username).then(data=>{
        console.log("POSTS", data);
        setPosts(data);
        setTotalData(prev=>{return {...prev, posts:data.length}});
      })
    }
    

    async function handleFollow(){
      if(!user){
        console.log('Login first');
        return redirectLogin();
      }
      try{
        setLoadingFollow(true);
        await followById(profileUser.id);
        await refreshUser();
        setIsFollowing(true);
        setTotalData(prev=>{return {...prev, followers:prev.followers+1}});
      }catch(error){
        console.log("Error trying to follow user", error.message);
      }finally{
        setLoadingFollow(false);
      }
    }

    async function handleUnfollow(){
      if(!user){
        return alert('Login first');
      }
      try{
        setLoadingFollow(true);
        await unfollowById(profileUser.id);
        await refreshUser();
        setIsFollowing(false);
        setTotalData(prev=>{return {...prev, followers:prev.followers-1}});
      }catch(error){
        console.log("Error trying to unfollow user", error.message);
      }finally{
        setLoadingFollow(false);
      }
    }


    
  return (
    <>
      <NavBar/>
      {
        isLoading ?
        <div className='profile-loader'>
          <ClipLoader size={'130px'} color='var(--text-color)' speedMultiplier={0.8}/>
        </div>
        :
        <div className='profile-container'>
          {profileUser && user &&
          <>
            <FollowersModal showFollowersModal={showFollowersModal} setShowFollowersModal={setShowFollowersModal} profileId={profileUser.id} user={user}/>
            <FollowingModal showFollowersModal={showFollowingModal} setShowFollowersModal={setShowFollowingModal} profileId={profileUser.id} user={user}/>
          </>  
          }
          {user && profileUser && user.id === profileUser.id &&
          <>
            <CreatePostModal showCreatePostModal={showCreatePostModal} setShowCreatePostModal={setShowCreatePostModal}/>
            {
              postToEdit && <EditPostModal showEditPostModal={showEditPostModal} setShowEditPostModal={setShowEditPostModal} post={postToEdit}/>
            }
          </>

          }
          
          
          {postModalOpen && postId && <PostModal postId={postId} postModalOpen={postModalOpen} setPostModalOpen={setPostModalOpen}/>}
          <header className='profile-header'>
            {
              profileUser && 
              <>
              <div className='profile-header__container'>
                <img className='profile-header__picture' src={profileUser.picture} alt="profile picture" referrerPolicy="no-referrer"/>
                  <div className='profile-header__user-inf'>
                    <h2 className='profile-header__username'>{profileUser.username}</h2>

                    <div className='profile-header__followers-inf'>
                      <button className='followers-inf_block' onClick={()=>postContainerRef.current.scrollIntoView({behavior: 'smooth' })}>
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
                      {profileUser.description}
                    </p>  
                    {
                      user && user.id === profileUser.id ? 
                      null :
                      !user ? <button className='follow-btn' onClick={()=>redirectLogin()}>Follow</button> :
                      loadingFollow ? <button disabled className='follow-btn'><BarLoader width='100%' color='var(--bg-color)'/></button> :
                      isFollowing ? <button className='follow-btn' onClick={()=>handleUnfollow()}>Unfollow</button> : <button className='follow-btn' onClick={()=>handleFollow()}>Follow</button>
                    }
                  </div>
              </div>
              </>
            }
            {/*--------------------Hidden--------------------*/ }
            {
              user && profileUser && 
              <div className='profile-header__followers-inf-bottom'>
                <button className='followers-inf_block' onClick={()=>postContainerRef.current.scrollIntoView({behavior: 'smooth' })}>
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
            }
            {user && profileUser && user.id === profileUser.id && <button className='create-post-btn' onClick={()=>setShowCreatePostModal(true)}><IoIosCreate size={'32px'}/> Create Post</button>}
            {user && profileUser && user.id === profileUser.id && <button className='account-settings-btn' onClick={()=>navigate('/account')}><RiUserSettingsFill size={'22px'}/> Account settings</button>}
            {
              user && profileUser && user.id === profileUser.id ? 
              null :
              !user ? <button className='bottom-follow' onClick={()=>redirectLogin()}>Follow</button> :
              loadingFollow ? <button disabled className='bottom-follow'><BarLoader width='100%' color='var(--bg-color)'/></button> : 
              <>
                {
                  isFollowing ? <button className='bottom-follow' onClick={()=>handleUnfollow()}>Unfollow</button> : <button className='bottom-follow' onClick={()=>handleFollow()}>Follow</button>
                }
              </>
            }
            {/*--------------------Hidden--------------------*/ }
          </header>
          <main className='profile-main'>
            <div className='posts-container' ref={postContainerRef}>
              {
                posts.map(post=>{
                  return(
                    <div onClick={()=>{setPostId(post.id), setPostModalOpen(true)}} className='post' key={post.id} role="button" tabIndex="0">
                      {
                        post.photos.length>0 ? 
                        <>
                          {post.photos.length>1 && <PiImagesFill className='multiImages'/> }
                          <img src={post.photos[0]}/>
                        </>
                        : <p>{post.content}</p>
                      }
                      {user && post.authorId===user.id  && <button onClick={e=>{e.stopPropagation(), setShowEditPostModal(true), setPostToEdit(post)}} className='post__edit-icon'><FaRegEdit color='white'/></button> }
                      
                    </div> 
                  )
                })
              }
            </div>
          </main>
        </div>
      }
      {(!loading || loadingFollow) && <BottomNav fixed={true}/>}
      
    </>
    
  )
}

export default Profile