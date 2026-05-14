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
  const role = localStorage.getItem("role");

  const hideOn = ["/", "/register"];

 if (hideOn.includes(location.pathname)) {
    return null;
  }

  const isActive = (p) =>
    location.pathname === p
      ? "active"
      : "";

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
          <Link
            to="/dashboard"
            className={isActive("/dashboard")}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/products"
            className={isActive("/products")}
          >
            Collection
          </Link>
        </li>

        <li>
          <Link
            to="/wishlist"
            className={isActive("/wishlist")}
          >
            Wishlist ({wishlistCount})
          </Link>
        </li>

        {isLoggedIn && (
          <li>
            <Link
              to="/my-orders"
              className={isActive("/my-orders")}
            >
              My Orders
            </Link>
          </li>
        )}

        {role === "ADMIN" && (
          <li>
            <Link
              to="/admin"
              className={isActive("/admin")}
            >
              Admin Panel
            </Link>
          </li>
        )}

      </ul>

      <div className="topnav-right">

        {isLoggedIn && (
          <button
            className="nav-ghost"
            onClick={onLogout}
          >
            Logout
          </button>
        )}

        <Link
          to="/cart"
          className="cart-icon-btn"
        >
          Cart ({cartCount})
        </Link>

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
      navigate(`/order/${res.data.id}`);

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