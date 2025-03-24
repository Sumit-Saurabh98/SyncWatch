import { Navigate, Route, Routes } from "react-router-dom"
import { Slide, ToastContainer } from 'react-toastify';
import Homepage from "./pages/Homepage"
import Registerpage from "./pages/Registerpage"
import Loginpage from "./pages/Loginpage"
import Roompage from "./pages/Roompage";
import { useAuthStore } from "./stores/useAuthStore";
import LoadingPage from "./components/LoadingPage";
import { useEffect } from "react";
import Profilepage from "./pages/Profilepage";
import NotificationPage from "./pages/NotificationPage";
import VerificationPage from "./pages/VerificationPage";
import ForgotPassword from "./pages/ForgotPassword";



function App() {

  const {user, checkAuth, checkingAuth} = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth])


  if(checkingAuth) return <LoadingPage />

  return (
    <div>
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={!user ? <Registerpage /> : <Navigate to={"/"}/>} />
      <Route path="/login" element={!user ? <Loginpage /> : <Navigate to={"/"} />} />
      <Route path="/rooms" element={user ? <Roompage /> : <Navigate to={"/login"} />} />
      <Route path="profile/:_id" element={user ? <Profilepage /> : <Navigate to={"/login"} />} />
      <Route path="notifications" element={user ? <NotificationPage /> : <Navigate to={"/login"} />} />
      <Route path="/verification" element={!user ? <VerificationPage /> : <Navigate to={"/"} />} />
      <Route path="/forgotpassword" element={<ForgotPassword/>} />
    </Routes>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
     />
    </div>
  )
}

export default App
