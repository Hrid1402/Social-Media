import React, {useEffect, useState, useRef} from 'react'
import { useAuth } from'../context/authContext.jsx'
import { getUserPostsLikes, likePost, unlikePost } from '../api/likesAPI';
import NavBar from '../components/NavBar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { getGuestFeed, getFollowersFeed, getFeedQuote } from '../api/postAPI.js'
import { FaChevronLeft, FaChevronRight, FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import PostModal from './PostModal.jsx';
import BarLoader from 'react-spinners/BarLoader'
import '../styles/Home.css'
import ClipLoader from 'react-spinners/ClipLoader'
import { useNavigate } from 'react-router-dom';

function Home() {
  let cursor = null;
  let curQuote = useRef(getFeedQuote());
  const { user, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedType, setFeedType] = useState('feed');
  const loadingRef = useRef(false);
  const mainRef = useRef(null);

  useEffect(()=>{
    refreshUser();
    setPostsData();
    if(user){
      getUserPostsLikes().then(likes=>{
        setUserLikes(likes)
        console.log('user likes', likes);
      });
    }
  },[]);

  

  useEffect(() => {
    const mainContainer = mainRef.current;
    if (!mainContainer) return;
      const handleScroll = () => {
      if (!loadingRef.current && mainContainer.scrollTop + mainContainer.clientHeight >= mainContainer.scrollHeight - 10) {
        console.log("Reached bottom!");
        loadPosts(feedType);
      }
    };
    mainContainer.addEventListener("scroll", handleScroll);
    return () => mainContainer.removeEventListener("scroll", handleScroll);
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function changeFeed(feedType){
    setFeedType(feedType);
    setPosts([]);
    cursor = null;
    loadPosts(feedType);
  }

  async function loadPosts(feedType='feed'){
    console.log('loading posts....')
    console.log('cursor', cursor);
    try {
      setLoading(true);
      loadingRef.current = true;
      let response = [];
      if(feedType === 'feed'){
        response = await getGuestFeed(cursor);
      }else{
        const followingsId = user.following.map(f=>{
          return f.followingUserId
        });
        console.log('ids',followingsId);
        if(followingsId.length===0){
          response = [];
        }else{
          response = await getFollowersFeed(cursor, followingsId);
          console.log('following FEED', response);
        }
        
      }
      console.log(response);
      cursor = response.length > 0 ? response[response.length - 1].id : cursor;
      if(feedType === 'feed'){
        setPosts(prev=>[...prev, ...shuffleArray([...response])]);
      }else{
        setPosts(prev=>[...prev, ...response]);
      }
    } catch (error) {
      console.log(error.message);
    }finally{
      loadingRef.current = false;
      setLoading(false);
    }
    
  }
  async function setPostsData(){
    await loadPosts();
  }


  return (
    <div className='home'>
        <NavBar shadow={user}/>
        <main className='home__main' ref={mainRef}>
        {
            user && 
            <div className='feeds-btns'>
              <button disabled={feedType === 'feed'} className='feed-btn' onClick={()=>changeFeed('feed')} >Feed</button>
              <button disabled={feedType === 'followers'} className='feed-btn' onClick={()=>changeFeed('followers')}>Following</button>
            </div>
        }
          {feedType === 'followers' ? <p className='home__quote'>{user && user.following.length===0 ? 'Your Following list is empty. Follow people to see their posts here!' : 'Here are the latest updates from people you follow!'}</p> : <p className='home__quote'>{curQuote.current}</p>} 
          <div className='main__posts-container'>
            {
              posts.map(p=>{
                return(
                  <PostPreview
                  key={p.id}
                  id={p.id}
                  username={p.author.username} 
                  date={p.createdAt}
                  userPfp={p.author.picture}
                  textOnly={!p.photos.length > 0}
                  multipleImgs={p.photos.length > 1}
                  content={p.content}
                  photos={p.photos}
                  likes={p._count.likes}
                  userLikes={userLikes}
                  comments={p._count.comments}
                  />
                )
              })
            }
            {loading && 
            <div className='posts-container-loader'>
              <BarLoader color='var(--text-color)'/>
            </div>  
              }
          </div>
        </main>
        <BottomNav/>
    </div>  
  )
}
function PostPreview({id, username, date, userPfp, textOnly, multipleImgs, content, photos, likes, userLikes, comments}){
  const [postLikes, setPostLikes] = useState(likes);
  const [postComments, setPostComments] = useState(comments);

  const [likeLoading, setLikeLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);
  const { user, refreshUser } = useAuth();

  const [postModalOpen, setPostModalOpen] = useState(false);
  const navigate = useNavigate();

  const redirectLogin = () =>{
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
  }

  useEffect(()=>{
    if(user){ 
      setLiked(userLikes.some(like=>like.postId===id));
      setLikeLoading(false);
    }else{
      setLikeLoading(false);
      setLiked(false);
    }
    
  },[]);

  async function toggleLike() {
    if(!user){
      console.log('Login first');
      return redirectLogin();
    }
    try {
      setLikeLoading(true);
      if(liked){
        await unlikePost(id);
        setLiked(false);
        setPostLikes(prev=>prev-1);
      }else{
        await likePost(id);
        setLiked(true);
        setPostLikes(prev=>prev+1);
      }
    } catch (error) {
      console.log('Error trying to handle like', error.message);
    }finally{
      setLikeLoading(false);
    }
  }

  const handleShare = async (path) => {
    const fullUrl = `${window.location.origin}${path}`; // Combine base URL with path
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check this out!',
          text: 'Look at this awesome content!',
          url: fullUrl, // Use the dynamically generated URL
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported on this browser');
    }
  };
  
  return(
    <>
      {postModalOpen && id && <PostModal postId={id} postModalOpen={postModalOpen} setPostModalOpen={setPostModalOpen}/>}
      <div className='main__post' onClick={()=>setPostModalOpen(true)}>
      <div className='main__post__top'>
        <button className='post__userData' onClick={()=>navigate('/profile/'+username)}>
          <img src={userPfp} referrerPolicy='no-referrer'/>
          <p>{username}</p>
        </button>
        <p className='main__post__date'>{(new Date(date).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }))}</p>
        {content && !textOnly && <p className='post_top_text'>{content.length>350 ? content.substring(0, 250)+'...' : content}</p>}
      </div>
      <div className='post__content'>
        {
          textOnly ? 
          <div className='post__content__text'>
            <p className='post__content__text-content'>{content.length>350 ? content.substring(0, 350)+'...' : content}</p>
          </div>
          : multipleImgs?
          <>
            {photoIndex !== 0 && <button className='leftBtn' onClick={e=>{e.stopPropagation(),setPhotoIndex(prev=>prev-1)}}><FaChevronLeft /></button>}
            {photoIndex < photos.length-1 && <button className='rightBtn' onClick={e=>{e.stopPropagation(), setPhotoIndex(prev=>prev+1)}}><FaChevronRight /></button>}
            <div className='amountPhotos'>
              {photos.map((p, i)=>{
                return(
                  <div key={i} className={`circle ${i===photoIndex ? 'filled' : ''}`}></div>
                )
              })}
            </div>
            <img src={photos[photoIndex]} className='post__content__img'/>
          </>
          :
          <img src={photos[0]} className='post__content__img'/>
        }
      </div>
      <div className='post__interaction-bar'>
          {
            likeLoading ? <ClipLoader color={'var(text-color)'} /> :
            <div className='like-btn'>
              <button onClick={e=>{e.stopPropagation(), toggleLike()}}>
                {liked ? <AiFillHeart color="rgb(255 48 64)" size={30} /> : <AiOutlineHeart  className='likeSVG' size={30} />}
              </button>
              <p>{postLikes}</p>
            </div>
          }
          <button className='comments-btn' onClick={()=>setPostModalOpen(true)}>
            <FaRegComment />
            <p>{postComments}</p>
          </button>
          <button className='share-btn' onClick={e=>{e.stopPropagation(),handleShare('/post/'+id)}}>
            <PiShareFat />
          </button>
      </div>
    </div>
    </>
  )
}

export default Home