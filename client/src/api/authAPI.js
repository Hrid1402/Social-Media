import axios from 'axios'
export async function logout(){
    try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {withCredentials: true});
        window.location.reload(); 
    } catch (error) {
        console.log("Error trying to delete token", error.message);
    }
}