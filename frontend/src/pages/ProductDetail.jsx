import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../style/productdetail.css";

const SHOE_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
];

const SIZES = [6, 7, 8, 9, 10, 11];

const COLORS = [
  "#111111",
  "#ffffff",
  "#c1121f",
  "#1d3557",
  "#606c38"
];

function ProductDetail({
  addToCart,
  toggleWishlist,
  isWishlisted,
  showMsg
}) {

  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [selSize, setSelSize] = useState(null);

  const [selColor, setSelColor] =
    useState(COLORS[0]);

  const [sizeErr, setSizeErr] =
    useState(false);

  useEffect(() => {

    (async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE_URL}/products/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        setProduct(data);

      } catch {

        showMsg("error", "Failed to load product");

      } finally {

        setLoading(false);

      }
    })();

  }, [id]);

  const getImage = (p) => {

    if (
      p.imageUrl &&
      p.imageUrl.startsWith("http")
    ) {
      return p.imageUrl;
    }

    return SHOE_IMGS[
      (p.id || 0) % SHOE_IMGS.length
    ];
  };

  const handleAdd = () => {

    if (!selSize) {

      setSizeErr(true);

      return;
    }

    addToCart({
      ...product,
      selectedSize: selSize
    });
  };

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spin" />
      </div>
    );
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const wishlisted =
    isWishlisted(product.id);

  return (
    <div className="detail-page page">

      <div className="container">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          Home / Collection / {product.name}
        </div>

        <div className="detail-grid">

          {/* IMAGE */}
          <div className="detail-left">

            <img
              src={getImage(product)}
              alt={product.name}
              className="detail-main-img"
              onError={(e) => { e.target.src = SHOE_IMGS[0]; }}
            />

          </div>

          {/* INFO */}
          <div className="detail-right">

            <p className="detail-category">
              {product.category || "Footwear"}
            </p>

            <h1 className="detail-title">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="rating-row">
              ⭐⭐⭐⭐⭐
              <span>(128 reviews)</span>
            </div>

            {/* PRICE */}
            <div className="detail-price">
              ₹{product.price}
            </div>

            {/* DESC */}
            <p className="detail-description">

              {
                product.description ||
                "Premium handcrafted footwear designed for luxury comfort and everyday style."
              }

            </p>

            {/* STOCK */}
            <div className="stock-text">

              {product.stock > 0
                ? `✅ In Stock (${product.stock} left)`
                : "❌ Out of stock"}

            </div>

            {/* COLORS */}
            <div className="detail-block">

              <p className="detail-label">
                Select Color
              </p>

              <div className="color-row">

                {COLORS.map(c => (

                  <button
                    key={c}
                    className={`color-btn ${
                      selColor === c
                        ? "active"
                        : ""
                    }`}
                    style={{
                      background:c
                    }}
                    onClick={() =>
                      setSelColor(c)
                    }
                  />

                ))}

              </div>
            </div>

            {/* SIZE */}
            <div className="detail-block">

              <div className="size-head">

                <p className="detail-label">
                  Select Size
                </p>

                {sizeErr && (
                  <span className="size-error">
                    Select a size
                  </span>
                )}

              </div>

              <div className="size-grid">

                {SIZES.map(size => (

                  <button
                    key={size}
                    className={`size-btn ${
                      selSize === size
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelSize(size);
                      setSizeErr(false);
                    }}
                  >
                    {size}
                  </button>

                ))}

              </div>
            </div>

            {/* ACTIONS */}
            <div className="detail-actions">

              <button
                className="btn btn-gold"
                onClick={handleAdd}
              >
                Add To Cart
              </button>

              <button
                className="btn btn-outline"
              >
                Buy Now
              </button>

              <button
                className={`wish-btn ${
                  wishlisted
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleWishlist(product)
                }
              >
                ♥
              </button>

            </div>

            {/* FEATURES */}
            <div className="feature-box">

              <div>
                🚚 Free Delivery
              </div>

              <div>
                🔄 30 Days Return
              </div>

              <div>
                🔒 Secure Payments
              </div>

            </div>

            {/* EXTRA DETAILS */}
            <div className="extra-details">

              <h3>
                Product Details
              </h3>

              <ul>

                <li>
                  Premium leather upper
                </li>

                <li>
                  Soft cushioned sole
                </li>

                <li>
                  Breathable inner lining
                </li>

                <li>
                  Lightweight design
                </li>

                <li>
                  Suitable for casual &
                  sports wear
                </li>

              </ul>

            </div>

          </div>
        </div>

        <button
          className="btn btn-outline back-btn"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Back to Collection
        </button>

      </div>
    </div>
  );
}

export default ProductDetail;