import axios from 'axios'

export async function getPostsProfile(username){
    try {
        const posts = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post`, {
            params: { 
                username: username 
            }
        });
        return posts.data
    } catch (error) {
        console.log("Error trying get posts from profile", error.message);
    }
}

export async function getPostFromId(id){
    try {
        const post = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/${id}`);
        return post.data
    } catch (error) {
        console.log("Error trying get post from id", error.message);
    }
}
export async function createPost(content, photos){
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/post/create`, 
            { 
                content: content ,
                photos: photos
            },{withCredentials: true});
        if(response.data){
            return response.data;
        }else {
            console.log("Couldn't create post");
            return null;
        }
    } catch (error) {
        console.log("Error trying to create post", error.message);
    }
}

export async function getGuestFeed(cursor){
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/feed/guest`,{
            params: { 
                cursor: cursor 
            }
        });
        return response.data
    } catch (error) {
        console.log("Error trying get post from id", error.message);
    }
}

export async function deletePost(postId){
    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, 
            {withCredentials: true});
        return response.data;
    } catch (error) {
        console.log("Error trying to delete post", error.message);
    }
}

export async function updatePost(postId, content, photos){
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`,
            {
                content: content,
                photos: photos
            },{withCredentials: true});
        return response.data;
    } catch (error) {
        console.log("Error trying to update post", error.message);
    }
}