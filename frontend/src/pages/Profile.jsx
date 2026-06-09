import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Profile({ showMsg }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    phoneNo: "",
    age: "",
    gender: "",
    email: "",
    address: "",
    dob: "",
    preferences: ""
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetPasswordState, setResetPasswordState] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({
        name: res.data.name || "",
        phoneNo: res.data.phoneNo || "",
        age: res.data.age || "",
        gender: res.data.gender || "",
        email: res.data.email || "",
        address: res.data.address || "",
        dob: res.data.dob || "",
        preferences: res.data.preferences || ""
      });
    } catch (err) {
      showMsg("error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/users/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMsg("success", "Profile updated successfully!");
    } catch (err) {
      showMsg("error", err.response?.data || "Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      showMsg("error", "New password must be at least 6 characters.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/users/password`, passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMsg("success", "Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      showMsg("error", err.response?.data || "Failed to update password.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === "123456") {
      setOtpVerified(true);
      showMsg("success", "OTP verified successfully.");
    } else {
      showMsg("error", "Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetPasswordState.length < 6) {
      showMsg("error", "New password must be at least 6 characters.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/users/reset-password`, { newPassword: resetPasswordState }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMsg("success", "Password reset successfully!");
      setForgotPasswordMode(false);
      setOtp("");
      setOtpVerified(false);
      setResetPasswordState("");
    } catch (err) {
      showMsg("error", err.response?.data || "Failed to reset password.");
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner-wrap"><div className="spin" /></div>
      </div>
    );
  }

  return (
    <div className="page container" style={{ maxWidth: "800px", padding: "40px 20px" }}>
      
      <div style={{ marginBottom: "40px" }}>
        <p className="eyebrow">My Account</p>
        <h1 className="section-title" style={{ fontSize: "36px" }}>Profile Settings</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        
        {/* PROFILE FORM */}
        <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Personal Information</h2>
          <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="form-group">
              <label>Email (Cannot be changed)</label>
              <input type="email" className="form-input" value={profile.email} disabled style={{ background: "#f9f9f9", color: "#888" }} />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-input" required value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" className="form-input" value={profile.phoneNo} onChange={e => setProfile({...profile, phoneNo: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input type="number" className="form-input" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select className="form-select" value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value})}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea className="form-input" rows="3" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Full address" style={{ resize: "vertical" }}></textarea>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" className="form-input" value={profile.dob} onChange={e => setProfile({...profile, dob: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Preferences</label>
                <input type="text" className="form-input" value={profile.preferences} onChange={e => setProfile({...profile, preferences: e.target.value})} placeholder="e.g. Sneakers, Formal, etc." />
              </div>
            </div>

            <button type="submit" className="btn btn-gold" style={{ alignSelf: "flex-start", marginTop: "10px" }}>Save Changes</button>
          </form>
        </div>

        {/* PASSWORD FORM */}
        <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", margin: 0 }}>Change Password</h2>
            {!forgotPasswordMode && (
              <button 
                type="button" 
                onClick={() => setForgotPasswordMode(true)}
                style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
              >
                Forgot Password?
              </button>
            )}
          </div>

          {!forgotPasswordMode ? (
            <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" required className="form-input" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" required className="form-input" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
              </div>

              <button type="submit" className="btn btn-dark" style={{ alignSelf: "flex-start", marginTop: "10px" }}>Update Password</button>
            </form>
          ) : (
            <div style={{ background: "#fafafa", padding: "20px", borderRadius: "8px", border: "1px dashed #ddd" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "15px", color: "#333" }}>Reset Password</h3>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>We've sent a 6-digit OTP to your registered email. (Use <strong>123456</strong> for testing)</p>
              
              {!otpVerified ? (
                <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div className="form-group">
                    <label>Enter OTP</label>
                    <input type="text" required className="form-input" value={otp} onChange={e => setOtp(e.target.value)} maxLength="6" placeholder="123456" />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" className="btn btn-gold">Verify OTP</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setForgotPasswordMode(false); setOtp(""); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div className="form-group">
                    <label>Enter New Password</label>
                    <input type="password" required className="form-input" value={resetPasswordState} onChange={e => setResetPasswordState(e.target.value)} placeholder="Minimum 6 characters" />
                  </div>
                  <button type="submit" className="btn btn-dark" style={{ alignSelf: "flex-start" }}>Reset Password</button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
