import Footer from "@/components/gust/Footer";
import Header from "@/components/gust/Header";
import LOginimag from "../assets/grow.png";
import {FaGoogle} from 'react-icons/fa'
import React, { useState } from "react";
import "../app.css";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Load from "@/components/ui/Load";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import { LoginUser } from "@/store/AuthSlice";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(LoginUser(user)).then((result) => {
        toast(result.payload.message, {
          style: { background: '#333', color: '#fff' }
        })
      });
      console.log(user)
  };

  return (
    <section className=" ">
      <Header />
      <div className="flex max-md:flex-col justify-evenly items-center text-[var(--parent4)] ">
        <form
          onSubmit={handleSubmit}
          className="bg-white max-sm:mt-10 sm:ml-34 magicpattern sm:w-[30%] p-5 h-100  shadow-lg rounded-2xl"
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
