import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import Cim from "../Cim";
import "../App.css";

const AdminRegisztralcio = () => {
    const [jatekos_nev, setFelhasznalonev] = useState("");
    const [jatekos_jelszo, setJatekos_jelszo] = useState("");
    const [jatekos_jelszo1, setJatekos_jelszo1] = useState("");
    const [hibaUzenet, setHibaUzenet] = useState("");
    const navigate = useNavigate();

    const regisztracioFuggveny = async (e) => {
        e.preventDefault();
        setHibaUzenet("");
        if (jatekos_jelszo !== jatekos_jelszo1) {
            setHibaUzenet("A két jelszó nem egyezik!");
            return;
       }

        try {
            const response = await fetch(`${Cim.Cim}/admin/regisztracio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jatekos_nev,
                    jatekos_jelszo
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Sikeres regisztráció!");
                localStorage.setItem("bejelentkezve", "true");
                localStorage.setItem("felhasznalo", jatekos_nev);
                window.dispatchEvent(new Event('storage'));
                navigate("/Bejelentkezes");
            } else {
                setHibaUzenet(data.error || "A regisztráció sikertelen!");
            }
        } catch (error) {
            console.error(error);
            setHibaUzenet("Hiba történt a regisztráció során!");
        }
    };

    return (
        <div className="register-container">
            <div className="login-card">
                <div className="login-icon">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="25" fill="#66A5AD"/>
                        <path d="M25 12C18.93 12 14 16.93 14 23C14 29.07 18.93 34 25 34C31.07 34 36 29.07 36 23C36 16.93 31.07 12 25 12ZM30 24H26V28H24V24H20V22H24V18H26V22H30V24Z" fill="white"/>
                    </svg>
                </div>
                <h1 className="login-title">Regisztráció</h1>
                <p className="login-subtitle">Hozz létre egy új admin fiókot</p>
                
                <form className="login-form" onSubmit={regisztracioFuggveny}>
                    <div className="form-group">
                        <label htmlFor="register-username" className="form-label">Felhasználónév</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="register-username"
                                name="username"
                                className="form-input"
                                value={jatekos_nev}
                                onChange={(e) => setFelhasznalonev(e.target.value)}
                                placeholder="Válassz egy felhasználónevet"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="register-password" className="form-label">Jelszó</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="register-password"
                                name="password"
                                className="form-input"
                                value={jatekos_jelszo}
                                onChange={(e) => setJatekos_jelszo(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="register-password-confirm" className="form-label">Jelszó megerősítése</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="register-password-confirm"
                                name="password-confirm"
                                className="form-input"
                                value={jatekos_jelszo1}
                                onChange={(e) => setJatekos_jelszo1(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    {hibaUzenet && (
                        <div className="error-message">
                            {hibaUzenet}
                        </div>
                    )}

                    <button type="submit" className="register-button">
                        Regisztráció
                    </button>
                    <Link to="/Bejelentkezes" className="forgot-password">
                        Van már fiókod? Belépés
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default AdminRegisztralcio;