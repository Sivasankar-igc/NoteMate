import { BrowserRouter, Form, Route, Routes } from "react-router-dom";
import axios from "axios";
import Links from "./Components/link.jsx";
import PostNoteForm from "./Components/postNoteForm.jsx";
import Account from "./Components/Account.jsx";
import Home from "./Pages/Home.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllPosts } from "./REDUX_COMPONENTS/Features/postSlice.mjs";
import Post from "./Components/Post.jsx";
import Auth from "./Security/Auth.jsx"
import { getUser } from "./REDUX_COMPONENTS/Features/userSlice.mjs";

axios.defaults.baseURL = "http://localhost:8000/api/"
axios.defaults.baseURL = "/api/"

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllPosts())
    dispatch(getUser())
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Post />} />
            <Route path="user_account" element={<Account />} />
            <Route path="account/:type" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;