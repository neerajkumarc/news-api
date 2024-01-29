const PORT = process.env.PORT || 3001;
const express = require("express");
const path = require("path");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function scrapeNews(url) {
  const allNews = [];
  for (let i = 1; i <= 3; i++) {
    const newUrl = `${url}/page-${i}`;
    const { data } = await axios.get(newUrl);
    const $ = cheerio.load(data);
    const listItems = $(".cartHolder");
    listItems.each((i, el) => {
      const newsArticle = {
        title: "",
        description: "",
        image: "",
        url: "",
        publishedAt: "",
      };
      newsArticle.title = $(el).children("h3").text();
      newsArticle.description = $(el).children("h2").text();
      newsArticle.image = $(el)
        .children("figure")
        .find("span > a > img")
        .attr("data-src");
      newsArticle.url = $(el).attr("data-weburl");
      newsArticle.publishedAt = $(el)
        .children(".storyShortDetail")
        .find("div")
        .children(".dateTime")
        .text();
      allNews.push(newsArticle);
    });
  }
  allNews.shift();
  return allNews;
}


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/latest", async (req, res) => {
  try {
    const data = await scrapeNews("https://www.hindustantimes.com/latest-news");
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.get("/science", async (req, res) => {
  try {
    const data = await scrapeNews("https://www.hindustantimes.com/science");
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.get("/india", async (req, res) => {
  try {
    const data = await scrapeNews("https://www.hindustantimes.com/india-news");
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.get("/world", async (req, res) => {
  try {
    const data = await scrapeNews("https://www.hindustantimes.com/world-news");
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.get("/entertainment", async (req, res) => {
  try {
    const data = await scrapeNews(
      "https://www.hindustantimes.com/entertainment"
    );
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.get("/cricket", async (req, res) => {
  try {
    const data = await scrapeNews("https://www.hindustantimes.com/cricket");
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.get("*", (req, res) => {
  res.status(400).json({ status: "Failed" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
