// Select DOM elements
const scrapeBtn = document.getElementById("scrape-btn");
const keywordInput = document.getElementById("keyword");
const resultsDiv = document.getElementById("results");

// Click event to start scraping
scrapeBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();

  // Validate input to ensure it's not empty
  if (!keyword) {
    alert("Please enter a keyword.");
    return;
  }

  // Show loading message while fetching data
  resultsDiv.innerHTML = "Loading...";

  try {
    // Make request to backend with the keyword
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    // Check if response is OK
    if (!res.ok) throw new Error("Request failed");

    // Parse response as JSON
    const products = await res.json();

    // Show message if no products found
    if (products.length === 0) {
      resultsDiv.innerHTML = "<p>No products found.</p>";
      return;
    }

    // Clear previous results
    resultsDiv.innerHTML = "";

    // Create and append elements for each product returned
    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}" />
        <div class="product-info">
          <div class="product-title">${product.title}</div>
          <div class="product-rating">⭐ ${product.rating ?? "N/A"}</div>
          <div class="product-reviews">${product.reviews ?? "0"} reviews</div>
        </div>
      `;

      resultsDiv.appendChild(div);
    });
  } catch (error) {
    // Show error message to user
    resultsDiv.innerHTML = `<p>Error fetching products: ${error.message}</p>`;
  }
});
