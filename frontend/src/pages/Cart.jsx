import { useNavigate } from "react-router-dom";
import "../style/cart.css";

const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
];

function Cart({
  cartItems,
  removeFromCart,
  updateQuantity
}) {

  const navigate = useNavigate();

  const subtotal =
    cartItems.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );

  const shipping =
    subtotal > 3000 ? 0 : 199;

  const total = subtotal + shipping;

  const getImage = (p) => {
    if (p.imageUrl && p.imageUrl.startsWith("http")) {
      return p.imageUrl;
    }
    return SHOE_IMGS[p.id % SHOE_IMGS.length];
  };

  if (cartItems.length === 0) {

    return (
      <div className="cart-page">

        <div className="cart-empty">

          <h1>Your Cart is Empty 🛒</h1>

          <button
            className="btn btn-gold"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="container">

        <h1 className="section-title">
          Shopping Cart
        </h1>

        <div className="cart-layout">

          {/* LEFT */}
          <div className="cart-items">

            {cartItems.map(item => (

              <div className="cart-item"
                   key={item.id}>

                <img
                  className="cart-item-img"
                  src={getImage(item.product)}
                  alt={item.product.name}
                />

                <div className="cart-item-info">

                  <h3 className="cart-item-name">
                    {item.product.name}
                  </h3>

                  <p>
                    ₹{item.product.price}
                  </p>

                  {item.selectedSize && (
                    <p>
                      Size: {item.selectedSize}
                    </p>
                  )}

                  <div className="qty-control">

                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span className="qty-num">
                      {item.quantity}
                    </span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <button
                  className="cart-remove"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  ✕
                </button>

              </div>
            ))}

          </div>

          {/* RIGHT */}
          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "Free"
                  : `₹${shipping}`}
              </span>
            </div>

            <hr />

            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="btn btn-gold"
              style={{
                width: "100%",
                marginTop: "20px"
              }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;