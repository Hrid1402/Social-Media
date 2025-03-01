import axios from "axios";
export async function getCommentsFromPost(postId){
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/comment/`, 
            { 
                params:{postId: postId}
            },{withCredentials: true});
        if(response.data){
            return response.data;
        }else {
            console.log("Couldn't get comments");
            return null;
        }
    } catch (error) {
        console.log("Error trying to get comments", error.message);
    }
}

export async function addComment(postId, commentId, content){
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/comment/addComment`, 
            { 
                commentId: commentId,
                postId: postId,
                content: content 
            },{withCredentials: true});
        if(response.data){
            return response.data;
        }else {
            console.log("Couldn't  add comment");
            return null;
        }
    } catch (error) {
        console.log("Error trying to add comment", error.message);
    }
}

export async function getCommentsFromUser(){
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/comment/user`,{withCredentials: true});
        if(response.data){
            return response.data;
        }else {
            console.log("Couldn't get comments from user");
            return null;
        }
    } catch (error) {
        console.log("Error trying to get comments from user", error.message);
    }
}

export async function updateComment(id,content){
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/comment/${id}`, 
            {
                content: content
            },{withCredentials: true});
        return response.data;
    } catch (error) {
        console.log("Error trying to update comment", error.message);
    }
}

export async function deleteComment(id){
    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/comment/${id}`, 
            {withCredentials: true});
        return response.data;
    } catch (error) {
        console.log("Error trying to delete comment", error.message);
    }
}