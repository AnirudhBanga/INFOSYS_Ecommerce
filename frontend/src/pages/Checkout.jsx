import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/checkout.css";

const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
];

function Checkout({ cartItems, checkout, showMsg }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // If cart is empty, user shouldn't be here
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page page">
        <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Your cart is empty!</h2>
          <button className="btn btn-gold" onClick={() => navigate("/products")}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const shipping = subtotal > 3000 ? 0 : 199;
  const total = subtotal + shipping;

  const getImage = (p) => {
    if (p.imageUrl && p.imageUrl.startsWith("http")) {
      return p.imageUrl;
    }
    return SHOE_IMGS[p.id % SHOE_IMGS.length];
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.fullName || !formData.address || !formData.city || !formData.zipCode) {
      showMsg("error", "Please fill out all shipping details.");
      return;
    }

    const fullAddress = `${formData.fullName}, ${formData.address}, ${formData.city} - ${formData.zipCode}`;
    
    // Call the checkout function from App.jsx
    checkout(fullAddress, paymentMethod);
    
    // Navigation and success message handled in App.jsx
  };

  return (
    <div className="checkout-page page">
      <div className="container">
        
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-grid">
          
          {/* LEFT: FORM */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              
              {/* SHIPPING DETAILS */}
              <div className="checkout-card">
                <h2 className="card-title">Shipping Details</h2>
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Fashion Street"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input 
                      type="text" 
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="checkout-card">
                <h2 className="card-title">Payment Method</h2>
                
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === "Credit Card" ? "selected" : ""}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Credit Card"
                      checked={paymentMethod === "Credit Card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="pay-text">Credit / Debit Card</span>
                  </label>

                  <label className={`payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="pay-text">UPI / Wallets</span>
                  </label>

                  <label className={`payment-option ${paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="pay-text">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-gold submit-btn">
                Place Order (₹{total})
              </button>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="checkout-summary-section">
            <div className="checkout-card summary-card">
              <h2 className="card-title">Order Summary</h2>
              
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div className="summary-item" key={item.id}>
                    <img 
                      src={getImage(item.product)} 
                      alt={item.product.name} 
                    />
                    <div className="summary-item-info">
                      <h4>{item.product.name}</h4>
                      <p className="summary-item-meta">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="summary-item-price">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="totals-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <hr />
                <div className="totals-row grand-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
