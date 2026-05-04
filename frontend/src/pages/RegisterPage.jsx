import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    gender: "", age: "", phoneNo: ""
  });
  const [pwdStrength, setPwdStrength] = useState(0); // 0=none 1=weak 2=medium 3=strong
  const [ageError,    setAgeError]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [popup,       setPopup]       = useState({ show: false, type: "", message: "" });

  const showMsg = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 2200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    if (name === "password") {
      if (value.length === 0)      setPwdStrength(0);
      else if (value.length < 6)   setPwdStrength(1);
      else if (/[A-Z]/.test(value) && /[0-9]/.test(value)) setPwdStrength(3);
      else                          setPwdStrength(2);
    }

    if (name === "age") setAgeError(!/^\d*$/.test(value));
  };

  const pwdClass = ["", "input-weak", "input-medium", "input-strong"][pwdStrength];
  const pwdLabel = ["", "Weak", "Medium", "Strong"][pwdStrength];
  const pwdColor = ["", "var(--red)", "#f59e0b", "var(--green)"][pwdStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ageError) { showMsg("error", "Age must be a number"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showMsg("success", "Account created!");
        setTimeout(() => navigate("/"), 1800);
      } else {
        showMsg("error", "Registration failed. Try again.");
      }
    } catch {
      showMsg("error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">Sole<span>Lux</span></div>
        <p className="auth-tagline">Create your account</p>

        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" name="name" placeholder="John Doe"
                   onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" name="email" type="email"
                   placeholder="you@example.com" onChange={handleChange} required />
          </div>

          {/* Password + strength */}
          <div className="form-group">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <label>Password</label>
              {pwdStrength > 0 && (
                <span style={{ fontSize:10, fontWeight:600, color: pwdColor }}>{pwdLabel}</span>
              )}
            </div>
            <input className={`form-input ${pwdClass}`} name="password" type="password"
                   placeholder="Min 6 characters" onChange={handleChange} required />
            <div className="strength-bar">
              {[1,2,3].map(n => (
                <div key={n} className={`strength-seg ${
                  pwdStrength >= n
                    ? n === 1 ? "filled-red" : n === 2 ? "filled-yellow" : "filled-green"
                    : ""
                }`} />
              ))}
            </div>
          </div>

          {/* Row: Gender + Age */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-select" name="gender" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Age {ageError && <span style={{ color:"var(--red)" }}>— numbers only</span>}</label>
              <input className={`form-input ${ageError ? "input-error" : ""}`}
                     name="age" placeholder="25" onChange={handleChange} required />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-input" name="phoneNo" placeholder="+91 98765 43210"
                   onChange={handleChange} required />
          </div>

          <button className="btn btn-gold" style={{ marginTop:8, width:"100%" }}
                  type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-link" style={{ marginTop:20 }}>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>

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

export default RegisterPage;
