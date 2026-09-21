const WHATSAPP_NUMBER = "201234567890"; // TODO: replace with DURHAM's real WhatsApp number

function cartItemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: ${item.size} · ${item.color}</div>
        <div class="qty-control">
          <button class="qty-btn" data-qty-minus>−</button>
          <span data-qty-value>${item.qty}</span>
          <button class="qty-btn" data-qty-plus>+</button>
        </div>
        <button class="remove-btn" data-remove>Remove</button>
      </div>
      <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `;
}

function renderCart() {
  const listEl = document.querySelector("[data-cart-list]");
  const emptyEl = document.querySelector("[data-cart-empty]");
  const summaryEl = document.querySelector("[data-cart-summary]");
  const cart = getCart();

  if (!cart.length) {
    listEl.innerHTML = "";
    emptyEl.style.display = "block";
    summaryEl.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  summaryEl.style.display = "block";
  listEl.innerHTML = cart.map(cartItemHTML).join("");

  const total = getCartTotal();
  document.querySelector("[data-cart-total]").textContent = formatPrice(total);

  listEl.querySelectorAll(".cart-item").forEach((row) => {
    const id = Number(row.dataset.id);
    const size = row.dataset.size;
    const item = cart.find((i) => i.id === id && i.size === size);

    row.querySelector("[data-qty-plus]").addEventListener("click", () => {
      updateQty(id, size, item.qty + 1);
      renderCart();
      updateCartCount();
    });

    row.querySelector("[data-qty-minus]").addEventListener("click", () => {
      if (item.qty <= 1) return;
      updateQty(id, size, item.qty - 1);
      renderCart();
      updateCartCount();
    });

    row.querySelector("[data-remove]").addEventListener("click", () => {
      removeFromCart(id, size);
      renderCart();
      updateCartCount();
    });
  });
}

function cartSummaryText(cart) {
  return cart.map((i) => `${i.name} (${i.size}) x${i.qty}`).join(", ");
}

async function handlePlaceOrder(e) {
  e.preventDefault();
  const form = e.target;
  const errorEl = form.querySelector("[data-form-error]");
  errorEl.textContent = "";

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  const notes = form.notes.value.trim();
  const cart = getCart();

  if (!name || !phone || !address) {
    errorEl.textContent = "Please fill in name, phone and address.";
    return;
  }

  if (!cart.length) {
    errorEl.textContent = "Your cart is empty.";
    return;
  }

  const total = getCartTotal();

  try {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        notes,
        items: cart,
        total_egp: total,
      }),
    });
  } catch (err) {
    console.error("Order save failed", err);
  }

  const msg =
    `New Order:%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Phone: ${encodeURIComponent(phone)}%0A` +
    `Items: ${encodeURIComponent(cartSummaryText(cart))}%0A` +
    `Total: EGP ${total}%0A` +
    `Address: ${encodeURIComponent(address)}` +
    (notes ? `%0ANotes: ${encodeURIComponent(notes)}` : "");

  clearCart();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  window.location.href = "./cart.html?ordered=1";
}

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.querySelector("[data-cart-list]");
  if (!listEl) return;

  renderCart();

  const params = new URLSearchParams(window.location.search);
  if (params.get("ordered") === "1") {
    document.querySelector("[data-order-confirmation]").style.display = "block";
  }

  document.querySelector("[data-order-form]")?.addEventListener("submit", handlePlaceOrder);
});
