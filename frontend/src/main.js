const scrapeBtn = document.getElementById("scrape-btn");
const keywordInput = document.getElementById("keyword");
const resultsDiv = document.getElementById("results");

scrapeBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    alert("Por favor, digite uma palavra-chave.");
    return;
  }

  resultsDiv.innerHTML = "Carregando...";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error("Erro na requisição");

    const products = await res.json();

    if (products.length === 0) {
      resultsDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    resultsDiv.innerHTML = "";

    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}" />
        <div class="product-info">
          <div class="product-title">${product.title}</div>
          <div class="product-rating">⭐ ${product.rating ?? "N/A"}</div>
          <div class="product-reviews">${product.reviews ?? "0"} avaliações</div>
        </div>
      `;

      resultsDiv.appendChild(div);
    });
  } catch (error) {
    resultsDiv.innerHTML = `<p>Erro ao buscar produtos: ${error.message}</p>`;
  }
});
