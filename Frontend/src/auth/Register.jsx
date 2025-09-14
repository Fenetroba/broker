import React, { useState } from "react";
import Header from "@/components/gust/Header";
import Footer from "@/components/gust/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LOginimag from "../assets/grow.png";
import Load from "@/components/ui/Load";
import { toast } from "sonner";
import { register } from "@/store/AuthSlice";
import { FaGoogle, FaHome, FaCity } from "react-icons/fa";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "LocalShop",
  });
  const { loading } = useSelector((state) => state.auth);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(user));
    console.log("Register result:", result);

    toast(result.payload?.message || "Registration attempted", {
      style: { background: "#333", color: "#fff" },
    });

    if (result.payload?.success || result.meta?.requestStatus === "fulfilled") {
      setUser({ name: "", email: "", password: "", role: "local" });
      navigate("/auth/login");
    }
  };

  return (
    <section className=" bg-gray-50">
      <Header />
      <div className="container mx-auto 0py-1">
        <div className="flex flex-col-reverse lg:flex-row sm:space-x-10 justify-center items-center  lg:gap-16 min-h-[80vh]">
          {/* Register Form */}
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <form
              onSubmit={handleSubmit}
              className="bg-white magicpattern p-6 sm:p-8 shadow-xl rounded-2xl w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">
                Register
              </h2>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="my-6 p-4 bg-[var(--two2m)]/90 rounded-xl shadow-lg">
                <label className="block mb-4 font-bold text-sm sm:text-base text-[var(--two4m)] text-center">
                  Select Seller Type:
                </label>
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <label
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-xl border-2 ${
                      user.role === "LocalShop"
                        ? "bg-white shadow-md border-[var(--two2m)]"
                        : "border-transparent hover:border-[var(--two2m)]/40 bg-white/50"
                    }`}
                    tabIndex={0}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="LocalShop"
                      checked={user.role === "LocalShop"}
                      onChange={() => setUser({ ...user, role: "LocalShop" })}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--two2m)] transition-all duration-200"
                    />
                    <FaHome className="text-lg sm:text-xl text-[var(--two2m)]" />
                    <span className="font-medium text-sm sm:text-base">Local Seller</span>
                  </label>
                  
                  <label
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-xl border-2 ${
                      user.role === "CityShop"
                        ? "bg-white shadow-md border-[var(--two2m)]"
                        : "border-transparent hover:border-[var(--two2m)]/40 bg-white/50"
                    }`}
                    tabIndex={0}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="CityShop"
                      checked={user.role === "CityShop"}
                      onChange={() => setUser({ ...user, role: "CityShop" })}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--two2m)] transition-all duration-200"
                    />
                    <FaCity className="text-lg sm:text-xl text-[var(--two2m)]" />
                    <span className="font-medium text-sm sm:text-base">City Seller</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center text-white font-bold cursor-pointer rounded-lg py-3 sm:py-4 mt-6 bg-[var(--two2m)] hover:bg-[var(--two2m)]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Load />
                    <span className="ml-2">Creating Account...</span>
                  </span>
                ) : (
                  "Register"
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

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  Already have an account?{" "}
                  <Link 
                    to="/auth/login" 
                    className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl order-first lg:order-last">
            <div className="relative">
              <img
                src={LOginimag}
                alt="Register illustration"
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] object-contain shadow-xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
   
    </section>
  );
};

export default Register;
