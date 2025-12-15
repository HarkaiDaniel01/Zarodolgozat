import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const navigate = useNavigate();

  // Figyelje, ha a localStorage változik (logout vagy lejár)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedToken !== token) setToken(storedToken);
      if (storedRole !== role) setRole(storedRole);
    }, 500); // 0.5 másodpercenként ellenőrzi

    return () => clearInterval(interval);
  }, [token, role]);

  const loggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);

    navigate("/menu1");
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>

        <div className={`menu ${menuOpen ? "open" : ""}`}>
          <Link to="/Kategoria" className="link" onClick={() => setMenuOpen(false)}>
            Játék
          </Link>

          {loggedIn && role === "admin" && (
            <Link to="/admin" className="link" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}

          {loggedIn && role === "user" && (
            <Link to="/user" className="link" onClick={() => setMenuOpen(false)}>
              User menü
            </Link>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {loggedIn ? (
          <button className="logoutButton" onClick={handleLogout}>
            Kijelentkezés
          </button>
        ) : (
          <Link to="/login" className="loginButton">
            Bejelentkezés
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
