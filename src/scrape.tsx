import axios from "axios";
import { JSDOM } from "jsdom";

export async function scrapeAmazon(keyword: string) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const products: any[] = [];

  document.querySelectorAll("div.s-main-slot div.s-result-item").forEach(item => {
    const title = item.querySelector("h2 a span")?.textContent?.trim() || null;
    const ratingText = item.querySelector("span.a-icon-alt")?.textContent || null;
    const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : null;
    const reviewCountText = item.querySelector("span.a-size-base")?.textContent?.replace(/,/g, "") || null;
    const reviewCount = reviewCountText ? parseInt(reviewCountText) : null;
    const imageUrl = item.querySelector("img.s-image")?.getAttribute("src") || null;

    if (title && imageUrl) {
      products.push({
        title,
        rating,
        reviews: reviewCount,
        imageUrl
      });
    }
  });

  return products;
}
