import express from "express";
import { scrapeAmazon } from "./scrape";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware to enable CORS and allow frontend requests
app.use(cors());

// Endpoint to perform Amazon product scraping
// Receives 'keyword' parameter via query string
app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  // Validate the keyword parameter
  if (!keyword) {
    return res.status(400).json({ error: "The 'keyword' parameter is required" });
  }

  try {
    // Execute scraping function with the given keyword
    const products = await scrapeAmazon(keyword);
    // Return found products in JSON format
    res.json(products);
  } catch (err) {
    // Return 500 error with message if scraping fails
    res.status(500).json({ error: "Error performing scraping", details: (err as Error).message });
  }
});

// Start the server on the defined port
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
