import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import DummyLeft from "../Assests/Dummy_Left.png";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-900 text-white">
      <section className="flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-[#14532d] via-[#3b0764] to-[#6d28d9] text-center p-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-7xl font-extrabold mb-6 tracking-wide leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500 animate-pulse">
            LinkedIn Scraper
          </h1>
          <p className="text-2xl text-gray-300 mb-8 font-light animate-fadeIn">
            Unlock the power of LinkedIn data with our efficient and reliable
            web scraper. Gather professional insights seamlessly.
          </p>
          <div className="flex gap-10 justify-around">
            <Link
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-blue-500 px-8 py-4 rounded-full flex items-center gap-3 text-xl font-semibold shadow-xl transition duration-300 transform hover:scale-105"
              to={"/register"}
            >
              <FaLinkedin className="text-3xl" /> Get Started
            </Link>
            <button
              className="bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-800 hover:to-gray-600 px-8 py-4 rounded-full flex items-center gap-3 text-xl font-semibold shadow-xl transition duration-300 transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://github.com/Abhishek-Mishra31/LinkedIn_Crawler_",
                  "_blank"
                )
              }
              target="_blank"
            >
              <FaGithub className="text-3xl" /> Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-12 max-w-4xl w-full flex flex-col justify-center"
        >
          <a
            href="#section_img"
            className="mx-auto px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-full shadow-md transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2 w-fit"
          >
            🔍 View Output
          </a>

          <section id="section_img" className="relative my-20">
            <motion.img
              src={DummyLeft}
              alt="Example Scraped LinkedIn Profile"
              className="w-full rounded-lg shadow-xl hover:border-blue-300 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.05 }}
            />
          </section>
        </motion.div>
      </section>
    </div>
  );
}
