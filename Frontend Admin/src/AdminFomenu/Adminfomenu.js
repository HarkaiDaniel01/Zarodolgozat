
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Menu1 = () => {
    const [felhasznalo, setFelhasznalo] = useState("");

    useEffect(() => {
        const bejelentkezve = localStorage.getItem("bejelentkezve");
        const nev = localStorage.getItem("felhasznalo");
        
        if (bejelentkezve === "true" && nev) {
            setFelhasznalo(nev);
        }
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Üdvözöllek, <strong style={{
                    backgroundImage: 'linear-gradient(135deg, #00A21D 0%, #FFEA64 70%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                }}>{felhasznalo}</strong>! 👋</h1>
                <p className="dashboard-subtitle">Mit szeretnél kezelni?</p>
            </div>
            
            <div className="dashboard-cards">
                <Link to="/kerdeskezel" className="dashboard-card" style={{
                    background: 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%, #FFC0CB 100%)',
                    minHeight: '1vh',
                    padding: '2rem',
                    borderRadius:'15px',
                    }}>
                    <div className="card-icon">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.9"/>
                            <path d="M30 18C23.37 18 18 23.37 18 30C18 36.63 23.37 42 30 42C36.63 42 42 36.63 42 30C42 23.37 36.63 18 30 18ZM31.5 35H28.5V28H31.5V35ZM31.5 25H28.5V22H31.5V25Z" fill="#00A21D"/>
                        </svg>
                    </div>
                    <h2 className="card-title">Kérdések kezelése</h2>
                    <p className="card-description">Kérdések felvitele, módosítása és törlése</p>
                </Link>

                <Link to="/kategoriakezel" className="dashboard-card" style={{
                    background: 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%, #FFC0CB 100%)',
                    minHeight: '1vh',
                    padding: '2rem',
                    borderRadius:'15px', }}>
                    <div className="card-icon">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.9"/>
                            <path d="M22.5 18H18V42H22.5V18ZM33 18H28.5V42H33V18ZM45 18H40.5V42H45V18Z" fill="#00A21D"/>
                        </svg>
                    </div>
                    <h2 className="card-title">Kategória kezelése</h2>
                    <p className="card-description">Kategóriák felvitele, módosítása és törlése</p>
                </Link>
                <Link to="/engedelykeres" className="dashboard-card" style={{
                    background: 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%, #FFC0CB 100%)',
                    minHeight: '1vh',
                    padding: '2rem',
                    borderRadius:'15px', }}>
                    <div className="card-icon">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.9"/>
                            <path d="M30 18C23.37 18 18 23.37 18 30C18 36.63 23.37 42 30 42C36.63 42 42 36.63 42 30C42 23.37 36.63 18 30 18ZM30 24C31.65 24 33 25.35 33 27C33 28.65 31.65 30 30 30C28.35 30 27 28.65 27 27C27 25.35 28.35 24 30 24ZM30 38.4C26.5 38.4 23.46 36.42 21.9 33.48C21.945 30.48 27.9 28.8 30 28.8C32.095 28.8 38.055 30.48 38.1 33.48C36.54 36.42 33.5 38.4 30 38.4Z" fill="#00A21D"/>
                        </svg>
                    </div>
                    <h2 className="card-title">Felhasználók kezelése</h2>
                    <p className="card-description">Felhasználók admin joga hozzáadása vagy elvéttele és felhasználók törlése </p>
                </Link>
            </div>
        </div>
    );
}

export default Menu1;