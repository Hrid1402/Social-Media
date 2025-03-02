import { useEffect, useState } from 'react';
import { getPostFromId } from '../api/postAPI';
import { getUserPostsLikes, likePost, unlikePost } from '../api/likesAPI';
import { addComment, getCommentsFromPost } from '../api/commentAPI.js';
import { IoSend } from "react-icons/io5";
import { useAuth } from'../context/authContext.jsx'
import '../styles/PostModal.css'
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { FaChevronLeft, FaChevronRight, FaRegComment } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import Comment from '../components/Comment';
import { useNavigate } from 'react-router-dom';
import PuffLoader from 'react-spinners/PuffLoader'
import ClipLoader from 'react-spinners/ClipLoader'
import BarLoader from 'react-spinners/BarLoader'

function PostModal({postId, postModalOpen, setPostModalOpen, showCloseButton=true, fixed=false}) {


    const [invalidId, setInvalidId]  = useState(false);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [postData, setPostData] = useState(null);

    const [postLikes, setPostLikes] = useState(null);
    const [allPhotos, setAllPhotos] = useState([]);
    const [liked, setLiked] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const [likeLoading, setLikeLoading] = useState(false);

    const [commentLoading, setCommentLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");

    const [showComments, setShowComments] = useState(false);

    const redirectLogin = () =>{
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
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
  

    useEffect(()=>{
        getPostData(postId);
    }, [postId])

    function organizeComments(comments) {
      const commentMap = new Map(); // Store comments by their ID
      const rootComments = []; // Store top-level comments
  
      // Initialize the comment map
      comments.forEach(comment => {
          comment.replies = [];
          commentMap.set(comment.id, comment);
      });
  
      // Organize comments into a tree structure
      comments.forEach(comment => {
          if (comment.parentId) {
              const parent = commentMap.get(comment.parentId);
              if (parent) {
                  parent.replies.push(comment);
              }
          } else {
              rootComments.push(comment);
          }
      });
  
      return rootComments;
  }
  

    async function getPostData(id){
        setLikeLoading(true);
        getPostFromId(id).then(postData=>{
          if(!postData){
            setInvalidId(true);
            return
          }
          postData.textOnly = !postData.photos.length > 0;
          postData.multipleImgs = postData.photos.length > 1;
          setAllPhotos(postData.photos);
          setPostData(postData);
          setPostLikes(postData.likes.length);
        }).catch(error=>console.log(error));
        getCommentsFromPost(id).then(comments=>{
          const organizedComments = organizeComments(comments);
          console.log('comments from id', id);
          console.log('comments:', organizedComments);
          setComments(organizedComments);
        })
        if(user){
          getUserPostsLikes().then(likes=>{
            setLiked(likes.some(like=>like.postId===postId));
            setLikeLoading(false);
            console.log('likes',likes);
          });
        }else{
          setLikeLoading(false);
        }
    }

    async function handleAddComment(commentId){
      if(!user){
        console.log('Login first');
        return redirectLogin();
      }
      console.log('handling comment');
      setCommentLoading(true);
      const newComment = await addComment(postId, commentId, commentContent);
      console.log('newComment', newComment);
      setComments(prev=>[{author: user,...newComment}, ...prev]);
      setCommentLoading(false);
      setCommentContent("");
    }

    async function toggleLike() {
      if(!user){
        console.log('Login first');
        return redirectLogin();
      }
      try {
        setLikeLoading(true);
        if(liked){
          await unlikePost(postId);
          setLiked(false);
          setPostLikes(prev=>prev-1);
        }else{
          await likePost(postId);
          setLiked(true);
          setPostLikes(prev=>prev+1);
        }
      } catch (error) {
        console.log('Error trying to handle like', error.message);
      }finally{
        setLikeLoading(false);
      }
    }

    function timeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
    
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
    
      if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
      if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
      if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      return `just now`;
    }

    function getFontSize(text) {
      const minSize = 18;  // Smallest font size
      const maxSize = 110;  // Maximum readable font size
      const lengthFactor = 0.5; // Controls how fast the font shrinks
  
      const calculatedSize = maxSize - text.length * lengthFactor;
      return `${Math.max(minSize, calculatedSize)}px`;
    }

    if(invalidId){
      return <div style={{display:'grid', placeContent:'center'}}><h1 style={{color:'var(--text-color)'}}>This post doesn’t exist</h1></div>
    }

    return (
      <Rodal showCloseButton={showCloseButton} className={`postRodal ${fixed ? 'fixed-rodal' : ''}`} visible={postModalOpen} onClose={()=>setPostModalOpen(false)} animation={'zoom'}>
        {
            postData ? 
            <div className='postData'>
              {
                !showComments ? 
                <>
                {/* -------------------- hidden ----------------------  */}
                  <div className='top-post-data'>
                    <button className='top-post-data__user-data' onClick={()=>navigate(`/profile/${postData.author.username}`)}>
                        <img src={postData.author.picture} referrerPolicy="no-referrer"/>
                        <p>{postData.author.username}</p>
                    </button>
                    <p className='postData__right__date'>{timeAgo(postData.createdAt)}</p>
                    {postData.content && !postData.textOnly && <p className='text-post-content-right'>{postData.content}</p>}
                  </div>
                  {/* -------------------- hidden ----------------------  */}
                  <div className='postData__left'>
                    {
                      postData.textOnly ? 
                      <div className='postData__left__text-content'>
                        <p style={{ fontSize: getFontSize(postData.content) }} className='text-content'>{postData.content}</p>
                      </div>
                      :
                      <>
                        {
                          postData.multipleImgs && 
                          <>
                            {photoIndex !== 0 && <button className='leftBtn' onClick={()=>setPhotoIndex(prev=>prev-1)}><FaChevronLeft /></button>}
                            {photoIndex < allPhotos.length-1 && <button className='rightBtn' onClick={()=>setPhotoIndex(prev=>prev+1)}><FaChevronRight /></button>}
                            <div className='amountPhotos'>
                              {postData.photos.map((p, i)=>{
                                return(
                                  <div className={`circle ${i===photoIndex ? 'filled' : ''}`}></div>
                                )
                              })}
                            </div>
                          </>
                        }
                        <img src={allPhotos[photoIndex]} className='postData__left__content'/>
                      </>
                      
                      
                    }
                  </div>
                  {/* -------------------- hidden ----------------------  */}
                  <div className='bottom-interaction-bar'>
                      {
                        likeLoading ? <ClipLoader color='var(--text-color)'/> :
                        <div className='like-btn'>
                          <button onClick={()=>toggleLike()}>
                            {liked ? <AiFillHeart color="rgb(255 48 64)" size={30} /> : <AiOutlineHeart size={30} />}
                          </button>
                          <p>{postLikes}</p>
                        </div>
                      }
                      <button className='comments-btn' onClick={()=>setShowComments(true)}>
                        <FaRegComment />
                        <p>{comments.length}</p>
                      </button>
                      <button className='share-btn' onClick={()=>handleShare('/post/'+postId)}>
                        <PiShareFat/>
                      </button>
                    </div>
                  {/* -------------------- hidden ----------------------  */}
                  <div className='postData__right'>
                    <button className='postData__author' onClick={()=>navigate(`/profile/${postData.author.username}`)}>
                      <img src={postData.author.picture} referrerPolicy="no-referrer"/>
                      <p>{postData.author.username}</p>
                    </button>
                    <p className='postData__right__date'>{timeAgo(postData.createdAt)}</p>
                    {postData.content && !postData.textOnly && <p className='text-post-content-right'>{postData.content}</p>}
                    <div className='postData__right__comments'>
                      <div className='postData__right__comments__comment-input'>
                        {
                          commentLoading ? <BarLoader width={'100%'} color='var(--text-color)'/>
                          :
                          <>
                            <input onChange={e=>setCommentContent(e.target.value)} type="text" placeholder='Add a comment...' value={commentContent} maxLength={600}/>
                            <button disabled={!commentContent} onClick={()=>handleAddComment()}><IoSend /></button>
                          </>
                        }
                      </div>
                      {
                        comments.map(c=>{
                          return(
                            <Comment key={c.id} id={c.id} content={c.content} likes={c.likes?.length ?? 0} date={c.createdAt} author={c.author} replies={c.replies} parent={c.parent} postId={postId}/>
                          )
                        })
                      }
                    </div>
                    <div className='postData__right__interaction'>
                      {
                        likeLoading ? <ClipLoader color='var(--text-color)'/> :
                        <div className='like-btn'>
                          <button onClick={()=>toggleLike()}>
                            {liked ? <AiFillHeart color="rgb(255 48 64)" size={30} /> : <AiOutlineHeart size={30} />}
                          </button>
                          <p>{postLikes}</p>
                        </div>
                      }
                      <button className='comments-btn'>
                        <FaRegComment />
                        <p>{comments.length}</p>
                      </button>
                      <button className='share-btn' onClick={()=>handleShare('/post/'+postId)}>
                        <PiShareFat/>
                      </button>
                    </div>
                  </div>
                </>
                :
                
                <div>
                  {/* hidden comments*/ }
                  <div className='postData__right__comments'>
                      <button onClick={()=>setShowComments(false)} className='postData__back-btn'>Back</button>
                      <div className='postData__right__comments__comment-input'>
                        {
                          commentLoading ? <BarLoader width={'100%'} color='var(--text-color)'/>:
                          <>
                            <input onChange={e=>setCommentContent(e.target.value)} type="text" placeholder='Add a comment...' value={commentContent}/>
                            <button onClick={()=>handleAddComment()}><IoSend /></button>
                          </>
                        }
                      </div>
                      {
                        comments.map(c=>{
                          return(
                            <Comment key={c.id} id={c.id} content={c.content} likes={c.likes?.length ?? 0} date={c.createdAt} author={c.author} replies={c.replies} parent={c.parent} postId={postId}/>
                          )
                        })
                      }
                    </div>
                </div>
              }
              
            </div>
            : 
            <div className='post-modal-loader'>
              <PuffLoader size={'140px'} color='var(--text-color)'/>
            </div>
        }

      </Rodal>
    );
  }

export default PostModal