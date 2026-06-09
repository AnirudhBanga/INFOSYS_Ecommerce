import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
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

  // Dynamic Razorpay and Simulator states
  const [razorpayKey, setRazorpayKey] = useState("");
  const [showSimModal, setShowSimModal] = useState(false);
  const [simStep, setSimStep] = useState(""); // "card_details", "upi_options", "upi_pin", "upi_qr", "processing", "otp", "success"
  const [simCard, setSimCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    phone: ""
  });
  const [simUpiApp, setSimUpiApp] = useState(""); // "Google Pay", "PhonePe", "Paytm"
  const [simUpiPin, setSimUpiPin] = useState("");
  const [simOtp, setSimOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [qrTimer, setQrTimer] = useState(300); // 5 minutes (300 seconds)
  
  const [activeOrderData, setActiveOrderData] = useState(null);
  const [activeFullAddress, setActiveFullAddress] = useState("");
  const [userEmail, setUserEmail] = useState("customer@example.com");

  // Fetch Razorpay key ID and user profile details on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const keyRes = await axios.get(`${API_BASE_URL}/payment/key`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRazorpayKey(keyRes.data.keyId || "");
      } catch (err) {
        console.error("Error fetching Razorpay key:", err);
      }

      try {
        const profileRes = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const p = profileRes.data;
        if (p) {
          setFormData(prev => ({
            ...prev,
            fullName: p.name || "",
            address: p.address || ""
          }));
          setUserEmail(p.email || "customer@example.com");
          setSimCard(prev => ({
            ...prev,
            name: p.name || "",
            phone: p.phoneNo || ""
          }));
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
    };
    
    fetchData();
  }, []);

  // UPI QR Code countdown timer
  useEffect(() => {
    let interval;
    if (showSimModal && simStep === "upi_qr") {
      interval = setInterval(() => {
        setQrTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showSimModal, simStep]);

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
    return SHOE_IMGS[(p.id || 0) % SHOE_IMGS.length];
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setSimCard({ ...simCard, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    let formatted = val;
    if (val.length > 2) {
      formatted = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setSimCard({ ...simCard, expiry: formatted });
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 3);
    setSimCard({ ...simCard, cvv: val });
  };

  const getCardType = (number) => {
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "Mastercard";
    if (number.startsWith("6")) return "RuPay";
    return "Card";
  };

  const handlePinPress = (val) => {
    if (simUpiPin.length < 6) {
      setSimUpiPin(prev => prev + val);
    }
  };

  const handlePinClear = () => {
    setSimUpiPin(prev => prev.slice(0, -1));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Simulation handler actions
  const handleCardSubmit = (e) => {
    e.preventDefault();
    const cleanNumber = simCard.number.replace(/\s/g, "");
    if (cleanNumber.length !== 16) {
      showMsg("error", "Please enter a valid 16-digit card number.");
      return;
    }
    if (simCard.expiry.length !== 5) {
      showMsg("error", "Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (simCard.cvv.length !== 3) {
      showMsg("error", "Please enter a valid 3-digit CVV.");
      return;
    }
    if (!simCard.name.trim()) {
      showMsg("error", "Please enter cardholder name.");
      return;
    }

    setSimStep("processing");
    setTimeout(() => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setSimOtp("");
      setSimStep("otp");
    }, 2000);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (simOtp === generatedOtp || simOtp === "123456") {
      setSimStep("processing");
      setTimeout(() => {
        setSimStep("success");
        setTimeout(() => {
          setShowSimModal(false);
          checkout(
            activeFullAddress,
            paymentMethod,
            activeOrderData.id,
            "pay_demo_" + Math.floor(Math.random() * 1000000),
            "demo_signature"
          );
        }, 1500);
      }, 1500);
    } else {
      showMsg("error", "Invalid OTP. Please try again.");
    }
  };

  const handlePinSubmit = () => {
    if (simUpiPin.length < 4) {
      showMsg("error", "Please enter a valid PIN.");
      return;
    }
    setSimStep("processing");
    setTimeout(() => {
      setSimStep("success");
      setTimeout(() => {
        setShowSimModal(false);
        checkout(
          activeFullAddress,
          paymentMethod,
          activeOrderData.id,
          "pay_demo_" + Math.floor(Math.random() * 1000000),
          "demo_signature"
        );
      }, 1500);
    }, 2000);
  };

  const handleQrSuccess = () => {
    setSimStep("processing");
    setTimeout(() => {
      setSimStep("success");
      setTimeout(() => {
        setShowSimModal(false);
        checkout(
          activeFullAddress,
          paymentMethod,
          activeOrderData.id,
          "pay_demo_" + Math.floor(Math.random() * 1000000),
          "demo_signature"
        );
      }, 1500);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.fullName || !formData.address || !formData.city || !formData.zipCode) {
      showMsg("error", "Please fill out all shipping details.");
      return;
    }

    const fullAddress = `${formData.fullName}, ${formData.address}, ${formData.city} - ${formData.zipCode}`;
    setActiveFullAddress(fullAddress);
    
    if (paymentMethod === "Cash on Delivery") {
      checkout(fullAddress, paymentMethod);
    } else {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${API_BASE_URL}/payment/create-order`, 
          { amount: total },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const orderData = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        setActiveOrderData(orderData);

        const currentKey = razorpayKey || "rzp_test_your_key_id_here";
        
        // DEMO / MOCK GATEWAY SIMULATOR TRIGGER
        if (currentKey === "rzp_test_your_key_id_here") {
          setQrTimer(300);
          setSimUpiPin("");
          setSimOtp("");
          if (paymentMethod === "Credit Card") {
            setSimStep("card_details");
          } else {
            setSimStep("upi_options");
          }
          setShowSimModal(true);
          return;
        }

        // OFFICIAL RAZORPAY GATEWAY TRIGGER
        const options = {
          key: currentKey,
          amount: total * 100,
          currency: "INR",
          name: "SoleLux",
          description: "Order Payment",
          order_id: orderData.id,
          handler: function (response) {
            checkout(
              fullAddress, 
              paymentMethod, 
              response.razorpay_order_id, 
              response.razorpay_payment_id, 
              response.razorpay_signature
            );
          },
          prefill: {
            name: formData.fullName,
            email: userEmail,
            contact: simCard.phone || "9999999999",
            method: paymentMethod === "Credit Card" ? "card" : "upi" // Pre-fill method to directly open Card or UPI!
          },
          theme: {
            color: "#c6a87c"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          showMsg("error", "Payment Failed: " + response.error.description);
        });
        rzp.open();
      } catch (err) {
        showMsg("error", "Could not initiate payment. Please try again.");
        console.error(err);
      }
    }
  };

  const renderSimModal = () => {
    if (!showSimModal) return null;

    return (
      <div className="payment-sim-overlay">
        <div className="payment-sim-container">
          <div className="payment-sim-header">
            <h3>SoleLux Secure Payment Gateway</h3>
            <button className="close-btn" type="button" onClick={() => setShowSimModal(false)}>✕</button>
          </div>

          <div className="payment-sim-body">
            {simStep === "card_details" && (
              <form onSubmit={handleCardSubmit} className="sim-card-form">
                <h4>Enter Card Details</h4>
                <div className="card-mockup">
                  <div className="card-mockup-top">
                    <span className="card-logo">💳 {getCardType(simCard.number)}</span>
                  </div>
                  <div className="card-mockup-number">{simCard.number || "•••• •••• •••• ••••"}</div>
                  <div className="card-mockup-row">
                    <span className="card-mockup-name">{simCard.name.toUpperCase() || "CARDHOLDER NAME"}</span>
                    <span className="card-mockup-expiry">{simCard.expiry || "MM/YY"}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 1111 1111 1111"
                    value={simCard.number}
                    onChange={handleCardNumberChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={simCard.expiry}
                      onChange={handleExpiryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={simCard.cvv}
                      onChange={handleCvvChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={simCard.name}
                    onChange={e => setSimCard({ ...simCard, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cardholder Phone (for OTP)</label>
                  <input
                    type="text"
                    placeholder="9999999999"
                    value={simCard.phone}
                    onChange={e => setSimCard({ ...simCard, phone: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-gold w-100">Pay ₹{total}</button>
              </form>
            )}

            {simStep === "otp" && (
              <form onSubmit={handleOtpVerify} className="sim-otp-form">
                <div className="otp-icon">✉️</div>
                <h4>OTP Verification</h4>
                <p>An OTP has been sent to your registered mobile number ending in <strong>{simCard.phone ? simCard.phone.slice(-4) : "9999"}</strong>.</p>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={simOtp}
                    onChange={e => setSimOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    style={{ textAlign: "center", fontSize: "24px", letterSpacing: "8px" }}
                  />
                </div>
                <div className="test-info">
                  Test OTP Code: <strong>{generatedOtp}</strong>
                </div>
                <button type="submit" className="btn btn-gold w-100">Verify & Pay</button>
              </form>
            )}

            {simStep === "upi_options" && (
              <div className="sim-upi-options">
                <h4>Choose UPI Payment Method</h4>
                <div className="upi-choice-grid">
                  <div className="upi-choice-card" onClick={() => setSimStep("upi_qr")}>
                    <div className="icon">📷</div>
                    <h5>Scan QR Code</h5>
                    <p>Pay using any UPI App by scanning a code</p>
                  </div>
                  <div className="upi-choice-card" onClick={() => { setSimStep("upi_app_select"); }}>
                    <div className="icon">📱</div>
                    <h5>Pay via UPI App</h5>
                    <p>Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
              </div>
            )}

            {simStep === "upi_app_select" && (
              <div className="sim-upi-app-select">
                <h4>Select UPI App</h4>
                <div className="upi-apps-list">
                  <button className="upi-app-btn gpay" type="button" onClick={() => { setSimUpiApp("Google Pay"); setSimStep("upi_pin"); }}>
                    <span className="app-icon">🔵</span> Google Pay
                  </button>
                  <button className="upi-app-btn phonepe" type="button" onClick={() => { setSimUpiApp("PhonePe"); setSimStep("upi_pin"); }}>
                    <span className="app-icon">🟣</span> PhonePe
                  </button>
                  <button className="upi-app-btn paytm" type="button" onClick={() => { setSimUpiApp("Paytm"); setSimStep("upi_pin"); }}>
                    <span className="app-icon">🔵</span> Paytm
                  </button>
                </div>
                <button className="btn btn-outline w-100" type="button" onClick={() => setSimStep("upi_options")} style={{ marginTop: "15px" }}>Back</button>
              </div>
            )}

            {simStep === "upi_qr" && (
              <div className="sim-upi-qr">
                <h4>Scan QR Code to Pay</h4>
                <div className="qr-box">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=solelux@ybl&pn=SoleLux&am=${total}&cu=INR`)}`}
                    alt="UPI QR Code"
                  />
                  <div className="qr-brand-logo">S</div>
                </div>
                <div className="qr-meta">
                  <p className="qr-amount">Amount: ₹{total}</p>
                  <p className="qr-timer">Expires in: {formatTime(qrTimer)}</p>
                </div>
                <button className="btn btn-gold w-100" type="button" onClick={handleQrSuccess}>Simulate Successful Payment</button>
                <button className="btn btn-outline w-100 mt-2" type="button" onClick={() => setSimStep("upi_options")} style={{ marginTop: "10px" }}>Back</button>
              </div>
            )}

            {simStep === "upi_pin" && (
              <div className="sim-upi-pin">
                <div className="upi-app-header">
                  <span>{simUpiApp}</span>
                  <span className="upi-logo">UPI</span>
                </div>
                <div className="upi-payee-info">
                  <p className="payee-label">Paying</p>
                  <p className="payee-name">SoleLux E-Commerce</p>
                  <p className="payee-amount">₹{total}</p>
                </div>
                
                <div className="pin-entry-container">
                  <p className="pin-prompt">Enter 6-Digit UPI PIN</p>
                  <div className="pin-dots">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <span key={idx} className={`pin-dot ${simUpiPin.length > idx ? "filled" : ""}`} />
                    ))}
                  </div>
                </div>

                <div className="keypad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button key={num} className="keypad-btn" type="button" onClick={() => handlePinPress(num.toString())}>{num}</button>
                  ))}
                  <button className="keypad-btn clear" type="button" onClick={handlePinClear}>⌫</button>
                  <button className="keypad-btn" type="button" onClick={() => handlePinPress("0")}>{0}</button>
                  <button className="keypad-btn submit" type="button" onClick={handlePinSubmit}>✓</button>
                </div>
              </div>
            )}

            {simStep === "processing" && (
              <div className="sim-processing">
                <div className="spinner-wrap"><div className="spin" /></div>
                <h4>Processing Payment</h4>
                <p>Please do not close this window or press back button...</p>
              </div>
            )}

            {simStep === "success" && (
              <div className="sim-success">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
                <h4>Payment Successful</h4>
                <p>Your order is being placed. Thank you for shopping with SoleLux!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                      onError={(e) => { e.target.src = SHOE_IMGS[0]; }}
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
      {renderSimModal()}
    </div>
  );
}

export default Checkout;
