import express from "express";
import cors from "cors";
import { scrapeAmazon } from "./scrape";

const app = express();
const PORT = 3000;

// Enable CORS to allow requests from the frontend
app.use(cors());

// Root route: simple message to check if server is running
app.get("/", (_req, res) => {
  res.send("Amazon Scraper API running. Use /api/scrape?keyword=yourSearch");
});

// Scrape route: receives a keyword as query parameter and returns scraped products
app.get("/api/scrape", async (req, res) => {
  // Get the 'keyword' query parameter
  const keyword = req.query.keyword as string;

  // Validate that a keyword was provided
  if (!keyword) {
    return res.status(400).json({ error: "The 'keyword' parameter is required" });
  }

  try {
    // Call the scrape function to get products from Amazon
    const products = await scrapeAmazon(keyword);

    // Return the products as JSON
    res.json(products);
  } catch (err) {
    // Handle any errors during scraping
    res.status(500).json({
      error: "Error scraping Amazon",
      details: (err as Error).message
    });
  }
});

// Start the backend server on PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
