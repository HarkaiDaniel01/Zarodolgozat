// authUtils.js - Autentikációs segédfüggvények

// Ellenőrzi, hogy a token érvényes-e és nem járt-e le
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  
  if (!token || !tokenExpiry) {
    return false;
  }
  
  // Ellenőrizzük, hogy a token nem járt-e le
  const now = Date.now();
  if (now > parseInt(tokenExpiry)) {
    return false;
  }
  
  return true;
};

// Kijelentkezés és adatok törlése
export const logout = (navigate) => {
  localStorage.removeItem("bejelentkezve");
  localStorage.removeItem("felhasznalo");
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("userType");
  
  // Átirányítás a bejelentkezési oldalra
  if (navigate) {
    navigate("/bejelentkezes");
  } else {
    window.location.href = "/bejelentkezes";
  }
};

// Token ellenőrzése és automatikus kijelentkezés ha lejárt
export const checkTokenAndLogout = (navigate) => {
  if (!isTokenValid()) {
    const bejelentkezve = localStorage.getItem("bejelentkezve");
    if (bejelentkezve === "true") {
      logout(navigate);
      return false;
    }
  }
  return true;
};

// Token lekérése Authorization headerhez
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token && isTokenValid()) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};
