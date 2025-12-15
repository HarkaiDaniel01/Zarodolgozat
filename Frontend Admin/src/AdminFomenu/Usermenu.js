import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Usermenu = () => {
    const [felhasznalo, setFelhasznalo] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const bejelentkezve = localStorage.getItem("bejelentkezve");
        const nev = localStorage.getItem("felhasznalo");
        const userType = localStorage.getItem("userType");
        
        // Dark mode figyelés
        const updateDarkMode = () => {
            const savedMode = localStorage.getItem("darkMode");
            setDarkMode(savedMode === "true");
        };
        
        updateDarkMode();
        
        if (bejelentkezve === "true" && nev) {
            setFelhasznalo(nev);
        }

        // Ha admin lesz, átirányítjuk a főoldalra
        if (userType === "admin") {
            navigate("/");
        }

        // Figyelés a userType változására
        const handleUserTypeChange = () => {
            const currentUserType = localStorage.getItem("userType");
            if (currentUserType === "admin") {
                navigate("/");
            }
        };

        // Dark mode változás figyelése
        window.addEventListener("darkModeChanged", updateDarkMode);
        window.addEventListener("userTypeChanged", handleUserTypeChange);
        window.addEventListener("storage", handleUserTypeChange);

        return () => {
            window.removeEventListener("darkModeChanged", updateDarkMode);
            window.removeEventListener("userTypeChanged", handleUserTypeChange);
            window.removeEventListener("storage", handleUserTypeChange);
        };
    }, [navigate]);

    return (
        <div style={{
            background: darkMode 
            ? 'linear-gradient(135deg, #4CAF50, #8B4513)'
            : 'linear-gradient(135deg, #00A21D 0%, #FFEA64 50%, #FFC0CB 100%)',
            height: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflow: 'hidden',
            borderRadius:'15px'
        }}>
            <div style={{
                background: darkMode ? '#1f2937' : 'white',
                borderRadius: '24px',
                padding: '2rem',
                maxWidth: '550px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                        <circle cx="40" cy="40" r="40" fill="#00A21D" fillOpacity="0.1"/>
                        <path d="M40 20C28.96 20 20 28.96 20 40C20 51.04 28.96 60 40 60C51.04 60 60 51.04 60 40C60 28.96 51.04 20 40 20ZM40 28C44.42 28 48 31.58 48 36C48 40.42 44.42 44 40 44C35.58 44 32 40.42 32 36C32 31.58 35.58 28 40 28ZM40 52.8C34 52.8 28.72 49.84 25.6 45.28C25.68 40.62 35.32 38.04 40 38.04C44.66 38.04 54.32 40.62 54.4 45.28C51.28 49.84 46 52.8 40 52.8Z" fill="#00A21D"/>
                    </svg>
                </div>
                
                <h1 style={{
                    color: darkMode ? '#e5e7eb' : '#1f2937',
                    fontSize: '1.75rem',
                    marginBottom: '0.75rem',
                    fontWeight: '600'
                }}>
                    Üdvözöllek, {felhasznalo}! 👋
                </h1>
                
                <p style={{
                    color: darkMode ? '#9ca3af' : '#6B7280',
                    fontSize: '1rem',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6'
                }}>
                    Jelenleg <strong style={{ color: '#00A21D' }}>felhasználói</strong> hozzáféréssel rendelkezel.
                </p>

                <div style={{
                    background: darkMode 
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)'
                        : 'linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 100%)',
                    borderLeft: '4px solid #F59E0B',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                }}>
                    <p style={{
                        color: darkMode ? '#fbbf24' : '#92400E',
                        margin: 0,
                        fontSize: '0.9rem',
                        lineHeight: '1.6'
                    }}>
                        ⏳ Az <strong>admin funkciók</strong> eléréséhez kérjük, várj amíg a jogosultságod 
                        jóváhagyásra kerül. Elfogadás esetén kb. 30 másodpercen belül automatikusan frissül az oldal.
                    </p>
                </div>

                <div style={{
                    background: darkMode ? '#374151' : '#F9FAFB',
                    borderRadius: '12px',
                    padding: '1.25rem'
                }}>
                    <p style={{
                        color: darkMode ? '#9ca3af' : '#6B7280',
                        margin: 0,
                        fontSize: '0.85rem'
                    }}>
                        💡 <strong>Tipp:</strong> Az oldal automatikusan frissül, amikor a jogosultságod megváltozik.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Usermenu;