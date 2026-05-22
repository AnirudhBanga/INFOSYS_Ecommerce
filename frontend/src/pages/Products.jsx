// ✅ T029 + T030: Product listing + dynamic display
// ✅ Heart/Wishlist button on each card

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/products.css";

/* Diverse shoe images — each index gets a different photo */
const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
];

// Backend stores imageUrl; fallback to unique per-product image
const getImage = (product) => {
  if (product.imageUrl && product.imageUrl.startsWith("http")) return product.imageUrl;
  // If backend serves image: return `http://localhost:8081/api/products/${product.id}/image`;
  return SHOE_IMGS[product.id % SHOE_IMGS.length];
};

const CATEGORIES = ["All", "Sneakers", "Formal", "Sports", "Sandals", "Casual"];

function Products({ addToCart, toggleWishlist, isWishlisted }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q") || "";
  const catParam = queryParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState(q);
  const [category, setCategory] = useState(
    catParam !== "All" ? catParam.charAt(0).toUpperCase() + catParam.slice(1) : "All"
  );
  const [sortBy,   setSortBy]   = useState("default");
  const [added,    setAdded]    = useState(null);

  // Sync with URL when it changes
  useEffect(() => {
    const qParams = new URLSearchParams(location.search);
    const newQ = qParams.get("q") || "";
    const newCat = qParams.get("category") || "All";
    
    setSearch(newQ);
    if(newCat !== "All") {
      setCategory(newCat.charAt(0).toUpperCase() + newCat.slice(1));
    } else {
      setCategory("All");
    }
  }, [location.search]);

  /* Fetch products from backend */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8081/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch {
        setError("Could not load products. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Search / Filter / Sort */
  useEffect(() => {
    let result = [...products];
    if (search.trim())
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase())
      );
    if (category !== "All")
      result = result.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
    if (sortBy === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name")       result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [search, category, sortBy, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (loading) return (
    <div className="page" style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh" }}>
      <div className="spinner-wrap"><div className="spin" />Loading collection…</div>
    </div>
  );

  return (
    <div className="products-page page">
      <div className="container">

        {/* Header */}
        <div className="products-header">
          <div>
            <p className="eyebrow">Our Collection</p>
            <h1 className="section-title" style={{ fontSize:"clamp(32px,5vw,52px)" }}>Premium Footwear</h1>
            <p style={{ color:"var(--text2)", marginTop:8, fontSize:14 }}>{filtered.length} styles available</p>
          </div>
        </div>

        {/* Controls */}
        <div className="products-controls">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.5" className="search-icon">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="search-input" type="text" placeholder="Search shoes…"
                   value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-tab ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">⚠ {error}</div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && !error && (
          <div className="empty-state">
            <span style={{ fontSize:48 }}>👟</span>
            <h3>No shoes found</h3>
            <p>Try adjusting your search or filters.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(""); setCategory("All"); }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="products-grid">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="pcard"
              style={{ animationDelay:`${i * 50}ms` }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="pcard-img-wrap">
                <img className="pcard-img" src={getImage(product)} alt={product.name} loading="lazy" />
                {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}

                {/* ❤️ Wishlist button — top right corner */}
                <button
                  className={`wishlist-btn ${isWishlisted(product.id) ? "wishlisted" : ""}`}
                  onClick={e => handleWishlist(e, product)}
                  title={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              <div className="pcard-body">
                <p className="pcard-cat">{product.category || "Footwear"}</p>
                <h3 className="pcard-name">{product.name}</h3>
                <p className="pcard-desc">
                  {(product.description || "Premium quality footwear.").substring(0, 65)}
                  {(product.description || "").length > 65 ? "…" : ""}
                </p>

                <div className="pcard-footer">
                  <div className="pcard-price">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </div>

                  {/* Add to cart button */}
                  <button
                    className={`add-to-cart-btn ${added === product.id ? "added" : ""}`}
                    onClick={e => handleAddToCart(e, product)}
                    disabled={product.stock === 0}
                    title="Add to Cart"
                  >
                    {added === product.id ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;