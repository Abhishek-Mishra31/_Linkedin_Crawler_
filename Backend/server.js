const express = require("express");
const puppeteer = require("puppeteer-extra");
const app = express();
const cors = require("cors");
app.use(express.json());
const nodemailer = require("nodemailer");
app.use(cors());
const cheerio = require("cheerio");
require("dotenv").config();
const PORT = process.env.PORT || 1000;
const db = require("./db");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

app.use("/user", require("./Routes/UserRoutes"));

async function loadCookies(page) {
  const cookiesJson = process.env.LINKEDIN_COOKIES;
  if (!cookiesJson) {
    console.error("Cookies not found in environment variables.");
    throw new Error("Cookies not found. Set cookies in the environment.");
  }
  const cookies = JSON.parse(cookiesJson);
  console.log("Cookies loaded:", cookies);
  await page.setCookie(...cookies);
}

app.post("/scrape", async (req, res) => {
  const { profileUrl } = req.body;

  if (!profileUrl) {
    return res.status(400).json({ error: "Profile URL is required" });
  }

  let browser;
  try {
    console.log("Launching Puppeteer...");

    browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();

    console.log("Loading cookies...");
    await loadCookies(page);
    console.log("Cookies loaded successfully.");
    console.log("Navigating to LinkedIn profile...");
    await page.goto(profileUrl);
    console.log("Navigation successful.");

    console.log("Waiting for profile name element...");
    await page.waitForSelector("h1", { timeout: 60000 });
    console.log("Profile name element found.");

    const pageContent = await page.content();

    const $ = cheerio.load(pageContent);

    console.log("Scraping data...");

    const name = $("h1").text().trim();

    const imageUrl = $("div[class*='photo-wrapper'] img").attr("src");

    const experience = $(".artdeco-list__item")
      .map((i, el) => {
        let degreeText = $(el).text().trim();

        degreeText = degreeText.replace(/\s+/g, " ", " ").trim();

        return degreeText ? degreeText : null;
      })
      .get();

    const education = experience[1];

    let skills = [];
    try {
      skills = $(".text-body-medium")
        .map((i, el) => $(el).text().trim())
        .get();
    } catch (e) {
      console.warn("Skills section not found.");
      skills = [];
    }

    console.log("Scraping completed. Sending response...");

    res.json({ name, imageUrl, experience, education, skills });
  } catch (error) {
    console.error("Error scraping LinkedIn profile:", error);
    res.status(500).json({
      error: "Failed to scrape LinkedIn profile",
      details: error.message,
    });
  } finally {
    if (browser) {
      console.log("Closing Puppeteer...");
      await browser.close();
    }
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `${email}`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `You have a new message: \n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
