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
    localStorage.removeItem("userid");

    setToken(null);
    setRole(null);

    navigate("/login");
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

          {/*loggedIn && (
            <Link to="/felhasznalo" className="link" onClick={() => setMenuOpen(false)}>
              Eredmények
            </Link>
          )*/}

          {loggedIn && <li className="nav-item dropdown link">
              <button 
                className="nav-link dropdown-toggle btn btn-link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                Eredmények
              </button>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/felhasznalo">Nyeremények</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/eredmenyekPontszam">Pontszámok</Link>
                </li>
              </ul>
          </li>}

          {loggedIn && <li className="nav-item dropdown link">
              <button 
                className="nav-link dropdown-toggle btn btn-link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                Statisztikák
              </button>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/statisztika">Nyeremények</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pontszamStatisztika">Pontszámok</Link>
                </li>
              </ul>
          </li>}

          {loggedIn && <li className="nav-item dropdown link">
              <button 
                className="nav-link dropdown-toggle btn btn-link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                Rekordok
              </button>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/rekordok">Nyeremények</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pontszamRekordok">Pontszámok</Link>
                </li>
              </ul>
          </li>}




          {/*loggedIn && (
            <Link to="/rekordok" className="link" onClick={() => setMenuOpen(false)}>
              Rekordok
            </Link>
          )*/}
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
