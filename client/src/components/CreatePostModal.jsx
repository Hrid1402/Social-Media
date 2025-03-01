import React, { useRef, useState } from 'react'
import Rodal from 'rodal';
import { v4 as uuidv4 } from 'uuid';
import { TiDelete } from "react-icons/ti";
import { createPost } from '../api/postAPI';
import { uploadImage, deleteImage } from '../api/cloudinaryAPI';
import '../styles/CreatePostModal.css'
import 'rodal/lib/rodal.css';
import ClipLoader from 'react-spinners/ClipLoader'
import { MdPhotoLibrary } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function CreatePostModal({showCreatePostModal, setShowCreatePostModal}) {
  const  maxLength = 3000;
  const maxPhotos = 20;
  const fileInputRef = useRef(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [curPhotoPreview, setCurPhotoPreview] = useState('');

  const [postContent, setPostContent] = useState('');
  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  

  function handleFile(e){
    const files = e.target.files;
    const newPhotos = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        newPhotos.push({
          id: uuidv4(),
          url: imageUrl,
          name: file.name,
        });
      } else {
        console.warn(`Invalid file: ${file.name} (Not an image)`);
      }
    }
    if(photos.length + newPhotos.length > maxPhotos){
      return
    }
    setPhotos(prev=>[...prev, ...newPhotos]);
  }

  function removePhoto(e, id){
    e.stopPropagation();
    setPhotos(prev=>prev.filter(p=>p.id !== id));
  }

  function showPhotoPreview(url){
    setPreviewModal(true);
    setCurPhotoPreview(url);
  }

  async function handlePublish(){
    try {
      setLoading(true);
      let photosURL = [];
      if(photos.length>0){
        photosURL = await uploadImage(photos);
        console.log(photosURL);
      }
      const response = await createPost(postContent, photosURL);
      console.log(response);
      setPostContent('');
      setCurPhotoPreview('');
      setPhotos([]);
    } catch (error) {
      console.log("Error trying to upload post", error.message);
    }finally{
      setLoading(false);
      navigate(0);
    }
    
  }

  return (
    <>
      <Rodal className='rodalPrevImage' visible={previewModal} onClose={()=>setPreviewModal(false)}>
          <img className='prevImage-photo' src={curPhotoPreview}/>
      </Rodal>

      <Rodal className='rodalPost' enterAnimation='slideDown' leaveAnimation='slideDown' visible={showCreatePostModal} onClose={()=>setShowCreatePostModal(false)}>
        {
          loading ? 
          <div style={{height:'100%',display: 'grid', placeContent:'center'}}><ClipLoader size={'100px'} color='var(--text-color)'/></div>:
          <>
            <h1 className='rodalPost__title'>CreatePostModal</h1>
            <div className='content-input'>
              <p>Content </p>
              <textarea className='post-content-textarea' name="content" maxLength={maxLength} value={postContent} onChange={e=>setPostContent(e.target.value)}></textarea>
              <p className='length-text'>{postContent.length}/{maxLength}</p>
            </div>
            <button onClick={()=>fileInputRef.current.click()} className='add-photo-btn'><MdPhotoLibrary size={'25px'} color={'var(--bg-color)'} /> Add photo</button>
            <input onChange={e=>handleFile(e)} multiple ref={fileInputRef} type="file" accept='image/*' style={{display:'none'}}/>
            {photos.length > 0 && <p>{photos.length}/{maxPhotos} photos</p>}
            <div className='photos-preview'>
              {
                photos.map(p=>{
                return(
                  <div key={p.id} className='photo-prev' onClick={()=>showPhotoPreview(p.url)} role='button' tabIndex="0">
                    <button className='deleteBtn' onClick={e => removePhoto(e, p.id)}>
                      <TiDelete/>
                    </button>
                    <img src={p.url} alt={p.name}/>
                  </div>
                )
              })}
            </div>
            <button onClick={()=>handlePublish()} disabled={photos.length==0 && !postContent} className='publish-post-btn'>Publish</button>
          </>

        }
      </Rodal>
    
    </>
  )
}

export default CreatePostModal