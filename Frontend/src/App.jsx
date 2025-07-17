import "./App.css";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AuthLayer from "./layer/Auth/Auth.layer";
import Home from "./pages/gust/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";
import { Children, useEffect } from "react";

import PageProtector from "./components/check_page/PageProtector";
import ContactUs from "./pages/gust/contactUs";
import { checkAuth } from "./store/AuthSlice";
import LocalLayer from "./layer/LocalLayer";
import Local_shop_Home from "./pages/LocalShoper/LocalHome";
import Profile from "./pages/AllUser_Profile/Profile";
import AlluserLayer from "./layer/AlluserLayer";
import CityLayer from "./layer/CityLayer";
import CityHome from "./pages/CityShope/CityHome";
import AdminLayer from "./layer/AdminLayer";
import AdminHome from "./pages/Admin/AdminHome";
import Nofound from "./pages/Nofound/Nofound";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import Header from "./components/LocalShoper/Sidebar";
import MyProduct from "./pages/LocalShoper/MyProduct";
import About from "./pages/gust/AboutUs";
import How_To_Work from "./pages/gust/How_To_Work";
import Orders from "./pages/LocalShoper/Orders";
import Earnings from "./pages/LocalShoper/Earnings";
import Inbox from "./pages/LocalShoper/Inbox";
import Settings from "./pages/LocalShoper/Settings";
import EditProfile from "./pages/AllUser_Profile/EditProfile";


function App({children}) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  console.log("auth", isAuthenticated, user);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
    console.log("auth", isAuthenticated);
  }, []);

  const Location = useLocation();
  console.log(Location.pathname);

  return (

<div className="">
      <Toaster />

      <Routes>
        <Route
          path="/"
          element={<Home isAuthenticated={isAuthenticated} user={user} />}
        />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="about" element={<About />} />
        <Route path="how-to-work" element={<How_To_Work />} />
        <Route
          path="/auth"
          element={
            <PageProtector isAuthenticated={isAuthenticated} user={user}>
              <AuthLayer />
            </PageProtector>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Register />} />
        </Route>

        {/* local shoper Page  */}

        <Route
          path="/local_shop"
          element={
            <PageProtector isAuthenticated={isAuthenticated} user={user}>
              <LocalLayer />
            </PageProtector>
          }
        >
          <Route path="home" element={<Local_shop_Home  isAuthenticated={isAuthenticated} user={user}/>} />
          <Route path="orders" element={<Orders />} />
          <Route path="earning" element={<Earnings />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="setting" element={<Settings />} />
          <Route path="my_product" element={<MyProduct />} />
        </Route>

        {/* city shoper Page  */}

        <Route
          path="/city_shop"
          element={
            <PageProtector isAuthenticated={isAuthenticated} user={user}>
              <CityLayer />
            </PageProtector>
          }
        >
          <Route path="home" element={<CityHome />} />
        </Route>
        {/* city shoper Page  */}

        <Route
          path="/admin"
          element={
            <PageProtector isAuthenticated={isAuthenticated} user={user}>
              <AdminLayer />
            </PageProtector>
          }
        >
          <Route path="home" element={<AdminHome />} />
        </Route>

        {/* all User can get */}
        <Route
          path="/user"
          element={
            <PageProtector isAuthenticated={isAuthenticated} user={user}>
              <AlluserLayer />
            </PageProtector>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="profile-edit" element={<EditProfile />} />
        </Route>

        {/* No found */}
        <Route path="*" element={<Nofound />} />
      </Routes>


  
    </div>
  );
}

export default App;
