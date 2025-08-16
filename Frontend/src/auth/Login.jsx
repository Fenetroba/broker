import Footer from "@/components/gust/Footer";
import Header from "@/components/gust/Header";
import LOginimag from "../assets/grow.png";
import {FaGoogle} from 'react-icons/fa'
import React, { useState, useEffect } from "react";
import "../app.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Load from "@/components/ui/Load";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import { LoginUser } from "@/store/AuthSlice";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const { loading, isAuthenticated, user: authUser, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle successful login and redirect
  useEffect(() => {
    if (isAuthenticated && authUser) {

      
      // Redirect based on user role
      switch (authUser.role) {
        case 'admin':
          navigate('/admin/home');
          break;
        case 'LocalShop':
          navigate('/local_shop/home');
          break;
        case 'CityShop':
          navigate('/city_shop/home');
          break;
        default:
          navigate('/');
          break;
      }
    }
  }, [isAuthenticated, authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(LoginUser(user)).unwrap();
      
      if (result.success) {
        toast.success(result.message || "Login successful!", {
          style: { background: '#10B981', color: '#fff' }
        });
        
        // Clear form
        setUser({ email: "", password: "" });
      } else {
        toast.error(result.message || "Login failed", {
          style: { background: '#EF4444', color: '#fff' }
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed", {
        style: { background: '#EF4444', color: '#fff' }
      });
    }
  };

  return (
    <section className=" ">
      <Header />
      <div className="flex max-md:flex-col justify-evenly items-center text-[var(--parent4)] ">
        <form
          onSubmit={handleSubmit}
          className="bg-white max-sm:mt-10 sm:ml-34 magicpattern w-[30%] max-sm:w-[70%]  max-md:w-[70%]  p-5 h-100  shadow-lg rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-16 text-center ">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center  text-[var(--two5m)] font-bold cursor-pointer rounded-2xl py-2 roundedtransition bg-[var(--two2m)]"
            disabled={loading}
          >
            {loading ? <Load/>: "Login"}
          </button>
        
          <p
           
            className="justify-evenly mt-3.5 w-full flex items-center   font-bold cursor-pointer rounded-2xl py-2 roundedtransition bg-white shadow-black shadow"
          
          >
            <span><FaGoogle/></span><span>Continue with Google</span>
          </p>

          <p className="mt-10 text-center">
            have't An account ?{" "}
            <Link to="/auth/signup" className="text-blue-400">
              Sign Up
            </Link>
            <br />
            <Link className="text-[var(--two3m)] m-3">Forgot Password</Link>
          </p>
        </form>
        <div>
          <img src={LOginimag} alt="LOginimag" className="sm:w-[100%] max:mt-10 shadow-lg  rounded-2xl sm:h-[600px]" />
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Login;
