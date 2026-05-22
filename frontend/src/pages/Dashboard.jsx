import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    // Try to get name from localStorage if saved
    const saved = localStorage.getItem("userName");
    if (saved) setUserName(saved);
  }, [navigate]);

  const categories = [
    { label: "Sneakers",   icon: "👟", color: "#fef3c7" },
    { label: "Formal",     icon: "👞", color: "#dbeafe" },
    { label: "Sports",     icon: "🏃", color: "#dcfce7" },
    { label: "Sandals",    icon: "🩴", color: "#f3e8ff" },
  ];

  // ── ADMIN VIEW ─────────────────────────────────────
  if (role === "ADMIN") {
    return (
      <div className="dash-page page" style={{ background: "#f9fafb" }}>
        <section className="hero-section" style={{ minHeight: "50vh", display: "flex", alignItems: "center", background: "#ffffff", borderBottom: "1px solid #eaeaea" }}>
          <div className="container hero-content" style={{ textAlign: "center", alignItems: "center", margin: "0 auto" }}>
            <p className="eyebrow" style={{ color: "var(--gold)" }}>Admin Workspace</p>
            <h1 className="section-title hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)", color: "#111" }}>
              Welcome back, <br />
              <em style={{ color:"var(--gold)", fontStyle:"normal" }}>Commander</em>
            </h1>
            <p className="section-sub" style={{ maxWidth: "600px", margin: "0 auto 40px", color: "#555" }}>
              Oversee your inventory, manage incoming orders, and track store performance directly from your dashboard.
            </p>
            <div className="hero-cta" style={{ justifyContent: "center" }}>
              <button className="btn btn-gold" onClick={() => navigate("/admin")}>
                Go to Admin Panel
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/products")} style={{ color: "#111", borderColor: "#ddd" }}>
                View Storefront
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── USER VIEW ─────────────────────────────────────
  return (
    <div className="dash-page page" style={{ background: "#ffffff" }}>

      {/* ── Bright Hero ───────────────────────────────────── */}
      <section className="hero-section" style={{ minHeight: "70vh", display: "flex", alignItems: "center", background: "linear-gradient(to right, #f8f9fa, #e9ecef)" }}>
        <div className="container hero-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ flex: 1, maxWidth: "600px" }}>
            <p className="eyebrow" style={{ color: "var(--gold)" }}>New Season 2025</p>
            <h1 className="section-title hero-title" style={{ fontSize: "clamp(48px, 6vw, 72px)", color: "#111", lineHeight: 1.1 }}>
              Step Into <br />
              <em style={{ color:"var(--gold)", fontStyle:"normal" }}>Elegance</em>
            </h1>
            <p className="section-sub" style={{ maxWidth: "500px", color: "#555", fontSize: "16px", marginTop: "20px" }}>
              Discover our curated collection of premium footwear. Experience ultimate comfort paired with contemporary design for every occasion.
            </p>
            <div className="hero-cta" style={{ marginTop: "40px" }}>
              <button className="btn btn-gold" onClick={() => navigate("/products")} style={{ padding: "16px 40px", fontSize: "14px" }}>
                Shop the Collection
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {/* Using a placeholder shoe image or abstract shape for a bright theme */}
            <div style={{ width: "400px", height: "400px", background: "radial-gradient(circle, #fff 0%, #e9ecef 70%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "180px" }}>👟</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clean Categories ─────────────────────────────── */}
      <section className="section container" style={{ padding: "80px 0" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 className="section-title" style={{ fontSize: 32, color: "#111" }}>Shop by Category</h2>
          <p style={{ color: "#777", marginTop: 10, fontSize: "16px" }}>Find exactly what you're looking for to complete your look.</p>
        </div>
        <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px" }}>
          {categories.map(c => (
            <div className="cat-card" key={c.label} onClick={() => navigate(`/products?category=${c.label.toLowerCase()}`)} 
                 style={{ 
                   padding: "40px 20px", 
                   textAlign: "center", 
                   cursor: "pointer", 
                   background: "#fff", 
                   border: "1px solid #eaeaea", 
                   borderRadius: "16px", 
                   transition: "0.3s",
                   boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
                 }}>
              <div style={{ width: "80px", height: "80px", margin: "0 auto 20px", background: c.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                {c.icon}
              </div>
              <h3 className="cat-name" style={{ fontSize: "1.2rem", margin: 0, color: "#111", fontWeight: "600" }}>{c.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dash-footer" style={{ borderTop: "1px solid #eaeaea", padding: "60px 0", textAlign: "center", background: "#f8f9fa" }}>
        <div className="container">
          <span className="topnav-brand" style={{ fontSize:28, display: "block", marginBottom: 15, color: "#111" }}>Sole<span style={{ color:"var(--gold)" }}>Lux</span></span>
          <p style={{ color: "#777", fontSize: "0.95rem", maxWidth: "400px", margin: "0 auto 20px" }}>
            The finest selection of premium footwear for the modern individual.
          </p>
          <p style={{ color: "#aaa", fontSize: "0.85rem" }}>© 2025 SoleLux. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
