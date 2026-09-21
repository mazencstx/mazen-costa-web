function formatPrice(egp) {
  return `EGP ${Number(egp).toLocaleString("en-US")}`;
}

function updateCartCount() {
  const el = document.querySelector("[data-cart-count]");
  if (el) el.textContent = getCartCount();
}

function initSearch() {
  const toggle = document.querySelector("[data-search-toggle]");
  const panel = document.querySelector("[data-search-panel]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) {
      panel.querySelector("input")?.focus();
    }
  });

  const form = panel.querySelector("form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = form.querySelector("input").value.trim();
    if (q) window.location.href = `/shop.html?search=${encodeURIComponent(q)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initSearch();
  window.addEventListener("cart:updated", updateCartCount);
});
