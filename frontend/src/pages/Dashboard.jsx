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
    { label: "Sneakers",   icon: "👟" },
    { label: "Formal",     icon: "👞" },
    { label: "Sports",     icon: "🏃" },
    { label: "Sandals",    icon: "🩴" },
  ];

  // ── ADMIN VIEW ─────────────────────────────────────
  if (role === "ADMIN") {
    return (
      <div className="dash-page page">
        <section className="hero-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
          <div className="hero-bg" style={{ filter: "brightness(0.3)" }} />
          <div className="container hero-content" style={{ textAlign: "center", alignItems: "center" }}>
            <p className="eyebrow" style={{ color: "var(--gold)" }}>Admin Workspace</p>
            <h1 className="section-title hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              Welcome back, <br />
              <em style={{ color:"var(--gold)", fontStyle:"normal" }}>Commander</em>
            </h1>
            <p className="section-sub" style={{ maxWidth: "600px", margin: "0 auto 40px" }}>
              Oversee your inventory, manage incoming orders, and track store performance directly from your dashboard.
            </p>
            <div className="hero-cta" style={{ justifyContent: "center" }}>
              <button className="btn btn-gold" onClick={() => navigate("/admin")}>
                Go to Admin Panel
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/products")}>
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
    <div className="dash-page page">

      {/* ── Minimal Hero ───────────────────────────────────── */}
      <section className="hero-section" style={{ minHeight: "75vh" }}>
        <div className="hero-bg" />
        <div className="container hero-content">
          <p className="eyebrow">New Season 2025</p>
          <h1 className="section-title hero-title">
            Walk in<br />
            <em style={{ color:"var(--gold)", fontStyle:"normal" }}>Pure Luxury</em>
          </h1>
          <p className="section-sub" style={{ maxWidth: "500px" }}>
            Discover our curated collection of premium footwear — where craftsmanship meets contemporary design.
          </p>
          <div className="hero-cta">
            <button className="btn btn-gold" onClick={() => navigate("/products")}>
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* ── Clean Categories ─────────────────────────────── */}
      <section className="section container" style={{ padding: "80px 0" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 className="section-title" style={{ fontSize: 28 }}>Shop by Category</h2>
          <p style={{ color: "var(--text2)", marginTop: 10 }}>Find exactly what you're looking for.</p>
        </div>
        <div className="cat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {categories.map(c => (
            <div className="cat-card" key={c.label} onClick={() => navigate("/products")} style={{ padding: "30px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", transition: "0.3s" }}>
              <span className="cat-icon" style={{ fontSize: "40px", display: "block", marginBottom: "15px" }}>{c.icon}</span>
              <h3 className="cat-name" style={{ fontSize: "1.1rem", margin: 0 }}>{c.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dash-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 0", textAlign: "center" }}>
        <span className="topnav-brand" style={{ fontSize:20, display: "block", marginBottom: 10 }}>Sole<span style={{ color:"var(--gold)" }}>Lux</span></span>
        <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>© 2025 SoleLux. Premium Footwear.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
