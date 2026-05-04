import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    // Try to get name from localStorage if saved
    const saved = localStorage.getItem("userName");
    if (saved) setUserName(saved);
  }, [navigate]);

  const categories = [
    { label: "Sneakers",   icon: "👟", count: "120+ styles" },
    { label: "Formal",     icon: "👞", count: "80+ styles"  },
    { label: "Sports",     icon: "🏃", count: "60+ styles"  },
    { label: "Sandals",    icon: "🩴", count: "45+ styles"  },
  ];

  const features = [
    { icon: "✦", title: "Premium Quality",  desc: "Handcrafted from the finest materials." },
    { icon: "↩", title: "Free Returns",     desc: "30-day hassle-free return policy."      },
    { icon: "⚡", title: "Fast Delivery",   desc: "Express shipping across India."          },
    { icon: "🔒", title: "Secure Payment",  desc: "100% safe & encrypted checkout."        },
  ];

  return (
    <div className="dash-page page">

      {/* ── Hero ───────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="container hero-content">
          <p className="eyebrow">New Season 2025</p>
          <h1 className="section-title hero-title">
            Walk in<br />
            <em style={{ color:"var(--gold)", fontStyle:"normal" }}>Pure Luxury</em>
          </h1>
          <p className="section-sub">
            Discover our curated collection of premium footwear —<br />
            where craftsmanship meets contemporary design.
          </p>
          <div className="hero-cta">
            <button className="btn btn-gold" onClick={() => navigate("/products")}>
              Shop Collection
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/products")}>
              View Lookbook
            </button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="hero-stats">
          {[["1200+","Products"],["50K+","Happy Customers"],["4.9★","Average Rating"]].map(([n,l]) => (
            <div className="hero-stat" key={l}>
              <span className="stat-num">{n}</span>
              <span className="stat-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────── */}
      <section className="section container">
        <p className="eyebrow">Browse by Category</p>
        <h2 className="section-title" style={{ fontSize:36, marginBottom:36 }}>What are you looking for?</h2>
        <div className="cat-grid">
          {categories.map(c => (
            <div className="cat-card" key={c.label} onClick={() => navigate("/products")}>
              <span className="cat-icon">{c.icon}</span>
              <h3 className="cat-name">{c.label}</h3>
              <p className="cat-count">{c.count}</p>
              <span className="cat-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" style={{ margin:"0 48px" }} />

      {/* ── Why Us ─────────────────────────────────── */}
      <section className="section container">
        <p className="eyebrow">Why SoleLux</p>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-item" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h4 className="feature-title">{f.title}</h4>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section className="cta-banner container">
        <div className="cta-inner">
          <h2 style={{ fontFamily:"var(--font-serif)", fontSize:36, color:"var(--text)", marginBottom:10 }}>
            Ready to find your perfect pair?
          </h2>
          <p style={{ color:"var(--text2)", marginBottom:24 }}>
            Join 50,000+ customers who trust SoleLux.
          </p>
          <button className="btn btn-gold" onClick={() => navigate("/products")}>
            Explore All Shoes
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="dash-footer">
        <span className="topnav-brand" style={{ fontSize:16 }}>Sole<span style={{ color:"var(--gold)" }}>Lux</span></span>
        <p>© 2025 SoleLux. Premium Footwear.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
