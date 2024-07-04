import { BrowserRouter, Form, Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./Pages/Home.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Auth from "./Security/Auth.jsx"
import { getUser } from "./REDUX_COMPONENTS/Features/userSlice.mjs";
import Account from "./Pages/Account.jsx";
import UserPost from "./Pages/UserPost.jsx";
import Error from "./Pages/Error.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditPassword from "./Pages/editPassword.jsx";
import Posts from "./Pages/Posts.jsx";
import About from "./Pages/About.jsx";
import Services from "./Pages/Service.jsx";
import Contact from "./Pages/Contact.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";


// axios.defaults.baseURL = "http://localhost:8000/api/"
axios.defaults.baseURL = "/api/"

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(getAllPosts())
    dispatch(getUser())
  }, [])

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Posts />} />
            <Route path="user_account" element={<Account />} />
            <Route path="account/:type" element={<Auth />} />
            <Route path="user_post" element={<UserPost />} />
            <Route path="edit_password" element={<EditPassword />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="*" element={
            <Error>
              <div className="error-content">
                <h2 className="error-heading">404</h2>
                <p className="error-text">Oops! Page Not Found</p>
                <Link to="/" className="error-link">Go Back To Home Page</Link>
              </div>
            </Error>
          }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App;