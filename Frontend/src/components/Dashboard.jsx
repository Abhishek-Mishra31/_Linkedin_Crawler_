import { React, useState, useContext, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';
import scrapcontext from "../context/scrapeApi/ScrapContext";
import ScrapedProfile from "./ScrapedProfile";

const Dashboard = () => {
  const [input, setInput] = useState({ username: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();
  const context = useContext(scrapcontext);
  const { getUserData, scrapeData } = context;
  const responseRef = useRef(null);

  const validateUsername = (username) => {
    const nameParts = username.trim().split(/\s+/);
    if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
      return false;
    }
    
    const namePartRegex = /^[\p{L}'-]{2,50}$/u;
    return nameParts.every(part => namePartRegex.test(part));
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = input.username.trim();
      
      if (!username) {
        setError("👤 Please enter a username to continue");
        return;
      }
      
      if (!validateUsername(username)) {
        setError("Please enter both first and last name (each at least 2 characters long)");
        return;
      }
      
      setLoading(true);
      setSelectedProfile(null);
      
      try {
        const data = await getUserData(username);
        if (!data || !data.profiles) {
          throw new Error('No profiles found');
        }
        setProfiles(data.profiles);
        setInput({ username: "" });
      } catch (error) {
        console.error('API Error:', error);
        setProfiles([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setProfiles([]);
      setLoading(false);
    }
  };

  const handleProfileClick = async (profileUrl) => {
    try {
      setLoading(true);
      const detailedData = await scrapeData(profileUrl);
      setSelectedProfile(detailedData);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError("Failed to fetch profile details. Please try again.");
      setLoading(false);
    }
  };

  const scrollToResponse = () => {
    responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handlePopState = () => {
      setSelectedProfile(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleBack = () => {
    setSelectedProfile(null);
    window.history.pushState(null, "", window.location.href);
  };
  
  if (selectedProfile) {
    return <ScrapedProfile profileData={selectedProfile} onBack={handleBack} />;
  }

  return (
    <>
      <section className="p-16 relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-500 via-blue-600 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 opacity-25 blur-3xl rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            Unlock the Power of LinkedIn Data
          </h1>
          <p className="text-lg p-4 md:p-8 text-gray-200 mt-4 mb-6 leading-relaxed opacity-80 animate-slide-up">
            Effortlessly extract, organize, and analyze LinkedIn profiles for
            valuable insights. Turn raw data into actionable strategies for
            hiring, networking, or sales growth.
          </p>
          <button
            onClick={scrollToResponse}
            className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 animate-bounce"
          >
            Get Started
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full h-24 bg-gradient-to-t from-[#0f172a] to-transparent"></div>

        <div
          ref={responseRef}
          className="mt-32 w-full flex flex-col md:flex-row items-center justify-center gap-4 p-4"
        >
          <div className="relative w-full max-w-md">
            <input
              name="username"
              value={input.username}
              onChange={handleChange}
              className="w-full px-5 py-3 text-lg text-gray-900 bg-white border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-300"
              placeholder="Enter username..."
            />

            {error && (
              <div className="absolute left-0 right-0 -bottom-8 mt-1">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-lg animate-fade-in">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              👤
            </div>
          </div>

          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg transition duration-300 transform hover:scale-105 hover:from-purple-500 hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300 text-lg font-medium animate-pulse">
            Fetching data, please wait...
          </p>
        </div>
      ) : (
        <section className="body-font bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-5">
            {profiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile, index) => (
                  <div
                    key={index}
                    onClick={() => handleProfileClick(profile.profileUrl)}
                    className="bg-gray-800 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-4">
                      {profile.imageUrl ? (
                        <img
                          src={profile.imageUrl}
                          alt={profile.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white mb-2">
                          {profile.name}
                        </h2>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {profile.headline}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          📍 {profile.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Dashboard;
