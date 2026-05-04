import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [popup, setPopup]       = useState({ show: false, type: "", message: "" });

  const showMsg = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 2200);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role",  data.role);
        setIsLoggedIn(true);
        showMsg("success", "Welcome back!");
        setTimeout(() => {
          navigate(data.role === "ADMIN" ? "/admin" : "/dashboard");
        }, 1500);
      } else {
        showMsg("error", "Invalid email or password");
      }
    } catch {
      showMsg("error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">Sole<span>Lux</span></div>
        <p className="auth-tagline">Premium Footwear</p>

        <h2 style={{ fontFamily:"var(--font-serif)", fontSize:22, color:"var(--text2)",
                     fontWeight:400, marginBottom:28, marginTop:24 }}>
          Sign in to your account
        </h2>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-input"
              type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button className="btn btn-gold" style={{ marginTop:8, width:"100%" }}
                  type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-link" style={{ marginTop:20 }}>
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>

      {/* Popup */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-icon">{popup.type === "success" ? "✓" : "✕"}</div>
            <h3 style={{ color: popup.type === "success" ? "var(--green)" : "var(--red)" }}>
              {popup.type === "success" ? "Success" : "Error"}
            </h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
