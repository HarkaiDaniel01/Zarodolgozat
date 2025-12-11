// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Navbar from './Navbar';
import Kategoria from './Menu1/Kategoria';
import './App.css'
import 'sweetalert2/dist/sweetalert2.min.css';




// App komponens
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Kategoria />} />
         
          <Route path="/kategoria" element={<Kategoria />} />
        </Routes>
      </div>
    </Router>

    
  );
}

export default App;
