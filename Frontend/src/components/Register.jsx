import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import scrapeContext from "../context/scrapeApi/ScrapContext";

const Register = () => {
  const context = useContext(scrapeContext);
  const { userSignup } = context;
  const navigate = useNavigate();

  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password } = details;
      const response = await userSignup(name, email, password);
      if (response.success) {
        navigate("/login");
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0f172a] via-[#1b5e20] to-[#00bfa5] text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-transparent rounded-xl shadow-lg border border-gray-500"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={details.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 border border-gray-700 outline-none"
          />
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
            Register
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
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

export default Register;
