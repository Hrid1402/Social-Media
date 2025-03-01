import axios from 'axios';
import {sha1} from 'js-sha1'

export async function uploadImage(photos){
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD;
    try {
      const uploadPromises = photos.map(async(photo)=>{
        const response = await fetch(photo.url);
        const blob = await response.blob();

        const form = new FormData();
        form.append("file", blob);
        form.append("upload_preset", "Cloudinary_Media");
        form.append("cloud_name", cloudName);

        return axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,form);
      })

      const uploadResponses = await Promise.allSettled(uploadPromises);
      const URLs = uploadResponses.map(r=>{
        return r.value.data.secure_url
      })
      return URLs;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
};

export async function deleteImage(urls) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API;
  const secret = import.meta.env.VITE_CLOUDINARY_SECRET;
  
  try {
    const deletePromises = urls.map(async(url) => {
      const publicId = extractPublicIdFromUrl(url);
      
      if (!publicId) {
        throw new Error(`Invalid Cloudinary URL: ${url}`);
      }
      
      const timeStamp = Math.floor(Date.now() / 1000);
      const signature = sha1(`public_id=${publicId}&timestamp=${timeStamp}${secret}`);
      
      return axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          public_id: publicId,
          api_key: apiKey,
          timestamp: timeStamp,
          signature: signature
        }
      );
    });
    
    const deleteResponses = await Promise.allSettled(deletePromises);
    if(!deleteResponses){
      console.log8('Error deleting photos');
    }
    return deleteResponses;
  }catch (error) {
    console.error('Bulk deletion failed:', error);
    return null;
  }
}
  
function extractPublicIdFromUrl(url) {
    if(!url){
        return null
    }
    const regex = /\/v\d+\/(.*?)(?=\.\w{3,4}$)/;
    const match = url.match(regex);
    console.log(match[1]);
    return match ? match[1] : null;
}