import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cim from "../Cim";

const Engedelykeres = () => {
  const [tolt, setTolt] = useState(true);
  const [hiba, setHiba] = useState(false);
  const [siker, setSiker] = useState(false);
  const [adatok, setAdatok] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateDarkMode = () => {
      const savedMode = localStorage.getItem("darkMode");
      setDarkMode(savedMode === "true");
    };
    
    updateDarkMode();
    
    window.addEventListener("darkModeChanged", updateDarkMode);
    
    return () => {
      window.removeEventListener("darkModeChanged", updateDarkMode);
    };
  }, []);

  const leToltes = async () => {
    try {
      const response = await fetch(Cim.Cim + "/admin/jatekoslista");
      const data = await response.json();

      if (response.ok) {
        setAdatok(data);
        setTolt(false);
      } else {
        setHiba(true);
        setTolt(false);
      }
    } catch (error) {
      console.log(error);
      setHiba(true);
    }
  };

  const ellenorizSajatFiok = async () => {
    const felhasznalo = localStorage.getItem("felhasznalo");
    if (!felhasznalo) return;

    try {
      const response = await fetch(Cim.Cim + "/admin/jatekoslista");
      const data = await response.json();

      if (response.ok) {
        const sajatFiok = data.find(user => user.jatekos_nev === felhasznalo);
        
        if (!sajatFiok) {
          // Ha a saját fiók törlődött, kijelentkeztetjük
          localStorage.removeItem("bejelentkezve");
          localStorage.removeItem("felhasznalo");
          localStorage.removeItem("userType");
          Swal.fire({
            icon: 'warning',
            title: 'Fiók törölve',
            text: 'A fiókod törölve lett. Kijelentkeztetés...',
            confirmButtonColor: '#00A21D'
          }).then(() => {
            navigate("/bejelentkezes");
          });
        }
      }
    } catch (error) {
      console.error("Ellenőrzési hiba:", error);
    }
  };

  useEffect(() => {
    leToltes();
    
    // 30 másodpercenkénti frissítés
    const interval = setInterval(() => {
      leToltes();
      ellenorizSajatFiok();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siker]);

  // ADMIN JOG ENGEDÉLYEZÉSE
  const adminJogAd = async (jatekos_id, jatekos_nev) => {
    const result = await Swal.fire({
      title: 'Admin jog megadása',
      text: `Biztosan admin jogot adsz ${jatekos_nev} felhasználónak?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00A21D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen, megadom',
      cancelButtonText: 'Mégse'
    });

    if (!result.isConfirmed) return;

    const response = await fetch(
      Cim.Cim + "/admin/jog-ad/" + jatekos_id,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jatekos_admin: 1 }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Sikeres!',
        text: data.message,
        confirmButtonColor: '#00A21D'
      });
      setSiker(!siker);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hiba!',
        text: data.error,
        confirmButtonColor: '#d33'
      });
    }
  };

  // ADMIN JOG ELVÉTELE
  const adminJogElvesz = async (jatekos_id, jatekos_nev) => {
    const felhasznalo = localStorage.getItem("felhasznalo");
    
    // Ellenőrizzük, hogy saját admin jogát próbálja-e elvenni
    if (jatekos_nev === felhasznalo) {
      Swal.fire({
        icon: 'warning',
        title: 'Művelet nem engedélyezett',
        text: 'Nem veheted el a saját admin jogodat!',
        confirmButtonColor: '#00A21D'
      });
      return;
    }
    
    const result = await Swal.fire({
      title: 'Admin jog elvétele',
      text: `Biztosan elveszed ${jatekos_nev} admin jogosultságát?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, elveszem',
      cancelButtonText: 'Mégse'
    });

    if (!result.isConfirmed) return;

    const response = await fetch(
      Cim.Cim + "/admin/jog-elvesz/" + jatekos_id,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jatekos_admin: 0 }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Sikeres!',
        text: data.message,
        confirmButtonColor: '#00A21D'
      });
      setSiker(!siker);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hiba!',
        text: data.error,
        confirmButtonColor: '#d33'
      });
    }
  };

  // TÖRLÉS
  const torlesFuggveny = async (jatekos_id, jatekos_nev) => {
    const felhasznalo = localStorage.getItem("felhasznalo");
    
    // Ellenőrizzük, hogy saját fiókját próbálja-e törölni
    if (jatekos_nev === felhasznalo) {
      Swal.fire({
        icon: 'warning',
        title: 'Művelet nem engedélyezett',
        text: 'Nem törölheted a saját fiókodat!',
        confirmButtonColor: '#00A21D'
      });
      return;
    }
    
    const result = await Swal.fire({
      title: 'Felhasználó törlése',
      text: `Biztosan törölni szeretnéd a(z) ${jatekos_nev} felhasználót?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00A21D',
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse'
    });

    if (result.isConfirmed) {
      const response = await fetch(
        Cim.Cim + "/admin/jatekostorles/" + jatekos_id,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Sikeres!',
          text: data.message,
          confirmButtonColor: '#00A21D'
        });
        setSiker(!siker);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Hiba!',
          text: data.error,
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  if (tolt)
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? "#e5e7eb" : "#1f2937" }}>
        Adatok betöltése folyamatban...
      </div>
    );
  if (hiba) return <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? "#f87171" : "red" }}>Hiba történt az adatok betöltése közben.</div>;

  return (
    <div
      style={{
        padding: "2rem",
        borderRadius: "15px",
        minHeight: "85vh",
      }}
      className={darkMode ? 'dark-bg-gradient' : 'light-bg-gradient'}
    >
      <div style={{ 
        maxWidth: "1200px", 
        minWidth: "800px", 
        overflow: "auto",
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
            👥 Felhasználók kezelése
          </h1>

          <div className="tabla-container">
            <table className="table table-striped" style={{ 
              backgroundColor: darkMode ? "#1f2937" : "gray",
              color: darkMode ? "#e5e7eb" : "#1f2937",
              borderRadius: darkMode ? "10px" : "0",
              overflow: darkMode ? "hidden" : "visible"
            }}>
              <thead style={{ 
                background: darkMode ? "#4b5563" : "#00A21D", 
                color: "white" 
              }}>
                <tr>
                  <th>ID</th>
                  <th>Felhasználónév</th>
                  <th>Admin jog</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {adatok.map((elem, index) => (
                  <tr key={elem.jatekos_id} style={{
                    backgroundColor: darkMode 
                      ? (index % 2 === 0 ? "#374151" : "#1f2937")
                      : (index % 2 === 0 ? "white" : "#F9FAFB"),
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    borderBottom: darkMode ? "1px solid #4b5563" : "1px solid #F3F4F6"
                  }}>
                    <td>{elem.jatekos_id}</td>
                    <td>{elem.jatekos_nev}</td>
                    <td>
                      {elem.jatekos_admin === 1 ? (
                        <span
                          style={{
                            background: "#00A21D",
                            color: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          ✓ Admin
                        </span>
                      ) : (
                        <span
                          style={{
                            background: darkMode ? "#bf2525ff" : "#bf2525ff",
                            color: darkMode ? "#d1d5db" : "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          ✗ Felhasználó
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {elem.jatekos_admin === 1 ? (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              adminJogElvesz(elem.jatekos_id, elem.jatekos_nev)
                            }
                          >
                            ⚠️ Admin jog elvétele
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              adminJogAd(elem.jatekos_id, elem.jatekos_nev)
                            }
                          >
                            ✓ Admin jog megadása
                          </button>
                        )}
                       
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            torlesFuggveny(elem.jatekos_id, elem.jatekos_nev)
                          }
                        >
                          🗑️ Törlés
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adatok.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? "#9ca3af" : "#6B7280" }}>
              Nincsenek regisztrált felhasználók.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Engedelykeres;