import React,{useEffect, useRef, useState} from 'react'
import Rodal from 'rodal';
import { TiDelete } from "react-icons/ti";
import { v4 as uuidv4 } from 'uuid';
import 'rodal/lib/rodal.css';
import { confirmAlert } from 'react-confirm-alert';
import { uploadImage, deleteImage } from '../api/cloudinaryAPI';
import { deletePost, updatePost } from '../api/postAPI';
import '../styles/EditPostModal.css'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from 'react-router-dom';
import { MdPhotoLibrary } from "react-icons/md";
import ClipLoader from 'react-spinners/ClipLoader'
import { MdDelete } from "react-icons/md";

function EditPostModal({post, showEditPostModal, setShowEditPostModal}) {
    
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const  maxLength = 3000;
    const maxPhotos = 20;

    const [previewModal, setPreviewModal] = useState(false);
    const [curPhotoPreview, setCurPhotoPreview] = useState('');

    const [postContent, setPostContent] = useState(post.content);
    const [photos, setPhotos] = useState(post.photos);
    const [newPhotos, setNewPhotos] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(showEditPostModal===false){
            return
        }
        setPostContent(post.content);
        setPhotos(post.photos);
        setNewPhotos([]);
    },[showEditPostModal]);

    
  function showPhotoPreview(url){
    setPreviewModal(true);
    setCurPhotoPreview(url);
  }

  function removePhoto(e, id){
    e.stopPropagation();
    setPhotos(prev=>prev.filter(p=>p !== id));
  }
  function removeNewPhoto(e, id){
    e.stopPropagation();
    setNewPhotos(prev=>prev.filter(p=>p.id !== id));
  }

  function handleFile(e){
    const files = e.target.files;
    const addedPhotos = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        addedPhotos.push({
          id: uuidv4(),
          url: imageUrl,
          name: file.name,
        });
      } else {
        console.warn(`Invalid file: ${file.name} (Not an image)`);
      }
    }
    if(photos.length + newPhotos.length + addedPhotos.length > maxPhotos){
      return
    }
    setNewPhotos(prev=>[...prev, ...addedPhotos]);
  }

  async function handleDeletePost() {
    console.log('Deleting post...');
    try {
        setLoading(true);
        await deleteImage(post.photos);
        await deletePost(post.id);
        navigate(0);
    } catch (error) {
        console.log('Error trying to delete post', error.message);
    }finally{
        setLoading(false);
    }
  }

  async function handleEditPost(){
    console.log("Editing post...");
    try {
        setLoading(true);
        const deletedPhotos = post.photos.filter(p=>!photos.includes(p));
        console.log('deleted photos', deletedPhotos);
        const photosURL = await uploadImage(newPhotos);
        await deleteImage(deletedPhotos);
        await updatePost(post.id, postContent, photos.concat(photosURL));
        navigate(0);
    } catch (error) {
        console.log('Error trying to edit post', error.message);
    }finally{
        setLoading(false);
    }
  }

  return (
    <>
    <Rodal className='rodalPrevImage' visible={previewModal} onClose={()=>setPreviewModal(false)}>
          <img className='prevImage-photo' src={curPhotoPreview}/>
      </Rodal>

        <Rodal className='rodalPost' visible={showEditPostModal} onClose={()=>setShowEditPostModal(false)}>
            {
                !loading ?
                <>
                <h1>Edit post</h1>
                <div className='content-input'>
                <p>Content </p>
                <textarea name="content" maxLength={maxLength} value={postContent} onChange={e=>setPostContent(e.target.value)}></textarea>
                <p className='length-text'>{postContent.length}/{maxLength}</p>
                </div>
                <button onClick={()=>fileInputRef.current.click()} className='add-photo-btn'><MdPhotoLibrary size={'25px'} color={'var(--bg-color)'} /> Add photo</button>
            <input onChange={e=>handleFile(e)} multiple ref={fileInputRef} type="file" accept='image/*' style={{display:'none'}}/>
                {photos.length > 0 && <p>{photos.length}/{maxPhotos} photos</p>}
                <div className='photos-preview'>
                    {
                    photos.map((p,i)=>{
                    return(
                        <div key={i} className='photo-prev' onClick={()=>showPhotoPreview(p)} role='button' tabIndex="0">
                        <button className='deleteBtn' onClick={e => removePhoto(e, p)}>
                            <TiDelete/>
                        </button>
                        <img src={p}/>
                        </div>
                    )
                    })}
                    {
                    newPhotos.map((p)=>{
                    return(
                        <div key={p.id} className='photo-prev' onClick={()=>showPhotoPreview(p.url)} role='button' tabIndex="0">
                        <button className='deleteBtn' onClick={e => removeNewPhoto(e, p.id)}>
                            <TiDelete/>
                        </button>
                        <img src={p.url}/>
                        </div>
                    )
                    
                    })}
                </div>
                <div className='edit-modal-buttons'>
                    <button onClick={() => {
                    confirmAlert({
                        message: 'Are you sure you want to delete this post?',
                        buttons: [
                        { label: 'Yes', onClick: () => handleDeletePost() },
                        { label: 'No' }
                        ]
                    });
                    }} className='delete-post-btn'><MdDelete size={'25px'}/>Delete Post</button>
                    <button onClick={()=>setShowEditPostModal(false)}>Discard Changes</button>
                    <button onClick={()=>handleEditPost()}>Save Changes</button>
                </div>
                </> : <div style={{height:'100%',display: 'grid', placeContent:'center'}}><ClipLoader size={'100px'} color='var(--text-color)'/></div>
            }

        </Rodal>
    </>
  )
}

export default EditPostModal