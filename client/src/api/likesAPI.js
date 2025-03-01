import axios from 'axios'

export async function getUserPostsLikes(){
    try {
        const likes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/like/posts`, {  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying get likes from user", error.message);
    }
}
export async function getUserFullPostsLikes(){
    try {
        const likes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/like/fullPosts`, {  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying get full posts likes from user", error.message);
    }
}

export async function getUserCommentsLikes(){
    try {
        const likes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/like/comments`, {  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying get likes from user", error.message);
    }
}

export async function likePost(id){
    try {
        const likes = await axios.post(`${import.meta.env.VITE_SERVER_URL}/like/addLikePost`,{
            postId: id
        },{  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying like post", error.message);
    }
}

export async function likeComment(id){
    try {
        const likes = await axios.post(`${import.meta.env.VITE_SERVER_URL}/like/addLikeComment`,{
            commentId: id
        },{  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying like comment", error.message);
    }
}

export async function unlikePost(id){
    try {
        const likes = await axios.post(`${import.meta.env.VITE_SERVER_URL}/like/removeLikePost`,{
            postId: id
        },{  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying unlike post", error.message);
    }
}

export async function unlikeComment(id){
    try {
        const likes = await axios.post(`${import.meta.env.VITE_SERVER_URL}/like/removeLikeComment`,{
            commentId: id
        },{  withCredentials: true});
        return likes.data
    } catch (error) {
        console.log("Error trying unlike comment", error.message);
    }
}