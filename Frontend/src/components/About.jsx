import React from "react";

const About = () => {
  return (
    <div className="aboutUs bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-100 tracking-wide font-montserrat">
            About Us
          </h1>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed font-poppins">
            Learn more about our mission, security, and technology powering our
            platform.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 font-montserrat">
              Our Mission
            </h2>
            <p className="mt-4 text-gray-300 text-lg font-poppins leading-relaxed">
              Our goal is to simplify access to LinkedIn insights, empowering
              professionals with actionable data for networking and growth.
            </p>
          </div>
          <div className="md:w-1/2 border border-gray-600 rounded-xl p-6 shadow-lg bg-gray-800">
            <p className="text-gray-300 font-medium font-poppins">
              "We make LinkedIn data extraction seamless for businesses and
              professionals."
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 font-montserrat">
              Privacy and Security
            </h2>
            <p className="mt-4 text-gray-300 text-lg font-poppins leading-relaxed">
              We prioritize user privacy, ensuring compliance with industry
              standards to protect sensitive data.
            </p>
          </div>
          <div className="md:w-1/2 border border-gray-600 rounded-xl p-6 shadow-lg bg-gray-800">
            <p className="text-gray-300 font-medium font-poppins">
              "Your data security is our top priority. We implement strict
              measures to protect user information."
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400 font-montserrat">
              Technology Stack
            </h2>
            <ul className="mt-6 text-lg text-gray-300 space-y-2 font-poppins">
              <li className="flex items-center gap-2">
                ✅ React.js for frontend
              </li>
              <li className="flex items-center gap-2">
                ✅ Node.js & Express for backend
              </li>
              <li className="flex items-center gap-2">
                ✅ Puppeteer for data scraping
              </li>
              <li className="flex items-center gap-2">
                ✅ Cheerio for parsing HTML
              </li>
              <li className="flex items-center gap-2">
                ✅ jsPDF for generating PDFs
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 border border-gray-600 rounded-xl p-6 shadow-lg bg-gray-800">
            <p className="text-gray-300 font-medium font-poppins">
              "We leverage modern web technologies to deliver efficient data
              extraction solutions."
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 font-montserrat">
              How It Works
            </h2>
            <ol className="mt-6 text-lg text-gray-300 space-y-3 list-decimal list-inside font-poppins">
              <li>The app scans LinkedIn profiles based on your input.</li>
              <li>
                Collects key details like name, summary, education, and skills.
              </li>
              <li>Download extracted data in structured formats like PDF.</li>
              <li>Adjust search depth and filters for precise results.</li>
            </ol>
          </div>
          <div className="md:w-1/2 border border-gray-600 rounded-xl p-6 shadow-lg bg-gray-800">
            <p className="text-gray-300 font-medium font-poppins">
              "Easily extract LinkedIn data with a simple and intuitive
              interface."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
