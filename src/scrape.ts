import { JSDOM } from "jsdom";

// Function to scrape Amazon
export async function scrapeAmazon(keyword: string) {
  const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

  // Bun já tem fetch nativo
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const products: any[] = [];

  document.querySelectorAll(".s-result-item").forEach((item) => {
    const title = item.querySelector("h2 a span")?.textContent || "";
    const imageUrl = item.querySelector("img")?.getAttribute("src") || "";
    const rating = item.querySelector(".a-icon-alt")?.textContent || "";
    const reviews = item.querySelector(".s-link-style .a-size-base")?.textContent || "";

    if (title && imageUrl) {
      products.push({ title, imageUrl, rating, reviews });
    }
  });

  return products;
}
