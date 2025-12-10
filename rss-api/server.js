const express = require("express");
const Parser = require("rss-parser");
const cors = require("cors");
const app = express();
const parser = new Parser();

app.use(cors());

// List RSS feed
const feeds = {
  dagangnews: "https://www.dagangnews.com/rss.xml",
  bernama: "https://bernama.com/en/rssfeed.php",
  tmr: "https://themalaysianreserve.com/feed/",
  harianmetro: "https://www.hmetro.com.my/rss",
  malaymail: "https://www.malaymail.com/feed/rss/malaysia"
};

// API endpoint
app.get("/news/:source", async (req, res) => {
  try {
    const url = feeds[req.params.source];
    if (!url) return res.json({ error: "RSS Feed not found" });

    const data = await parser.parseURL(url);
    res.json(data.items.slice(0, 10)); // Hantar 10 berita terbaru
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(5000, () => console.log("RSS Server running on port 5000"));
