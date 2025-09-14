import Footer from "@/components/gust/Footer";
import Header from "@/components/gust/Header";
import LOginimag from "../assets/grow.png";
import { FaGoogle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import "../app.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Load from "@/components/ui/Load";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import { LoginUser } from "@/store/AuthSlice";
import { Loader2, LoaderPinwheel } from "lucide-react";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const {
    loading,
    isAuthenticated,
    user: authUser,
    error,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle successful login and redirect
  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Redirect based on user role
      switch (authUser.role) {
        case "admin":
          navigate("/admin/home");
          break;
        case "LocalShop":
          navigate("/local_shop/home");
          break;
        case "CityShop":
          navigate("/city_shop/home");
          break;
        default:
          navigate("/");
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
          style: { background: "#10B981", color: "#fff" },
        });

        // Clear form
        setUser({ email: "", password: "" });
      } else {
        toast.error(result.message || "Login failed", {
          style: { background: "#EF4444", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed", {
        style: { background: "#EF4444", color: "#fff" },
      });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col-reverse  lg:flex-row space-x-10 justify-center items-center gap-8 lg:gap-16 min-h-[80vh]">
          {/* Login Form */}
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl ">
            <form
              onSubmit={handleSubmit}
              className="bg-white magicpattern ml-4  p-6 sm:p-8 shadow-xl rounded-2xl w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">
                Login
              </h2>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center text-white font-bold cursor-pointer rounded-lg py-3 sm:py-4 mt-6 bg-[var(--two2m)] hover:bg-[var(--two2m)]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <LoaderPinwheel className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center mt-4 font-bold cursor-pointer rounded-lg py-3 sm:py-4 bg-white border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 text-gray-700 text-sm sm:text-base"
              >
                <span className="mr-3">
                  <FaGoogle className="w-5 h-5" />
                </span>
                <span>Continue with Google</span>
              </button>

              <div className="mt-8 text-center space-y-2">
                <p className="text-gray-600 text-sm sm:text-base">
                  Don't have an account?{" "}
                  <Link 
                    to="/auth/signup" 
                    className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </p>
                <Link 
                  className="text-[var(--two3m)] hover:text-[var(--two3m)]/80 text-sm sm:text-base transition-colors duration-200 block"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl order-first lg:order-last">
            <div className="relative">
              <img
                src={LOginimag}
                alt="Login illustration"
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] object-contain shadow-xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Login;
