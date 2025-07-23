import React from "react";
const webScrap = require("../Assests/web-scraper.png");

const Footer = () => {
  return (
    <footer className="text-gray-300 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 body-font mt-8 shadow-lg border-t border-gray-700">
      <div className="container mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center text-white">
          <div className="flex items-center space-x-3">
            <img src={webScrap} className="h-10" alt="LinkCrawler Logo" />
          </div>

          <span className="ml-3 text-2xl font-semibold tracking-wide">
            LinkCrawler
          </span>
        </div>

        <div className="text-center text-sm mt-4 md:mt-0">
          <p className="text-gray-400">
            © 2025 LinkCrawler
            <a
              href="https://x.com/_AsyncBytes_"
              className="text-indigo-400 ml-1 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @_AsyncBytes_
            </a>
          </p>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://x.com/_AsyncBytes_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition duration-300"
          >
            <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/async.bytes_/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-400 transition duration-300"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/abhishek-mishra-192006209/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition duration-300"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path
                stroke="none"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              ></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
