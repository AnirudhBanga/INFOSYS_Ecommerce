import { useNavigate } from "react-router-dom";
import "../style/wishlist.css";

const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80",
];
const getImage = (item) => {
  if (item.imageUrl && item.imageUrl.startsWith("http")) return item.imageUrl;
  return SHOE_IMGS[item.id % SHOE_IMGS.length];
};

function Wishlist({ wishlistItems, toggleWishlist, addToCart }) {
  const navigate = useNavigate();

  if (wishlistItems.length === 0) return (
    <div className="wishlist-page page">
      <div className="container wishlist-empty">
        <span style={{ fontSize:64 }}>♡</span>
        <h2>Your wishlist is empty</h2>
        <p>Save items you love — tap the heart on any shoe.</p>
        <button className="btn btn-gold" onClick={() => navigate("/products")}>Explore Collection</button>
      </div>
    </div>
  );

  return (
    <div className="wishlist-page page">
      <div className="container">

        <div style={{ padding:"48px 0 36px" }}>
          <p className="eyebrow">Saved Items</p>
          <h1 className="section-title" style={{ fontSize:"clamp(28px,5vw,44px)" }}>
            My Wishlist
            <span style={{
              fontFamily:"var(--font-sans)", fontSize:18,
              color:"var(--text2)", fontWeight:400, marginLeft:12
            }}>
              ({wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""})
            </span>
          </h1>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div className="wcard" key={item.id}>
              {/* Image — clickable */}
              <div className="wcard-img-wrap" onClick={() => navigate(`/products/${item.id}`)}>
                <img src={getImage(item)} alt={item.name} className="wcard-img" />
              </div>

              <div className="wcard-body">
                <p className="pcard-cat">{item.category || "Footwear"}</p>
                <h3 className="pcard-name" style={{ cursor:"pointer" }}
                    onClick={() => navigate(`/products/${item.id}`)}>
                  {item.name}
                </h3>
                <p className="pcard-desc">
                  {(item.description || "Premium footwear.").substring(0,60)}…
                </p>

                <div className="wcard-footer">
                  <span className="pcard-price">₹{Number(item.price).toLocaleString("en-IN")}</span>

                  <div style={{ display:"flex", gap:8 }}>
                    {/* Add to cart */}
                    <button
                      className="btn btn-gold"
                      style={{ padding:"9px 16px", fontSize:10 }}
                      onClick={() => { addToCart(item); navigate("/cart"); }}
                    >
                      Add to Cart
                    </button>

                    {/* Remove from wishlist */}
                    <button
                      className="w-remove-btn"
                      onClick={() => toggleWishlist(item)}
                      title="Remove from wishlist"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Wishlist;