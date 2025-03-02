import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import { useAuth } from'../context/authContext.jsx'
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../api/userAPI.js';
import '../styles/Account.css'
import RotateLoader from 'react-spinners/RotateLoader'
import BottomNav from '../components/BottomNav.jsx';
import ClipLoader from 'react-spinners/ClipLoader'
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { uploadImage, deleteImage } from '../api/cloudinaryAPI';

function Account() {
    const maxLength = 150;
    const { user, refreshUser, loading } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [description, setDescription] = useState('');
    const [loadingChanges, setLoadingChanges] = useState(false);
    const [loadedImage, setLoadedImage] = useState(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(()=>{
        if(loading){
            return
        }
        if(!user){
            console.log('NO USER!', user);
            window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
        }else{
            console.log('Logged')
            setCurUserData();
        }
    },[user, loading])

    function setCurUserData(){
        if(!user) return;
        setDescription(user.description ?? '');
    }

    async function saveChanges(){
        try {
            setLoadingChanges(true);
            await updateUser(description);
            await refreshUser();
            setEditMode(false);
        } catch (error) {
            console.log('Error trying to edit user data', error.message);
        }finally{
            setLoadingChanges(false);
        }
    }

    function handleFileUploaded(e){
        const file = e.target.files[0];
        if (file && !file.type.startsWith("image/")) {
            alert("Only image files are allowed!");
            return
        }
        const imageUrl = URL.createObjectURL(file);
        setLoadedImage(imageUrl);
    }

    async function handleUpdatePfp(){
        setEditMode(true);
        setLoadingChanges(true);
        await deleteImage([user.picture]);
        const photosURL = await uploadImage([{url:loadedImage}]);
        console.log(photosURL[0]);
        await updateUser(undefined, photosURL[0]);
        setEditMode(false);
        setLoadingChanges(false);
        navigate(0);
    }

  return (
    <>
        <NavBar/>
       {
        loading ? <div className='loader-container-my-likes'><RotateLoader color='var(--text-color)'/></div> : !user ? <div className='loader-container-my-likes'><RotateLoader color='var(--text-color)'/></div>:
        <div className='account-settings-container'>
            <h1 className='account-title'>Account Settings</h1>
            {
                editMode ? loadingChanges ? <div style={{display: 'grid', placeContent:'center', height:'65vh'}}><ClipLoader size={'70px'} color='var(--text-color)'/></div> : 
                <div className='account-edit-container'>
                    <p className='account-edit-title'>Editing</p>
                    <textarea maxLength={maxLength} value={description ?? 'No description yet'} onChange={e=>setDescription(e.target.value)}/>
                    <p>{description.length}/{maxLength}</p>
                    <div className='editing-user-btns'>
                        <button onClick={()=>setEditMode(false)}>Cancel</button>
                        <button onClick={()=>saveChanges()}>Save changes</button>
                    </div>
                </div>
                :
                <>

                    <div className='account-user-data'>
                        <button className='account-change-picture' onClick={()=>inputRef.current.click()}>
                            <input type="file" accept='image/*' style={{display:'none'}}  ref={inputRef} onChange={e=>handleFileUploaded(e)}/>
                            <img src={loadedImage ?? user.picture} alt="user picture" />
                            <FaCirclePlus className='plus-icon'/>
                        </button>
                        <p>{user.username}</p>
                        {loadedImage && (
                        <div>
                            <p>Change Profile Picture?</p>
                           <div className='change-pfp-btns'>
                           <button onClick={()=>handleUpdatePfp()}>Accept</button>
                            <button onClick={()=>setLoadedImage(null)}>Cancel</button>
                           </div>
                        </div>
                        )}
                        <p className='account-user-data__description'>{user.description ?? 'No description yet. Add one!'}</p>
                        <button onClick={()=>{setCurUserData(), setEditMode(true)}}>Edit description</button>
                    </div>
                    <div className='account-buttons'>
                        <button onClick={()=>navigate('/account/likes')}><AiOutlineHeart size={'20px'} color='var(--bg-color)'/> My likes</button>
                        <button onClick={()=>navigate('/account/comments')}><FaRegComment size={'20px'} color='var(--bg-color)'/> My comments</button>
                    </div>
                </>
                
            }
            
        </div>
       }
       {!loading && <BottomNav fixed={true}/>}
    </>
    
  )
}

export default Account