document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("[data-product-detail]");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = `<div class="empty-state">Product not found</div>`;
    return;
  }

  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    container.innerHTML = `<div class="empty-state">Product not found</div>`;
    return;
  }
  const product = await res.json();

  document.title = `${product.name} — DURHAM`;

  const sizes = product.sizes.split(",");
  let selectedSize = null;

  const isWide = product.color === "duality";

  container.innerHTML = `
    <div class="product-detail-image${isWide ? " wide" : ""}">
      <img src="${product.image_url}" alt="${product.name}" />
    </div>
    <div class="product-detail-info">
      <div class="product-name">${product.name}</div>
      <p class="product-detail-description">${product.description}</p>
      <div class="product-detail-price">${formatPrice(product.price_egp)}</div>
      <div class="size-label">Select Size</div>
      <div class="size-selector" data-size-selector>
        ${sizes
          .map((s) => `<button type="button" class="size-box" data-size="${s}">${s}</button>`)
          .join("")}
      </div>
      <button class="btn btn-primary btn-full" data-add-to-cart ${
        !product.in_stock ? "disabled" : ""
      }>${product.in_stock ? "Add to Cart" : "Out of Stock"}</button>
      <div class="add-to-cart-msg" data-add-msg></div>
    </div>
  `;

  const sizeBoxes = container.querySelectorAll(".size-box");
  const addBtn = container.querySelector("[data-add-to-cart]");
  const msg = container.querySelector("[data-add-msg]");

  sizeBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      sizeBoxes.forEach((b) => b.classList.remove("selected"));
      box.classList.add("selected");
      selectedSize = box.dataset.size;
      msg.textContent = "";
    });
  });

  addBtn?.addEventListener("click", () => {
    if (!selectedSize) {
      msg.textContent = "Please select a size";
      return;
    }
    addToCart(product, selectedSize);
    msg.textContent = "Added to cart";
    if (typeof openCartDrawer === "function") openCartDrawer();
  });
});
