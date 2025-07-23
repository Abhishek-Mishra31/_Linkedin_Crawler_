const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
require("dotenv").config();

puppeteer.use(StealthPlugin());

async function loginAndGetSessionCookie() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  );

  try {
    console.log("Navigating to LinkedIn login page...");
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "networkidle2",
    });

    console.log("Typing credentials...");
    await page.type("#username", process.env.LINKEDIN_EMAIL, { delay: 100 });
    await page.type("#password", process.env.LINKEDIN_PASSWORD, { delay: 100 });

    await page.click("button[type=submit]");

    let liAtCookie = null;
    for (let i = 0; i < 60; i++) {
      const cookies = await page.cookies();
      liAtCookie = cookies.find((cookie) => cookie.name === "li_at");
      if (liAtCookie) {
        console.log("li_at cookie found!");
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!liAtCookie) {
      throw new Error("li_at cookie not found after login.");
    }

        const cookies = [liAtCookie];
    fs.writeFileSync("linked_cookies.json", JSON.stringify(cookies, null, 2));
    console.log("Cookies saved to linked_cookies.json");

    await browser.close();
    return cookies;
  } catch (err) {
    console.error("Login failed:", err.message);
    await browser.close();
    return null;
  }
}

module.exports = { loginAndGetSessionCookie };
