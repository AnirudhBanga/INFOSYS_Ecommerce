import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
];

function OrderSummary({ showMsg }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSuccess = new URLSearchParams(location.search).get("success") === "true";

  const getImage = (p) => {
    if (!p) return SHOE_IMGS[0];
    if (p.imageUrl && p.imageUrl.startsWith("http")) {
      return p.imageUrl;
    }
    return SHOE_IMGS[(p.id || 0) % SHOE_IMGS.length];
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
        showMsg("error", "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner-wrap"><div className="spin" /></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2>Order not found</h2>
        <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page container" style={{ maxWidth: "800px", padding: "40px 20px" }}>
      
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        {isSuccess ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎉</div>
            <h1 style={{ color: "var(--green)", marginBottom: "10px" }}>Order Placed Successfully!</h1>
            <p style={{ color: "#555" }}>Thank you for shopping with SoleLux. Your order is confirmed.</p>
          </>
        ) : (
          <>
            <h1 style={{ color: "#111", marginBottom: "10px" }}>Order Details</h1>
            <p style={{ color: "#555" }}>Review your order information below.</p>
          </>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #eee", padding: "30px", marginBottom: "30px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "0.85rem", color: "#333", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Order Number</p>
            <h3 style={{ margin: 0, color: "#111" }}>#{order.id}</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.85rem", color: "#333", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Date</p>
            <h3 style={{ margin: 0, color: "#111" }}>{new Date(order.orderDate).toLocaleDateString()}</h3>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div>
            <h4 style={{ marginBottom: "10px", color: "#111" }}>Shipping Address</h4>
            <p style={{ color: "#222", lineHeight: "1.6" }}>{order.shippingAddress || "N/A"}</p>
          </div>
          <div>
            <h4 style={{ marginBottom: "10px", color: "#111" }}>Payment Method</h4>
            <p style={{ color: "#222" }}>{order.paymentMethod || "N/A"}</p>
            <p style={{ display: "inline-block", background: "rgba(205,164,94,0.1)", color: "var(--gold)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", marginTop: "5px", fontWeight: "600" }}>{order.status}</p>
          </div>
        </div>

        <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px", color: "#111" }}>Order Items</h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
          {order.orderItems && order.orderItems.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img 
                  src={getImage(item.product)} 
                  alt={item.product?.name} 
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }}
                />
                <div>
                  <p style={{ fontWeight: "600", margin: "0 0 5px 0", color: "#111" }}>{item.product?.name}</p>
                  <p style={{ fontSize: "0.85rem", color: "#333", margin: 0 }}>Size: {item.selectedSize} | Qty: {item.quantity}</p>
                </div>
              </div>
              <div style={{ fontWeight: "600", color: "#111" }}>
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#111" }}>Total Amount</h3>
          <h2 style={{ margin: 0, color: "var(--gold)" }}>₹{order.totalPrice}</h2>
        </div>

      </div>

      <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
        <button className="btn btn-outline" onClick={() => navigate("/products")}>Continue Shopping</button>
        <button className="btn btn-gold" onClick={() => navigate("/my-orders")}>View All Orders</button>
      </div>

    </div>
  );
}

export default OrderSummary;
