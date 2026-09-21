function productCardHTML(product) {
  return `
    <a class="product-card" href="./product.html?id=${product.id}">
      <div class="product-image-wrap">
        <img src="${product.image_url}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price_egp)}</div>
    </a>
  `;
}

function renderGrid(products, gridEl) {
  if (!products.length) {
    gridEl.innerHTML = `<div class="empty-state">No products found</div>`;
    return;
  }
  gridEl.innerHTML = products.map(productCardHTML).join("");
}

async function fetchProducts(color) {
  const res = await fetch(`/api/products?color=${color}`);
  return res.json();
}

function setActiveTab(activeBtn) {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const gridEl = document.querySelector("[data-shop-grid]");
  if (!gridEl) return;

  const params = new URLSearchParams(window.location.search);
  const initialColor = params.get("color") === "white" ? "white" : "black";

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    if (btn.dataset.color === initialColor) btn.classList.add("active");
    else btn.classList.remove("active");

    btn.addEventListener("click", () => {
      const color = btn.dataset.color;
      const url = new URL(window.location);
      url.searchParams.set("color", color);
      window.history.replaceState({}, "", url);
      setActiveTab(btn);
      fetchProducts(color).then((products) => renderGrid(products, gridEl));
    });
  });

  fetchProducts(initialColor).then((products) => renderGrid(products, gridEl));
});
