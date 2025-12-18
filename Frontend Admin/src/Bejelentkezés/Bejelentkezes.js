import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cim from "../Cim";
import "../App.css";

const Bejelentkezés = () => {
    const [jatekos_nev, setFelhasznalonev] = useState("");
    const [jatekos_jelszo, setJatekos_jelszo] = useState("");
    const [hibaUzenet, setHibaUzenet] = useState("");
    const navigate = useNavigate();

    const bejelentkezesFuggveny = async (e) => {
        e.preventDefault();
        setHibaUzenet("");

        try {
            const response = await fetch(Cim.Cim+'/admin/bejelentkezes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jatekos_nev ,
                    jatekos_jelszo
                })
                });

            const data = await response.json();

            if (response.ok) {
                console.log("Admin érték:", data.jatekos_admin);
                localStorage.setItem("bejelentkezve", "true");
                localStorage.setItem("felhasznalo", jatekos_nev);
                localStorage.setItem("token", data.token);
                localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000); // 1 óra
                localStorage.setItem("userType", data.jatekos_admin === 1 ? "admin" : "user");
                window.dispatchEvent(new Event('storage'));
                window.dispatchEvent(new Event('userTypeChanged'));
                if(data.jatekos_admin === 1){
                    navigate("/");
                } else {
                    navigate("/usermenu");
                }
            } else {
                setHibaUzenet(data.error || "Hibás felhasználónév vagy jelszó!");
            }
        } catch (error) {
            console.error(error);
            setHibaUzenet("Hiba történt a bejelentkezés során!");
        }
    };

    return (
        <div className="login-container ">
            <div className="login-card">
                <div className="login-icon">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="25" fill="#66A5AD"/>
                        <path d="M25 15C19.48 15 15 19.48 15 25C15 30.52 19.48 35 25 35C30.52 35 35 30.52 35 25C35 19.48 30.52 15 25 15ZM25 20C27.21 20 29 21.79 29 24C29 26.21 27.21 28 25 28C22.79 28 21 26.21 21 24C21 21.79 22.79 20 25 20ZM25 32.2C22.5 32.2 20.29 30.92 19 29C19.03 26.99 23 25.9 25 25.9C26.99 25.9 30.97 26.99 31 29C29.71 30.92 27.5 32.2 25 32.2Z" fill="white"/>
                    </svg>
                </div>
                <h1 className="login-title">Admin Bejelentkezés</h1>
                <p className="login-subtitle">Add meg a bejelentkezési adataidat az admin felület eléréséhez</p>
                
                <form className="login-form" onSubmit={bejelentkezesFuggveny}>
                    <div className="form-group">
                        <label htmlFor="login-username" className="form-label">Felhasználónév</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="login-username"
                                name="username"
                                className="form-input"
                                value={jatekos_nev}
                                onChange={(e) => setFelhasznalonev(e.target.value)}
                                placeholder=""
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="login-password" className="form-label">Jelszó</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="login-password"
                                name="password"
                                className="form-input"
                                value={jatekos_jelszo}
                                onChange={(e) => setJatekos_jelszo(e.target.value)}
                                placeholder=""
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    {hibaUzenet && (
                        <div className="error-message">
                            {hibaUzenet}
                        </div>
                    )}

                    <button type="submit" className="login-button">
                        Belépés
                    </button>

                    <Link to="/AdminRegisztracio" className="forgot-password">
                        Nincs még fiókod? Regisztráció
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Bejelentkezés;