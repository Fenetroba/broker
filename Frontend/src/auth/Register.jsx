import React, { useState } from "react";
import Header from "@/components/gust/Header";
import Footer from "@/components/gust/Footer";
import { Link } from "react-router-dom";
import axios from "../lib/Axios";
import { useDispatch, useSelector } from "react-redux";

import Load from "@/components/ui/Load";
import { toast } from "sonner"

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { loading } = useSelector((state) => state.auth);

  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // dispatch(register(user)).then((result) => {
    //   toast(result.payload.message, {
    //     style: { background: '#333', color: '#fff' }
    //   })
    // });

  };

  return (
    <section className="magicpattern">
      <Header />
      <div className="flex flex-col items-center text-[var(--parent4)] justify-center min-h-screen ">
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--parent2)] p-5 h-100 shadow-lg rounded-2xl w-[300px]"
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
          <button
            type="submit"
            className="w-full flex items-center justify-center text-[var(--parent1)] font-bold cursor-pointer rounded-2xl py-2 roundedtransition bg-[var(--parent3)]"
            disabled={loading}
          >
            {loading ? <Load/> : "Register"}
          </button>
          {message && (
            <p className="mt-4 text-center text-red-500">{message}</p>
          )}
          <p className="mt-10 text-center">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-400">
              Login
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default Register;
