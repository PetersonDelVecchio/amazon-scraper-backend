import express from "express";
import cors from "cors";
import { scrapeAmazon } from "./scrape";

const app = express();
const PORT = 3000;

app.use(cors());

// Welcome route
app.get("/", (_req, res) => {
  res.send("Amazon Scraper API running. Use /api/scrape?keyword=yourSearch");
});

// Scrape route
app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "O parâmetro 'keyword' é obrigatório" });
  }

  try {
    const products = await scrapeAmazon(keyword);
    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao realizar scraping",
      details: (err as Error).message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
