import React, { useState } from "react";
import { Link } from "react-router-dom";

const webScrap = require("../Assests/web-scraper.png");

const Navbar = ({ authenticated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white/30 backdrop-blur-md backdrop-brightness-110 shadow-md fixed top-0 left-0 w-full z-50 border-purple-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 ">
          <img src={webScrap} className="h-10" alt="LinkCrawler Logo" />
          <span className="text-2xl font-semibold text-white tracking-wide">
            LinkCrawler
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:bg-gray-700 p-2 rounded-lg focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center w-full md:w-auto mt-4 md:mt-0`}
        >
          {!authenticated && (
            <ul className="flex flex-col md:flex-row md:space-x-6 text-lg">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 text-white hover:text-indigo-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 px-4 text-gray-300 hover:text-indigo-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 px-4 text-gray-300 hover:text-indigo-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          )}
        </div>
        {authenticated && (
          <button
            onClick={handleLogout}
            className=" flex justify-end bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
