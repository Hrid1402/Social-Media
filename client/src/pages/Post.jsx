import React from 'react'
import { useParams } from 'react-router-dom';
import PostModal from './PostModal';
import NavBar from '../components/NavBar';
import { useAuth } from'../context/authContext.jsx'
import BottomNav from '../components/BottomNav';
import '../styles/Post.css'


function Post() {
    const { loading } = useAuth();
    const { postId } = useParams();
  return (
    <>
        <NavBar/>
        <PostModal fixed={true} showCloseButton={false} postId={postId} postModalOpen={true} setPostModalOpen={()=>{}}/>
        {!loading && <BottomNav  fixed={true}/>}
    </>
   
    
  )
}

export default Post