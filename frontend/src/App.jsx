import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
  useNavigate
} from "react-router-dom";

import { useState, useEffect } from "react";

import axios from "axios";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSummary from "./pages/OrderSummary";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";

import "./index.css";

const API = "http://localhost:8081/api";

// ─────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────
function Navbar({
  cartCount,
  wishlistCount,
  isLoggedIn,
  onLogout
}) {

  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const hideOn = ["/", "/register"];

 if (hideOn.includes(location.pathname)) {
    return null;
  }

  const isActive = (p) =>
    location.pathname === p
      ? "active"
      : "";

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className="topnav solid">

      <Link
        to="/dashboard"
        className="topnav-brand"
      >
        Sole<span>Lux</span>
      </Link>

      <ul className="topnav-links">
        <li>
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" className={isActive("/products")}>
            Collection
          </Link>
        </li>
      </ul>

      {/* Global Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "400px", margin: "0 40px", display: "flex", alignItems: "center" }}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 18px", borderRadius: "20px", border: "1px solid #ddd", outline: "none", fontSize: "13px", background: "#f9f9f9" }}
        />
      </form>

      <div className="topnav-right">
        
        {role === "ADMIN" && (
          <Link to="/admin" className="nav-pill" style={{ marginRight: "10px" }}>Admin Panel</Link>
        )}

        <Link to="/wishlist" className="cart-icon-btn" style={{ marginRight: "15px" }}>
          ♡ {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
        </Link>

        <Link to="/cart" className="cart-icon-btn" style={{ marginRight: "20px" }}>
          🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {isLoggedIn ? (
          <div style={{ position: "relative" }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", padding: "10px 0" }}>
              👤 Account ▾
            </div>
            {showDropdown && (
              <div style={{ position: "absolute", top: "100%", right: 0, background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", minWidth: "160px", overflow: "hidden", zIndex: 1000, display: "flex", flexDirection: "column" }}>
                <Link to="/profile" style={{ padding: "12px 16px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5" }} className="dropdown-item">My Profile</Link>
                <Link to="/my-orders" style={{ padding: "12px 16px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5" }} className="dropdown-item">My Orders</Link>
                <button onClick={onLogout} style={{ background: "none", border: "none", width: "100%", textAlign: "left", padding: "12px 16px", fontSize: "13px", color: "var(--red)", cursor: "pointer" }} className="dropdown-item">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/" className="btn btn-dark" style={{ padding: "8px 20px", fontSize: "11px" }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────
// PRIVATE ROUTE
// ─────────────────────────────────────────
function PrivateRoute({ children }) {

  return localStorage.getItem("token")
    ? children
    : <Navigate to="/" replace />;
}

// ─────────────────────────────────────────
// APP INNER
// ─────────────────────────────────────────
function AppInner() {

  const navigate = useNavigate();

  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] =
    useState(
      !!localStorage.getItem("token")
    );

  // CART
  const [cartItems, setCartItems] =
    useState([]);

  // WISHLIST
  const [wishlistItems, setWishlistItems] =
    useState([]);

  const token =
    localStorage.getItem("token");

  // POPUP STATE
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const showMsg = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 2500);
  };

  // ─────────────────────────────────────
  // GLOBAL AXIOS 401 INTERCEPTOR (T60)
  // ─────────────────────────────────────
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setIsLoggedIn(false);
          navigate("/");
          showMsg("error", "Session expired. Please log in again.");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  // ─────────────────────────────────────
  // FETCH CART
  // ─────────────────────────────────────
  const fetchCart = async () => {

    if (!token) return;

    try {

      const res = await axios.get(
        `${API}/cart`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setCartItems(
        res.data.cartItems || []
      );

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    fetchCart();

  }, []);

  // ─────────────────────────────────────
  // ADD TO CART
  // ─────────────────────────────────────
  const addToCart = async (
    product,
    selectedSize = product.selectedSize || "8"
  ) => {

    try {

      await axios.post(
        `${API}/cart/add`,
        {
          productId: product.id,
          quantity: 1,
          selectedSize
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      showMsg("success", "Item added to cart!");
      fetchCart();

    } catch (err) {

      showMsg(
        "error",
        err.response?.data
        || "Failed to add to cart"
      );
    }
  };

  // ─────────────────────────────────────
  // REMOVE ITEM
  // ─────────────────────────────────────
  const removeFromCart = async (
    cartItemId
  ) => {

    try {

      const res = await axios.delete(
        `${API}/cart/remove/${cartItemId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setCartItems(
        res.data.cartItems
      );
      showMsg("success", "Item removed from cart");

    } catch {

      showMsg("error", "Failed to remove item");

    }
  };

  // ─────────────────────────────────────
  // UPDATE QUANTITY
  // ─────────────────────────────────────
  const updateQuantity = async (
    cartItemId,
    quantity
  ) => {

    try {

      const res = await axios.put(
        `${API}/cart/update/${cartItemId}`,
        { quantity },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setCartItems(
        res.data.cartItems
      );

    } catch {

      showMsg("error", "Failed to update");

    }
  };

  // ─────────────────────────────────────
  // CHECKOUT
  // ─────────────────────────────────────
  const checkout = async (shippingAddress, paymentMethod) => {

    try {

      const res = await axios.post(
        `${API}/orders/checkout`,
        { shippingAddress, paymentMethod },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchCart();
      showMsg("success", "Order placed successfully!");
      navigate(`/order/${res.data.id}?success=true`);

    } catch (err) {

      showMsg(
        "error",
        err.response?.data
        || "Checkout failed"
      );

    }
  };

  // ─────────────────────────────────────
  // WISHLIST
  // ─────────────────────────────────────
  const toggleWishlist = (product) => {

    setWishlistItems(prev => {

      const exists =
        prev.find(i =>
          i.id === product.id
        );

      if (exists) {

        return prev.filter(i =>
          i.id !== product.id
        );
      }

      return [...prev, product];
    });
  };

  const isWishlisted = (id) =>
    wishlistItems.some(i => i.id === id);

  // ─────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    setIsLoggedIn(false);

    navigate("/");
  };

  // ─────────────────────────────────────
  // CART COUNT
  // ─────────────────────────────────────
  const cartCount =
    cartItems.reduce(
      (s, i) => s + i.quantity,
      0
    );

  return (
    <>

      <Navbar
        cartCount={cartCount}
        wishlistCount={
          wishlistItems.length
        }
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            <LoginPage
              setIsLoggedIn={
                setIsLoggedIn
              }
            />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products
                addToCart={addToCart}
                toggleWishlist={
                  toggleWishlist
                }
                isWishlisted={
                  isWishlisted
                }
                showMsg={showMsg}
              />
            </PrivateRoute>
          }
        />

        {/* PRODUCT DETAIL */}
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductDetail
                addToCart={addToCart}
                toggleWishlist={
                  toggleWishlist
                }
                isWishlisted={
                  isWishlisted
                }
                showMsg={showMsg}
              />
            </PrivateRoute>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart
                cartItems={cartItems}
                removeFromCart={
                  removeFromCart
                }
                updateQuantity={
                  updateQuantity
                }
                showMsg={showMsg}
              />
            </PrivateRoute>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout
                cartItems={cartItems}
                checkout={checkout}
                showMsg={showMsg}
              />
            </PrivateRoute>
          }
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Wishlist
                wishlistItems={
                  wishlistItems
                }
                toggleWishlist={
                  toggleWishlist
                }
                showMsg={showMsg}
              />
            </PrivateRoute>
          }
        />

        {/* ORDER SUMMARY */}
        <Route
          path="/order/:id"
          element={
            <PrivateRoute>
              <OrderSummary showMsg={showMsg} />
            </PrivateRoute>
          }
        />

        {/* MY ORDERS */}
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrders showMsg={showMsg} />
            </PrivateRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile showMsg={showMsg} />
            </PrivateRoute>
          }
        />

      </Routes>

      {/* GLOBAL POPUP */}
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
    </>
  );
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
function App() {

  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;