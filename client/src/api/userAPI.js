import axios from 'axios'
export async function getUser(){
    try {
        const user = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user`, {withCredentials: true});
        console.log('User', user.data);
        if(user.data){
            return user.data;
        }else {
            console.log('No user data found');
            return null;
        }
    } catch (error) {
        console.log("Error trying to get user data", error.message);
    }
}