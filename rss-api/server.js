// ==================================================
//  ZTAKAFUL RSS/FEED API SERVER (STABLE VERSION)
// ==================================================

const express = require("express");
const Parser = require("rss-parser");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
});

app.use(cors());

// ==============================
// RSS FEED LIST
// ==============================
const feeds = {
  dagangnews: "https://www.dagangnews.com/rss.xml",
  bernama: "https://bernama.com/en/rssfeed.php",
  tmr: "https://themalaysianreserve.com/feed/",
  malaymail: "https://www.malaymail.com/feed/rss/malaysia"
};

// ===============================
// UNIVERSAL RSS HANDLER
// ===============================
async function fetchRSS(url) {
  try {
    const data = await parser.parseURL(url);
    return data.items.slice(0, 10).map(item => ({
      title: item.title,
      content: item.contentSnippet || item.content || "",
      url: item.link
    }));
  } catch (err) {
    console.log("RSS ERROR:", err.message);
    return { error: err.message };
  }
}

// ===============================
// ROUTE: GENERIC RSS FEED (DagangNews, Bernama, TMR, MalayMail)
// ===============================
app.get("/news/:source", async (req, res) => {
  const source = req.params.source;

  // If special case = Harian Metro
  if (source === "harianmetro") return scrapeHarianMetro(req, res);

  const url = feeds[source];
  if (!url) return res.json({ error: "Invalid RSS Source" });

  const data = await fetchRSS(url);
  res.json(data);
});

// ===============================
// HARlAN METRO — FIX INVALID RSS
// SCRAPE HTML DIRECT FROM WEBSITE
// ===============================
async function scrapeHarianMetro(req, res) {
  try {
    const response = await axios.get("https://www.hmetro.com.my/terkini", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);
    let articles = [];

    $(".view-content .views-row").each((i, el) => {
      const title = $(el).find("a").first().text().trim();
      const url = $(el).find("a").attr("href");
      const content = $(el).find(".field-content").text().trim();

      if (title && url) {
        articles.push({
          title,
          content: content.slice(0, 150),
          url: "https://www.hmetro.com.my" + url
        });
      }
    });

    res.json(articles.slice(0, 10));

  } catch (err) {
    res.json({ error: "Harian Metro Scrape Error: " + err.message });
  }
}

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RSS API Server running on port ${PORT}`);
});

