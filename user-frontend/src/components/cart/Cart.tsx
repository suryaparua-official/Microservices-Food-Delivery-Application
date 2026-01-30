"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import "./Cart.css";

export default function Cart() {
  const router = useRouter();

  const { cartItems, increaseQty, decreaseQty, removeFromCart, totalAmount } =
    useCart();

  if (!cartItems || cartItems.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-row">
            <div className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">₹ {item.price}</p>
              </div>
            </div>

            <div className="cart-qty">
              <button onClick={() => decreaseQty(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>

            <div className="cart-subtotal">₹ {item.price * item.quantity}</div>

            <button
              className="cart-remove"
              onClick={() => removeFromCart(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <strong>₹ {totalAmount}</strong>
      </div>

      <div className="cart-action">
        <button onClick={() => router.push("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
