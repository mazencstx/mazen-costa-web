function drawerItemHTML(item) {
  return `
    <div class="drawer-item">
      <div class="drawer-item-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div>
        <div class="drawer-item-name">${item.name}</div>
        <div class="drawer-item-meta">Size: ${item.size} · Qty: ${item.qty}</div>
      </div>
      <div class="drawer-item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `;
}

function renderCartDrawer() {
  const itemsEl = document.querySelector("[data-drawer-items]");
  const totalEl = document.querySelector("[data-drawer-total]");
  if (!itemsEl || !totalEl) return;

  const cart = getCart();

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="drawer-empty">Your cart is empty</div>`;
  } else {
    itemsEl.innerHTML = cart.map(drawerItemHTML).join("");
  }

  totalEl.textContent = formatPrice(getCartTotal());
}

function openCartDrawer() {
  document.querySelector("[data-cart-drawer]")?.classList.add("open");
  document.querySelector("[data-drawer-overlay]")?.classList.add("open");
}

function closeCartDrawer() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  document.querySelector("[data-drawer-overlay]")?.classList.remove("open");
}

function toggleCartDrawer() {
  const drawer = document.querySelector("[data-cart-drawer]");
  if (!drawer) return;
  if (drawer.classList.contains("open")) {
    closeCartDrawer();
  } else {
    renderCartDrawer();
    openCartDrawer();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("[data-cart-drawer]")) return;

  renderCartDrawer();

  document.querySelector("[data-cart-toggle]")?.addEventListener("click", toggleCartDrawer);
  document.querySelector("[data-drawer-close]")?.addEventListener("click", closeCartDrawer);
  document.querySelector("[data-drawer-overlay]")?.addEventListener("click", closeCartDrawer);

  window.addEventListener("cart:updated", renderCartDrawer);
});
