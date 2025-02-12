import axios from 'axios'
export async function searchUser(toSearch){
    try {
        console.log("Searching", toSearch)
        const users = await axios.get(`${import.meta.env.VITE_SERVER_URL}/search/user`, {
            params: { 
                username: toSearch 
            }
        });
        return users.data;
    } catch (error) {
        console.log("Error trying search users", error.message);
    }
}

export async function userProfileData(username){
    try {
        console.log("Searching", username, "profile...")
        const user = await axios.get(`${import.meta.env.VITE_SERVER_URL}/search/userByName`, {
            params: { 
                username: username 
            }
        });
        return user.data;
    } catch (error) {
        console.log("Error trying search user data", error.message);
    }
}