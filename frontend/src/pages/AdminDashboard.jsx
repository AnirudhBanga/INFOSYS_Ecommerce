import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({
    name:"", description:"", price:"", stock:"", category:"", imageUrl:""
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [popup,     setPopup]     = useState({ show:false, type:"", message:"" });

  const showMsg = (type, message) => {
    setPopup({ show:true, type, message });
    setTimeout(() => setPopup({ show:false, type:"", message:"" }), 3000);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Preview selected image
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) { showMsg("error", "Not logged in. Please login again."); setLoading(false); return; }

      // Step 1: Create product (JSON)
      const productData = {
        name:        form.name,
        description: form.description,
        price:       Number(form.price),
        stock:       Number(form.stock),
        category:    form.category,
        imageUrl:    form.imageUrl || null,   // external URL if provided
      };

      const res = await fetch("http://localhost:8081/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Product creation error:", res.status, errText);
        showMsg("error", `Failed to add product (${res.status}). Check console.`);
        setLoading(false);
        return;
      }

      const savedProduct = await res.json();

      // Step 2: If user picked an image file, upload it
      if (imageFile && savedProduct.id) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const imgRes = await fetch(`http://localhost:8081/api/products/${savedProduct.id}/image`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });

        if (!imgRes.ok) {
          showMsg("success", "Product added! (Image upload failed — check file type)");
        } else {
          showMsg("success", "Product added with image successfully!");
        }
      } else {
        showMsg("success", "Product added successfully!");
      }

      // Reset form
      setForm({ name:"", description:"", price:"", stock:"", category:"", imageUrl:"" });
      setImageFile(null);
      setPreview(null);

    } catch (err) {
      console.error(err);
      showMsg("error", "Cannot connect to server. Is backend running on port 8081?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page page">
      <div className="container">

        <div style={{ padding:"48px 0 32px" }}>
          <p className="eyebrow">Admin Panel</p>
          <h1 className="section-title" style={{ fontSize:"clamp(28px,4vw,44px)" }}>Product Management</h1>
        </div>

        <div className="admin-grid">

          {/* ── Add Product Form ── */}
          <div className="admin-card">
            <h2 className="admin-card-title">Add New Product</h2>
            <form className="admin-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Product Name</label>
                <input className="form-input" name="name" placeholder="Nike Air Max"
                       value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="form-select" name="category" value={form.category}
                        onChange={handleChange} required>
                  <option value="">Select category</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Formal">Formal</option>
                  <option value="Sports">Sports</option>
                  <option value="Sandals">Sandals</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input className="form-input" name="price" type="number" placeholder="2999"
                         value={form.price} onChange={handleChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input className="form-input" name="stock" type="number" placeholder="50"
                         value={form.stock} onChange={handleChange} required min="0" />
                </div>
              </div>

              {/* Image options */}
              <div className="admin-img-section">
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--text2)", marginBottom:10 }}>
                  Product Image
                </p>

                {/* Option A: Upload file */}
                <div className="form-group">
                  <label>Upload Image File (from your computer)</label>
                  <label className="file-upload-label">
                    <input type="file" accept="image/*" onChange={handleImageFile}
                           style={{ display:"none" }} />
                    <span>📁 Choose Image</span>
                  </label>
                  {preview && (
                    <div className="img-preview-wrap">
                      <img src={preview} alt="Preview" className="img-preview" />
                      <button type="button" className="img-clear"
                              onClick={() => { setImageFile(null); setPreview(null); }}>
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Option B: External URL */}
                {!imageFile && (
                  <div className="form-group">
                    <label>OR — Paste Image URL</label>
                    <input className="form-input" name="imageUrl"
                           placeholder="https://example.com/shoe.jpg"
                           value={form.imageUrl} onChange={handleChange} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" name="description"
                          placeholder="Product description…"
                          value={form.description} onChange={handleChange}
                          rows={3} style={{ resize:"vertical", lineHeight:1.6 }} />
              </div>

              <button className="btn btn-gold" style={{ width:"100%", marginTop:8, padding:"14px" }}
                      type="submit" disabled={loading}>
                {loading ? "Adding product…" : "Add Product"}
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"Total Products", value:"—", icon:"📦" },
              { label:"Total Orders",   value:"—", icon:"🛒" },
              { label:"Revenue",        value:"—", icon:"💰" },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <span className="stat-card-icon">{s.icon}</span>
                <div>
                  <p className="stat-card-value">{s.value}</p>
                  <p className="stat-card-label">{s.label}</p>
                </div>
              </div>
            ))}
            <button className="btn btn-outline" onClick={() => navigate("/products")}>
              View All Products →
            </button>
          </div>
        </div>
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

export default AdminDashboard;