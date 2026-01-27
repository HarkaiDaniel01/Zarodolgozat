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
import Rekordok from './Rekordok'
import Statisztika from './Statisztika';
import EredmenyekPontszam from './EredmenyekPontszam';
import PontszamStatisztika from './PontszamStatisztika';
import PontszamRekordok from './PontszamRekordok';




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

          <Route path="/rekordok" element={<Rekordok/>} />

          <Route path="/statisztika" element={<Statisztika/>} />

          <Route path="/eredmenyekPontszam" element={<EredmenyekPontszam/>} />

          <Route path="/pontszamStatisztika" element={<PontszamStatisztika/>} />

          <Route path="/pontszamRekordok" element={<PontszamRekordok/>} />
          
        </Routes>
      </div>
    </Router>

    
  );
}

export default App;
