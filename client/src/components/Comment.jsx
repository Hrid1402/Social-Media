import React, {useEffect, useState} from 'react'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useAuth } from'../context/authContext.jsx'
import { addComment } from '../api/commentAPI';
import { deleteComment, updateComment } from '../api/commentAPI';
import { getUserCommentsLikes, likeComment, unlikeComment } from '../api/likesAPI.js';
import guestPfp from '../assets/guestPfp.png'
import ClipLoader from 'react-spinners/ClipLoader'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import BarLoader from 'react-spinners/BarLoader'
import '../styles/Comment.css'
import { useNavigate } from 'react-router-dom';

function Comment({id, content, author, likes, date, replies=[], parent, postId}) {
    const { user, refreshUser } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [mainContent, setMainContent] = useState(content);
    const [editContent, setEditContent] = useState(content);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [commentLikes, setCommentLikes] = useState(likes);
    const [allReplies, setAllReplies] = useState([]);
    const [repliesTotal, setRepliesTotal] = useState(null);
    const [hasReplies, setHasReplies] = useState(null);
    const [showReplies, setShowReplies] = useState(false);
    const [replying, setReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        setCommentData()
    },[]);

    async function setCommentData() {
        if(user){
            getUserCommentsLikes().then(likes=>{
            setLiked(likes.some(like=>like.commentId===id));
            setLikeLoading(false);
            console.log('comment likes',likes);
        });
        }else{
            setLikeLoading(false);
        }
    }

    async function toggleLike() {
        if(!user){
            console.log('Login first');
            return redirectLogin();
        }
        if(likeLoading){return}
        setLikeLoading(true);
        if(liked){
            await unlikeComment(id);
            setCommentLikes(prev=>liked ? prev-1 : prev+1);
            setLiked(prev=>!prev);
            setLikeLoading(false);
        }else{
            await likeComment(id);
            setCommentLikes(prev=>prev+1);
            setLiked(true);
            setLikeLoading(false);
        }       
    }

    useEffect(()=>{
        if(replies.length>0){
            getAllReplies();
        }
     },[replies])

     function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const units = [
          { name: "year", short: "y", value: 31536000000 },
          { name: "month", short: "M", value: 2592000000 },
          { name: "week", short: "w", value: 604800000 },
          { name: "day", short: "d", value: 86400000 },
          { name: "hour", short: "h", value: 3600000 },
          { name: "minute", short: "m", value: 60000 },
          { name: "second", short: "s", value: 1000 },
        ];
        for (const unit of units) {
          const amount = Math.floor(diff / unit.value);
          if (amount >= 1) {
            return `${amount}${unit.short}`;
          }
        }
        return "now";
      }
      


    function getAllReplies(){  
        let allRepliesArray = [];

        function recursive(comments){
            if(!comments || comments.length<1){
                return
            }
            comments.forEach(c=>{
                allRepliesArray.push(
                    {
                        id: c.id,
                        content: c.content, 
                        author: c.author,
                        parent: c.parent,
                        likes: c.likes,
                        createdAt: c.createdAt
                    }
                )
                recursive(c.replies);
            })
        }
        recursive(replies);
        const repliesLength = allRepliesArray.length;
        setRepliesTotal(repliesLength);
        setHasReplies(repliesLength > 0);
        setAllReplies(allRepliesArray);
    }   

    async function handleAddComment(commentId){
        if(!user){
            console.log('Login first');
            return redirectLogin();
        }
        try {
            setReplyLoading(true);
            const newComment = await addComment(postId, commentId, replyContent);
            console.log('newComment', newComment);
            setAllReplies(prev=>[newComment, ...prev]);
            setHasReplies(true);
            setRepliesTotal(prev=>prev+1);
            setReplyContent("");
            setReplying(false);
        } catch (error) {
            console.log(error.message);
        }finally{
            setReplyLoading(false);
        }
    }
    async function handleEditComment(commentId) {
        try{
            console.log('Editing...', commentId, editContent);
            setLoadingEdit(true);
            const editedComment = await updateComment(commentId, editContent);
            console.log('edited comment', editedComment);
            setMainContent(editContent);
            setEditMode(false);
        }catch(error){
            console.log(error.message);
        }finally{
            setLoadingEdit(false);
        }
    }

    async function handleDeleteComment(commentId){
        try {
            setDeleteLoading(true);
            await deleteComment(commentId);
            setDeleted(true);
        } catch (error) {
            console.log('Error deleting comment', error.message)
        }finally{
            setDeleteLoading(false);
        }
    }
    if(deleted){
        return null
    }

  return (
    <div className='comment'>
        <div className='comment__main-comment'>
            <button className='comment-profile-btn' onClick={()=>navigate('/profile/'+ author.username)}>
                <img src={author.picture} referrerPolicy="no-referrer"/>
            </button>
            <div className='comment_main'>
                <p className='comment__username'>{author.username}</p>
                {loadingEdit ? <div style={{padding: '10px 0px', width:'100%'}}><BarLoader width='100%' color='var(--text-color)'/></div> : editMode ? 
                    <input className='edit-comment-input' maxLength={600} type="text" value={editContent} onChange={e=>setEditContent(e.target.value)}/>
                    :
                <p className='comment__content'>{parent && <span className='parent-name'>@{parent.author.username}</span>} {mainContent}</p>
                } 
                <div className='comment__bottom'>
                    
                    {
                        !replying && <p>{timeAgo(date)}</p>
                    }
                    <div className='comment__bottom__buttons-container'>
                    {
                        deleteLoading||editMode? null : !replying ? <button onClick={()=>setReplying(true)}>Reply</button> : 
                        <div className='reply-input'>
                            {
                                replyLoading ? <BarLoader color='var(--text-color)'/> : 
                                <>
                                 <div className='reply-input__data'>
                                    <img src={user ? user.picture : guestPfp} referrerPolicy='no-referrer'/>
                                    <input maxLength={600} placeholder='Add a reply...' type="text" value={replyContent} onChange={e=>setReplyContent(e.target.value)}/>
                                </div>
                                <div className='reply-input__btns'>
                                    <button onClick={()=>{setReplying(false), setReplyContent("")}}>Cancel</button>
                                    <button onClick={()=>handleAddComment(id)} disabled={!replyContent}>Send</button>
                                </div>
                                </>
                            }
                           
                        </div>
                    }
                    {
                        editMode ? !loadingEdit ?
                        <div className='edit-mode-buttons'>
                            <button onClick={()=>{setEditContent(mainContent),setEditMode(false)}}>Cancel</button>
                            <button onClick={()=>handleEditComment(id)} disabled={!editContent}>Save</button>
                        </div> : null
                        
                        : deleteLoading ? <ClipLoader size={'15px'} color='var(--text-color)'/> : !replying && user && user.id === author.id &&
                        <>
                            <button onClick={()=>setEditMode(true)}>Edit</button>
                            <button onClick={() => {
                                confirmAlert({
                                    message: 'Are you sure you want to delete this comment?',
                                    buttons: [
                                    { label: 'Yes', onClick: () => handleDeleteComment(id) },
                                    { label: 'No' }
                                    ]
                                });
                                }}>Delete</button>
                        </>
                    }
                    </div>
                    
                    
                </div>
            </div>
            <div className='comment__like-btn'>
                {
                    likeLoading ? <ClipLoader color='var(--text-color)'/>:
                    <>
                        <button onClick={()=>toggleLike()}>
                            {liked ? <AiFillHeart color="rgb(255 48 64)" size={30} /> : <AiOutlineHeart size={30} />}
                        </button>
                        <p>{commentLikes}</p>
                    </>
                }
            </div>
        </div>
        {
            hasReplies &&
            <>
                <button onClick={()=>setShowReplies(prev=>!prev)} className='show-replies-btn'>{showReplies ? 'Hide replies' :  `${repliesTotal} replies`} </button>
                {
                    showReplies &&
                    <div className='comment__replies'>
                        {
                            allReplies.map(c=>{
                                return(
                                    <Comment key={c.id} id={c.id} content={c.content} likes={c.likes?.length ?? 0} date={c.createdAt} author={c.author} parent={c.parent} postId={postId}></Comment> 
                                )
                            })
                        }
                    </div>
                }
            </>
        }
    </div>
  )
}

export default Comment