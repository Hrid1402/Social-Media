import axios from 'axios'
export async function followById(id){
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/follower/add`, 
            { profileID: id },{withCredentials: true});
        if(response.data){
            return response.data;
        }else {
            console.log("Couldn't  follow user");
            return null;
        }
    } catch (error) {
        console.log("Error trying to follow user", error.message);
    }
}

export async function unfollowById(id){
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/follower/delete`, 
            { profileID: id },{withCredentials: true});
        if(response.data){
            return response.data;
        }else {
            console.log("Couldn't  unfollow user");
            return null;
        }
    } catch (error) {
        console.log("Error trying to unfollow user", error.message);
    }
}

export async function getFollowers(id){
    try {
        const followers = await axios.get(`${import.meta.env.VITE_SERVER_URL}/follower/followers`, 
            {
                withCredentials: true,
                params: { 
                    profileID: id 
                }
            
            });
        if(followers.data){
            return followers.data;
        }else {
            console.log('No followers data found');
            return null;
        }
    } catch (error) {
        console.log("Error trying to get followers data", error.message);
    }
}

export async function getFollowings(id){
    try {
        const followings = await axios.get(`${import.meta.env.VITE_SERVER_URL}/follower/followings`, 
            {
                withCredentials: true,
                params: { 
                    profileID: id 
                }
            
            });
        if(followings.data){
            return followings.data;
        }else {
            console.log('No followings data found');
            return null;
        }
    } catch (error) {
        console.log("Error trying to get followings data", error.message);
    }
}