// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './Navbar';
import Kategoria from './Menu1/Kategoria';
import './App.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import Login from './Login';
import Register from './Register';
import Felhasznalo from './Felhasznalo';




// App komponens
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Kategoria />} />
         
          <Route path="/kategoria" element={<Kategoria />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register/>} />

          <Route path="/felhasznalo" element={<Felhasznalo/>} />
          
        </Routes>
      </div>
    </Router>

    
  );
}

export default App;
