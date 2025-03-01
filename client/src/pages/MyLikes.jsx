import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar.jsx';
import { getUserFullPostsLikes } from '../api/likesAPI.js';
import { PiImagesFill } from "react-icons/pi";
import { useAuth } from'../context/authContext.jsx'
import PostModal from './PostModal.jsx';
import RotateLoader from 'react-spinners/RotateLoader'
import ClipLoader from 'react-spinners/ClipLoader'
import BottomNav from '../components/BottomNav.jsx';
import '../styles/MyLikes.css'

function MyLikes() {
    const { user, refreshUser, loading } = useAuth();
    const [curPostId, setCurPostId] = useState('');
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [loadingLikes, setLoadingLikes] = useState(false);
    const [likes, setLikes] = useState([]);

     useEffect(()=>{
            if(loading){
                return
            }
            if(!user){
                console.log('NO USER!', user);
                window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
            }else{
                console.log('Logged');
                setLikesData();
            }
        },[user, loading])

    async function setLikesData(){
        try {
            setLoadingLikes(true)
            const likesData = await getUserFullPostsLikes();
            setLikes(likesData);
            console.log(likesData);
        } catch (error) {
            console.log(error.message);
        }finally{
            setLoadingLikes(false)
        }
        
    }
  return (
    <>
        <NavBar/>
        {
            loading ? <div className='loader-container-my-likes'><RotateLoader color='var(--text-color)'/></div> : !user ? <div className='loader-container-my-likes'><RotateLoader color='var(--text-color)'/></div>:
            <main className='MyLikes'>
                {postModalOpen && curPostId && <PostModal postId={curPostId} postModalOpen={postModalOpen} setPostModalOpen={setPostModalOpen}/>}
                <h1>Liked by Me</h1>
                {!loadingLikes && <p>{likes.length} Posts Liked</p>}
                {
                    loadingLikes ? <div style={{display: 'grid', placeContent:'center', height:'65vh'}}><ClipLoader size={'70px'} color='var(--text-color)'/></div> :
                    <div className='likes__post-container'>
                    {
                        likes.map(like=>{
                            const post = like.post;
                        return(
                            <button onClick={()=>{setCurPostId(post.id), setPostModalOpen(true)}} key={like.id} className='likes__post'>
                            {
                            post.photos.length>0 ? 
                            <>
                                {post.photos.length>1 && <PiImagesFill className='multiImages'/> }
                                <img src={post.photos[0]}/>
                            </>
                            : <p>{post.content}</p>
                            }
                            </button>
                        )  
                        })
                    }
                </div>
                }
                
            </main>
        }
        {!loading && <BottomNav fixed={true}/>}
    </>
  )
}

export default MyLikes