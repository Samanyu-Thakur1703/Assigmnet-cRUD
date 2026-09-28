import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await api.me();
        setUser(data.user);
      } catch {
        // No active login. Public product browsing is still allowed.
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div className="center-screen">Loading...</div>;
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">MiniStore</Link>
        <div className="nav-actions">
          <Link to="/">Products</Link>
          {user ? (
            <>
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={handleLogout} className="secondary-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="primary-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Products user={user} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}
