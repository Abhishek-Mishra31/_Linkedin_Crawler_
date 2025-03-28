import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import scrapcontext from "../context/scrapeApi/ScrapContext";

const Login = () => {
  const [details, setDetails] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const context = useContext(scrapcontext);
  const { userLogin } = context;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = details;
      const response = await userLogin(email, password);
      if (response.success) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-purple-600 to-indigo-500 text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-transparent rounded-xl shadow-lg border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={details.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 border border-gray-700 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={details.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 border border-gray-700 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:from-purple-500 hover:to-blue-500 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </motion.div>

      {error && (
        <div className="absolute bottom-0 left-0 right-0 w-full bg-red-500 text-white p-4 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
