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
    <section className="">
      <Header />
      <div className="flex max-md:flex-col max-md:m-flex:none max-sm:m-7 justify-evenly items-center m-3">
        <form
          onSubmit={handleSubmit}
          className=" max-sm:mt-10 sm:ml-34 magicpattern w-[30%] max-sm:w-[100%]  max-md:w-[70%]   p-5 h-100  shadow-lg rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-10 text-center ">Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
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
          <div className="mb-6 p-4  bg-[var(--two2m)]/90 rounded-xl shadow flex flex-col items-center">
            <label className="block mb-3 font-bold text-[16px] text-[var(--two4m)]">
              Select Seller Type:
            </label>
            <div className="flex  gap-2 w-full justify-center max-sm:flex-col">
              <label
                className={`flex items-center gap-3 px-4 cursor-pointer transition-all duration-200 rounded-2xl ${
                  user.role === "LocalShop"
                    ? " bg-white shadow-md"
                    : "border-transparent hover:border-[var(--two2m)]/40"
                }`}
                tabIndex={0}
              >
                <input
                  type="radio"
                  name="role"
                  value="LocalShop"
                  checked={user.role === "LocalShop"}
                  onChange={() => setUser({ ...user, role: "LocalShop" })}
                  className="w-5 h-5 accent-[var(--two2m)] transition-all duration-200"
                />
                <FaHome className="text-[18px] text-[var(--two2m)]" />
                <span className="font-medium text-[16px]">Local_Seller</span>
              </label>
              <label
                className={`flex items-center gap-3 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  user.role === "CityShop"
                    ? "border-[var(--two2m)] bg-white shadow-md"
                    : "border-transparent hover:border-[var(--two2m)]/40"
                }`}
                tabIndex={0}
              >
                <input
                  type="radio"
                  name="role"
                  value="CityShop"
                  checked={user.role === "CityShop"}
                  onChange={() => setUser({ ...user, role: "CityShop" })}
                  className="w-5 h-5 accent-[var(--two2m)] transition-all duration-200"
                />
                <FaCity className="text-xl text-[var(--two2m)]" />
                <span className="font-medium text-base ">City_Seller</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center text-[var(--two5m)] font-bold cursor-pointer rounded-2xl py-2 roundedtransition bg-[var(--two2m)]"
            disabled={loading}
          >
            {loading ? <Load /> : "Register"}
          </button>

          <p className="justify-evenly mt-3.5 w-full flex items-center   font-bold cursor-pointer rounded-2xl py-2 roundedtransition bg-white shadow-black shadow">
            <span>
              <FaGoogle />
            </span>
            <span>Continue with Google</span>
          </p>
      
          <p className="mt-10 text-center">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-400">
              Login
            </Link>
          </p>
        </form>
        <div>
          <img
            src={LOginimag}
            alt="LOginimag"
            className="sm:w-[90%] max:mt-10 shadow-lg  rounded-2xl sm:h-[600px]"
          />
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Register;
