import { useNavigate } from "react-router-dom";
import "../style/cart.css";

/* Same array as Products/ProductDetail so images match */
const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=300&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&q=80",
];

/* Use product's own image or unique fallback per product id */
const getImage = (item) => {
  if (item.imageUrl && item.imageUrl.startsWith("http")) return item.imageUrl;
  return SHOE_IMGS[item.id % SHOE_IMGS.length];
};

function Cart({ cartItems, removeFromCart, updateQuantity }) {
  const navigate  = useNavigate();

  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = subtotal > 2999 ? 0 : 199;
  const total     = subtotal + shipping;

  if (cartItems.length === 0) return (
    <div className="cart-page page">
      <div className="container cart-empty">
        <span style={{ fontSize:64 }}>🛍</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <button className="btn btn-gold" onClick={() => navigate("/products")}>Shop Collection</button>
      </div>
    </div>
  );

  return (
    <div className="cart-page page">
      <div className="container">

        <div style={{ padding:"48px 0 32px" }}>
          <p className="eyebrow">Your Bag</p>
          <h1 className="section-title" style={{ fontSize:"clamp(28px,5vw,44px)" }}>
            Shopping Cart
            <span style={{
              fontFamily:"var(--font-sans)", fontSize:18,
              color:"var(--text2)", fontWeight:400, marginLeft:12
            }}>
              ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
            </span>
          </h1>
        </div>

        <div className="cart-layout">

          {/* Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>

                {/* ✅ Clicking image or name → product detail */}
                <img
                  className="cart-item-img"
                  src={getImage(item)}           /* ✅ Each product has its own image */
                  alt={item.name}
                  onClick={() => navigate(`/products/${item.id}`)}
                  style={{ cursor:"pointer" }}
                />

                <div className="cart-item-info">
                  <p className="cart-item-cat">{item.category || "Footwear"}</p>

                  {/* ✅ Clickable name → product detail */}
                  <h3
                    className="cart-item-name"
                    onClick={() => navigate(`/products/${item.id}`)}
                    style={{ cursor:"pointer" }}
                  >
                    {item.name}
                  </h3>

                  {item.selectedSize && (
                    <p className="cart-item-meta">Size: UK {item.selectedSize}</p>
                  )}

                  <div className="cart-item-bottom">
                    {/* Quantity controls */}
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="cart-item-price">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button className="cart-remove" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0
                ? <span style={{ color:"var(--green)" }}>Free</span>
                : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="free-ship-note">
                Add ₹{(2999 - subtotal).toLocaleString("en-IN")} more for free shipping
              </p>
            )}

            <hr className="divider" style={{ margin:"16px 0" }} />

            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button className="btn btn-gold" style={{ width:"100%", marginTop:20, padding:"15px" }}
                    onClick={() => alert("Checkout coming soon!")}>
              Proceed to Checkout
            </button>
            <button className="btn btn-dark" style={{ width:"100%", marginTop:10 }}
                    onClick={() => navigate("/products")}>
              Continue Shopping
            </button>

            <div className="trust-badges">
              {["🔒 Secure Payment","↩ Easy Returns","⚡ Fast Delivery"].map(b => (
                <span key={b} className="trust-badge">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;