import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cim from "../Cim";

const Felhasznalobeallitas = () => {
  const [felhasznalo, setFelhasznalo] = useState("");
  const [regiJelszo, setRegiJelszo] = useState("");
  const [ujJelszo, setUjJelszo] = useState("");
  const [ujJelszoMegerosites, setUjJelszoMegerosites] = useState("");
  const [tolt, setTolt] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const nev = localStorage.getItem("felhasznalo");
    
    const updateDarkMode = () => {
      const savedMode = localStorage.getItem("darkMode");
      setDarkMode(savedMode === "true");
    };
    
    updateDarkMode();
    
    if (nev) {
      setFelhasznalo(nev);
      setTolt(false);
    } else {
      navigate("/bejelentkezes");
    }
    
    window.addEventListener("darkModeChanged", updateDarkMode);
    
    return () => {
      window.removeEventListener("darkModeChanged", updateDarkMode);
    };
  }, [navigate]);

  
  // FIÓK TÖRLÉSE
  const fiokTorlese = async () => {
    const result = await Swal.fire({
      title: 'Fiók törlése',
      html: `
        <p>Biztosan törölni szeretnéd a fiókodat?</p>
        <p style="color: #d33; font-weight: bold; margin-top: 1rem;">
          ⚠️ Ez a művelet nem visszavonható!
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse'
    });

    if (!result.isConfirmed) return;


    const confirmResult = await Swal.fire({
      title: 'Utolsó figyelmeztetés',
      text: 'Tényleg törölni szeretnéd a fiókodat? Az összes adatod véglegesen elvész!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, véglegesen törlöm',
      cancelButtonText: 'Mégse'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const response = await fetch(Cim.Cim + `/admin/sajat-fiok-torles/${felhasznalo}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Fiók törölve',
          text: 'A fiókod sikeresen törölve lett.',
          confirmButtonColor: '#00A21D',
          timer: 2000
        });

        setTimeout(() => {
          localStorage.clear();
          navigate("/bejelentkezes");
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Hiba!',
          text: data.error,
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Hiba!',
        text: 'Hiba történt a szerver kapcsolat során.',
        confirmButtonColor: '#d33'
      });
    }
  };

  // JELSZÓ MÓDOSÍTÁSA
  const jelszoModositas = async (e) => {
    e.preventDefault();

    if (ujJelszo !== ujJelszoMegerosites) {
      Swal.fire({
        icon: 'warning',
        title: 'Jelszavak nem egyeznek',
        text: 'Az új jelszó és a megerősítés nem egyezik!',
        confirmButtonColor: '#00A21D'
      });
      return;
    }

    if (ujJelszo.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Túl rövid jelszó',
        text: 'A jelszónak legalább 4 karakter hosszúnak kell lennie!',
        confirmButtonColor: '#00A21D'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Jelszó módosítása',
      text: 'Biztosan módosítod a jelszavad?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00A21D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen, módosítom',
      cancelButtonText: 'Mégse'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(Cim.Cim + "/admin/jelszo-modositas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jatekos_nev: felhasznalo,
          regi_jelszo: regiJelszo,
          uj_jelszo: ujJelszo
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegiJelszo("");
        setUjJelszo("");
        setUjJelszoMegerosites("");
        Swal.fire({
          icon: 'success',
          title: 'Sikeres!',
          text: data.message,
          confirmButtonColor: '#00A21D'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Hiba!',
          text: data.error,
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Hiba!',
        text: 'Hiba történt a szerver kapcsolat során.',
        confirmButtonColor: '#d33'
      });
    }
  };

  if (tolt) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? "#e5e7eb" : "#1f2937" }}>
        Betöltés...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        padding: "2rem",
        borderRadius: "15px",
      }}
      className={darkMode ? 'dark-bg-gradient' : 'light-bg-gradient'}
    >
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto",
        backgroundColor: darkMode ? "#374151" : "white",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: darkMode ? "0 4px 16px rgba(0, 0, 0, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.05)"
      }}>
        <div
          style={{
            backgroundColor: darkMode ? "#1f2937" : "white",
            borderRadius: "24px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ color: darkMode ? "#e5e7eb" : "#1f2937", marginBottom: "1.5rem", fontSize: "2rem" }}>
            ⚙️ Fiók beállítások
          </h1>
          <div style={{ marginBottom: "3rem" }}>
          </div>

          <hr style={{ margin: "2rem 0", borderColor: "black" }} />

          {/* JELSZÓ MÓDOSÍTÁSA */}
          <div>
            <h3 style={{ color: "#00A21D", marginBottom: "1rem" }}>
              Jelszó módosítása
            </h3>
            <form onSubmit={jelszoModositas}>
              <div className="mb-3">
                <label htmlFor="regi-jelszo" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" , color: darkMode ? "#e5e7eb" : "black" }}>
                  Jelenlegi jelszó:
                </label>
                <input
                  type="password"
                  id="regi-jelszo"
                  name="regi-jelszo"
                  className="form-control"
                  value={regiJelszo}
                  onChange={(e) => setRegiJelszo(e.target.value)}
                  required
                  placeholder="pl. MyOldPass123"
                  autoComplete="current-password"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "white",
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    border: darkMode ? "1px solid #4b5563" : "1px solid #d1d5db"
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="uj-jelszo" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" ,
                color: darkMode ? "#e5e7eb" : "black" }}>
                  Új jelszó:
                </label>
                <input
                  type="password"
                  id="uj-jelszo"
                  name="uj-jelszo"
                  className="form-control"
                  value={ujJelszo}
                  onChange={(e) => setUjJelszo(e.target.value)}
                  required
                  placeholder="pl. MyNewPass456 (min. 4 karakter)"
                  autoComplete="new-password"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "white",
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    border: darkMode ? "1px solid #4b5563" : "1px solid #d1d5db"
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="uj-jelszo-megerosites" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" , color: darkMode ? "#e5e7eb" : "black"  }}>
                  Új jelszó megerősítése:
                </label>
                <input
                  type="password"
                  id="uj-jelszo-megerosites"
                  name="uj-jelszo-megerosites"
                  className="form-control"
                  value={ujJelszoMegerosites}
                  onChange={(e) => setUjJelszoMegerosites(e.target.value)}
                  required
                  placeholder="pl. MyNewPass456"
                  autoComplete="new-password"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "white",
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    border: darkMode ? "1px solid #4b5563" : "1px solid #d1d5db"
                  }}
                />
              </div>
              <button type="submit" className="btn btn-success" style={{ width: "100%" }}>
                Jelszó frissítése
              </button>
            </form>
          </div>

          <hr style={{ margin: "2rem 0", borderColor: "black" }} />

          {/* FIÓK TÖRLÉSE */}
          <div>
            <h3 style={{ color: "#d33", marginBottom: "1rem" }}>
              ⚠️ Veszélyzóna
            </h3>
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: darkMode ? "#4b5563" : "#fee",
                borderRadius: "12px",
                border: "2px solid #d33",
              }}
            >
              <p style={{ marginBottom: "1rem", color: darkMode ? "#e5e7eb" : "#555" }}>
                A fiók törlése <strong>véglegesen</strong> eltávolítja az összes adatodat.
                Ez a művelet nem visszavonható!
              </p>
              <button
                onClick={fiokTorlese}
                className="btn btn-danger"
                style={{ width: "100%" }}
              >
                🗑️ Fiók törlése
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Felhasznalobeallitas;
