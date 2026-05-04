import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import "./index.css";

/* ─── Navbar ─── */
function Navbar({ cartCount, wishlistCount, isLoggedIn, onLogout }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const hideOn = ["/", "/register"];
  if (hideOn.includes(location.pathname)) return null;

  const isActive = (p) => (location.pathname === p ? "active" : "");

  return (
    <nav className={`topnav${scrolled ? " solid" : ""}`}>
      <Link to="/dashboard" className="topnav-brand">Sole<span>Lux</span></Link>

      <ul className="topnav-links">
        <li><Link to="/dashboard"  className={isActive("/dashboard")}>Home</Link></li>
        <li><Link to="/products"   className={isActive("/products")}>Collection</Link></li>
        {/* WISHLIST link replaces CART text in navbar */}
        <li>
          <Link to="/wishlist" className={isActive("/wishlist")} style={{ display:"flex", alignItems:"center", gap:5 }}>
            Wishlist
            {wishlistCount > 0 && (
              <span style={{
                background:"var(--gold)", color:"#080808",
                fontSize:"9px", fontWeight:700,
                width:15, height:15, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>{wishlistCount}</span>
            )}
          </Link>
        </li>
      </ul>

      <div className="topnav-right">
        {isLoggedIn
          ? <button className="nav-ghost" onClick={onLogout}>Logout</button>
          : <Link to="/" className="nav-ghost">Login</Link>
        }
        {/* Cart icon stays on right */}
        <Link to="/cart" className="cart-icon-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

/* ─── Private Route ─── */
function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
}

/* ─── App Inner ─── */
function AppInner() {
  const [cartItems,     setCartItems]     = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoggedIn,    setIsLoggedIn]    = useState(!!localStorage.getItem("token"));

  /* ── Cart ── */
  const addToCart = (product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  /* ── Wishlist ── */
  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.filter(i => i.id !== product.id);
      return [...prev, product];
    });
  };
  const isWishlisted = (id) => wishlistItems.some(i => i.id === id);

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  const cartCount     = cartItems.reduce((s, i) => s + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/"          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin"     element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/products"  element={
          <PrivateRoute>
            <Products addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
          </PrivateRoute>
        } />
        <Route path="/products/:id" element={
          <PrivateRoute>
            <ProductDetail addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
          </PrivateRoute>
        } />
        <Route path="/cart"     element={
          <PrivateRoute>
            <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
          </PrivateRoute>
        } />
        <Route path="/wishlist" element={
          <PrivateRoute>
            <Wishlist wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return <BrowserRouter><AppInner /></BrowserRouter>;
}

export default App;