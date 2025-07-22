import React from "react";
import { jsPDF } from "jspdf";

const ScrapedProfile = ({ profileData, onBack }) => {
  const getImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  const cleanText = (text) => {
    if (!text) return '';
    return text.split(/(?=[A-Z][a-z])/).filter((item, index, arr) => arr.indexOf(item) === index).join(' ').trim();
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatExperience = (experience) => {
    if (!experience || !Array.isArray(experience)) return [];
    
    const currentPosition = experience[0];
    if (!currentPosition) return [];

    const mainExp = {
      role: cleanText(currentPosition.match(/^([^·]+)/)?.[1] || ''),
      company: cleanText(currentPosition.match(/·\s*([^·]+)·/)?.[1] || ''),
      duration: currentPosition.match(/(?:May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr)\s+\d{4}\s*-\s*(?:Present|[^·]+)/)?.[0] || '',
      location: currentPosition.match(/Remote/)?.[0] || ''
    };

    const validExperience = experience.filter(exp => 
      exp.includes('·') && 
      !exp.includes('followers') &&
      !exp.includes('connections') &&
      !exp.includes('members')
    );

    return [mainExp];
  };

  const formatEducation = (education) => {
    if (!education) return [];

    const eduInfo = {
      institution: cleanText(education.match(/^([^,]+)/)?.[1] || ''),
      degree: cleanText(education.match(/Master of[^,]+|BCA[^,]+/)?.[0] || ''),
      duration: education.match(/(?:May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr)\s+\d{4}\s*-\s*(?:Present|[^A]+)/)?.[0] || '',
      activities: education.match(/Activities and societies:\s*([^T]+)/)?.[1] || ''
    };

    return [eduInfo];
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    let yPos = 20;
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.width;
    
    const addWrappedText = (text, y) => {
      const splitText = doc.splitTextToSize(text, pageWidth - 40);
      doc.text(splitText, leftMargin, y);
      return y + (splitText.length * 7);
    };

    if (profileData?.imageUrl) {
      try {
        const imageData = await getImageAsBase64(profileData.imageUrl);
        if (imageData) {
          const imgSize = 40;
          const imgX = (pageWidth - imgSize) / 2;
          doc.addImage(imageData, 'JPEG', imgX, yPos, imgSize, imgSize);
          yPos += imgSize + 15;
        }
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }

    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(44, 62, 80);
    yPos = addWrappedText(profileData?.name || "Profile", yPos);
    
    yPos += 10;
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
    yPos += 10;

    doc.setTextColor(0, 0, 0);

    if (profileData?.summary || profileData?.experience?.[0]) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Summary", leftMargin, yPos);
      yPos += 7;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const summaryText = cleanText(profileData?.summary || profileData?.experience?.[0]);
      yPos = addWrappedText(summaryText, yPos);
      yPos += 10;
    }

    const experiences = formatExperience(profileData?.experience);
    if (experiences.length > 0) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Experience", leftMargin, yPos);
      yPos += 7;
      
      doc.setFontSize(12);
      
      for (const exp of experiences) {
        if (exp.role) {
          doc.setFont(undefined, 'bold');
          yPos = addWrappedText(exp.role, yPos);
          yPos += 5;
        }
        
        if (exp.company) {
          doc.setFont(undefined, 'normal');
          yPos = addWrappedText(exp.company, yPos);
          yPos += 5;
        }
        
        if (exp.duration) {
          doc.setFont(undefined, 'italic');
          yPos = addWrappedText(exp.duration, yPos);
          yPos += 5;
        }
        
        if (exp.location) {
          doc.setFont(undefined, 'italic');
          yPos = addWrappedText(exp.location, yPos);
          yPos += 5;
        }
        
        yPos += 5;
      }
      yPos += 10;
    }
    const educationEntries = formatEducation(profileData?.education);
    if (educationEntries.length > 0) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Education", leftMargin, yPos);
      yPos += 7;
      
      doc.setFontSize(12);
      
      for (const edu of educationEntries) {
        if (edu.institution) {
          doc.setFont(undefined, 'bold');
          yPos = addWrappedText(edu.institution, yPos);
          yPos += 5;
        }
        
        if (edu.degree) {
          doc.setFont(undefined, 'normal');
          yPos = addWrappedText(edu.degree, yPos);
          yPos += 5;
        }
        
        if (edu.duration) {
          doc.setFont(undefined, 'italic');
          yPos = addWrappedText(edu.duration, yPos);
          yPos += 5;
        }
        
        if (edu.activities) {
          doc.setFont(undefined, 'normal');
          yPos = addWrappedText(`Activities: ${edu.activities}`, yPos);
          yPos += 5;
        }
        
        yPos += 5;
      }
      yPos += 10;
    }


    if (profileData?.skills) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Skills", leftMargin, yPos);
      yPos += 7;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const skills = formatSkills(profileData.skills).join(", ");
      yPos = addWrappedText(skills, yPos);
    }

    const name = profileData?.name?.replace(/\s+/g, '_') || 'profile';
    doc.save(`${name}_LinkedIn_Profile.pdf`);
  };

  const formatSkills = (skillsString) => {
    if (!skillsString) return [];

    if (Array.isArray(skillsString)) {
      const actualSkills = skillsString[0] || "";
      return actualSkills
        .split("||")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    const skills = String(skillsString);
    return skills
      .split("||")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-400 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="mt-20 bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
            
            <div className="md:w-1/3 flex flex-col items-center justify-start">
              <div className="md:sticky md:top-24 w-full flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 bg-gray-700/50 border-2 border-blue-500/20">
                  {profileData?.imageUrl && (
                    <img
                      src={profileData.imageUrl}
                      alt={profileData?.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="text-center w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {profileData?.name || "Profile"}
                  </h1>
                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 space-y-6 sm:space-y-8">
             
              <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/20 transition-colors">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Summary
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-gray-300">
                  {cleanText(profileData?.summary || profileData?.experience?.[0]) || 'No summary available'}
                </p>
              </div>

             
              {formatExperience(profileData?.experience).length > 0 && (
                <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/20 transition-colors">
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {formatExperience(profileData?.experience).map((exp, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-blue-500/10 transition-colors">
                        {exp.role && (
                          <h3 className="text-lg font-semibold text-blue-300 mb-1">
                            {exp.role}
                          </h3>
                        )}
                        <div className="flex flex-col gap-1">
                          {exp.company && (
                            <p className="text-sm text-gray-400">
                              {exp.company}
                            </p>
                          )}
                          {exp.duration && (
                            <p className="text-sm text-gray-500">
                              {exp.duration}
                            </p>
                          )}
                          {exp.location && (
                            <p className="text-sm text-gray-500">
                              {exp.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

             
              {formatEducation(profileData?.education).length > 0 && (
                <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/20 transition-colors">
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Education
                  </h2>
                  <div className="space-y-4">
                    {formatEducation(profileData?.education).map((edu, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-blue-500/10 transition-colors">
                        {edu.institution && (
                          <h3 className="text-lg font-semibold text-blue-300 mb-1">
                            {edu.institution}
                          </h3>
                        )}
                        <div className="flex flex-col gap-1">
                          {edu.degree && (
                            <p className="text-sm text-gray-400">
                              {edu.degree}
                            </p>
                          )}
                          {edu.duration && (
                            <p className="text-sm text-gray-500">
                              {edu.duration}
                            </p>
                          )}
                          {edu.activities && (
                            <p className="text-sm text-gray-500">
                              Activities: {edu.activities}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/20 transition-colors">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {formatSkills(profileData?.skills).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapedProfile;
