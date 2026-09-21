const CART_KEY = "durham_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}

function addToCart(product, size) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id && item.size === size);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      color: product.color,
      size,
      price: product.price_egp,
      qty: 1,
      image: product.image_url,
    });
  }

  saveCart(cart);
  return cart;
}

function removeFromCart(productId, size) {
  const cart = getCart().filter((item) => !(item.id === productId && item.size === size));
  saveCart(cart);
  return cart;
}

function updateQty(productId, size, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId && i.size === size);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
  return cart;
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function clearCart() {
  saveCart([]);
}
