import { React, useState, useContext, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import scrapcontext from "../context/scrapeApi/ScrapContext";

const Dashboard = () => {
  const [input, setInput] = useState({ dataUrl: "" });
  const [error, setError] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const context = useContext(scrapcontext);
  const { scrapeData } = context;
  const scrapeRef = useRef(null);

  const handleChange = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleScrape = async () => {
    try {
      if (!input.dataUrl.trim()) {
        setError("Please enter a valid LinkedIn URL.");
        return;
      }
      setLoading(true);
      const data = await scrapeData(input.dataUrl);
      setResp(data);
      setInput({ dataUrl: "" });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setResp(null);
    }
  };

  async function getImageAsBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function createPdf(data) {
    const doc = new jsPDF();

    let x = 10;
    let y = 10;
    const pageWidth = doc.internal.pageSize.width;
    const fontSize = 12;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);

    const sanitize = (text) =>
      typeof text === "string" ? text.replace(/[^\w\s.,-]/g, "") : "";
    const name = sanitize(data.name);
    const experience = sanitize(data.experience[0]);
    const education = sanitize(data.education);

    if (data.imageUrl) {
      const base64Image = await getImageAsBase64(data.imageUrl);
      if (base64Image) {
        const imgWidth = 50;
        const imgHeight = 50;
        const x = (pageWidth - imgWidth) / 2;
        doc.addImage(base64Image, "JPEG", x, y, imgHeight, imgWidth);
        y += imgHeight + 10;
      }
    }

    doc.text(`Name: ${name}`, x, y);
    y += 10;

    const experienceLines = doc.splitTextToSize(
      `Experience: ${experience}`,
      180
    );
    doc.text(experienceLines, x, y);
    y += experienceLines.length * 8;

    const educationLines = doc.splitTextToSize(`Education: ${education}`, 180);
    doc.text(educationLines, x, y);
    y += educationLines.length * 8;

    const skillsLines = doc.splitTextToSize(`Skills: ${data.skills}`, 180);
    doc.text(skillsLines, x, y);

    doc.save(`${name}_LinkedIn_Details.pdf`);
  }

  const scrollToScrape = () => {
    scrapeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

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
            onClick={scrollToScrape}
            className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 animate-bounce"
          >
            Get Started
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full h-24 bg-gradient-to-t from-[#0f172a] to-transparent"></div>

        <div
          ref={scrapeRef}
          className="mt-32 w-full flex flex-col md:flex-row items-center justify-center gap-4 p-4"
        >
          <div className="relative w-full max-w-md">
            <input
              name="dataUrl"
              value={input.dataUrl}
              onChange={handleChange}
              className="w-full px-5 py-3 text-lg text-gray-900 bg-white border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-300"
              placeholder="Enter LinkedIn URL..."
            />

            {error && <p className="text-red-500 text-xl mt-2">{error}</p>}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              🔗
            </div>
          </div>

          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleScrape();
            }}
            className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg transition duration-300 transform hover:scale-105 hover:from-purple-500 hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Scrape
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-300 text-lg font-medium animate-pulse">
            This may take a while, please wait...
          </p>
        </div>
      ) : resp ? (
        <section className="body-font bg-gray-900 text-gray-400">
          <div className="container mx-auto flex flex-col items-center justify-center px-5 py-24">
            <img
              className=" myImg mb-10 w-5/6 rounded object-cover object-center 
              md:w-3/6 
              lg:w-2/6"
              alt="some error occured"
              src={resp?.imageUrl}
            />
            <div className="mb-16 flex w-full flex-col items-center text-center md:w-2/3">
              <h1 className="title-font mb-4 text-3xl font-medium text-white sm:text-4xl">
                {resp?.name}
              </h1>
              <br></br>
              <strong>
                <p>Summary: </p>
              </strong>
              <p className="mb-8 leading-relaxed">{resp?.experience[0]}</p>
              <strong>
                <p>Education: </p>
              </strong>
              <p className="mb-8 leading-relaxed">{resp?.education}</p>
              <strong>
                <p>Skills: </p>
              </strong>
              <p className="mb-8 leading-relaxed">{resp?.skills}</p>
            </div>

            <div className="flex">
              <button
                className="ml-auto flex rounded border-0 bg-indigo-800 px-6 py-2 text-white hover:bg-indigo-600 focus:outline-none"
                onClick={() => createPdf(resp)}
              >
                Generate pdf
              </button>
            </div>
          </div>
        </section>
      ) : (
        <p></p>
      )}
    </>
  );
};

export default Dashboard;
