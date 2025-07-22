# LinkedIn Profile Scraper & PDF Downloader

A powerful tool designed to scrape public LinkedIn profile data using their URLs. This application allows you to effortlessly download the extracted details in a clean, professional PDF format, making it an ideal solution for research, recruitment, and data analysis.

## Features

- **Scrape LinkedIn Profiles**: Enter a public LinkedIn profile URL to automatically extract key information, including name, title, company, education, and more.
- **Download as PDF**: Save the scraped profile data as a well-formatted PDF document for offline access and easy sharing.
- **User-Friendly Interface**: A clean and intuitive frontend built with React to ensure a seamless user experience.
- **Secure & Efficient Backend**: Powered by Node.js and Express, with Puppeteer for reliable and stealthy web scraping.

## Tech Stack

**Frontend:**
- React
- React Router
- `jsPDF` for PDF generation
- Tailwind CSS for styling

**Backend:**
- Node.js
- Express
- Mongoose (for MongoDB)
- Puppeteer with `puppeteer-extra-plugin-stealth` for scraping
- JSON Web Token (JWT) for authentication

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or newer)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/linkedin-crawler.git
   cd linkedin-crawler
   ```

2. **Set up the Backend:**
   - Navigate to the `Backend` directory:
     ```sh
     cd Backend
     ```
   - Install the dependencies:
     ```sh
     npm install
     ```
   - Create a `.env` file in the `Backend` directory and add the following environment variables:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

3. **Set up the Frontend:**
   - Navigate to the `Frontend` directory from the root:
     ```sh
     cd ../Frontend
     ```
   - Install the dependencies:
     ```sh
     npm install
     ```
   - Create a `.env` file in the `Frontend` directory and add your backend API endpoint:
     ```env
     REACT_APP_API_URL=http://localhost:5000
     ```

### Running the Application

1. **Start the Backend Server:**
   - In the `Backend` directory, run:
     ```sh
     npm start
     ```
   - The server will start on `http://localhost:5000`.

2. **Start the Frontend Application:**
   - In the `Frontend` directory, run:
     ```sh
     npm start
     ```
   - The application will open in your browser at `http://localhost:3000`.

## How to Use

1. **Navigate to the homepage**.
2. **Enter a public LinkedIn profile URL** in the input field.
3. **Click the "Scrape" button** to begin the data extraction process.
4. Once the data is fetched, a **"Download PDF" button** will appear.
5. **Click the button** to save the profile details as a PDF file.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/linkedin-crawler](https://github.com/your-username/linkedin-crawler)
