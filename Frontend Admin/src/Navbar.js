// Navbar komponens
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout, checkTokenAndLogout } from './utils/authUtils';

const Navbar = () => {
  const [bejelentkezve, setBejelentkezve] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      // Token ellenőrzés először
      if (!checkTokenAndLogout(navigate)) {
        setBejelentkezve(false);
        setIsAdmin(false);
        return;
      }
      
      const loginStatus = localStorage.getItem("bejelentkezve");
      const userType = localStorage.getItem("userType");
      setBejelentkezve(loginStatus === "true");
      setIsAdmin(userType === "admin");
    };

    checkLogin();
    refreshAdminStatus(); 
    
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    const interval = setInterval(refreshAdminStatus, 30000);

    window.addEventListener('storage', checkLogin);
    window.addEventListener('userTypeChanged', checkLogin);
    
    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('userTypeChanged', checkLogin);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kijelentkezes = () => {
    setBejelentkezve(false);
    setIsAdmin(false);
    logout(navigate);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
    // Értesítés küldése a dark mode változásról
    window.dispatchEvent(new Event('darkModeChanged'));
  };

  const refreshAdminStatus = async () => {
    // Előbb ellenőrizzük a tokent
    if (!checkTokenAndLogout(navigate)) {
      return;
    }
    
    const felhasznalo = localStorage.getItem("felhasznalo");
    if (!felhasznalo) return;

    try {
      const response = await fetch(`http://localhost:3000/admin/check-admin/${felhasznalo}`);
      
      // Ha 401 vagy 403, akkor lejárt a token
      if (response.status === 401 || response.status === 403) {
        logout(navigate);
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        const newUserType = data.jatekos_admin === 1 ? "admin" : "user";
        const currentUserType = localStorage.getItem("userType");
        
        // Csak akkor frissít, ha változott
        if (newUserType !== currentUserType) {
          localStorage.setItem("userType", newUserType);
          window.dispatchEvent(new Event('userTypeChanged'));
          
          // Átirányítás ha szükséges
          if (data.jatekos_admin === 1 && window.location.pathname === '/usermenu') {
            navigate('/');
          } else if (data.jatekos_admin !== 1 && window.location.pathname !== '/usermenu') {
            navigate('/usermenu');
          }
        }
      }
    } catch (error) {
      console.error('Admin státusz frissítési hiba:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to={isAdmin ? "/" : "/usermenu"}>Kvízjáték</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {bejelentkezve && isAdmin && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/kategoriakezel">Kategoriák</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/kerdeskezel">Kérdések</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/engedelykeres">Felhasználók</Link>
              </li>
            </ul>
          )}
          <ul className="navbar-nav ms-auto">
            {bejelentkezve && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/beallitasok">⚙️ Fiókbeállítások</Link>
                </li>
                <li className="nav-item d-flex align-items-center ms-3">
                  <span style={{ marginRight: '10px', fontSize: '14px', fontWeight: '600' }}>
                    {darkMode ? '🌙' : '☀️'}
                  </span>
                  <label className="theme-switch" style={{marginTop:'10px'}}>
                    <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                    <span className="slider"></span>
                  </label>
                </li>
              </>
            )}
            {bejelentkezve ? (
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={kijelentkezes}
                  style={{
                    background: 'none',
                    color: 'var(--text-color)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    marginLeft: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--danger-color)';
                    e.target.style.color = 'white';
                    e.target.style.borderRadius = 'var(--border-radius)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--text-color)';
                  }}
                >
                  Kijelentkezés 🚪
                </button>
              </li>
            ) : null
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar
