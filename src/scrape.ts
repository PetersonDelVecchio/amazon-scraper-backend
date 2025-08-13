import { JSDOM } from "jsdom";

/**
 * scrapeAmazon: fetches Amazon search results for a given keyword
 * @param keyword - the search term to query on Amazon
 * @returns an array of product objects with title, imageUrl, rating, and reviews
 */
export async function scrapeAmazon(keyword: string) {
  // Build the Amazon search URL with the encoded keyword
  const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

  // Fetch the HTML content of the search results page
  // Adding a User-Agent header to avoid request blocks by Amazon
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  // Get the page content as text
  const html = await response.text();

  // Parse the HTML using JSDOM
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Array to hold the scraped products
  const products: any[] = [];

  // Loop through each product item on the page
  document.querySelectorAll(".s-result-item").forEach((item) => {
    // Extract the product title
    const title = item.querySelector("h2 a span")?.textContent || "";

    // Extract the product image URL
    const imageUrl = item.querySelector("img")?.getAttribute("src") || "";

    // Extract the rating (number of stars)
    const rating = item.querySelector(".a-icon-alt")?.textContent || "";

    // Extract the number of reviews
    const reviews = item.querySelector(".s-link-style .a-size-base")?.textContent || "";

    // Only include products that have a title and image
    if (title && imageUrl) {
      products.push({ title, imageUrl, rating, reviews });
    }
  });

  // Return the array of products
  return products;
}
