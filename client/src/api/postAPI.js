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
        console.log("Error trying get post guest feed", error.message);
    }
}

export async function getFollowersFeed(cursor, followers){
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/feed/followers`,{
            params: { 
                followers: followers,
                cursor: cursor 
            },withCredentials: true});
        return response.data
    } catch (error) {
        console.log("Error trying get followers feed", error.message);
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

export function getFeedQuote() {
    const messages = [
        "Check out what everyone’s talking about!",
        "See what’s trending in your feed!",
        "Fresh posts just for you, dive in!",
        "Don’t miss out on the latest updates!",
        "Your feed is buzzing, see what’s new!",
        "New posts are in, scroll and enjoy!",
        "Everyone’s sharing, catch up now!",
        "Hot takes and fresh updates await!",
        "Discover the latest conversations!",
        "Stay in the loop, see what’s happening!",
        "The latest posts are just a scroll away!",
        "Explore what’s new in your feed today!",
        "See what’s making waves right now!",
        "Your daily dose of fresh content is here!",
        "Jump into the latest updates from everyone!",
        "The feed is alive, see what’s trending!",
        "What’s new? Find out in your feed!",
        "Fresh posts, hot topics, check them out!",
        "The latest updates are waiting for you!",
        "Scroll through the freshest posts now!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}