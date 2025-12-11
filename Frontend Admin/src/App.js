// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Navbar from './Navbar';
import AdminFomenu from './AdminFomenu/Adminfomenu';
import Kategoriafeltolt from './KategoriaFeltolt/Kategoriafeltolt';
import Kerdesfeltolt from './Kerdesfeltolt/Kerdesfeltolt';
import Bejelentkezés from './Bejelentkezés/Bejelentkezes';
import AdminRegisztralcio from './Regisztralcio/AdminRegisztralcio';
import Usermenu from './AdminFomenu/Usermenu';
import Engedelykeres from './Felhasználókezel/Engedelykeres';
import Felhasznalobeallitas from './Felhasználókezel/Felhasznalobeallitas';
const ProtectedRoute = ({ children }) => {
  const bejelentkezve = localStorage.getItem("bejelentkezve");
  return bejelentkezve === "true" ? children : <Navigate to="/bejelentkezes" />;
};

const UserRoute = ({ children }) => {
  const bejelentkezve = localStorage.getItem("bejelentkezve");
  const userType = localStorage.getItem("userType");
  
  if (bejelentkezve !== "true") {
    return <Navigate to="/bejelentkezes" />;
  }
  
  if (userType === "admin") {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const bejelentkezve = localStorage.getItem("bejelentkezve");
  const userType = localStorage.getItem("userType");
  
  if (bejelentkezve !== "true") {
    return <Navigate to="/bejelentkezes" />;
  }
  
  if (userType !== "admin") {
    return <Navigate to="/usermenu" />;
  }
  
  return children;
};

// App komponens
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/bejelentkezes" element={<Bejelentkezés />} />
        <Route path="/AdminRegisztracio" element={<AdminRegisztralcio />} />
        <Route path="/*" element={
          <>
            <Navbar className="navbar"/>
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<AdminRoute><AdminFomenu /></AdminRoute>} />
                <Route path="/Adminfomenu" element={<AdminRoute><AdminFomenu /></AdminRoute>} />
                <Route path="/kategoriakezel" element={<AdminRoute><Kategoriafeltolt /></AdminRoute>} />
                <Route path="/kerdeskezel" element={<AdminRoute><Kerdesfeltolt /></AdminRoute>} />
                <Route path="/engedelykeres" element={<AdminRoute><Engedelykeres /></AdminRoute>} />
                <Route path="/beallitasok" element={<ProtectedRoute><Felhasznalobeallitas /></ProtectedRoute>} />
                <Route path="/usermenu" element={<UserRoute><Usermenu /></UserRoute>} />
              </Routes>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
