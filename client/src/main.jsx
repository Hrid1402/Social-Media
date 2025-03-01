import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from './pages/Profile.jsx';
import Post from './pages/Post.jsx'
import Account from './pages/Account.jsx';
import { AuthProvider } from './context/authContext.jsx';
import App from './App.jsx'
import MyLikes from './pages/MyLikes.jsx';
import MyComments from './pages/MyComments.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/profile/:username",
    element: <Profile/>
  },
  {
    path:'/account',
    element: <Account/>
  },
  {
    path: "/account/likes",
    element: <MyLikes/>
  },
  {
    path: "/account/comments",
    element: <MyComments/>
  },
  {
    path: "/post/:postId",
    element: <Post/>
  }

]);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>
)
