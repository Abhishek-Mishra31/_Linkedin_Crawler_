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
const fs = require("fs");
const { loginAndGetSessionCookie } = require("./linkedinLogin");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

app.use("/user", require("./Routes/UserRoutes"));

async function loadCookies(page) {
  let cookies;
  if (!fs.existsSync("linked_cookies.json")) {
    console.log("Cookies file not found, running login script...");
    cookies = await loginAndGetSessionCookie();
    if (!cookies) {
      throw new Error("Failed to log in and get cookies.");
    }
  } else {
    const cookiesJson = fs.readFileSync("linked_cookies.json");
    cookies = JSON.parse(cookiesJson);
  }

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

app.post("/search", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username parameter is required" });
  }

  let browser;
  try {
    console.log("Launching Puppeteer for LinkedIn search...");
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
    await loadCookies(page);

    const encodedName = encodeURIComponent(username);
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodedName}`;

    console.log("Navigating to LinkedIn search...");
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector(".search-results-container li", {
      timeout: 60000,
    });

    const extractProfiles = async () => {
      return await page.evaluate(() => {
        const profiles = [];
        const results = document.querySelectorAll(
          ".search-results-container li"
        );

        results.forEach((result) => {
          const isProfileCard = result.querySelector(
            'div[data-view-name="search-entity-result-universal-template"]'
          );
          if (!isProfileCard) {
            return;
          }

          const nameElement = result.querySelector(
            "span[dir='ltr'] > span[aria-hidden='true']"
          );
          const linkElement = result.querySelector(
            "a[data-test-app-aware-link]"
          );
          const imageElement = result.querySelector(
            "img.presence-entity__image"
          );

          const nameContainer = result.querySelector(".t-roman.t-sans");
          const headlineElement = nameContainer
            ? nameContainer.nextElementSibling
            : null;
          const locationElement = headlineElement
            ? headlineElement.nextElementSibling
            : null;

          if (nameElement && linkElement) {
            const name = nameElement.textContent.trim();
            const headline = headlineElement
              ? headlineElement.textContent.trim()
              : "";

            const location = locationElement
              ? locationElement.innerText.split("\n")[0]
              : "";

            const imageUrl = imageElement ? imageElement.src : null;

            const profileUrl = linkElement
              ? linkElement.href.split("?")[0]
              : "";

            profiles.push({
              name,
              headline,
              location,
              imageUrl,
              profileUrl,
            });
          }
        });

        return profiles;
      });
    };

    const scrollAndWait = async () => {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    for (let i = 0; i < 3; i++) {
      await scrollAndWait();
    }

    const profiles = await extractProfiles();
    console.log(`Found ${profiles.length} profiles`);

    res.json({ profiles });
  } catch (error) {
    console.error("Error searching LinkedIn profiles:", error);
    res.status(500).json({
      error: "Failed to search LinkedIn profiles",
      details: error.message,
    });
  } finally {
    if (browser) {
      console.log("Closing Puppeteer...");
      await browser.close();
    }
  }
});

(async () => {
  if (!fs.existsSync("linked_cookies.json")) {
    console.log("Cookies file not found, running login script on startup...");
    await loginAndGetSessionCookie();
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
