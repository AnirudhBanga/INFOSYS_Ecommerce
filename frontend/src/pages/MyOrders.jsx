import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function MyOrders({ showMsg }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        showMsg("error", "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner-wrap"><div className="spin" /></div>
      </div>
    );
  }

  return (
    <div className="page container" style={{ maxWidth: "1000px", padding: "40px 20px" }}>
      
      <div style={{ marginBottom: "40px" }}>
        <p className="eyebrow">Order History</p>
        <h1 className="section-title">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", background: "#f9f9f9", borderRadius: "12px" }}>
          <h2 style={{ color: "#777", marginBottom: "20px" }}>You haven't placed any orders yet.</h2>
          <button className="btn btn-gold" onClick={() => navigate("/products")}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              background: "#fff", 
              border: "1px solid #eaeaea", 
              borderRadius: "12px", 
              padding: "25px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px"
            }}>
              
              <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#333", margin: "0 0 5px 0" }}>ORDER ID</p>
                  <p style={{ fontWeight: "600", margin: 0, color: "#111" }}>#{order.id}</p>
                </div>
                
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#333", margin: "0 0 5px 0" }}>DATE PLACED</p>
                  <p style={{ fontWeight: "600", margin: 0, color: "#111" }}>{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <p style={{ fontSize: "0.85rem", color: "#333", margin: "0 0 5px 0" }}>TOTAL AMOUNT</p>
                  <p style={{ fontWeight: "600", margin: 0, color: "var(--gold)" }}>₹{order.totalPrice}</p>
                </div>

                <div>
                  <p style={{ fontSize: "0.85rem", color: "#333", margin: "0 0 5px 0" }}>STATUS</p>
                  <p style={{ 
                    fontWeight: "600", 
                    margin: 0, 
                    display: "inline-block", 
                    background: "rgba(205,164,94,0.1)", 
                    color: "var(--gold)", 
                    padding: "2px 10px", 
                    borderRadius: "12px", 
                    fontSize: "0.85rem" 
                  }}>
                    {order.status}
                  </p>
                </div>
              </div>

              <div>
                <button 
                  className="btn btn-outline" 
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MyOrders;
