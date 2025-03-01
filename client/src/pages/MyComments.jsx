import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar.jsx';
import { getCommentsFromUser } from '../api/commentAPI.js';
import { useAuth } from'../context/authContext.jsx'
import PostModal from './PostModal.jsx';
import BottomNav from '../components/BottomNav.jsx';
import RotateLoader from 'react-spinners/RotateLoader'
import ClipLoader from 'react-spinners/ClipLoader'
import '../styles/MyComments.css'

function MyComments() {
    const { user, refreshUser, loading } = useAuth();
    const [curPostId, setCurPostId] = useState('');
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [comments, setComments] = useState([]);

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
            setLoadingComments(true);
            const commentsData = await getCommentsFromUser();
            setComments(commentsData);
            console.log(commentsData);
        } catch (error) {
            console.log(error.message);   
        }finally{
            setLoadingComments(false);
        }
        
    }
  return (
    <>
        <NavBar/>
        {
            loading ? <div className='loader-container-my-likes'><RotateLoader color='var(--text-color)'/></div> : !user ? <div className='loader-container-my-likes'><RotateLoader color='var(--text-color)'/></div>:
            <main className='MyComments'>
                {postModalOpen && curPostId && <PostModal postId={curPostId} postModalOpen={postModalOpen} setPostModalOpen={setPostModalOpen}/>}
                <h1 >My Comments</h1>
                {!loadingComments && <p>{comments.length} Comments Made</p>}
                
                {
                    loadingComments ? <div style={{display: 'grid', placeContent:'center', height:'65vh'}}><ClipLoader size={'70px'} color='var(--text-color)'/></div> :
                    <div className='comments__post-container'>
                    {
                        comments.map(comment=>{
                        return(
                            <button onClick={()=>{setCurPostId(comment.postId), setPostModalOpen(true)}} key={comment.id} className='my-comments__comment'>
                                <img src={user.picture} referrerPolicy='no-referrer' />
                                <p>{comment.parent&&<span>@{comment.parent.author.username}</span>} {comment.content}</p>
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

export default MyComments